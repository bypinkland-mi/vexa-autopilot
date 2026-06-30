---
title: Vexa Autopilot Presentation Outline
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Autopilot Presentation Outline

## Slide 1 - Title

Vexa Autopilot: Qwen browser-agent sandbox with evidence and approval gates.

## Slide 2 - Problem

Browser agents can complete useful business tasks, but unsafe agents hide what they saw and may act before a human reviews customer-facing output.

## Slide 3 - Solution

Vexa pairs Qwen planning with deterministic browser execution:

- Qwen plans sandbox browser actions.
- Playwright executes only allowlisted local actions.
- Evidence is attached before completion.
- Customer-facing actions pause for approval.

## Slide 4 - Demo Flow

Task: compare refund policy and checkout copy.

Expected result:

- Policy says 30 days.
- Checkout says 14 days.
- Vexa flags mismatch.
- Draft reply pauses before send.

## Slide 5 - Architecture

Use the Mermaid diagram from `docs/ARCHITECTURE.md`.

## Slide 6 - Qwen / Alibaba Cloud

- Qwen Cloud adapter: `server/qwen-cloud.mjs`.
- Docker-ready deployment for Alibaba Cloud.
- `/api/health` exposes planner provider state.
- Fallback is visible, not hidden.

## Slide 7 - Safety

- No real browser profile.
- No external websites.
- No customer data.
- No secrets in repo.
- Local `/sandbox/*` navigation only.
- Approval required before send.

## Slide 8 - Impact

Vexa shows a practical pattern for enterprise-safe browser agents: plan, act inside boundaries, attach evidence, and require human approval where risk rises.

## Slide 9 - Next Steps

- Connect live Qwen Cloud in Alibaba Cloud.
- Add more sandbox business workflows.
- Expand verifier evidence schema.
- Add exportable audit trail.
