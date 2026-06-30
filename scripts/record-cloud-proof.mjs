import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const repoUrl = "https://github.com/bypinkland-mi/vexa-autopilot";
const defaultCodeUrl = `${repoUrl}/blob/main/server/qwen-cloud.mjs`;
const objective =
  "Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply.";

const options = parseArgs(process.argv.slice(2));

if (!options.cloudUrl) {
  console.error(
    [
      "Usage:",
      "  npm run record:cloud-proof -- --cloud-url <Alibaba Cloud URL> [--out proof/vexa-cloud-proof.webm]",
      "",
      "Example:",
      "  npm run record:cloud-proof -- --cloud-url http://<ecs-public-ip>:8080"
    ].join("\n")
  );
  process.exit(1);
}

const baseUrl = options.cloudUrl.replace(/\/$/, "");
const outFile = path.resolve(root, options.out || "proof/vexa-cloud-proof.webm");
const tmpVideoDir = path.join(root, "tmp/cloud-proof-video");
const codeUrl = options.codeUrl || defaultCodeUrl;

await mkdir(tmpVideoDir, { recursive: true });
await mkdir(path.dirname(outFile), { recursive: true });
await rm(outFile, { force: true });

const health = await waitForHealth(`${baseUrl}/api/health`);
const run = await runBrowserAgent(`${baseUrl}/api/browser-agent/run`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: tmpVideoDir, size: { width: 1280, height: 720 } }
});
const page = await context.newPage();

try {
  await page.goto(`${baseUrl}/api/health`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  await page.getByLabel("Open Vexa browser agent").click();
  await page.locator(".agent-popover").waitFor();
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: /Run browser agent/i }).click();
  await page.getByText(/Mismatch detected|Local Qwen offline|Planner fallback/i).first().waitFor({
    timeout: 20000
  });
  await page.getByText(/waiting_for_human|Approval required|pause_for_approval/i).first().waitFor({
    timeout: 20000
  });
  await page.waitForTimeout(1800);

  await page.goto(codeUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  const video = page.video();
  await context.close();
  await browser.close();

  const videoPath = await video.path();
  await copyFile(videoPath, outFile);

  console.log(
    JSON.stringify(
      {
        ok: true,
        cloudUrl: baseUrl,
        healthProvider: health.provider || null,
        planner: run.planner || null,
        approvalRequired: run.approvalRequired === true,
        outFile,
        codeUrl
      },
      null,
      2
    )
  );
} catch (error) {
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
  throw error;
}

async function waitForHealth(url) {
  const startedAt = Date.now();
  let lastError = "";

  while (Date.now() - startedAt < 20000) {
    try {
      const response = await fetch(url);
      const payload = await response.json();
      if (response.ok && payload.ok) return payload;
      lastError = `HTTP ${response.status}: ${JSON.stringify(payload).slice(0, 300)}`;
    } catch (error) {
      lastError = error.message;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  throw new Error(`Timed out waiting for ${url}. Last error: ${lastError}`);
}

async function runBrowserAgent(url) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective })
  });
  const text = await response.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`Browser agent returned non-JSON response: ${text.slice(0, 300)}`);
  }

  if (!response.ok) {
    throw new Error(`Browser agent returned HTTP ${response.status}: ${text.slice(0, 300)}`);
  }

  const lastTrace = Array.isArray(payload.trace) ? payload.trace.at(-1) : null;
  if (payload.approvalRequired !== true || lastTrace?.status !== "waiting_for_human") {
    throw new Error(
      `Expected approval pause before recording, got approvalRequired=${String(
        payload.approvalRequired
      )}, lastTraceStatus=${lastTrace?.status || "missing"}`
    );
  }

  return payload;
}

function parseArgs(args) {
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (value === "--cloud-url") {
      parsed.cloudUrl = args[index + 1];
      index += 1;
    } else if (value === "--out") {
      parsed.out = args[index + 1];
      index += 1;
    } else if (value === "--code-url") {
      parsed.codeUrl = args[index + 1];
      index += 1;
    }
  }
  return parsed;
}
