import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runBrowserAgent } from "./browser-agent.mjs";
import {
  createQwenWorkflowPlan,
  getLocalQwenConfig,
  getPlannerProvider,
  probeLocalQwen
} from "./qwen-cloud.mjs";

const app = express();
const port = Number(process.env.VEXA_API_PORT || process.env.VELA_API_PORT || 8798);
const host = process.env.VEXA_HOST || process.env.HOST || "127.0.0.1";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");
const indexPath = path.join(distPath, "index.html");
const allowedDevPorts = new Set(["4173", "5173", "5174", "5175"]);

function isAllowedDevOrigin(origin) {
  if (!origin) return true;

  try {
    const url = new URL(origin);
    return (
      url.protocol === "http:" &&
      (url.hostname === "127.0.0.1" || url.hostname === "localhost") &&
      allowedDevPorts.has(url.port)
    );
  } catch {
    return false;
  }
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedDevOrigin(origin));
    }
  })
);
app.use(express.json({ limit: "64kb" }));

app.get("/api/health", async (_request, response) => {
  const provider = getPlannerProvider(process.env);
  const localQwen = getLocalQwenConfig(process.env);
  const localProbe = provider === "local-qwen" ? await probeLocalQwen(process.env) : null;

  response.json({
    ok: true,
    provider,
    localQwenBaseUrl: localQwen.baseUrl,
    localQwenModel: localQwen.model,
    localQwenReachable: localProbe?.reachable ?? null,
    localQwenStatus: localProbe?.status ?? null,
    localQwenError: localProbe?.error ?? null
  });
});

app.post("/api/workflows/plan", async (request, response) => {
  try {
    const body = request.body || {};
    const workflow = await createQwenWorkflowPlan({ request: String(body.request || "") });
    response.json(workflow);
  } catch (error) {
    response.status(502).json({
      error: "workflow_plan_failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.post("/api/browser-agent/run", async (request, response) => {
  try {
    const body = request.body || {};
    const result = await runBrowserAgent({ objective: String(body.objective || "") });
    response.json(result);
  } catch (error) {
    response.status(502).json({
      error: "browser_agent_failed",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.get("/sandbox/storefront", (_request, response) => {
  response.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Northstar Goods</title>
    <style>
      body { font-family: Inter, system-ui, sans-serif; margin: 0; background: #f7faf9; color: #172021; }
      header, main, footer { max-width: 880px; margin: 0 auto; padding: 24px; }
      header { display: flex; justify-content: space-between; align-items: center; }
      .hero { background: white; border: 1px solid #dce6e2; border-radius: 12px; padding: 28px; }
      a { color: #0f8f86; font-weight: 800; }
    </style>
  </head>
  <body>
    <header><strong>Northstar Goods</strong><span>Demo storefront</span></header>
    <main class="hero">
      <h1>Everyday care products</h1>
      <p>Public-safe sandbox page for Vexa browser-agent evaluation.</p>
    </main>
    <footer>
      <a href="/sandbox/refunds" data-agent-link="refund-policy">Refund policy</a>
    </footer>
  </body>
</html>`);
});

app.get("/sandbox/refunds", (_request, response) => {
  response.type("html").send(`<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Refund policy</title></head>
  <body style="font-family: Inter, system-ui, sans-serif; max-width: 760px; margin: 40px auto;">
    <nav><a href="/sandbox/storefront">Northstar Goods</a></nav>
    <h1>Refund policy</h1>
    <p data-agent-evidence="refund-window">Refund window is 30 days after delivery.</p>
    <p>Items must be unused and in original packaging.</p>
  </body>
</html>`);
});

app.get("/sandbox/checkout", (_request, response) => {
  response.type("html").send(`<!doctype html>
<html lang="en">
  <head><meta charset="utf-8" /><title>Checkout</title></head>
  <body style="font-family: Inter, system-ui, sans-serif; max-width: 760px; margin: 40px auto;">
    <h1>Checkout</h1>
    <p data-agent-evidence="checkout-return-note">Checkout note says returns are accepted within 14 days.</p>
    <button>Place order</button>
  </body>
</html>`);
});

if (existsSync(indexPath)) {
  app.use(express.static(distPath));
  app.get("*", (request, response, next) => {
    if (request.path.startsWith("/api/")) return next();
    response.sendFile(indexPath);
  });
}

app.listen(port, host, () => {
  console.log(`Vexa API listening on http://${host}:${port}`);
});
