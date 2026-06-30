---
title: Alibaba ECS Deployment Bundle
created: 2026-06-30
updated: 2026-06-30
---

# Alibaba ECS Deployment Bundle

This folder is a public-safe deployment bundle for proving that Vexa's backend can run on Alibaba Cloud. It does not include credentials.

## Fast ECS Path

### Option A: Console / Workbench One-Paste

Create an Ubuntu ECS instance, open inbound TCP `8080`, then run this in Alibaba Cloud Workbench, Cloud Assistant, or an SSH shell:

```bash
curl -fsSL https://raw.githubusercontent.com/bypinkland-mi/vexa-autopilot/main/deploy/alibaba/console-one-paste.sh | sudo -E bash
```

If public IP detection fails, pass the public URL explicitly:

```bash
curl -fsSL https://raw.githubusercontent.com/bypinkland-mi/vexa-autopilot/main/deploy/alibaba/console-one-paste.sh | \
  sudo -E VEXA_PUBLIC_ORIGIN=http://<ecs-public-ip>:8080 bash
```

For Qwen Cloud mode, set `DASHSCOPE_API_KEY` on the server only and run:

```bash
curl -fsSL https://raw.githubusercontent.com/bypinkland-mi/vexa-autopilot/main/deploy/alibaba/console-one-paste.sh | \
  sudo -E DASHSCOPE_API_KEY=<set-on-server-only> VEXA_FORCE_MOCK=0 VEXA_PUBLIC_ORIGIN=http://<ecs-public-ip>:8080 bash
```

### Option B: Console User Data

When creating the ECS instance, paste `deploy/alibaba/cloud-init.user-data.example` into the instance user-data / cloud-init field. This installs Docker, clones the public repository, starts Vexa on port `8080`, and leaves logs in:

```bash
/var/log/cloud-init-output.log
```

Use this mode for a fastest mock-mode proof. For true Qwen Cloud mode, add `DASHSCOPE_API_KEY` through a secure server-side mechanism and set `VEXA_FORCE_MOCK=0` before rerunning `deploy/alibaba/bootstrap-ecs.sh`.

### Option C: SSH Bootstrap

After creating an Ubuntu ECS instance and opening inbound TCP `8080`, SSH into it and run:

```bash
sudo apt-get update
sudo apt-get install -y git
sudo git clone https://github.com/bypinkland-mi/vexa-autopilot.git /opt/vexa-autopilot
cd /opt/vexa-autopilot
sudo -E VEXA_PUBLIC_ORIGIN=http://<ecs-public-ip>:8080 bash deploy/alibaba/bootstrap-ecs.sh
```

Optional Qwen Cloud mode:

```bash
sudo -E \
  DASHSCOPE_API_KEY=<set-on-server-only> \
  VEXA_FORCE_MOCK=0 \
  VEXA_PUBLIC_ORIGIN=http://<ecs-public-ip>:8080 \
  bash deploy/alibaba/bootstrap-ecs.sh
```

### Option D: Manual Compose

1. Create an Alibaba Cloud ECS instance with Ubuntu 22.04 or 24.04.
2. Open inbound TCP `8080` in the ECS security group for the demo window.
3. SSH into the instance.
4. Install Docker:

```bash
sudo bash deploy/alibaba/install-ecs-docker.sh
```

5. Clone the public repository:

```bash
sudo git clone https://github.com/bypinkland-mi/vexa-autopilot.git /opt/vexa-autopilot
cd /opt/vexa-autopilot
```

6. Create the runtime env file:

```bash
cp deploy/alibaba/env.alibaba.example deploy/alibaba/env.alibaba
nano deploy/alibaba/env.alibaba
```

Set `VEXA_SANDBOX_ORIGIN` to the public ECS URL, for example:

```bash
VEXA_SANDBOX_ORIGIN=http://<ecs-public-ip>:8080
```

For Qwen Cloud mode, set `DASHSCOPE_API_KEY` in `deploy/alibaba/env.alibaba` on the server only. Do not commit that file.

7. Build and start:

```bash
docker compose -f deploy/alibaba/docker-compose.yml up -d --build
```

8. Verify:

```bash
curl -s http://<ecs-public-ip>:8080/api/health
npm run verify:cloud -- http://<ecs-public-ip>:8080
```

## Optional systemd Service

After the compose service works, install the unit:

```bash
sudo cp deploy/alibaba/vexa-autopilot.service /etc/systemd/system/vexa-autopilot.service
sudo systemctl daemon-reload
sudo systemctl enable --now vexa-autopilot
sudo systemctl status vexa-autopilot --no-pager
```

## Proof Recording

Record:

1. Alibaba Cloud ECS console showing the running instance.
2. Security group rule or service detail showing the backend is reachable.
3. Public URL loading Vexa.
4. `/api/health`.
5. `npm run verify:cloud -- <cloud-url>`.
6. Code proof link: `https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs`.

## Cleanup

```bash
docker compose -f deploy/alibaba/docker-compose.yml down
sudo systemctl disable --now vexa-autopilot || true
```
