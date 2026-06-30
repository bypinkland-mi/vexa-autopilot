import { mkdir, stat, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outFile = path.join(root, "docs/SUBMISSION_PACKAGE.md");
const repoUrl = "https://github.com/bypinkland-mi/vexa-autopilot";
const codeProofUrl = `${repoUrl}/blob/main/server/qwen-cloud.mjs`;
const deckUrl = `${repoUrl}/blob/main/docs/presentation/vexa-autopilot-qwen-hackathon.pptx`;
const videoArtifactUrl = `${repoUrl}/blob/main/docs/demo/vexa-local-demo.mp4`;

const checks = {
  latestCi: exec("gh", [
    "run",
    "list",
    "--repo",
    "bypinkland-mi/vexa-autopilot",
    "--limit",
    "1",
    "--json",
    "status,conclusion,headSha,url"
  ]),
  repoMeta: exec("gh", [
    "repo",
    "view",
    "bypinkland-mi/vexa-autopilot",
    "--json",
    "url,visibility,licenseInfo,defaultBranchRef"
  ]),
  aliyunVersion: exec("aliyun", ["version"]),
  aliyunProfile: exec("aliyun", ["configure", "list"])
};

const artifacts = [
  ["Presentation deck", "docs/presentation/vexa-autopilot-qwen-hackathon.pptx"],
  ["Demo video MP4", "docs/demo/vexa-local-demo.mp4"],
  ["Demo video WebM", "docs/demo/vexa-local-demo.webm"]
];

const artifactLines = [];
for (const [label, relative] of artifacts) {
  const file = path.join(root, relative);
  try {
    const info = await stat(file);
    artifactLines.push(`- ${label}: \`${relative}\` (${formatBytes(info.size)})`);
  } catch {
    artifactLines.push(`- ${label}: missing`);
  }
}

const markdown = `---
title: Vexa Submission Package
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Submission Package

## Devpost Fields

- Project name: Vexa Autopilot
- Track: Track 4: Autopilot Agent
- Repository: ${repoUrl}
- Qwen / Alibaba Cloud code proof: ${codeProofUrl}
- Slides: ${deckUrl}
- Demo video artifact to upload: ${videoArtifactUrl}
- Live demo URL: <Alibaba Cloud URL pending>
- Public demo video URL: <YouTube, Vimeo, or Youku URL pending>

## Copy

Vexa Autopilot is a Qwen-powered browser-agent sandbox that checks a storefront policy, extracts evidence, detects a customer-impacting mismatch, and pauses before sending any customer-facing reply.

## Artifacts

${artifactLines.join("\n")}

## Verification Snapshot

- GitHub repo metadata: \`${oneLine(checks.repoMeta)}\`
- Latest GitHub CI at generation time: \`${oneLine(checks.latestCi)}\`
- Alibaba CLI version: \`${checks.aliyunVersion || "missing"}\`
- Alibaba profile: \`${checks.aliyunProfile ? oneLine(checks.aliyunProfile) : "missing ~/.aliyun/config.json"}\`

## Still Required

1. Configure Alibaba Cloud credentials or deploy through the console.
2. Deploy the backend on Alibaba Cloud.
3. Run \`npm run verify:cloud -- <cloud-url>\`.
4. Record or link Alibaba Cloud proof.
5. Upload \`docs/demo/vexa-local-demo.mp4\` or a narrated variant to YouTube, Vimeo, or Youku.
6. Paste the final URLs into Devpost and submit.
`;

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, markdown);
console.log(JSON.stringify({ ok: true, outFile }, null, 2));

function exec(command, args) {
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    }).trim();
  } catch (error) {
    return error.stderr?.toString().trim() || "";
  }
}

function oneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
