import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Globe2,
  FileText,
  LockKeyhole,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { defaultRequest } from "./data/demoWorkflow";
import { requestWorkflowPlan, runLiveBrowserAgent } from "./lib/api";
import { approveRiskyStep, createMockWorkflowRun, rejectRiskyStep } from "./lib/workflow";
import type { BrowserAgentResult, StepStatus, WorkflowRun, WorkflowStep } from "./types";

const statusLabels: Record<StepStatus, string> = {
  completed: "Completed",
  running: "Running",
  warning: "Review",
  approval_required: "Approval required",
  pending: "Pending"
};

const statusIcons: Record<StepStatus, ReactNode> = {
  completed: <Check size={15} />,
  running: <RefreshCw size={15} />,
  warning: <AlertTriangle size={15} />,
  approval_required: <LockKeyhole size={15} />,
  pending: <CircleDot size={15} />
};

function getPlannerStatus(result: BrowserAgentResult | null) {
  if (!result) {
    return {
      label: "ready",
      title: "",
      body: ""
    };
  }

  const requestedProvider = result.plannerProvider || result.provider;
  if (result.providerError) {
    const isLocal = requestedProvider === "local-qwen";

    return {
      label: isLocal ? "local-qwen fallback" : `${requestedProvider} fallback`,
      title: isLocal ? "Local Qwen offline - using safe fallback plan." : "Planner fallback active.",
      body: isLocal
        ? "LM Studio is not reachable at 127.0.0.1:1234/v1. The sandbox browser runner still executed and collected evidence."
        : `${requestedProvider} returned an error, so Vexa used the safe sandbox plan.`
    };
  }

  return {
    label: result.provider,
    title: "",
    body: ""
  };
}

function App() {
  const [request, setRequest] = useState(defaultRequest);
  const [workflow, setWorkflow] = useState<WorkflowRun>(() => createMockWorkflowRun());
  const [isRunning, setIsRunning] = useState(false);
  const [isLiveRunning, setIsLiveRunning] = useState(false);
  const [decision, setDecision] = useState<"waiting" | "approved" | "rejected">("waiting");
  const [liveResult, setLiveResult] = useState<BrowserAgentResult | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);

  const approvalStep = useMemo(
    () => workflow.steps.find((step) => step.status === "approval_required"),
    [workflow.steps]
  );

  async function runDemo() {
    setIsRunning(true);
    setDecision("waiting");
    const nextWorkflow = await requestWorkflowPlan(request);
    setWorkflow(nextWorkflow);
    window.setTimeout(() => setIsRunning(false), 450);
  }

  async function runRealBrowserAgent() {
    setIsLiveRunning(true);
    setLiveError(null);
    try {
      const result = await runLiveBrowserAgent(request);
      setLiveResult(result);
    } catch (error) {
      setLiveError(error instanceof Error ? error.message : "Browser agent failed");
    } finally {
      setIsLiveRunning(false);
    }
  }

  function approveStep() {
    if (!approvalStep) return;
    setWorkflow((current) => ({
      ...current,
      steps: approveRiskyStep(current.steps, approvalStep.id)
    }));
    setDecision("approved");
  }

  function rejectStep() {
    if (!approvalStep) return;
    setWorkflow((current) => ({
      ...current,
      steps: rejectRiskyStep(current.steps, approvalStep.id)
    }));
    setDecision("rejected");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">V</span>
          <div>
            <h1>Vexa Autopilot</h1>
            <p>Qwen Cloud browser agent sandbox</p>
          </div>
        </div>
        <nav className="topbar-nav" aria-label="Demo status">
          <span className="status-chip">
            <Sparkles size={15} />
            Qwen Cloud
          </span>
          <span className="status-chip quiet">API: {workflow.mode === "qwen" ? "Qwen" : "mock mode"}</span>
          <button className="ghost-button" type="button" onClick={() => setWorkflow(createMockWorkflowRun(request))}>
            <RefreshCw size={16} />
            Reset
          </button>
        </nav>
      </header>

      <section className="workspace">
        <aside className="request-panel" aria-label="Workflow request">
          <div className="panel-title-row">
            <div>
              <span className="section-label">Request</span>
              <h2>Business objective</h2>
            </div>
            <ShieldCheck size={20} />
          </div>

          <textarea
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            aria-label="Business request"
          />

          <div className="constraint-list">
            <div className="constraint-item">
              <Check size={16} />
              Sandbox browser only by default
            </div>
            <div className="constraint-item">
              <Check size={16} />
              Human approval before sending
            </div>
            <div className="constraint-item">
              <Check size={16} />
              Page evidence attached before completion
            </div>
          </div>

          <BrowserSandbox />

          <button className="primary-button" type="button" onClick={runDemo} disabled={isRunning}>
            {isRunning ? <RefreshCw className="spin" size={18} /> : <Play size={18} />}
            Run UI demo
          </button>

          <button className="secondary-button" type="button" onClick={runRealBrowserAgent} disabled={isLiveRunning}>
            {isLiveRunning ? <RefreshCw className="spin" size={18} /> : <Globe2 size={18} />}
            Run real browser agent
          </button>

          <div className="runtime-strip">
            <span>Provider</span>
            <strong>{workflow.mode === "qwen" ? "Qwen Cloud" : "Mock mode"}</strong>
          </div>
        </aside>

        <section className="plan-panel" aria-label="Workflow plan">
          <div className="panel-title-row">
            <div>
              <span className="section-label">Plan</span>
              <h2>Step-by-step execution</h2>
            </div>
            <span className="step-count">{workflow.steps.length} steps</span>
          </div>

          <p className="plan-summary">{workflow.planSummary}</p>

          <div className="step-list">
            {workflow.steps.map((step) => (
              <WorkflowStepRow key={step.id} step={step} />
            ))}
          </div>
        </section>

      </section>

      <section className="activity-panel" aria-label="Tool activity log">
        <div className="activity-header">
          <div>
            <span className="section-label">Browser tools</span>
            <h2>Browser activity log</h2>
          </div>
          <span className="activity-note">
            <Activity size={15} />
            Public-safe sandbox pages
          </span>
        </div>
        <div className="log-table">
          {workflow.activityLog.map((entry) => (
            <div className="log-row" key={`${entry.time}-${entry.step}-${entry.action}`}>
              <span>{entry.time}</span>
              <strong>Step {entry.step}</strong>
              <code>{entry.tool}</code>
              <span>{entry.action}</span>
              <em>{entry.status}</em>
              <p>{entry.details}</p>
            </div>
          ))}
        </div>
      </section>

      <AgentLauncher
        open={launcherOpen}
        onToggle={() => setLauncherOpen((current) => !current)}
        objective={request}
        running={isLiveRunning}
        result={liveResult}
        error={liveError}
        onRun={runRealBrowserAgent}
        workflow={workflow}
        decision={decision}
        approvalStep={approvalStep}
        onApprove={approveStep}
        onReject={rejectStep}
      />
    </main>
  );
}

function AgentLauncher({
  open,
  onToggle,
  objective,
  running,
  result,
  error,
  onRun,
  workflow,
  decision,
  approvalStep,
  onApprove,
  onReject
}: {
  open: boolean;
  onToggle: () => void;
  objective: string;
  running: boolean;
  result: BrowserAgentResult | null;
  error: string | null;
  onRun: () => void;
  workflow: WorkflowRun;
  decision: "waiting" | "approved" | "rejected";
  approvalStep?: WorkflowStep;
  onApprove: () => void;
  onReject: () => void;
}) {
  const plannerStatus = getPlannerStatus(result);
  const needsReview = Boolean(approvalStep && decision === "waiting");
  const launcherLabel = open ? "Close Vexa browser agent" : "Open Vexa browser agent";

  return (
    <aside className={open ? "agent-launcher open" : "agent-launcher"} aria-label="Vexa browser agent launcher">
      {open && (
        <section className="agent-popover" aria-label="Agent review drawer">
          <div className="agent-popover-head">
            <div>
              <span>Vexa</span>
              <h2>Agent dock</h2>
            </div>
            <button type="button" className="icon-button" onClick={onToggle} aria-label="Close Vexa browser agent">
              <X size={16} />
            </button>
          </div>

          <div className="agent-popover-body">
            <div className="agent-control-card">
              <p className="agent-objective">{objective}</p>

              <button className="primary-button" type="button" onClick={onRun} disabled={running}>
                {running ? <RefreshCw className="spin" size={17} /> : <Globe2 size={17} />}
                Run browser agent
              </button>

              <div className="agent-mini-status">
                <span>Planner</span>
                <strong>{plannerStatus.label}</strong>
              </div>
              <div className="agent-mini-status">
                <span>Review</span>
                <strong>{needsReview ? "approval needed" : decision}</strong>
              </div>
              {error && <p className="live-error">{error}</p>}
              {plannerStatus.title && (
                <div className="live-fallback">
                  <strong>{plannerStatus.title}</strong>
                  <span>{plannerStatus.body}</span>
                </div>
              )}
              {result && <p className="live-verdict">{result.verdict.summary}</p>}
            </div>

            <ApprovalCard
              decision={decision}
              step={approvalStep}
              onApprove={onApprove}
              onReject={onReject}
            />
            <LiveAgentCard result={result} error={error} running={running} />
            <EvidenceCard workflow={workflow} />
          </div>
        </section>
      )}

      <button
        type="button"
        className={needsReview ? "agent-fab attention" : "agent-fab"}
        onClick={onToggle}
        aria-label={launcherLabel}
        aria-expanded={open}
        title={launcherLabel}
      >
        <span className="agent-fab-mark">V</span>
        <Bot size={21} />
        {needsReview && <span className="agent-alert-dot" aria-hidden="true" />}
      </button>
    </aside>
  );
}

function LiveAgentCard({
  result,
  error,
  running
}: {
  result: BrowserAgentResult | null;
  error: string | null;
  running: boolean;
}) {
  const plannerStatus = getPlannerStatus(result);

  return (
    <section className="live-agent-card">
      <div className="panel-title-row">
        <div>
          <span className="section-label">Qwen browser agent</span>
          <h2>{result ? `${(result.plannerProvider || result.provider).toUpperCase()} runner` : "Live runner"}</h2>
        </div>
        <Globe2 size={20} />
      </div>
      {running && <p className="live-muted">Opening sandbox browser and collecting page evidence...</p>}
      {error && <p className="live-error">{error}</p>}
      {!running && !error && !result && (
        <p className="live-muted">
          Runs Playwright against local sandbox pages. With `DASHSCOPE_API_KEY`, Qwen plans the browser
          steps; otherwise Vexa uses the same safe fallback plan.
        </p>
      )}
      {result && (
        <>
          <p className="live-verdict">{result.verdict.summary}</p>
          {plannerStatus.title && (
            <div className="live-fallback">
              <strong>{plannerStatus.title}</strong>
              <span>{plannerStatus.body}</span>
            </div>
          )}
          <div className="live-trace">
            {result.trace.map((item) => (
              <div className="live-trace-row" key={`${item.step}-${item.action}-${item.target}`}>
                <span>{item.step}</span>
                <code>{item.action}</code>
                <strong>{item.status}</strong>
                <p>{item.output || item.target}</p>
              </div>
            ))}
          </div>
          <div className="draft-reply">
            <span>Draft reply paused for approval</span>
            <p>{result.draftReply}</p>
          </div>
        </>
      )}
    </section>
  );
}

function WorkflowStepRow({ step }: { step: WorkflowStep }) {
  return (
    <article className={`step-row ${step.status}`}>
      <div className="step-index">{step.id}</div>
      <div className="step-main">
        <div className="step-head">
          <h3>{step.title}</h3>
          <span className={`risk ${step.risk}`}>{step.risk} risk</span>
        </div>
        <p>{step.summary}</p>
        <div className="step-meta">
          <code>{step.tool}</code>
          <ChevronRight size={14} />
          <span>{step.action}</span>
        </div>
      </div>
      <div className="step-status">
        {statusIcons[step.status]}
        <span>{statusLabels[step.status]}</span>
      </div>
    </article>
  );
}

function ApprovalCard({
  decision,
  step,
  onApprove,
  onReject
}: {
  decision: "waiting" | "approved" | "rejected";
  step?: WorkflowStep;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isClosed = !step || decision !== "waiting";

  return (
    <section className="approval-card">
      <div className="panel-title-row">
        <div>
          <span className="section-label">Approval required</span>
          <h2>{step ? step.title : "No pending approval"}</h2>
        </div>
        <LockKeyhole size={20} />
      </div>
      <p>
        Vexa pauses before customer-facing actions. The demo never controls your real browser, sends real
        messages, or uses private Tabi/Nami code.
      </p>
      <div className="approval-detail">
        <span>Action</span>
        <strong>{step?.action || "Reviewed"}</strong>
      </div>
      <div className="approval-detail">
        <span>Tool</span>
        <strong>{step?.tool || "qwen_writer"}</strong>
      </div>
      <div className="button-pair">
        <button className="approve-button" type="button" onClick={onApprove} disabled={isClosed}>
          <Check size={16} />
          Approve
        </button>
        <button className="reject-button" type="button" onClick={onReject} disabled={isClosed}>
          <X size={16} />
          Reject
        </button>
      </div>
      <div className={`decision-strip ${decision}`}>{decision === "waiting" ? "Waiting for reviewer" : decision}</div>
    </section>
  );
}

function EvidenceCard({ workflow }: { workflow: WorkflowRun }) {
  const report = workflow.evidenceReport;

  return (
    <section className="evidence-card">
      <div className="panel-title-row">
        <div>
          <span className="section-label">Evidence report</span>
          <h2>{report.title}</h2>
        </div>
        <FileText size={20} />
      </div>

      <div className="report-grid">
        <Metric label="Pages visited" value={`${report.pagesVisited}`} />
        <Metric label="Facts extracted" value={`${report.extractedFacts}`} />
        <Metric label="Risk flags" value={`${report.riskFlags}`} accent />
        <Metric label="Confidence" value={`${report.confidence}%`} />
      </div>

      <div className="discrepancy-list">
        {report.findings.map((item) => (
          <div className="discrepancy-row" key={`${item.source}-${item.evidence}`}>
            <ClipboardCheck size={15} />
            <span>{item.source}</span>
            <strong>{item.evidence}</strong>
            <em>{item.status.replace("_", " ")}</em>
          </div>
        ))}
      </div>
    </section>
  );
}

function BrowserSandbox() {
  return (
    <section className="browser-sandbox" aria-label="Sandbox browser preview">
      <div className="browser-chrome">
        <Globe2 size={14} />
        <span>https://demo-store.local/policies/refunds</span>
      </div>
      <div className="mock-page">
        <div className="mock-page-nav">
          <strong>Northstar Goods</strong>
          <span>Cart</span>
        </div>
        <h3>Refund policy</h3>
        <p>Customers can request a refund within 30 days after delivery.</p>
        <div className="checkout-note">
          Checkout note mismatch: returns accepted within 14 days.
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={accent ? "metric accent" : "metric"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default App;
