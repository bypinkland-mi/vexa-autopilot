import { mkdir, stat, writeFile } from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const args = parseArgs(process.argv.slice(2));
const outputFile = path.join(root, "docs/SUBMISSION_READINESS_REPORT.md");

const inputs = {
  cloudUrl: args["cloud-url"] || "",
  videoUrl: args["video-url"] || "",
  proofUrl: args["proof-url"] || ""
};

const checks = [];

await fileExists("LICENSE", "MIT license file");
await fileExists("README.md", "README");
await fileExists("Dockerfile", "Dockerfile");
await fileExists("docs/ARCHITECTURE.md", "Architecture diagram document");
await fileExists("docs/DEVPOST_SUBMISSION.md", "Devpost copy draft");
await fileExists("docs/DEVPOST_FINAL_PACKET.template.md", "Final Devpost packet template");
await fileExists("docs/demo/vexa-devpost-demo.mp4", "Devpost-ready MP4 demo");
await fileExists("docs/presentation/vexa-autopilot-qwen-hackathon.pptx", "Presentation deck");
await fileExists("deploy/alibaba/bootstrap-ecs.sh", "Alibaba ECS bootstrap script");
await fileExists("deploy/alibaba/cloud-init.user-data.example", "Alibaba cloud-init user-data example");

jsonCommandCheck(
  "Repository is public with MIT license",
  "gh",
  ["repo", "view", "bypinkland-mi/vexa-autopilot", "--json", "url,visibility,licenseInfo,defaultBranchRef"],
  (payload) =>
    payload.url === "https://github.com/bypinkland-mi/vexa-autopilot" &&
    payload.visibility === "PUBLIC" &&
    payload.licenseInfo?.key === "mit" &&
    payload.defaultBranchRef?.name === "main",
  (payload) =>
    `${payload.url}; visibility=${payload.visibility}; license=${payload.licenseInfo?.key}; default=${payload.defaultBranchRef?.name}`
);

jsonCommandCheck(
  "Latest GitHub CI passed",
  "gh",
  [
    "run",
    "list",
    "--repo",
    "bypinkland-mi/vexa-autopilot",
    "--limit",
    "1",
    "--json",
    "status,conclusion,headSha,url"
  ],
  (payload) => Array.isArray(payload) && payload[0]?.status === "completed" && payload[0]?.conclusion === "success",
  (payload) => {
    const run = Array.isArray(payload) ? payload[0] : null;
    return run ? `${run.url}; sha=${String(run.headSha || "").slice(0, 7)}` : "No run found";
  }
);

jsonCommandCheck(
  "Release contains required assets",
  "gh",
  [
    "release",
    "view",
    "v0.1-qwen-hackathon",
    "--repo",
    "bypinkland-mi/vexa-autopilot",
    "--json",
    "assets,url"
  ],
  (payload) => {
    const assets = new Set((payload.assets || []).map((asset) => asset.name));
    return [
      "vexa-devpost-demo.mp4",
      "vexa-autopilot-qwen-hackathon.pptx",
      "SUBMISSION_PACKAGE.md",
      "DEVPOST_FINAL_PACKET.template.md",
      "bootstrap-ecs.sh",
      "cloud-init.user-data.example"
    ].every((name) => assets.has(name));
  },
  (payload) => {
    const names = (payload.assets || []).map((asset) => asset.name).sort();
    return `${payload.url}; assets=${names.join(", ")}`;
  }
);

jsonCommandCheck(
  "Devpost MP4 is under 3 minutes and upload-ready",
  "ffprobe",
  [
    "-v",
    "error",
    "-show_entries",
    "stream=codec_type,codec_name,width,height:format=duration,size",
    "-of",
    "json",
    "docs/demo/vexa-devpost-demo.mp4"
  ],
  (payload) => {
    const duration = Number(payload.format?.duration || 0);
    const video = (payload.streams || []).find((stream) => stream.codec_type === "video");
    const audio = (payload.streams || []).find((stream) => stream.codec_type === "audio");
    return (
      duration > 0 &&
      duration <= 180 &&
      video?.codec_name === "h264" &&
      video?.width === 1280 &&
      video?.height === 720 &&
      audio?.codec_name === "aac"
    );
  },
  (payload) => {
    const duration = Number(payload.format?.duration || 0).toFixed(1);
    const video = (payload.streams || []).find((stream) => stream.codec_type === "video");
    const audio = (payload.streams || []).find((stream) => stream.codec_type === "audio");
    return `${duration}s; ${video?.codec_name} ${video?.width}x${video?.height}; audio=${audio?.codec_name}; size=${payload.format?.size} bytes`;
  }
);

commandCheck("Alibaba CLI installed", "aliyun", ["version"], (stdout) => stdout.trim().length > 0);
commandCheck("Alibaba CLI profile configured", "aliyun", ["configure", "list"], (stdout) => {
  return stdout.includes("Profile") || stdout.includes("Region") || stdout.includes("Mode");
});

if (inputs.cloudUrl) {
  assertHttpUrl(inputs.cloudUrl, "cloud-url");
  const result = spawnSync("node", ["scripts/verify-cloud-url.mjs", inputs.cloudUrl], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  checks.push({
    label: "Alibaba Cloud live URL verifies",
    status: result.status === 0 ? "ready" : "blocked",
    evidence: result.status === 0 ? oneLine(result.stdout) : oneLine(result.stderr || result.stdout)
  });
} else {
  checks.push({
    label: "Alibaba Cloud live URL verifies",
    status: "pending",
    evidence: "Run with --cloud-url <Alibaba Cloud URL> after deployment."
  });
}

if (inputs.videoUrl) {
  assertHttpUrl(inputs.videoUrl, "video-url");
  checks.push({
    label: "Public demo video URL is accepted platform",
    status: isAllowedVideoUrl(inputs.videoUrl) ? "ready" : "blocked",
    evidence: inputs.videoUrl
  });
} else {
  checks.push({
    label: "Public demo video URL is accepted platform",
    status: "pending",
    evidence: "Run with --video-url <YouTube, Vimeo, or Youku URL> after upload."
  });
}

if (inputs.proofUrl) {
  assertHttpUrl(inputs.proofUrl, "proof-url");
  checks.push({
    label: "Alibaba Cloud proof recording URL supplied",
    status: "ready",
    evidence: inputs.proofUrl
  });
} else {
  checks.push({
    label: "Alibaba Cloud proof recording URL supplied",
    status: "pending",
    evidence: "Run with --proof-url <recording URL> after proof capture."
  });
}

const counts = {
  ready: checks.filter((check) => check.status === "ready").length,
  pending: checks.filter((check) => check.status === "pending").length,
  blocked: checks.filter((check) => check.status === "blocked").length
};

const markdown = `---
title: Vexa Submission Readiness Report
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Submission Readiness Report

Generated by:

\`\`\`bash
npm run audit:submission${inputs.cloudUrl ? ` -- --cloud-url ${inputs.cloudUrl}` : ""}${
  inputs.videoUrl ? ` --video-url ${inputs.videoUrl}` : ""
}${inputs.proofUrl ? ` --proof-url ${inputs.proofUrl}` : ""}
\`\`\`

## Summary

- Ready: ${counts.ready}
- Pending: ${counts.pending}
- Blocked: ${counts.blocked}

## Checks

| Check | Status | Evidence |
| --- | --- | --- |
${checks.map((check) => `| ${escapeTable(check.label)} | ${check.status} | ${escapeTable(check.evidence)} |`).join("\n")}

## Final Pending Items

${checks
  .filter((check) => check.status !== "ready")
  .map((check) => `- ${check.label}: ${check.evidence}`)
  .join("\n") || "- None."}
`;

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, markdown, "utf8");
console.log(JSON.stringify({ ok: counts.blocked === 0, counts, outputFile }, null, 2));

if (args.strict === true && (counts.pending > 0 || counts.blocked > 0)) {
  process.exit(1);
}

async function fileExists(relative, label) {
  try {
    await stat(path.join(root, relative));
    checks.push({ label, status: "ready", evidence: relative });
  } catch {
    checks.push({ label, status: "blocked", evidence: `Missing ${relative}` });
  }
}

function commandCheck(label, command, commandArgs, predicate) {
  try {
    const stdout = execFileSync(command, commandArgs, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    checks.push({
      label,
      status: predicate(stdout) ? "ready" : "blocked",
      evidence: oneLine(stdout)
    });
  } catch (error) {
    checks.push({
      label,
      status: "pending",
      evidence: oneLine(error.stderr?.toString() || error.message)
    });
  }
}

function jsonCommandCheck(label, command, commandArgs, predicate, formatEvidence = null) {
  try {
    const stdout = execFileSync(command, commandArgs, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    const payload = JSON.parse(stdout);
    checks.push({
      label,
      status: predicate(payload) ? "ready" : "blocked",
      evidence: formatEvidence ? formatEvidence(payload) : oneLine(stdout)
    });
  } catch (error) {
    checks.push({
      label,
      status: "pending",
      evidence: oneLine(error.stderr?.toString() || error.message)
    });
  }
}

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

function isAllowedVideoUrl(value) {
  const hostname = new URL(value).hostname.toLowerCase();
  return (
    hostname === "youtu.be" ||
    hostname.endsWith("youtube.com") ||
    hostname.endsWith("vimeo.com") ||
    hostname.endsWith("youku.com")
  );
}

function oneLine(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function escapeTable(value) {
  return oneLine(value).replaceAll("|", "\\|");
}
