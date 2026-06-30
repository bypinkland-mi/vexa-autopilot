import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const outDir = path.resolve("tmp/qa");
const appUrl = process.env.VEXA_APP_URL || process.env.VELA_APP_URL || "http://127.0.0.1:5173/";
const apiUrl = process.env.VEXA_API_URL || process.env.VELA_API_URL || "http://127.0.0.1:8798";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const errors = [];

const desktop = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1
});

desktop.on("console", (message) => {
  const text = message.text();
  if (message.type() === "error" && !text.includes("WebSocket connection to")) {
    errors.push(text);
  }
});
desktop.on("pageerror", (error) => errors.push(error.message));

await desktop.goto(appUrl, { waitUntil: "networkidle" });
const initialText = await desktop.locator("body").innerText();
const reviewPanelCount = await desktop.locator(".review-panel").count();
const hasFloatingAgentIcon = await desktop.getByLabel("Open Vexa browser agent").isVisible();
await desktop.screenshot({ path: path.join(outDir, "desktop-initial.png"), fullPage: true });
await desktop.getByLabel("Open Vexa browser agent").click();
const launcher = desktop.locator(".agent-popover");
await launcher.locator(".agent-popover-head h2", { hasText: "Agent dock" }).waitFor();
const launcherInitialText = await launcher.innerText();
await launcher.getByRole("button", { name: /Run browser agent/i }).click();
await launcher.getByText(/Mismatch detected|Local Qwen offline|Planner fallback/i).first().waitFor({
  timeout: 15000
});
await desktop.screenshot({ path: path.join(outDir, "desktop-launcher.png"), fullPage: false });
await desktop.getByRole("button", { name: /Run UI demo/i }).click();
await desktop.waitForTimeout(700);
await desktop.getByRole("button", { name: /Approve/i }).click();
await desktop.waitForTimeout(300);
await desktop.screenshot({ path: path.join(outDir, "desktop-approved.png"), fullPage: true });

const approvedText = await desktop.locator("body").innerText();
const initialLower = initialText.toLowerCase();
const launcherInitialLower = launcherInitialText.toLowerCase();
const approvedLower = approvedText.toLowerCase();

const mobile = await browser.newPage({
  viewport: { width: 390, height: 900 },
  isMobile: true
});

await mobile.goto(appUrl, { waitUntil: "networkidle" });
await mobile.screenshot({ path: path.join(outDir, "mobile.png"), fullPage: true });
const mobileOverflow = await mobile.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth
);

const agentResponse = await desktop.request.post(`${apiUrl}/api/browser-agent/run`, {
  data: {
    objective:
      "Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply."
  }
});
const agentResult = await agentResponse.json();
const browserAgentOk =
  agentResponse.ok() &&
  agentResult.trace?.some((step) => step.action === "navigate") &&
  agentResult.trace?.some((step) => step.action === "extract") &&
  agentResult.evidence?.length >= 2 &&
  agentResult.approvalRequired === true;
const hasLauncher = await launcher.locator(".agent-popover-head h2", { hasText: "Agent dock" }).isVisible();

await browser.close();

const result = {
  outDir,
  errors,
  hasWorkspace: initialLower.includes("business objective") && initialLower.includes("step-by-step execution"),
  hasApproval: launcherInitialLower.includes("approval required"),
  hasEvidence: launcherInitialLower.includes("evidence report"),
  hasApprovedDecision: approvedLower.includes("approved"),
  hasLauncher,
  hasFloatingAgentIcon,
  reviewPanelRemoved: reviewPanelCount === 0,
  mobileOverflow,
  browserAgentOk
};

console.log(JSON.stringify(result, null, 2));

if (
  errors.length > 0 ||
  !result.hasWorkspace ||
  !result.hasApproval ||
  !result.hasEvidence ||
  !result.hasApprovedDecision ||
  !result.hasLauncher ||
  !result.hasFloatingAgentIcon ||
  !result.reviewPanelRemoved ||
  mobileOverflow ||
  !browserAgentOk
) {
  process.exit(1);
}
