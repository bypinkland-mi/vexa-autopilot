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
- Qwen / Alibaba Cloud code proof: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs
- Alibaba ECS deployment bundle: https://github.com/bypinkland-mi/vexa-autopilot/tree/main/deploy/alibaba
- Slides: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/presentation/vexa-autopilot-qwen-hackathon.pptx
- Demo video artifact to upload: https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/demo/vexa-local-demo.mp4
- Live demo URL: <Alibaba Cloud URL pending>
- Public demo video URL: <YouTube, Vimeo, or Youku URL pending>

## Copy

Vexa Autopilot is a Qwen-powered browser-agent sandbox that checks a storefront policy, extracts evidence, detects a customer-impacting mismatch, and pauses before sending any customer-facing reply.

## Artifacts

- Presentation deck: `docs/presentation/vexa-autopilot-qwen-hackathon.pptx` (579 KB)
- Demo video MP4: `docs/demo/vexa-local-demo.mp4` (441 KB)
- Demo video WebM: `docs/demo/vexa-local-demo.webm` (645 KB)
- Alibaba ECS deployment bundle: `deploy/alibaba/` (5 files)

## Verification Snapshot

- GitHub repo metadata: `{"defaultBranchRef":{"name":"main"},"licenseInfo":{"key":"mit","name":"MIT License","nickname":""},"url":"https://github.com/bypinkland-mi/vexa-autopilot","visibility":"PUBLIC"}`
- Latest GitHub CI at generation time: `[{"conclusion":"success","headSha":"276132b9ca904794c95837efd0c410e2b05dd802","status":"completed","url":"https://github.com/bypinkland-mi/vexa-autopilot/actions/runs/28455740349"}]`
- Alibaba CLI version: `3.4.2`
- Alibaba profile: `ERROR: load configure failed: stat /Users/sammili/.aliyun/config.json: no such file or directory`

## Still Required

1. Configure Alibaba Cloud credentials or deploy through the console.
2. Deploy the backend on Alibaba Cloud.
3. Run `npm run verify:cloud -- <cloud-url>`.
4. Record or link Alibaba Cloud proof.
5. Upload `docs/demo/vexa-local-demo.mp4` or a narrated variant to YouTube, Vimeo, or Youku.
6. Paste the final URLs into Devpost and submit.
