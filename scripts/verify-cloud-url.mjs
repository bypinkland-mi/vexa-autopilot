const [, , rawBaseUrl] = process.argv;

if (!rawBaseUrl) {
  console.error("Usage: npm run verify:cloud -- https://your-alibaba-cloud-url");
  process.exit(1);
}

const baseUrl = rawBaseUrl.replace(/\/$/, "");
const objective =
  "Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply.";

const failures = [];

const health = await readJson(`${baseUrl}/api/health`, { method: "GET" }, "health");
if (!health.ok) failures.push("/api/health did not report ok:true");
if (!health.provider) failures.push("/api/health did not include provider");

const run = await readJson(
  `${baseUrl}/api/browser-agent/run`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective })
  },
  "browser-agent"
);

if (!Array.isArray(run.trace) || run.trace.length < 5) {
  failures.push("browser-agent trace is missing or too short");
}

if (!Array.isArray(run.evidence) || run.evidence.length < 2) {
  failures.push("browser-agent evidence is missing or too short");
}

const lastTrace = Array.isArray(run.trace) ? run.trace.at(-1) : null;
const pausedForHuman = run.approvalRequired === true && lastTrace?.status === "waiting_for_human";
if (!pausedForHuman) {
  failures.push(
    `browser-agent should pause for human approval, got approvalRequired=${String(
      run.approvalRequired
    )}, lastTraceStatus=${lastTrace?.status || "missing"}`
  );
}

if (failures.length > 0) {
  console.error("Cloud verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(JSON.stringify({ baseUrl, health, run }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      baseUrl,
      provider: health.provider,
      planner: run.planner,
      fallbackReason: run.fallbackReason || null,
      traceSteps: run.trace.length,
      evidenceItems: run.evidence.length,
      approvalRequired: run.approvalRequired,
      lastTraceStatus: lastTrace.status
    },
    null,
    2
  )
);

async function readJson(url, init, label) {
  const response = await fetch(url, init);
  const text = await response.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(`${label} returned non-JSON response from ${url}: ${text.slice(0, 300)}`);
  }

  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}: ${text.slice(0, 300)}`);
  }

  return payload;
}
