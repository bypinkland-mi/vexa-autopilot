#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${VEXA_REPO_URL:-https://github.com/bypinkland-mi/vexa-autopilot.git}"
APP_DIR="${VEXA_APP_DIR:-/opt/vexa-autopilot}"
PUBLIC_ORIGIN="${VEXA_PUBLIC_ORIGIN:-}"
FORCE_MOCK="${VEXA_FORCE_MOCK:-1}"
QWEN_MODEL="${QWEN_MODEL:-qwen-plus}"
DASHSCOPE_BASE_URL="${DASHSCOPE_BASE_URL:-https://dashscope-us.aliyuncs.com/compatible-mode/v1}"

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run as root or with sudo: sudo -E bash deploy/alibaba/bootstrap-ecs.sh" >&2
  exit 1
fi

if [[ -z "${PUBLIC_ORIGIN}" ]]; then
  PUBLIC_ORIGIN="$(detect_public_origin)"
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "This bootstrap expects Ubuntu/Debian with apt-get." >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl git

if [[ -d "${APP_DIR}/.git" ]]; then
  git -C "${APP_DIR}" fetch --depth=1 origin main
  git -C "${APP_DIR}" checkout main
  git -C "${APP_DIR}" reset --hard origin/main
else
  rm -rf "${APP_DIR}"
  git clone --depth=1 "${REPO_URL}" "${APP_DIR}"
fi

bash "${APP_DIR}/deploy/alibaba/install-ecs-docker.sh"

ENV_FILE="${APP_DIR}/deploy/alibaba/env.alibaba"
install -m 0600 /dev/null "${ENV_FILE}"
{
  echo "DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY:-}"
  echo "DASHSCOPE_BASE_URL=${DASHSCOPE_BASE_URL}"
  echo "QWEN_MODEL=${QWEN_MODEL}"
  echo "VEXA_FORCE_MOCK=${FORCE_MOCK}"
  echo "VEXA_HOST=0.0.0.0"
  echo "VEXA_API_PORT=8080"
  echo "VEXA_SANDBOX_ORIGIN=${PUBLIC_ORIGIN}"
} >"${ENV_FILE}"

docker compose -f "${APP_DIR}/deploy/alibaba/docker-compose.yml" up -d --build

echo "Waiting for Vexa at ${PUBLIC_ORIGIN}/api/health ..."
for _ in $(seq 1 30); do
  if curl -fsS "${PUBLIC_ORIGIN}/api/health" >/tmp/vexa-health.json; then
    cat /tmp/vexa-health.json
    echo
    echo "Vexa is running at ${PUBLIC_ORIGIN}"
    echo "Next: npm run verify:cloud -- ${PUBLIC_ORIGIN}"
    exit 0
  fi
  sleep 2
done

echo "Vexa container did not become healthy in time. Recent logs:" >&2
docker compose -f "${APP_DIR}/deploy/alibaba/docker-compose.yml" logs --tail=80 >&2
exit 1

detect_public_origin() {
  local ip=""
  ip="$(curl -fsS --max-time 2 http://100.100.100.200/latest/meta-data/eipv4 2>/dev/null || true)"
  if [[ -z "${ip}" ]]; then
    ip="$(curl -fsS --max-time 2 http://100.100.100.200/latest/meta-data/public-ipv4 2>/dev/null || true)"
  fi
  if [[ -z "${ip}" ]]; then
    ip="$(curl -fsS --max-time 5 https://ifconfig.me 2>/dev/null || true)"
  fi
  if [[ -z "${ip}" ]]; then
    echo "Could not detect public IP. Set VEXA_PUBLIC_ORIGIN=http://<ecs-public-ip>:8080." >&2
    exit 1
  fi
  echo "http://${ip}:8080"
}
