import type { ActivityLogEntry, EvidenceReport, WorkflowStep } from "../types";

export const defaultRequest =
  "Open the demo storefront, find the refund policy, compare it with checkout copy, then draft a customer reply. Do not send anything without approval.";

export const demoSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Understand browser task",
    tool: "qwen_planner",
    action: "classify_browser_goal",
    status: "completed",
    duration: "2.1s",
    risk: "low",
    summary: "Detected web navigation, page extraction, comparison, and reply drafting."
  },
  {
    id: 2,
    title: "Open demo storefront",
    tool: "sandbox_browser",
    action: "navigate",
    status: "completed",
    duration: "3.4s",
    risk: "low",
    summary: "Loaded the mock storefront homepage inside the sandbox browser."
  },
  {
    id: 3,
    title: "Find refund policy page",
    tool: "sandbox_browser",
    action: "click_link",
    status: "completed",
    duration: "2.8s",
    risk: "low",
    summary: "Followed the footer policy link and captured page text evidence."
  },
  {
    id: 4,
    title: "Inspect checkout copy",
    tool: "sandbox_browser",
    action: "read_dom",
    status: "completed",
    duration: "1.6s",
    risk: "medium",
    summary: "Read the checkout returns note and compared it with policy text."
  },
  {
    id: 5,
    title: "Detect contradiction",
    tool: "qwen_verifier",
    action: "compare_claims",
    status: "warning",
    duration: "1.2s",
    risk: "medium",
    summary: "Found a review item: checkout says 14 days, policy says 30 days."
  },
  {
    id: 6,
    title: "Draft customer reply",
    tool: "qwen_writer",
    action: "draft_reply",
    status: "approval_required",
    risk: "high",
    summary: "A message would be sent to a customer, so Vexa pauses for approval."
  },
  {
    id: 7,
    title: "Generate browser evidence",
    tool: "evidence_pack",
    action: "generate_report",
    status: "pending",
    risk: "low",
    summary: "Bundle visited pages, extracted text, and reasoning notes."
  },
  {
    id: 8,
    title: "Prepare send action",
    tool: "sandbox_mail",
    action: "prepare_send",
    status: "pending",
    risk: "medium",
    summary: "Stage the reply only after approval."
  },
  {
    id: 9,
    title: "Complete browser run",
    tool: "vexa_runner",
    action: "complete",
    status: "pending",
    risk: "low",
    summary: "Close the run with all evidence attached."
  }
];

export const demoEvidenceReport: EvidenceReport = {
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
};

export const demoActivityLog: ActivityLogEntry[] = [
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
    details: "Opened /policies/refunds and extracted policy text"
  },
  {
    time: "10:24:15",
    step: 4,
    tool: "sandbox_browser",
    action: "read_dom",
    status: "success",
    details: "Read checkout returns note from the mock checkout page"
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
    details: "Customer-facing reply requires approval before send"
  }
];
