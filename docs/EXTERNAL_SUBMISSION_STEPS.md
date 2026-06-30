---
title: Vexa External Submission Steps
created: 2026-06-30
updated: 2026-06-30
---

# Vexa External Submission Steps

Use this as the last-mile checklist when logged into Alibaba Cloud, a public video account, and Devpost. Keep API keys and account screens out of public artifacts unless they are already redacted.

## 1. Alibaba Cloud

1. Create an Ubuntu ECS instance.
2. Open inbound TCP `8080` only for the judging/demo window.
3. Run the one-paste bootstrap through Alibaba Cloud Workbench, Cloud Assistant, or SSH:

```bash
curl -fsSL https://raw.githubusercontent.com/bypinkland-mi/vexa-autopilot/main/deploy/alibaba/console-one-paste.sh | \
  sudo -E VEXA_PUBLIC_ORIGIN=http://<ecs-public-ip>:8080 bash
```

Alternative: paste `deploy/alibaba/cloud-init.user-data.example` as cloud-init user data, or SSH in and run `deploy/alibaba/bootstrap-ecs.sh`.

4. For Qwen Cloud mode, set runtime variables on the server:

```bash
DASHSCOPE_API_KEY=<set in Alibaba Cloud only>
DASHSCOPE_BASE_URL=https://dashscope-us.aliyuncs.com/compatible-mode/v1
QWEN_MODEL=qwen-plus
VEXA_FORCE_MOCK=0
VEXA_HOST=0.0.0.0
VEXA_API_PORT=8080
VEXA_SANDBOX_ORIGIN=http://<ecs-public-ip>:8080
```

5. Verify from this local repo:

```bash
npm run verify:cloud -- http://<ecs-public-ip>:8080
```

## 2. Proof Recording

First record the public URL/app/code proof from this repo:

```bash
npm run record:cloud-proof -- --cloud-url <Alibaba Cloud URL>
```

This writes:

```text
proof/vexa-cloud-proof.webm
```

The automated clip shows:

1. Public app URL opens.
2. `<cloud-url>/api/health` works.
3. Vexa browser-agent flow reaches the approval pause.
4. GitHub code proof link opens: `https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs`.

If console proof is required, record a separate short clip showing the Alibaba Cloud ECS instance or service running.

Do not show API keys, billing pages, private account emails, or full access-key pages.

## 3. Public Demo Video

Upload `docs/demo/vexa-devpost-demo.mp4` to YouTube, Vimeo, or Facebook Video.

Suggested title:

```text
Vexa Autopilot - Qwen Cloud Browser Agent Demo
```

Suggested description:

```text
Vexa Autopilot is a Qwen-powered browser-agent sandbox for the Qwen Cloud AI Hackathon. It plans a browser task, checks storefront policy evidence, detects a refund-policy mismatch, and pauses before any customer-facing send action.

GitHub: https://github.com/bypinkland-mi/vexa-autopilot
Release package: https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon
```

Set visibility to public or unlisted if Devpost accepts unlisted. Confirm the URL opens in a private browser window.

## 4. Final Packet

After the three public URLs exist, run:

```bash
npm run final:submission -- \
  --cloud-url <Alibaba Cloud URL> \
  --video-url <YouTube, Vimeo, or Facebook Video URL> \
  --proof-url <Alibaba Cloud proof recording URL>
```

If you need to inspect the individual layers, run:

```bash
npm run audit:submission -- \
  --cloud-url <Alibaba Cloud URL> \
  --video-url <YouTube, Vimeo, or Facebook Video URL> \
  --proof-url <Alibaba Cloud proof recording URL>

npm run verify:submission-links -- \
  --cloud-url <Alibaba Cloud URL> \
  --video-url <YouTube, Vimeo, or Facebook Video URL> \
  --proof-url <Alibaba Cloud proof recording URL>

npm run finalize:devpost -- \
  --cloud-url <Alibaba Cloud URL> \
  --video-url <YouTube, Vimeo, or Facebook Video URL> \
  --proof-url <Alibaba Cloud proof recording URL>
```

Use `docs/DEVPOST_FINAL_PACKET.md` as the copy/paste source for Devpost.

## 5. Submit

Before clicking submit:

1. Devpost track is `Track 4: Autopilot Agent`.
2. Repository is public: `https://github.com/bypinkland-mi/vexa-autopilot`.
3. Release package is linked.
4. Live Alibaba Cloud URL is reachable.
5. Public demo video is reachable.
6. Architecture, deck, and code proof links are included.
7. No secret, token, API key, private browser profile, or real customer data appears in the submission.
