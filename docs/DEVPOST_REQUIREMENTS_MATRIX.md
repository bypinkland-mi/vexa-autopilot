---
title: Vexa Devpost Requirements Matrix
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Devpost Requirements Matrix

This matrix maps the Qwen Cloud AI Hackathon / Devpost requirements to Vexa's current evidence. Use it before final submission so the project is judged against explicit proof, not memory.

Sources:

- Hackathon page: `https://qwencloud-hackathon.devpost.com/`
- Rules page: `https://qwencloud-hackathon.devpost.com/rules`

## Current Verdict

Vexa is repo/release-ready, but not fully submitted. The remaining required evidence is external-account evidence: Alibaba Cloud live URL, Alibaba Cloud proof recording, public YouTube/Vimeo/Facebook Video demo video URL, and final Devpost submission.

## Requirement Matrix

| Requirement | Vexa Evidence | Status | Final Action |
| --- | --- | --- | --- |
| Project uses Qwen models available through Qwen Cloud / Alibaba Cloud | `server/qwen-cloud.mjs`, `.env.example`, `docs/ALIBABA_CLOUD_DEPLOYMENT.md`, `deploy/alibaba/` | ready for deployment | Configure `DASHSCOPE_API_KEY` in Alibaba Cloud and run with `VEXA_FORCE_MOCK=0` for final proof. |
| Track selected | `Track 4: Autopilot Agent` in `docs/DEVPOST_SUBMISSION.md`, `docs/DEVPOST_FINAL_PACKET.template.md`, and `docs/SUBMISSION_PACKAGE.md` | ready | Select Track 4 in Devpost. |
| Public open-source repository | `https://github.com/bypinkland-mi/vexa-autopilot`, MIT `LICENSE` | ready | Paste repo URL into Devpost. |
| Architecture diagram / technical explanation | `docs/ARCHITECTURE.md`, `docs/presentation/vexa-autopilot-qwen-hackathon.pptx` | ready | Link architecture doc and/or upload deck. |
| Code shows Qwen / Alibaba Cloud usage | `https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs` | ready | Paste code proof link into Devpost. |
| Backend runs on Alibaba Cloud | `Dockerfile`, `deploy/alibaba/README.md`, `deploy/alibaba/console-one-paste.sh`, `deploy/alibaba/bootstrap-ecs.sh`, `deploy/alibaba/cloud-init.user-data.example` | pending | Deploy on Alibaba Cloud and keep the public URL available through judging. |
| Alibaba Cloud proof is provided | `docs/CLOUD_PROOF_RECORDING.md`, `scripts/record-cloud-proof.mjs`, `docs/EXTERNAL_SUBMISSION_STEPS.md` describe safe recording scope | pending | Run `npm run record:cloud-proof -- --cloud-url <Alibaba Cloud URL>`, then record/link any required console proof without secrets. |
| Demo video is under/about 3 minutes | `docs/demo/vexa-devpost-demo.mp4` is 82.8s H.264/AAC; release asset exists | ready locally | Upload to YouTube, Vimeo, or Facebook Video and paste the public URL. |
| Public demo video URL | `npm run verify:submission-links -- --video-url <url>` validates platform and reachability | pending | Upload video and rerun final gate. |
| No secrets/private product code in public submission | `scripts/public-safety-check.mjs`, `docs/PROJECT_BOUNDARY.md`, `npm run check:submission` | ready | Keep `.env*` and credentials uncommitted. |
| Final copy/paste Devpost packet | `npm run finalize:devpost`, `docs/DEVPOST_FINAL_PACKET.template.md` | ready template | Generate `docs/DEVPOST_FINAL_PACKET.md` after final URLs exist. |
| Final pre-submit gate | `npm run final:submission`, `docs/FINAL_SUBMISSION_GATE_REPORT.md` | pending final URLs | Run with `--cloud-url`, `--video-url`, and `--proof-url` before clicking Submit. |

## Final Command

After the Alibaba Cloud URL, public video URL, and proof URL exist, run:

```bash
npm run final:submission -- \
  --cloud-url <Alibaba Cloud URL> \
  --video-url <YouTube, Vimeo, or Facebook Video URL> \
  --proof-url <Alibaba Cloud proof recording URL>
```

Only submit on Devpost after the final gate reports zero pending and zero blocked items.
