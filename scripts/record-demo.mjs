import { spawn } from "node:child_process";
import { mkdir, copyFile, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const port = Number(process.env.VEXA_RECORD_PORT || 8798);
const appUrl = `http://127.0.0.1:${port}/`;
const tmpVideoDir = path.join(root, "tmp/demo-video");
const outDir = path.join(root, "docs/demo");
const outFile = path.join(outDir, "vexa-local-demo.webm");

await mkdir(tmpVideoDir, { recursive: true });
await mkdir(outDir, { recursive: true });
await rm(outFile, { force: true });

const server = spawn("node", ["server/index.mjs"], {
  cwd: root,
  env: {
    ...process.env,
    VEXA_FORCE_MOCK: "1",
    VEXA_HOST: "127.0.0.1",
    VEXA_API_PORT: String(port),
    VEXA_SANDBOX_ORIGIN: appUrl.replace(/\/$/, "")
  },
  stdio: ["ignore", "pipe", "pipe"]
});

server.stdout.on("data", (chunk) => process.stdout.write(chunk));
server.stderr.on("data", (chunk) => process.stderr.write(chunk));

try {
  await waitForHealth(`${appUrl}api/health`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: tmpVideoDir, size: { width: 1280, height: 720 } }
  });
  const page = await context.newPage();

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  await page.getByLabel("Open Vexa browser agent").click();
  await page.locator(".agent-popover").waitFor();
  await page.waitForTimeout(1000);

  await page.getByRole("button", { name: /Run browser agent/i }).click();
  await page.getByText(/Mismatch detected|Local Qwen offline|Planner fallback/i).first().waitFor({
    timeout: 15000
  });
  await page.waitForTimeout(2200);

  await page.getByRole("button", { name: /Run UI demo/i }).click();
  await page.waitForTimeout(900);
  await page.getByRole("button", { name: /Approve/i }).click();
  await page.waitForTimeout(1600);

  const video = page.video();
  await context.close();
  await browser.close();

  const videoPath = await video.path();
  await copyFile(videoPath, outFile);

  console.log(
    JSON.stringify(
      {
        ok: true,
        appUrl,
        outFile
      },
      null,
      2
    )
  );
} finally {
  server.kill("SIGTERM");
}

async function waitForHealth(url) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 15000) {
    try {
      const response = await fetch(url);
      const payload = await response.json();
      if (response.ok && payload.ok) return;
    } catch {
      // retry until timeout
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${url}`);
}
