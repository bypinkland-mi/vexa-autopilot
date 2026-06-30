---
title: Alibaba Cloud Deployment Proof Guide
created: 2026-06-30
updated: 2026-06-30
---

# Alibaba Cloud Deployment Proof Guide

The Qwen Cloud hackathon asks for proof that the app was deployed on Alibaba Cloud, plus a code file showing Alibaba Cloud service/API use. This repo is prepared for that requirement, but the actual public URL and proof recording must be produced after deployment with Sammi's Alibaba account.

## Code Proof

Use these files as the code evidence:

- `server/qwen-cloud.mjs`: Qwen/DashScope OpenAI-compatible API adapter.
- `server/browser-agent.mjs`: Qwen plan execution boundary and sandbox navigation guard.
- `Dockerfile`: container deployment entrypoint for Alibaba Cloud.

Public code proof link:

https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs

## Container Build

```bash
docker build -t vexa-autopilot:latest .
docker run --rm -p 8080:8080 \
  -e VEXA_HOST=0.0.0.0 \
  -e VEXA_API_PORT=8080 \
  -e VEXA_SANDBOX_ORIGIN=http://127.0.0.1:8080 \
  -e VEXA_FORCE_MOCK=1 \
  vexa-autopilot:latest
```

Open `http://127.0.0.1:8080` and run the browser-agent dock.

## Qwen Cloud Environment

For a real Qwen Cloud run, set these as Alibaba Cloud environment variables or secrets:

```bash
DASHSCOPE_API_KEY=<set in Alibaba Cloud console>
DASHSCOPE_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
VEXA_FORCE_MOCK=0
VEXA_HOST=0.0.0.0
VEXA_API_PORT=8080
VEXA_SANDBOX_ORIGIN=http://127.0.0.1:8080
```

Do not commit the API key.

## Suggested Alibaba Cloud Targets

Any container-capable Alibaba Cloud service is acceptable for the proof video:

- Alibaba Cloud Container Service / ACK
- Alibaba Cloud Elastic Container Instance
- Alibaba Cloud ECS running Docker

## Proof Recording Checklist

Record a short clip showing:

1. Alibaba Cloud console with the running Vexa service.
2. The public deployment URL loading `Vexa Autopilot`.
3. `/api/health` showing `provider:"qwen"` when Qwen Cloud is configured, or `provider:"mock"` if recording only the deployment proof first.
4. The browser-agent dock run completing with trace/evidence and approval pause.
5. The code file `server/qwen-cloud.mjs` in the repository.

## Current Status

- Repo is deployment-ready.
- Local Docker image build has passed.
- Local Docker smoke QA has passed through host port `8081`.
- Public Alibaba Cloud URL is still pending.
- Proof recording is still pending.
