export type StepStatus =
  | "pending"
  | "running"
  | "completed"
  | "warning"
  | "approval_required";

export type WorkflowStep = {
  id: number;
  title: string;
  tool: string;
  action: string;
  status: StepStatus;
  duration?: string;
  risk: "low" | "medium" | "high";
  summary: string;
};

export type ActivityLogEntry = {
  time: string;
  step: number;
  tool: string;
  action: string;
  status: string;
  details: string;
};

export type EvidenceReport = {
  title: string;
  generatedAt: string;
  pagesVisited: number;
  extractedFacts: number;
  riskFlags: number;
  confidence: number;
  findings: Array<{
    source: string;
    evidence: string;
    status: "confirmed" | "needs_review";
  }>;
};

export type WorkflowRun = {
  mode: "mock" | "qwen" | "local-qwen";
  request: string;
  planSummary: string;
  steps: WorkflowStep[];
  activityLog: ActivityLogEntry[];
  evidenceReport: EvidenceReport;
};

export type BrowserAgentResult = {
  provider: "mock" | "qwen" | "local-qwen";
  plannerProvider?: "mock" | "qwen" | "local-qwen";
  fallbackUsed?: boolean;
  providerError?: string | null;
  objective: string;
  sandboxOrigin: string;
  plan: Array<{
    action: string;
    url?: string;
    selector?: string;
    reason: string;
  }>;
  trace: Array<{
    step: number;
    action: string;
    target: string;
    status: string;
    reason: string;
    output?: string;
    at: string;
  }>;
  evidence: Array<{
    source: string;
    selector: string;
    text: string;
  }>;
  approvalRequired: boolean;
  draftReply: string;
  verdict: {
    status: "confirmed" | "needs_review";
    summary: string;
  };
};
