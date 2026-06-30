import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outFile = path.join(root, "docs/SUBMISSION_PACKAGE.md");
const repoUrl = "https://github.com/bypinkland-mi/vexa-autopilot";
const releaseUrl = `${repoUrl}/releases/tag/v0.1-qwen-hackathon`;
const codeProofUrl = `${repoUrl}/blob/main/server/qwen-cloud.mjs`;
const deckUrl = `${repoUrl}/blob/main/docs/presentation/vexa-autopilot-qwen-hackathon.pptx`;
const videoArtifactUrl = `${repoUrl}/blob/main/docs/demo/vexa-local-demo.mp4`;
const finalDemoArtifactUrl = `${repoUrl}/blob/main/docs/demo/vexa-devpost-demo.mp4`;
const alibabaDeployBundleUrl = `${repoUrl}/tree/main/deploy/alibaba`;
const releaseDeckUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/vexa-autopilot-qwen-hackathon.pptx`;
const releaseVideoUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/vexa-local-demo.mp4`;
const releaseFinalDemoUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/vexa-devpost-demo.mp4`;
const releasePackageUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/SUBMISSION_PACKAGE.md`;
const releaseFinalPacketTemplateUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/DEVPOST_FINAL_PACKET.template.md`;
const releaseReadinessReportUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/SUBMISSION_READINESS_REPORT.md`;
const releaseLinksReportUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/SUBMISSION_LINKS_REPORT.md`;
const releaseFinalGateReportUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/FINAL_SUBMISSION_GATE_REPORT.md`;
const releaseRequirementsMatrixUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/DEVPOST_REQUIREMENTS_MATRIX.md`;
const releaseSubmissionBundleUrl = `${repoUrl}/releases/download/v0.1-qwen-hackathon/vexa-qwen-hackathon-submission.tar.gz`;

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
  ["Devpost demo MP4", "docs/demo/vexa-devpost-demo.mp4"],
  ["Demo video MP4", "docs/demo/vexa-local-demo.mp4"],
  ["Demo video WebM", "docs/demo/vexa-local-demo.webm"],
  ["Devpost final packet template", "docs/DEVPOST_FINAL_PACKET.template.md"],
  ["Devpost requirements matrix", "docs/DEVPOST_REQUIREMENTS_MATRIX.md"],
  ["Submission bundle manifest", "docs/SUBMISSION_BUNDLE_MANIFEST.md"],
  ["Submission readiness report", "docs/SUBMISSION_READINESS_REPORT.md"],
  ["Submission links report", "docs/SUBMISSION_LINKS_REPORT.md"],
  ["Final submission gate report", "docs/FINAL_SUBMISSION_GATE_REPORT.md"],
  ["External submission steps", "docs/EXTERNAL_SUBMISSION_STEPS.md"],
  ["Alibaba ECS deployment bundle", "deploy/alibaba"]
];

const artifactLines = [];
for (const [label, relative] of artifacts) {
  const file = path.join(root, relative);
  try {
    const info = await stat(file);
    if (info.isDirectory()) {
      const entries = await readdir(file);
      artifactLines.push(`- ${label}: \`${relative}/\` (${entries.length} files)`);
    } else {
      artifactLines.push(`- ${label}: \`${relative}\` (${formatBytes(info.size)})`);
    }
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
- GitHub release package: ${releaseUrl}
- Qwen / Alibaba Cloud code proof: ${codeProofUrl}
- Alibaba ECS deployment bundle: ${alibabaDeployBundleUrl}
- Slides: ${deckUrl}
- Devpost demo video artifact to upload: ${finalDemoArtifactUrl}
- Raw UI recording artifact: ${videoArtifactUrl}
- Release deck download: ${releaseDeckUrl}
- Release Devpost MP4 download: ${releaseFinalDemoUrl}
- Release MP4 download: ${releaseVideoUrl}
- Release submission package download: ${releasePackageUrl}
- Release final packet template download: ${releaseFinalPacketTemplateUrl}
- Release readiness report download: ${releaseReadinessReportUrl}
- Release links report download: ${releaseLinksReportUrl}
- Release final gate report download: ${releaseFinalGateReportUrl}
- Release requirements matrix download: ${releaseRequirementsMatrixUrl}
- Release submission bundle download: ${releaseSubmissionBundleUrl}
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
5. Upload \`docs/demo/vexa-devpost-demo.mp4\` or a narrated variant to YouTube, Vimeo, or Youku.
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
