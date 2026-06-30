---
title: Vexa Hackathon Readiness Checklist
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Hackathon Readiness Checklist

## Current Verdict

Vexa Autopilot is public-repo-ready and container-smoke-tested. It is not yet fully submitted because the Alibaba Cloud deployment URL/proof video, final demo video, and slide upload must be created from Sammi's accounts.

## Completed

- Public-facing name changed to `Vexa Autopilot`.
- V logo retained.
- MIT license added.
- Public-safe boundary doc added.
- Qwen Cloud adapter exists in `server/qwen-cloud.mjs`.
- Local Qwen planner fallback is clear in UI.
- Browser runner is sandbox-only and port-aware for local/container deployments.
- Express production server serves both `dist/` frontend and API.
- Dockerfile added and built locally.
- Devpost copy draft added.
- Demo video script added.
- Architecture diagram added.
- Submission audit added.
- Final submission runbook added.
- Alibaba Cloud deployment proof guide added.
- Public-safety checker added.
- Public GitHub repository published: `https://github.com/bypinkland-mi/vexa-autopilot`.
- GitHub CI passed on `main`.
- Cloud URL verifier added: `npm run verify:cloud -- <cloud-url>`.

## Verified Locally

Last verified on 2026-06-30:

```bash
npm run check:submission
docker build -t vexa-autopilot:local .
VEXA_APP_URL=http://127.0.0.1:8081/ VEXA_API_URL=http://127.0.0.1:8081 npm run qa:browser
```

Observed proof:

- Tests passed: 2/2.
- Production build passed.
- Public-safety check passed.
- Docker image built as `vexa-autopilot:local`.
- Docker smoke app on `127.0.0.1:8081` passed browser QA.
- API runner returned sandbox origin `http://127.0.0.1:8080` inside single-service production mode.

## Still Required Before Devpost Submission

1. Deploy the Docker image to Alibaba Cloud.
2. Set `DASHSCOPE_API_KEY`, `QWEN_MODEL`, and `VEXA_FORCE_MOCK=0` in Alibaba Cloud for true Qwen Cloud mode.
3. Run `npm run verify:cloud -- <cloud-url>` against the Alibaba Cloud URL.
4. Record Alibaba Cloud proof clip:
   - console/service running,
   - public URL,
   - `/api/health`,
   - app flow,
   - `server/qwen-cloud.mjs` code proof.
5. Record final demo video using `docs/DEMO_SCRIPT.md`.
6. Upload the demo video publicly on YouTube, Vimeo, or Youku.
7. Prepare/upload slides using `docs/PRESENTATION_OUTLINE.md`.
8. Fill Devpost from `docs/DEVPOST_SUBMISSION.md` and verify every item in `docs/SUBMISSION_AUDIT.md`.

## Known Honest Limitation

If `DASHSCOPE_API_KEY` or local Qwen is unavailable, Vexa runs the safe fallback plan and visibly labels planner fallback. That is acceptable for local smoke tests, but the final hackathon submission should include at least one Qwen Cloud configured run.
