---
title: Devpost Submission Draft
created: 2026-06-30
updated: 2026-06-30
---

# Devpost Submission Draft

## Project Name

Vexa Autopilot

## Track

Track 4: Autopilot Agent

## One-liner

Vexa Autopilot is a Qwen-powered browser-agent sandbox that checks a storefront policy, extracts evidence, detects a customer-impacting mismatch, and pauses before sending any customer-facing reply.

## Inspiration

Browser agents are useful only when they can show what they saw and stop before risky actions. Vexa demonstrates that pattern in a public-safe sandbox: Qwen plans the browser task, deterministic tools execute only allowed local actions, and a human reviewer approves the final customer-facing step.

## What It Does

- Accepts a business objective.
- Uses Qwen Cloud, local Qwen, or a safe fallback planner.
- Runs a Playwright browser agent against local sandbox pages.
- Extracts refund-policy and checkout evidence.
- Detects a 30-day vs 14-day policy mismatch.
- Drafts a customer reply but pauses before any send action.
- Shows trace, evidence, planner fallback state, and approval status in a floating V agent dock.

## How We Built It

- React + Vite frontend.
- Express API and sandbox pages.
- Qwen/DashScope OpenAI-compatible API adapter.
- Playwright browser runner with local sandbox URL enforcement.
- Docker container for Alibaba Cloud deployment.

## Alibaba Cloud / Qwen Usage

The Qwen integration lives in `server/qwen-cloud.mjs`. It calls the DashScope/Qwen OpenAI-compatible endpoint when `DASHSCOPE_API_KEY` is configured and falls back visibly when the planner is unavailable.

Code proof link:

https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs

## Safety

Vexa does not control a real user browser profile, does not access external sites, does not send messages, and does not include private Tabi/Nami code. All navigation is restricted to local `/sandbox/*` pages.

## What Is Next

- Deploy to Alibaba Cloud and attach the public URL.
- Record the required Alibaba Cloud proof clip.
- Upload the prepared under-3-minute Devpost demo video.
- Attach the presentation deck.

## Links To Prepare

- Code repository: `https://github.com/bypinkland-mi/vexa-autopilot`
- GitHub release package: `https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon`
- Qwen Cloud code proof: `https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs`
- Alibaba ECS deployment bundle: `https://github.com/bypinkland-mi/vexa-autopilot/tree/main/deploy/alibaba`
- Live demo: `<Alibaba Cloud URL>`
- Demo video: `<public YouTube, Vimeo, or Youku URL>`
- Devpost video artifact to upload: `docs/demo/vexa-devpost-demo.mp4`
- Raw UI recording artifact: `docs/demo/vexa-local-demo.mp4`
- Slides: `https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/presentation/vexa-autopilot-qwen-hackathon.pptx`
- Release Devpost MP4 download: `https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-devpost-demo.mp4`
- Release MP4 download: `https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-local-demo.mp4`
- Release deck download: `https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-autopilot-qwen-hackathon.pptx`
