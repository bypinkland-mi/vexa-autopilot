import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "LICENSE",
  "Dockerfile",
  "deploy/alibaba/README.md",
  "deploy/alibaba/docker-compose.yml",
  "deploy/alibaba/env.alibaba.example",
  "deploy/alibaba/bootstrap-ecs.sh",
  "deploy/alibaba/cloud-init.user-data.example",
  "deploy/alibaba/install-ecs-docker.sh",
  "deploy/alibaba/vexa-autopilot.service",
  "README.md",
  "docs/HACKATHON_DEMO.md",
  "docs/ARCHITECTURE.md",
  "docs/DEVPOST_SUBMISSION.md",
  "docs/SUBMISSION_AUDIT.md",
  "docs/SUBMISSION_READINESS_REPORT.md",
  "docs/FINAL_SUBMISSION_RUNBOOK.md",
  "docs/EXTERNAL_SUBMISSION_STEPS.md",
  "docs/DEVPOST_FINAL_PACKET.template.md",
  "docs/ALIBABA_CLOUD_DEPLOYMENT.md",
  "docs/DEMO_SCRIPT.md",
  "docs/PRESENTATION_OUTLINE.md",
  "docs/presentation/vexa-autopilot-qwen-hackathon.pptx",
  "docs/demo/vexa-local-demo.webm",
  "docs/demo/vexa-local-demo.mp4",
  "docs/demo/vexa-devpost-demo.mp4",
  "docs/SUBMISSION_PACKAGE.md",
  "docs/READINESS_CHECKLIST.md",
  "docs/PROJECT_BOUNDARY.md",
  "scripts/verify-cloud-url.mjs",
  "scripts/record-demo.mjs",
  "scripts/render-devpost-demo.py",
  "scripts/collect-submission-evidence.mjs",
  "scripts/audit-submission-readiness.mjs",
  "scripts/finalize-devpost-packet.mjs",
  "scripts/check-deploy-bundle.mjs",
  ".env.example"
];

const ignoredDirs = new Set(["node_modules", "dist", "tmp", ".git", ".cache"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".py",
  ".ts",
  ".tsx",
  ".txt",
  ".example",
  ".service",
  ".sh",
  ".yml",
  ".yaml"
]);

const failures = [];

for (const file of requiredFiles) {
  try {
    await stat(path.join(root, file));
  } catch {
    failures.push(`Missing required public submission file: ${file}`);
  }
}

const files = [];
await collectFiles(root, files);

for (const file of files) {
  const relative = path.relative(root, file);
  const basename = path.basename(file);
  if (basename.startsWith(".env") && basename !== ".env.example") {
    failures.push(`Environment file must not be committed: ${relative}`);
    continue;
  }

  if (!textExtensions.has(path.extname(file))) continue;

  const text = await readFile(file, "utf8");
  const secretPatterns = [
    [/sk-[A-Za-z0-9_-]{20,}/, "possible OpenAI-style secret"],
    [/AKIA[0-9A-Z]{16}/, "possible AWS access key"],
    [/ghp_[A-Za-z0-9_]{20,}/, "possible GitHub token"],
    [/xox[baprs]-[A-Za-z0-9-]{20,}/, "possible Slack token"],
    [/-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/, "private key block"]
  ];

  for (const [pattern, label] of secretPatterns) {
    if (pattern.test(text)) failures.push(`${relative}: ${label}`);
  }

  const staleVelaPattern = new RegExp(
    [
      `Ve${"la"} Autopilot`,
      `Open Ve${"la"} browser agent`,
      `Close Ve${"la"} browser agent`
    ].join("|")
  );
  if (relative !== "scripts/public-safety-check.mjs" && staleVelaPattern.test(text)) {
    failures.push(`${relative}: stale public Vela naming`);
  }

  if (/from\s+["'].*agent-browser|require\(["'].*agent-browser/.test(text)) {
    failures.push(`${relative}: imports private agent-browser code`);
  }
}

if (failures.length > 0) {
  console.error("Public safety check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      checkedFiles: files.length,
      requiredFiles: requiredFiles.length
    },
    null,
    2
  )
);

async function collectFiles(directory, output) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(fullPath, output);
    } else if (entry.isFile()) {
      output.push(fullPath);
    }
  }
}
