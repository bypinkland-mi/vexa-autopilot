import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const bundleName = "vexa-qwen-hackathon-submission";
const outDir = path.join(root, "dist/submission");
const stageDir = path.join(outDir, bundleName);
const archivePath = path.join(outDir, `${bundleName}.tar.gz`);
const shaPath = `${archivePath}.sha256`;
const manifestPath = path.join(root, "docs/SUBMISSION_BUNDLE_MANIFEST.md");

const includedFiles = [
  "README.md",
  "LICENSE",
  "Dockerfile",
  ".env.example",
  "docs/DEVPOST_REQUIREMENTS_MATRIX.md",
  "docs/SUBMISSION_PACKAGE.md",
  "docs/SUBMISSION_READINESS_REPORT.md",
  "docs/SUBMISSION_LINKS_REPORT.md",
  "docs/FINAL_SUBMISSION_GATE_REPORT.md",
  "docs/EXTERNAL_SUBMISSION_STEPS.md",
  "docs/CLOUD_PROOF_RECORDING.md",
  "docs/DEVPOST_FINAL_PACKET.template.md",
  "docs/FINAL_SUBMISSION_RUNBOOK.md",
  "docs/DEVPOST_SUBMISSION.md",
  "docs/ARCHITECTURE.md",
  "docs/ALIBABA_CLOUD_DEPLOYMENT.md",
  "docs/DEMO_SCRIPT.md",
  "docs/PROJECT_BOUNDARY.md",
  "docs/presentation/vexa-autopilot-qwen-hackathon.pptx",
  "docs/demo/vexa-devpost-demo.mp4",
  "deploy/alibaba/README.md",
  "deploy/alibaba/docker-compose.yml",
  "deploy/alibaba/env.alibaba.example",
  "deploy/alibaba/console-one-paste.sh",
  "deploy/alibaba/bootstrap-ecs.sh",
  "deploy/alibaba/cloud-init.user-data.example",
  "deploy/alibaba/install-ecs-docker.sh",
  "deploy/alibaba/vexa-autopilot.service",
  "scripts/verify-cloud-url.mjs",
  "scripts/record-cloud-proof.mjs",
  "scripts/verify-submission-links.mjs",
  "scripts/final-submission-gate.mjs",
  "scripts/finalize-devpost-packet.mjs"
];

await rm(outDir, { recursive: true, force: true });
await mkdir(stageDir, { recursive: true });

for (const relative of includedFiles) {
  const source = path.join(root, relative);
  await stat(source);
  const target = path.join(stageDir, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await copyFile(source, target);
}

await writeFile(
  path.join(stageDir, "BUNDLE_CONTENTS.txt"),
  [
    "Vexa Autopilot Qwen Cloud Hackathon submission bundle",
    "",
    "This bundle contains public-safe submission artifacts only.",
    "It does not include API keys, credentials, private browser profiles, real customer data, or private Tabi/Nami source code.",
    "",
    "Included files:",
    ...includedFiles.map((file) => `- ${file}`),
    "",
    "Final command after public URLs exist:",
    "npm run final:submission -- --cloud-url <Alibaba Cloud URL> --video-url <YouTube/Vimeo/Youku URL> --proof-url <proof URL>"
  ].join("\n"),
  "utf8"
);

const tarResult = spawnSync("tar", ["-czf", archivePath, "-C", outDir, bundleName], {
  cwd: root,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

if (tarResult.status !== 0) {
  console.error(tarResult.stdout);
  console.error(tarResult.stderr);
  throw new Error("Failed to build submission bundle archive.");
}

const archiveBuffer = await readFile(archivePath);
const sha256 = createHash("sha256").update(archiveBuffer).digest("hex");
await writeFile(shaPath, `${sha256}  ${path.basename(archivePath)}\n`, "utf8");

const manifest = `---
title: Vexa Submission Bundle Manifest
created: 2026-06-30
updated: 2026-06-30
---

# Vexa Submission Bundle Manifest

The submission bundle is a single public-safe archive for handoff, backup, or judge-facing artifact review. It is generated locally and uploaded to the GitHub release; the archive itself is not committed to the repository.

## Generate

\`\`\`bash
npm run build:submission-bundle
\`\`\`

## Output

- Archive: \`dist/submission/${bundleName}.tar.gz\`
- SHA256: \`dist/submission/${bundleName}.tar.gz.sha256\`
- Release download: \`https://github.com/bypinkland-mi/vexa-autopilot/releases/download/v0.1-qwen-hackathon/${bundleName}.tar.gz\`
- SHA256: \`${sha256}\`
- Size: \`${formatBytes(archiveBuffer.length)}\`

## Included Files

${includedFiles.map((file) => `- \`${file}\``).join("\n")}

## Excluded

- API keys, DashScope credentials, Alibaba access keys, OAuth tokens, cookies, browser profiles, local \`.env*\` files, private Tabi/Nami source code, and real customer data.
`;

await writeFile(manifestPath, manifest, "utf8");

console.log(
  JSON.stringify(
    {
      ok: true,
      archivePath,
      shaPath,
      manifestPath,
      sha256,
      size: archiveBuffer.length,
      files: includedFiles.length
    },
    null,
    2
  )
);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
