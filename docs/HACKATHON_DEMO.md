# Vexa Autopilot Hackathon Demo

Vexa Autopilot is a public-safe Qwen Cloud demo app for approval-safe browser-agent workflows.

## Demo Story

The demo asks Vexa to open a sandbox storefront, find the refund policy, compare it with checkout copy, and pause before drafting a customer-facing reply.

The important behavior is the safety gate:

- Low-risk navigation, reading, and analysis steps can complete.
- The customer-facing send step pauses for review.
- The reviewer can approve or reject.
- Evidence is visible before completion.
- The floating V icon opens the browser-agent panel without leaving the page.

## Run Locally

```bash
npm install
npm run dev:api
npm run dev
```

Open `http://127.0.0.1:5173`.

The default local API port is `8798` to avoid collisions with existing Playroom, Hermes, and Codex dashboard services.

## Real Browser Agent

The app includes a real Playwright-backed browser runner:

```bash
curl -s http://127.0.0.1:8798/api/browser-agent/run \
  -H 'Content-Type: application/json' \
  -d '{"objective":"Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply."}'
```

With Qwen Cloud configured, Qwen returns the browser action plan. Vexa then executes the allowed sandbox actions with Playwright:

- `navigate`
- `click`
- `extract`
- `pause_for_approval`

Without a key, the same runner uses a safe fallback plan so judges can still run the demo.

## Qwen Cloud Mode

Mock mode is the safe default. To test Qwen Cloud:

```bash
cp .env.example .env.local
```

Set `DASHSCOPE_API_KEY`, then run:

```bash
VEXA_FORCE_MOCK=0 npm run dev:api
npm run dev
```

If your Model Studio workspace uses a region-specific base URL, set `DASHSCOPE_BASE_URL`.

## Local Qwen 3.5 9B Mode

For local judging/dev, use the LM Studio OpenAI-compatible server:

```bash
VEXA_PLANNER_PROVIDER=local-qwen \
LOCAL_QWEN_BASE_URL=http://127.0.0.1:1234/v1 \
LOCAL_QWEN_MODEL=prism-qwen35-9b-v2 \
npm run dev:api
```

The browser runner will call the local Qwen planner first. If it is unavailable, the UI shows `Local Qwen offline - using safe fallback plan.` Vexa still runs the sandbox browser flow, collects evidence, and pauses before the customer-facing action.

## Safety Boundary

This repo must stay public-safe:

- No Tabi desktop source.
- No private Nami router/core source.
- No production secrets.
- No real customer data.
- No private browser profiles, cookies, or downloaded files.

## Verification

```bash
npm test
npm run build
npm run qa:browser
```

`npm run qa:browser` checks the desktop workflow, approval path, evidence report, and mobile overflow.
