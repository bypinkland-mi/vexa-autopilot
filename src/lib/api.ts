import { createMockWorkflowRun } from "./workflow";
import type { BrowserAgentResult, WorkflowRun } from "../types";

const apiBaseUrl =
  import.meta.env.VITE_VEXA_API_BASE_URL ||
  import.meta.env.VITE_VELA_API_BASE_URL ||
  "";

export async function requestWorkflowPlan(request: string): Promise<WorkflowRun> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/workflows/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return (await response.json()) as WorkflowRun;
  } catch {
    return createMockWorkflowRun(request);
  }
}

export async function runLiveBrowserAgent(objective: string): Promise<BrowserAgentResult> {
  const response = await fetch(`${apiBaseUrl}/api/browser-agent/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ objective })
  });

  if (!response.ok) {
    throw new Error(`Browser agent API returned ${response.status}`);
  }

  return (await response.json()) as BrowserAgentResult;
}
