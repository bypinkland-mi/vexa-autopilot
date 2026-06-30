---
title: Vexa Submission Bundle Manifest
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Submission Bundle Manifest

The submission bundle is a single public-safe archive for handoff, backup, or judge-facing artifact review. It is generated locally and uploaded to the GitHub release; the archive itself is not committed to the repository.

## Generate

```bash
npm run build:submission-bundle
```

## Output

- Archive: `dist/submission/vexa-qwen-hackathon-submission.tar.gz`
- SHA256: `dist/submission/vexa-qwen-hackathon-submission.tar.gz.sha256`
- Release download: `https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-qwen-hackathon-submission.tar.gz`
- SHA256: `eed3f2c86dffb4a287178551ddff3b3a39f7f2dade2aee623d83ab5af5a7238c`
- Size: `1.7 MB`

## Included Files

- `README.md`
- `LICENSE`
- `Dockerfile`
- `.env.example`
- `docs/DEVPOST_REQUIREMENTS_MATRIX.md`
- `docs/SUBMISSION_PACKAGE.md`
- `docs/SUBMISSION_READINESS_REPORT.md`
- `docs/SUBMISSION_LINKS_REPORT.md`
- `docs/FINAL_SUBMISSION_GATE_REPORT.md`
- `docs/EXTERNAL_SUBMISSION_STEPS.md`
- `docs/CLOUD_PROOF_RECORDING.md`
- `docs/DEVPOST_FINAL_PACKET.template.md`
- `docs/FINAL_SUBMISSION_RUNBOOK.md`
- `docs/DEVPOST_SUBMISSION.md`
- `docs/ARCHITECTURE.md`
- `docs/ALIBABA_CLOUD_DEPLOYMENT.md`
- `docs/DEMO_SCRIPT.md`
- `docs/PROJECT_BOUNDARY.md`
- `docs/presentation/vexa-autopilot-qwen-hackathon.pptx`
- `docs/demo/vexa-devpost-demo.mp4`
- `deploy/alibaba/README.md`
- `deploy/alibaba/docker-compose.yml`
- `deploy/alibaba/env.alibaba.example`
- `deploy/alibaba/console-one-paste.sh`
- `deploy/alibaba/bootstrap-ecs.sh`
- `deploy/alibaba/cloud-init.user-data.example`
- `deploy/alibaba/install-ecs-docker.sh`
- `deploy/alibaba/vexa-autopilot.service`
- `scripts/verify-cloud-url.mjs`
- `scripts/record-cloud-proof.mjs`
- `scripts/verify-submission-links.mjs`
- `scripts/final-submission-gate.mjs`
- `scripts/finalize-devpost-packet.mjs`

## Excluded

- API keys, DashScope credentials, Alibaba access keys, OAuth tokens, cookies, browser profiles, local `.env*` files, private Tabi/Nami source code, and real customer data.
