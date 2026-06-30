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

## Safety

Vexa does not control a real user browser profile, does not access external sites, does not send messages, and does not include private Tabi/Nami code. All navigation is restricted to local `/sandbox/*` pages.

## What Is Next

- Deploy to Alibaba Cloud and attach the public URL.
- Record the required Alibaba Cloud proof clip.
- Record the final 3-minute demo video.
- Attach the presentation deck.

## Links To Prepare

- Code repository: `<public GitHub URL>`
- Live demo: `<Alibaba Cloud URL>`
- Demo video: `<public YouTube, Vimeo, or Youku URL>`
- Slides: `<presentation URL or uploaded PDF>`
