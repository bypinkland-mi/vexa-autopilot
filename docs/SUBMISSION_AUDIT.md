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
| Public repository | Local git repo initialized on `main`; `.gitignore` excludes secrets/build artifacts | External GitHub publish pending |
| Open-source license visible at repo top | `LICENSE` is MIT; `package.json` has `"license": "MIT"` | Ready |
| Alibaba Cloud backend proof | `Dockerfile`, `docs/ALIBABA_CLOUD_DEPLOYMENT.md`, and `server/qwen-cloud.mjs` are ready | Alibaba Cloud deployment/proof recording pending |
| Code file showing Alibaba Cloud service/API use | `server/qwen-cloud.mjs` shows DashScope/Qwen API usage | Ready for link after public repo exists |
| Architecture diagram | `docs/ARCHITECTURE.md` includes a Mermaid architecture diagram showing UI, API, Qwen Cloud/local Qwen, fallback, runner, sandbox, and approval gate | Ready |
| Demo video under/about 3 minutes | `docs/DEMO_SCRIPT.md` gives a three-minute recording script | Recording pending |
| Public video URL | Use YouTube, Vimeo, or Youku according to official rules | Pending |
| Text description | `docs/DEVPOST_SUBMISSION.md` includes one-liner, inspiration, what it does, build notes, safety, and next steps | Ready |
| Track identified | `docs/DEVPOST_SUBMISSION.md` identifies `Track 4: Autopilot Agent` | Ready |
| Functionality matches video/text | `npm run check:submission`, local browser QA, production-style smoke, and Docker smoke are the local proof baseline | Ready locally; live cloud proof pending |
| Live cloud URL works | `npm run verify:cloud -- <cloud-url>` checks `/api/health` and browser-agent trace/evidence/status | Pending Alibaba Cloud URL |

## Final Submission Evidence To Collect

1. Public GitHub URL.
2. Public Alibaba Cloud app URL.
3. `/api/health` response from the Alibaba Cloud URL.
4. Code link to `server/qwen-cloud.mjs` in the public repository.
5. Alibaba Cloud proof recording link.
6. Public demo video link.
7. Presentation deck link or uploaded file.

## Non-Submission Local Evidence

These prove local readiness but do not replace official external evidence:

```bash
npm run check:submission
docker build -t vexa-autopilot:local .
VEXA_APP_URL=http://127.0.0.1:8081/ VEXA_API_URL=http://127.0.0.1:8081 npm run qa:browser
```
