const steps = [
  ["Understand browser task", "qwen_planner", "classify_browser_goal", "completed", "low"],
  ["Open demo storefront", "sandbox_browser", "navigate", "completed", "low"],
  ["Find refund policy page", "sandbox_browser", "click_link", "completed", "low"],
  ["Inspect checkout copy", "sandbox_browser", "read_dom", "completed", "medium"],
  ["Detect contradiction", "qwen_verifier", "compare_claims", "warning", "medium"],
  ["Draft customer reply", "qwen_writer", "draft_reply", "approval_required", "high"],
  ["Generate browser evidence", "evidence_pack", "generate_report", "pending", "low"],
  ["Prepare send action", "sandbox_mail", "prepare_send", "pending", "medium"],
  ["Complete browser run", "vexa_runner", "complete", "pending", "low"]
];

export function createServerWorkflowRun({ request, mode = "mock", planSummary } = {}) {
  return {
    mode,
    request:
      request ||
      "Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply. Do not send anything without approval.",
    planSummary:
      planSummary ||
      "Vexa will browse a sandbox storefront, extract page evidence, compare claims, and pause before any customer-facing send action.",
    steps: steps.map(([title, tool, action, status, risk], index) => ({
      id: index + 1,
      title,
      tool,
      action,
      status,
      risk,
      duration: status === "pending" || status === "approval_required" ? undefined : `${(index + 1) * 0.6 + 0.9}s`,
      summary:
        status === "approval_required"
          ? "A customer-facing message would be sent, so Vexa pauses for approval."
          : `${tool} prepared browser evidence for ${title.toLowerCase()}.`
    })),
    activityLog: [
      {
        time: "10:24:11",
        step: 2,
        tool: "sandbox_browser",
        action: "navigate",
        status: "success",
        details: "Opened https://demo-store.local"
      },
      {
        time: "10:24:13",
        step: 3,
        tool: "sandbox_browser",
        action: "click_link",
        status: "success",
        details: "Opened /policies/refunds and extracted text"
      },
      {
        time: "10:24:16",
        step: 5,
        tool: "qwen_verifier",
        action: "compare_claims",
        status: "success_with_warnings",
        details: "Found 14-day vs 30-day policy mismatch"
      },
      {
        time: "10:24:17",
        step: 6,
        tool: "qwen_writer",
        action: "draft_reply",
        status: "paused_for_approval",
        details: "Customer-facing reply requires approval"
      }
    ],
    evidenceReport: {
      title: "Browser Evidence Report",
      generatedAt: "1 minute ago",
      pagesVisited: 3,
      extractedFacts: 5,
      riskFlags: 1,
      confidence: 92,
      findings: [
        {
          source: "/policies/refunds",
          evidence: "Refund window is listed as 30 days after delivery.",
          status: "confirmed"
        },
        {
          source: "/checkout",
          evidence: "Checkout note still says returns accepted within 14 days.",
          status: "needs_review"
        }
      ]
    }
  };
}
