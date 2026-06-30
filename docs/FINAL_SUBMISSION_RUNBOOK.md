---
title: Vexa Final Submission Runbook
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Final Submission Runbook

Use this runbook after Sammi chooses the public GitHub owner and Alibaba Cloud account. Do not paste API keys into any file or terminal history that will be committed.

## 1. Pre-Publish Check

```bash
npm run check:submission
git status --short
git log --oneline --decorate -1
```

Expected:

- `npm run check:submission` passes.
- `git status --short` is empty.
- Latest commit is the Vexa hackathon submission commit.

## 2. Publish Public GitHub Repository

The public repository is now:

```text
https://github.com/bypinkland-mi/vexa-autopilot
```

If this repo ever needs to be recreated, choose the account/owner intentionally. The local `gh` active account may not be the intended public owner.

```bash
gh auth status
gh auth switch --user <chosen-github-user>
gh repo create <chosen-github-user>/vexa-autopilot --public --source=. --remote=origin --push
```

After publish:

```bash
gh repo view <chosen-github-user>/vexa-autopilot --web
```

Devpost needs the public repository URL and this direct code link:

```text
https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs
```

## 3. Deploy To Alibaba Cloud

Any container-capable Alibaba Cloud service is acceptable if the proof shows the backend running on Alibaba Cloud.

For a plain ECS instance, use the ready bundle in `deploy/alibaba/`. It includes Docker Compose, an env template, an Ubuntu Docker install helper, and an optional systemd unit.

Recommended simple path:

1. Create an Ubuntu ECS instance and open inbound TCP `8080`.
2. Paste `deploy/alibaba/cloud-init.user-data.example` as user-data, or SSH in and run `deploy/alibaba/bootstrap-ecs.sh`.
3. For Qwen Cloud mode, set these runtime environment variables on the server:

```bash
DASHSCOPE_API_KEY=<set in Alibaba Cloud secret/env UI>
DASHSCOPE_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
VEXA_FORCE_MOCK=0
VEXA_HOST=0.0.0.0
VEXA_API_PORT=8080
VEXA_SANDBOX_ORIGIN=<public-or-internal-app-origin>
```

If Qwen credentials are not ready, deploy first with:

```bash
VEXA_FORCE_MOCK=1
VEXA_HOST=0.0.0.0
VEXA_API_PORT=8080
```

Then repeat with Qwen enabled before the final demo if possible.

## 4. Cloud Smoke Test

Replace `<cloud-url>` with the Alibaba Cloud URL.

```bash
curl -s <cloud-url>/api/health
curl -s <cloud-url>/api/browser-agent/run \
  -H 'Content-Type: application/json' \
  -d '{"objective":"Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply."}'
npm run verify:cloud -- <cloud-url>
```

Expected:

- `/api/health` returns service metadata and the selected provider.
- Browser-agent run returns a trace, evidence, and a pause-before-approval result.
- `npm run verify:cloud -- <cloud-url>` returns `ok:true`.

## 5. Record Proof

Record two separate public-safe clips:

- Alibaba Cloud proof: console/service running, public URL, `/api/health`, app workflow, and code link to `server/qwen-cloud.mjs`.
- Main demo video: upload `docs/demo/vexa-devpost-demo.mp4`, or record a narrated version under/about three minutes using `docs/DEMO_SCRIPT.md`.

Upload the main demo video publicly to YouTube, Vimeo, or Youku.

## 6. Devpost Fields

Use:

- Project name: `Vexa Autopilot`
- Track: `Track 4: Autopilot Agent`
- GitHub release package: `https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon`
- Devpost video artifact: `docs/demo/vexa-devpost-demo.mp4`
- Text copy: `docs/DEVPOST_SUBMISSION.md`
- Architecture: `docs/ARCHITECTURE.md`
- Slides: `docs/presentation/vexa-autopilot-qwen-hackathon.pptx`
- Final audit: `docs/SUBMISSION_AUDIT.md`

## 7. Final Gate

Generate the final copy/paste packet after the Alibaba Cloud URL, public video URL, and proof recording URL exist:

```bash
npm run finalize:devpost -- \
  --cloud-url <Alibaba Cloud URL> \
  --video-url <YouTube, Vimeo, or Youku URL> \
  --proof-url <Alibaba Cloud proof recording URL>
```

If the cloud URL has already been verified elsewhere, add `--skip-cloud-verify`.

Before clicking submit, verify every row in `docs/SUBMISSION_AUDIT.md` has external evidence, not only local evidence.
