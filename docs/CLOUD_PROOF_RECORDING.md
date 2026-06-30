---
title: Vexa Cloud Proof Recording
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Cloud Proof Recording

Use this after the Vexa backend is reachable on Alibaba Cloud. The recorder captures only public-safe surfaces:

- The public `/api/health` endpoint.
- The Vexa app at the public cloud URL.
- The browser-agent run reaching the human approval pause.
- The GitHub Qwen Cloud code proof link: `server/qwen-cloud.mjs`.

It does not open the Alibaba Cloud console. If Devpost needs console/service evidence, record that separately with account emails, API keys, access-key pages, billing pages, and private resource IDs hidden.

## Command

```bash
npm run record:cloud-proof -- --cloud-url <Alibaba Cloud URL>
```

Default output:

```text
proof/vexa-cloud-proof.webm
```

Custom output:

```bash
npm run record:cloud-proof -- \
  --cloud-url <Alibaba Cloud URL> \
  --out proof/vexa-cloud-proof.webm
```

## Before Recording

```bash
npm run verify:cloud -- <Alibaba Cloud URL>
```

Expected:

- `/api/health` returns `ok:true`.
- Browser-agent run returns trace and evidence.
- The final trace status is `waiting_for_human`.

## Public Upload

Upload the cloud proof recording to the same public or unlisted video host used for Devpost, or include it as a release asset if Devpost accepts that proof URL.

Do not upload a clip that shows secrets, private browser profiles, real customer data, personal email inboxes, or billing pages.
