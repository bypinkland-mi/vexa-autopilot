---
title: Vexa Submission Audit
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Submission Audit

This audit maps the official Qwen Cloud Hackathon requirements to concrete Vexa evidence. Keep this file current until Devpost submission is complete.

## Official Track

- Target track: `Track 4: Autopilot Agent`
- Fit: Vexa automates a real-world business workflow end-to-end: inspect a storefront, compare policy claims, extract evidence, and pause before a customer-facing reply.

## Requirement Map

| Requirement | Current Evidence | Status |
| --- | --- | --- |
| Project uses Qwen models available on Qwen Cloud | `server/qwen-cloud.mjs` implements DashScope/Qwen OpenAI-compatible calls; `.env.example` documents `DASHSCOPE_API_KEY`, `DASHSCOPE_BASE_URL`, and `QWEN_MODEL` | Code ready; live Qwen run pending credentials |
| Public repository | `https://github.com/bypinkland-mi/vexa-autopilot`; `.gitignore` excludes secrets/build artifacts | Ready |
| Open-source license visible at repo top | `LICENSE` is MIT; `package.json` has `"license": "MIT"` | Ready |
| Stable artifact package | `https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon` includes MP4, WebM, deck, and generated submission package | Ready |
| Alibaba Cloud backend proof | `Dockerfile`, `deploy/alibaba/`, `docs/ALIBABA_CLOUD_DEPLOYMENT.md`, and `server/qwen-cloud.mjs` are ready | Alibaba Cloud deployment/proof recording pending |
| Code file showing Alibaba Cloud service/API use | `https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs` shows DashScope/Qwen API usage | Ready |
| Architecture diagram | `docs/ARCHITECTURE.md` includes a Mermaid architecture diagram showing UI, API, Qwen Cloud/local Qwen, fallback, runner, sandbox, and approval gate | Ready |
| Demo video under/about 3 minutes | `docs/demo/vexa-local-demo.mp4` is a 1280x720 H.264 upload-ready recording artifact; the release MP4 is at `https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-local-demo.mp4`; `docs/DEMO_SCRIPT.md` gives a fuller three-minute narration script | Local/release artifact ready; public video-platform upload pending |
| Public video URL | Use YouTube, Vimeo, or Youku according to official rules | Pending |
| Presentation deck | `docs/presentation/vexa-autopilot-qwen-hackathon.pptx` is an 8-slide deck covering product, workflow, architecture, safety, evidence, and remaining gates; release download is available | Ready |
| Text description | `docs/DEVPOST_SUBMISSION.md` includes one-liner, inspiration, what it does, build notes, safety, and next steps | Ready |
| Track identified | `docs/DEVPOST_SUBMISSION.md` identifies `Track 4: Autopilot Agent` | Ready |
| Functionality matches video/text | `npm run check:submission`, public GitHub CI, local browser QA, production-style smoke, and Docker smoke are the proof baseline | Ready locally; live cloud proof pending |
| Live cloud URL works | `npm run verify:cloud -- <cloud-url>` checks `/api/health` and browser-agent trace/evidence/status | Pending Alibaba Cloud URL |

## Final Submission Evidence To Collect

1. Public Alibaba Cloud app URL.
2. `/api/health` response from the Alibaba Cloud URL.
3. Alibaba Cloud proof recording link.
4. Public demo video URL after uploading `docs/demo/vexa-local-demo.mp4` or a narrated recording.

## Non-Submission Local Evidence

These prove local readiness but do not replace official external evidence:

```bash
npm run check:submission
docker build -t vexa-autopilot:local .
VEXA_APP_URL=http://127.0.0.1:8081/ VEXA_API_URL=http://127.0.0.1:8081 npm run qa:browser
```
