import { describe, expect, it } from "vitest";
import { createMockWorkflowRun, getApprovalStep, approveRiskyStep } from "./workflow";

describe("workflow safety gates", () => {
  it("keeps a customer-facing browser action paused for human approval", () => {
    const run = createMockWorkflowRun();
    const approvalStep = getApprovalStep(run.steps);

    expect(approvalStep?.title).toBe("Draft customer reply");
    expect(approvalStep?.risk).toBe("high");
  });

  it("only advances the requested approval step", () => {
    const run = createMockWorkflowRun();
    const approvedSteps = approveRiskyStep(run.steps, 6);

    expect(approvedSteps.find((step) => step.id === 6)?.status).toBe("completed");
    expect(approvedSteps.find((step) => step.id === 7)?.status).toBe("pending");
  });
});
