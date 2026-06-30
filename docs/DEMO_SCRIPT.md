---
title: Vexa Autopilot Demo Script
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Autopilot Demo Script

Target length: 2.5 to 3 minutes.

Prepared artifact: `docs/demo/vexa-devpost-demo.mp4` is an 82.8-second silent/captioned Devpost-ready cut generated with:

```bash
npm run render:devpost-demo
```

Use this MP4 for a quick public upload, or use the script below to record a fuller narrated variant.

## 0:00 - 0:20 Problem

"Browser agents should not just click around. For business workflows, they need evidence, policy checks, and a human approval gate before anything customer-facing happens."

## 0:20 - 0:45 Product

"This is Vexa Autopilot, a Qwen browser-agent sandbox. The task is to open a demo storefront, find the refund policy, compare it with checkout copy, and draft a customer reply without sending anything."

## 0:45 - 1:25 Run

1. Show the request in the left panel.
2. Click the floating V agent dock.
3. Click `Run browser agent`.
4. Show the planner status.
5. Show trace rows: navigate, click, extract, navigate, extract, pause.

## 1:25 - 2:00 Evidence

"The policy page says refunds are available within 30 days, but checkout says returns are accepted within 14 days. Vexa flags the contradiction and attaches page evidence."

## 2:00 - 2:30 Approval

"The draft reply is customer-facing, so Vexa pauses and asks for approval. This is the key safety behavior: the agent can gather evidence and prepare work, but it does not send on its own."

## 2:30 - 3:00 Qwen + Deployment

"When Qwen Cloud is configured, Qwen plans the browser steps through the DashScope-compatible API. If the planner is offline, the UI clearly marks fallback while the sandbox runner still proves the workflow. The app is packaged in Docker for Alibaba Cloud deployment."
