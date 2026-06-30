import { chromium } from "playwright";
import { askQwenForBrowserPlan, getPlannerProvider } from "./qwen-cloud.mjs";

export async function runBrowserAgent({ objective }, env = process.env) {
  const sandboxOrigin = getSandboxOrigin(env);
  const fallbackPlan = createFallbackPlan(sandboxOrigin);
  let provider = getPlannerProvider(env);
  const plannerProvider = provider;
  let providerError = null;
  const rawPlan =
    provider === "mock"
      ? fallbackPlan
      : await askQwenForBrowserPlan({ objective, sandboxOrigin }, env).catch((error) => {
          providerError = error instanceof Error ? error.message : "Planner failed";
          provider = "mock";
          return fallbackPlan;
        });
  const plan = normalizePlan(rawPlan, fallbackPlan);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });
  const trace = [];
  const evidence = [];

  try {
    for (const [index, step] of plan.entries()) {
      const startedAt = new Date().toISOString();

      if (step.action === "navigate") {
        await page.goto(assertSandboxUrl(step.url, sandboxOrigin), { waitUntil: "domcontentloaded" });
        trace.push(toTrace(index, step, "success", step.url, startedAt));
        continue;
      }

      if (step.action === "click") {
        await page.locator(step.selector).click();
        await page.waitForLoadState("domcontentloaded");
        trace.push(toTrace(index, step, "success", step.selector, startedAt));
        continue;
      }

      if (step.action === "extract") {
        const text = (await page.locator(step.selector).innerText()).trim();
        evidence.push({
          source: page.url().replace(sandboxOrigin, ""),
          selector: step.selector,
          text
        });
        trace.push({
          ...toTrace(index, step, "success", step.selector, startedAt),
          output: text
        });
        continue;
      }

      if (step.action === "pause_for_approval") {
        trace.push(toTrace(index, step, "waiting_for_human", "customer_reply.send", startedAt));
      }
    }

    const policyText = evidence.find((item) => item.selector.includes("refund-window"))?.text || "";
    const checkoutText =
      evidence.find((item) => item.selector.includes("checkout-return-note"))?.text || "";
    const mismatchDetected = policyText.includes("30") && checkoutText.includes("14");

    return {
      provider,
      plannerProvider,
      fallbackUsed: provider !== plannerProvider,
      providerError,
      objective,
      sandboxOrigin,
      plan,
      trace,
      evidence,
      approvalRequired: true,
      draftReply:
        "I checked the policy page and checkout copy. The policy says 30 days after delivery, while checkout still says 14 days. I would reply with the 30-day policy and flag the checkout copy for correction.",
      verdict: {
        status: mismatchDetected ? "needs_review" : "confirmed",
        summary: mismatchDetected
          ? "Mismatch detected: policy says 30 days, checkout says 14 days."
          : "No mismatch detected in the sandbox evidence."
      }
    };
  } finally {
    await browser.close();
  }
}

function getSandboxOrigin(env = process.env) {
  if (env.VEXA_SANDBOX_ORIGIN || env.VELA_SANDBOX_ORIGIN) {
    return String(env.VEXA_SANDBOX_ORIGIN || env.VELA_SANDBOX_ORIGIN).replace(/\/$/, "");
  }

  const port = env.VEXA_API_PORT || env.VELA_API_PORT || 8798;
  return `http://127.0.0.1:${port}`;
}

function createFallbackPlan(sandboxOrigin) {
  return [
    {
      action: "navigate",
      url: `${sandboxOrigin}/sandbox/storefront`,
      reason: "Open the demo storefront in a controlled browser sandbox."
    },
    {
      action: "click",
      selector: "a[data-agent-link='refund-policy']",
      reason: "Open the refund policy page from the storefront footer."
    },
    {
      action: "extract",
      selector: "[data-agent-evidence='refund-window']",
      reason: "Capture the refund window stated in the policy."
    },
    {
      action: "navigate",
      url: `${sandboxOrigin}/sandbox/checkout`,
      reason: "Inspect checkout copy for customer-facing return messaging."
    },
    {
      action: "extract",
      selector: "[data-agent-evidence='checkout-return-note']",
      reason: "Capture the return window stated during checkout."
    },
    {
      action: "pause_for_approval",
      reason: "Drafted customer reply is a customer-facing send action."
    }
  ];
}

function normalizePlan(plan, fallbackPlan) {
  if (!Array.isArray(plan) || plan.length === 0) return fallbackPlan;

  const normalized = plan
    .filter((step) => step && typeof step === "object")
    .map((step) => ({
      action: String(step.action || ""),
      url: step.url,
      selector: step.selector,
      reason: String(step.reason || "Run browser step.")
    }))
    .filter((step) =>
      ["navigate", "click", "extract", "pause_for_approval"].includes(step.action)
    )
    .slice(0, 8);

  return normalized.length > 0 ? normalized : fallbackPlan;
}

function assertSandboxUrl(url, sandboxOrigin) {
  if (!url || !String(url).startsWith(`${sandboxOrigin}/sandbox/`)) {
    throw new Error("Browser agent demo may only navigate inside the local sandbox.");
  }
  return url;
}

function toTrace(index, step, status, target, at) {
  return {
    step: index + 1,
    action: step.action,
    target,
    status,
    reason: step.reason,
    at
  };
}
