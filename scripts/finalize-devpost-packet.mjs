import { mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const templateMode = args.template === true;
const skipCloudVerify = args["skip-cloud-verify"] === true || templateMode;

const values = {
  cloudUrl: args["cloud-url"] || "<Alibaba Cloud URL pending>",
  videoUrl: args["video-url"] || "<YouTube, Vimeo, or Youku URL pending>",
  proofUrl: args["proof-url"] || "<Alibaba Cloud proof recording URL pending>"
};

if (!templateMode) {
  for (const [key, value] of Object.entries(values)) {
    assertHttpUrl(value, key);
  }
}

let cloudVerification = "Not run. Template mode or --skip-cloud-verify was used.";
if (!skipCloudVerify) {
  const result = spawnSync("node", ["scripts/verify-cloud-url.mjs", values.cloudUrl], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    throw new Error("Cloud verification failed. Fix the cloud URL before finalizing Devpost fields.");
  }
  cloudVerification = result.stdout.trim();
}

const outputFile = path.join(
  root,
  templateMode ? "docs/DEVPOST_FINAL_PACKET.template.md" : "docs/DEVPOST_FINAL_PACKET.md"
);

const markdown = `---
title: Vexa Devpost Final Packet${templateMode ? " Template" : ""}
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Devpost Final Packet${templateMode ? " Template" : ""}

Use this file as the final copy/paste surface for Devpost. Do not paste API keys, console credentials, or private account data.

## Required Final URLs

- Live Alibaba Cloud app URL: ${values.cloudUrl}
- Public demo video URL: ${values.videoUrl}
- Alibaba Cloud proof recording URL: ${values.proofUrl}

## Devpost Fields

Project name:

\`\`\`text
Vexa Autopilot
\`\`\`

Track:

\`\`\`text
Track 4: Autopilot Agent
\`\`\`

One-liner:

\`\`\`text
Vexa Autopilot is a Qwen-powered browser-agent sandbox that checks a storefront policy, extracts evidence, detects a customer-impacting mismatch, and pauses before sending any customer-facing reply.
\`\`\`

Inspiration:

\`\`\`text
Browser agents are useful only when they can show what they saw and stop before risky actions. Vexa demonstrates that pattern in a public-safe sandbox: Qwen plans the browser task, deterministic tools execute only allowed local actions, and a human reviewer approves the final customer-facing step.
\`\`\`

What it does:

\`\`\`text
Vexa accepts a business objective, runs a Playwright browser agent against a sandbox storefront, extracts policy and checkout evidence, detects a 30-day versus 14-day refund mismatch, drafts a customer reply, and pauses before any customer-facing send action. The UI shows the trace, evidence, fallback state, and approval status in a floating V agent dock.
\`\`\`

How we built it:

\`\`\`text
Vexa uses React, Vite, and an Express API. The backend includes a DashScope/Qwen OpenAI-compatible adapter in server/qwen-cloud.mjs, a sandbox-only Playwright browser runner, deterministic evidence checks, and an approval gate for risky output. The app is packaged with Docker and an Alibaba ECS deployment bundle.
\`\`\`

Safety:

\`\`\`text
Vexa does not control a real user browser profile, does not access external sites, does not send messages, and does not include private Tabi/Nami code. All navigation is restricted to public-safe sandbox pages, and customer-facing output requires human approval.
\`\`\`

Repository:

\`\`\`text
https://github.com/bypinkland-mi/vexa-autopilot
\`\`\`

Code proof link:

\`\`\`text
https://github.com/bypinkland-mi/vexa-autopilot/blob/main/server/qwen-cloud.mjs
\`\`\`

Release package:

\`\`\`text
https://github.com/bypinkland-mi/vexa-autopilot/releases/tag/v0.1-qwen-hackathon
\`\`\`

Architecture:

\`\`\`text
https://github.com/bypinkland-mi/vexa-autopilot/blob/main/docs/ARCHITECTURE.md
\`\`\`

Presentation deck:

\`\`\`text
https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-autopilot-qwen-hackathon.pptx
\`\`\`

Demo video artifact for upload:

\`\`\`text
https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/vexa-devpost-demo.mp4
\`\`\`

## Final Verification

Cloud verification:

\`\`\`json
${cloudVerification}
\`\`\`

Before clicking submit:

1. Confirm the live URL opens from a non-local browser.
2. Confirm \`/api/health\` works on the Alibaba Cloud URL.
3. Confirm \`npm run verify:cloud -- ${values.cloudUrl}\` passes.
4. Confirm the public video URL is YouTube, Vimeo, or Youku.
5. Confirm the Devpost track is Track 4: Autopilot Agent.
6. Confirm no API keys, tokens, or private account screenshots are pasted into Devpost.
`;

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, markdown, "utf8");
console.log(JSON.stringify({ ok: true, outputFile }, null, 2));

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = rawArgs[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}

function assertHttpUrl(value, label) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid URL, got: ${value}`);
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${label} must start with http:// or https://, got: ${value}`);
  }
}
