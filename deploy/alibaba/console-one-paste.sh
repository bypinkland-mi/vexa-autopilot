#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${VEXA_REPO_URL:-https://github.com/bypinkland-mi/vexa-autopilot.git}"
APP_DIR="${VEXA_APP_DIR:-/opt/vexa-autopilot}"
PUBLIC_ORIGIN="${VEXA_PUBLIC_ORIGIN:-}"
FORCE_MOCK="${VEXA_FORCE_MOCK:-1}"

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

if [[ "${EUID}" -ne 0 ]]; then
  echo "Please run as root, for example:" >&2
  echo "  curl -fsSL https://raw.githubusercontent.com/bypinkland-mi/vexa-autopilot/main/deploy/alibaba/console-one-paste.sh | sudo -E bash" >&2
  exit 1
fi

if ! command -v apt-get >/dev/null 2>&1; then
  echo "This one-paste bootstrap expects Ubuntu/Debian with apt-get." >&2
  exit 1
fi

if [[ -z "${PUBLIC_ORIGIN}" ]]; then
  PUBLIC_ORIGIN="$(detect_public_origin)"
fi

echo "Preparing Vexa Autopilot in ${APP_DIR}"
echo "Public origin: ${PUBLIC_ORIGIN}"
echo "Mock mode: ${FORCE_MOCK}"

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

export VEXA_PUBLIC_ORIGIN="${PUBLIC_ORIGIN}"
export VEXA_FORCE_MOCK="${FORCE_MOCK}"

bash "${APP_DIR}/deploy/alibaba/bootstrap-ecs.sh"

cat <<EOF

Vexa one-paste bootstrap finished.

Open:
  ${PUBLIC_ORIGIN}

Verify from your local repo:
  npm run verify:cloud -- ${PUBLIC_ORIGIN}
  npm run record:cloud-proof -- --cloud-url ${PUBLIC_ORIGIN}

EOF
