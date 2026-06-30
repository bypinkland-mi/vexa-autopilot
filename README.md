# Vexa Autopilot

Public hackathon demo for an approval-safe browser agent powered by Qwen Cloud.

This repository is intentionally separate from Tabi and Nami. It is designed to be open-source safe for hackathon submission while preserving byPINKLAND's private product code.

## Product Shape

Vexa Autopilot demonstrates a narrow, runnable browser-agent workflow:

1. Understand a web task.
2. Build a step-by-step browser plan.
3. Navigate a public-safe sandbox website.
4. Extract page evidence.
5. Pause on risky send/submit actions for human approval.
6. Produce an evidence report.

## Boundaries

This repo may include:

- Qwen Cloud adapter code.
- Demo UI.
- Mock browser tools and sandbox sample pages.
- Approval workflow logic.
- Architecture docs and demo scripts.

This repo must not include:

- Tabi desktop source code.
- Nami private router/core source code.
- Real customer data.
- Production secrets, API keys, OAuth tokens, or billing code.
- Private browser profiles, cookies, or downloaded files.

## Current Status

Runnable demo app with a mock browser-agent workflow, evidence report, local Qwen adapter, and optional Qwen Cloud adapter.

The demo now includes two paths:

- UI demo: shows the browser-agent workflow in the app.
- Real browser runner: `POST /api/browser-agent/run` asks Qwen for a sandbox browser plan when configured, then uses Playwright to navigate, click, extract DOM evidence, and pause before customer-facing send actions.
- Browser-style launcher: a floating V icon opens an agent panel, similar to a browser assistant entry point.

## Hackathon Readiness

- License: [MIT](LICENSE)
- Architecture: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Devpost copy: [docs/DEVPOST_SUBMISSION.md](docs/DEVPOST_SUBMISSION.md)
- Submission audit: [docs/SUBMISSION_AUDIT.md](docs/SUBMISSION_AUDIT.md)
- Readiness report: [docs/SUBMISSION_READINESS_REPORT.md](docs/SUBMISSION_READINESS_REPORT.md)
- Final submission runbook: [docs/FINAL_SUBMISSION_RUNBOOK.md](docs/FINAL_SUBMISSION_RUNBOOK.md)
- Devpost final packet template: [docs/DEVPOST_FINAL_PACKET.template.md](docs/DEVPOST_FINAL_PACKET.template.md)
- Demo script: [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
- Devpost-ready demo video: [docs/demo/vexa-devpost-demo.mp4](docs/demo/vexa-devpost-demo.mp4)
- Local demo recording: [docs/demo/vexa-local-demo.webm](docs/demo/vexa-local-demo.webm)
- Upload-ready MP4 demo: [docs/demo/vexa-local-demo.mp4](docs/demo/vexa-local-demo.mp4)
- Presentation outline: [docs/PRESENTATION_OUTLINE.md](docs/PRESENTATION_OUTLINE.md)
- Presentation deck: [docs/presentation/vexa-autopilot-qwen-hackathon.pptx](docs/presentation/vexa-autopilot-qwen-hackathon.pptx)
- Submission package: [docs/SUBMISSION_PACKAGE.md](docs/SUBMISSION_PACKAGE.md)
- GitHub release package: [v0.1-qwen-hackathon](https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon)
- Readiness checklist: [docs/READINESS_CHECKLIST.md](docs/READINESS_CHECKLIST.md)
- Alibaba Cloud deployment guide: [docs/ALIBABA_CLOUD_DEPLOYMENT.md](docs/ALIBABA_CLOUD_DEPLOYMENT.md)
- Alibaba ECS deployment bundle: [deploy/alibaba/README.md](deploy/alibaba/README.md)
- Alibaba ECS bootstrap script: [deploy/alibaba/bootstrap-ecs.sh](deploy/alibaba/bootstrap-ecs.sh)
- Public-safety boundary: [docs/PROJECT_BOUNDARY.md](docs/PROJECT_BOUNDARY.md)

## Quick Start

```bash
npm install
npm run dev:api
npm run dev
```

Open `http://127.0.0.1:5173`.

By default the local API runs on `127.0.0.1:8798` and uses mock mode. In development, Vite proxies `/api` to the API server. In production, the built frontend uses same-origin `/api`.

## Local Qwen 3.5 9B Mode

Use this first when LM Studio is running locally:

```bash
VEXA_PLANNER_PROVIDER=local-qwen \
LOCAL_QWEN_BASE_URL=http://127.0.0.1:1234/v1 \
LOCAL_QWEN_MODEL=prism-qwen35-9b-v2 \
npm run dev:api
```

Start the LM Studio local server first and load the Qwen 3.5 9B model. If the local planner is unavailable, Vexa falls back to the safe mock plan and the UI shows `Local Qwen offline - using safe fallback plan.` The browser runner still executes against the local sandbox and collects evidence.

## Qwen Cloud Mode

To test Qwen Cloud, copy `.env.example` to `.env.local`, set `DASHSCOPE_API_KEY`, and run the API with `VEXA_FORCE_MOCK=0`. If your Model Studio workspace uses a region-specific base URL, override `DASHSCOPE_BASE_URL`.

## Production / Alibaba Cloud Container

The same Express server can serve the built frontend and API:

```bash
npm run build
VEXA_HOST=0.0.0.0 VEXA_API_PORT=8080 VEXA_SANDBOX_ORIGIN=http://127.0.0.1:8080 npm start
```

Docker:

```bash
docker build -t vexa-autopilot:latest .
docker run --rm -p 8080:8080 -e VEXA_FORCE_MOCK=1 vexa-autopilot:latest
```

For Qwen Cloud judging, set `DASHSCOPE_API_KEY`, `QWEN_MODEL`, and `VEXA_FORCE_MOCK=0` in Alibaba Cloud. See [docs/ALIBABA_CLOUD_DEPLOYMENT.md](docs/ALIBABA_CLOUD_DEPLOYMENT.md).

## Real Browser Runner

```bash
curl -s http://127.0.0.1:8798/api/browser-agent/run \
  -H 'Content-Type: application/json' \
  -d '{"objective":"Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply."}'
```

The runner only navigates inside local `/sandbox/*` pages. It is intentionally safe for public judging and does not control the user's real browser profile.

## Verification

```bash
npm test
npm run build
npm run check:public
npm run qa:browser
```

`npm run check:submission` runs tests, production build, and the public-safety file check.
