---
title: Vexa Devpost Final Packet Template
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Devpost Final Packet Template

Use this file as the final copy/paste surface for Devpost. Do not paste API keys, console credentials, or private account data.

## Required Final URLs

- Live Alibaba Cloud app URL: <Alibaba Cloud URL pending>
- Public demo video URL: <YouTube, Vimeo, or Facebook Video URL pending>
- Alibaba Cloud proof recording URL: <Alibaba Cloud proof recording URL pending>

## Devpost Fields

Project name:

```text
Vexa Autopilot
```

Track:

```text
Track 4: Autopilot Agent
```

One-liner:

```text
Vexa Autopilot is a Qwen-powered browser-agent sandbox that checks a storefront policy, extracts evidence, detects a customer-impacting mismatch, and pauses before sending any customer-facing reply.
```

Inspiration:

```text
Browser agents are useful only when they can show what they saw and stop before risky actions. Vexa demonstrates that pattern in a public-safe sandbox: Qwen plans the browser task, deterministic tools execute only allowed local actions, and a human reviewer approves the final customer-facing step.
```

What it does:

```text
Vexa accepts a business objective, runs a Playwright browser agent against a sandbox storefront, extracts policy and checkout evidence, detects a 30-day versus 14-day refund mismatch, drafts a customer reply, and pauses before any customer-facing send action. The UI shows the trace, evidence, fallback state, and approval status in a floating V agent dock.
```

How we built it:

```text
Vexa uses React, Vite, and an Express API. The backend includes a DashScope/Qwen OpenAI-compatible adapter in server/qwen-cloud.mjs, a sandbox-only Playwright browser runner, deterministic evidence checks, and an approval gate for risky output. The app is packaged with Docker and an Alibaba ECS deployment bundle.
```

Safety:

```text
Vexa does not control a real user browser profile, does not access external sites, does not send messages, and does not include private Tabi/Nami code. All navigation is restricted to public-safe sandbox pages, and customer-facing output requires human approval.
```

Repository:

```text
https://github.com/bypinkland-mi/vexa-autopilot
```

Code proof link:

```text
https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs
```

Release package:

```text
https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon
```

Readiness report:

```text
https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/SUBMISSION_READINESS_REPORT.md
```

Architecture:

```text
https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/ARCHITECTURE.md
```

Presentation deck:

```text
https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-autopilot-qwen-hackathon.pptx
```

Demo video artifact for upload:

```text
https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-devpost-demo.mp4
```

## Final Verification

Cloud verification:

```json
Not run. Template mode or --skip-cloud-verify was used.
```

Before clicking submit:

1. Confirm the live URL opens from a non-local browser.
2. Confirm `/api/health` works on the Alibaba Cloud URL.
3. Confirm `npm run verify:cloud -- <Alibaba Cloud URL pending>` passes.
4. Confirm the public video URL is YouTube, Vimeo, or Facebook Video.
5. Confirm the Devpost track is Track 4: Autopilot Agent.
6. Confirm no API keys, tokens, or private account screenshots are pasted into Devpost.
