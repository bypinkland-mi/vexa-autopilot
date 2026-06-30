---
title: Vexa Submission Package
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Submission Package

## Devpost Fields

- Project name: Vexa Autopilot
- Track: Track 4: Autopilot Agent
- Repository: https://github.com/bypinkland-mi/vexa-autopilot
- GitHub release package: https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon
- Qwen / Alibaba Cloud code proof: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs
- Alibaba ECS deployment bundle: https://github.com/bypinkland-mi/vexa-autopilot/tree/main/deploy/alibaba
- Slides: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/presentation/vexa-autopilot-qwen-hackathon.pptx
- Devpost demo video artifact to upload: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/demo/vexa-devpost-demo.mp4
- Raw UI recording artifact: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/demo/vexa-local-demo.mp4
- Release deck download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-autopilot-qwen-hackathon.pptx
- Release Devpost MP4 download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-devpost-demo.mp4
- Release MP4 download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-local-demo.mp4
- Release submission package download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/SUBMISSION_PACKAGE.md
- Release final packet template download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/DEVPOST_FINAL_PACKET.template.md
- Release readiness report download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/SUBMISSION_READINESS_REPORT.md
- Release links report download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/SUBMISSION_LINKS_REPORT.md
- Release final gate report download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/FINAL_SUBMISSION_GATE_REPORT.md
- Release requirements matrix download: https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/DEVPOST_REQUIREMENTS_MATRIX.md
- Live demo URL: <Alibaba Cloud URL pending>
- Public demo video URL: <YouTube, Vimeo, or Youku URL pending>

## Copy

Vexa Autopilot is a Qwen-powered browser-agent sandbox that checks a storefront policy, extracts evidence, detects a customer-impacting mismatch, and pauses before sending any customer-facing reply.

## Artifacts

- Presentation deck: `docs/presentation/vexa-autopilot-qwen-hackathon.pptx` (579 KB)
- Devpost demo MP4: `docs/demo/vexa-devpost-demo.mp4` (1.2 MB)
- Demo video MP4: `docs/demo/vexa-local-demo.mp4` (441 KB)
- Demo video WebM: `docs/demo/vexa-local-demo.webm` (645 KB)
- Devpost final packet template: `docs/DEVPOST_FINAL_PACKET.template.md` (3 KB)
- Devpost requirements matrix: `docs/DEVPOST_REQUIREMENTS_MATRIX.md` (3 KB)
- Submission readiness report: `docs/SUBMISSION_READINESS_REPORT.md` (3 KB)
- Submission links report: `docs/SUBMISSION_LINKS_REPORT.md` (3 KB)
- Final submission gate report: `docs/FINAL_SUBMISSION_GATE_REPORT.md` (159 B)
- External submission steps: `docs/EXTERNAL_SUBMISSION_STEPS.md` (3 KB)
- Alibaba ECS deployment bundle: `deploy/alibaba/` (7 files)

## Verification Snapshot

- GitHub repo metadata: `{"defaultBranchRef":{"name":"main"},"licenseInfo":{"key":"mit","name":"MIT License","nickname":""},"url":"https://github.com/bypinkland-mi/vexa-autopilot","visibility":"PUBLIC"}`
- Latest GitHub CI at generation time: `[{"conclusion":"success","headSha":"0008cf8d0844aff7fa39939b4d0fa00492d8e65a","status":"completed","url":"https://github.com/bypinkland-mi/vexa-autopilot/actions/runs/28459720886"}]`
- Alibaba CLI version: `3.4.2`
- Alibaba profile: `ERROR: load configure failed: stat /Users/sammili/.aliyun/config.json: no such file or directory`

## Still Required

1. Configure Alibaba Cloud credentials or deploy through the console.
2. Deploy the backend on Alibaba Cloud.
3. Run `npm run verify:cloud -- <cloud-url>`.
4. Record or link Alibaba Cloud proof.
5. Upload `docs/demo/vexa-devpost-demo.mp4` or a narrated variant to YouTube, Vimeo, or Youku.
6. Paste the final URLs into Devpost and submit.
