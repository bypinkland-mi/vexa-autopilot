import {
  demoActivityLog,
  demoEvidenceReport,
  demoSteps,
  defaultRequest
} from "../data/demoWorkflow";
import type { WorkflowRun, WorkflowStep } from "../types";

export function createMockWorkflowRun(request = defaultRequest): WorkflowRun {
  return {
    mode: "mock",
    request,
    planSummary:
      "Vexa will browse a sandbox storefront, extract page evidence, compare claims, and pause before any customer-facing send action.",
    steps: demoSteps,
    activityLog: demoActivityLog,
    evidenceReport: demoEvidenceReport
  };
}

export function approveRiskyStep(steps: WorkflowStep[], stepId: number) {
  return steps.map((step) =>
    step.id === stepId && step.status === "approval_required"
      ? { ...step, status: "completed" as const, duration: "approved" }
      : step
  );
}

export function rejectRiskyStep(steps: WorkflowStep[], stepId: number) {
  return steps.map((step) =>
    step.id === stepId && step.status === "approval_required"
      ? { ...step, status: "warning" as const, summary: "Rejected by reviewer." }
      : step
  );
}

export function getApprovalStep(steps: WorkflowStep[]) {
  return steps.find((step) => step.status === "approval_required");
}
