import OpenAI from "openai";
import { createServerWorkflowRun } from "./workflow-engine.mjs";

const DEFAULT_BASE_URL = "https://dashscope-us.aliyuncs.com/compatible-mode/v1";
const DEFAULT_LOCAL_QWEN_BASE_URL = "http://127.0.0.1:1234/v1";
const DEFAULT_LOCAL_QWEN_MODEL = "prism-qwen35-9b-v2";

export function hasQwenConfig(env = process.env) {
  return Boolean(env.DASHSCOPE_API_KEY) && env.VEXA_FORCE_MOCK !== "1" && env.VELA_FORCE_MOCK !== "1";
}

export function getPlannerProvider(env = process.env) {
  if (
    env.VEXA_PLANNER_PROVIDER === "local-qwen" ||
    env.VELA_PLANNER_PROVIDER === "local-qwen" ||
    env.LOCAL_QWEN_BASE_URL ||
    env.VEXA_USE_LOCAL_QWEN === "1" ||
    env.VELA_USE_LOCAL_QWEN === "1"
  ) {
    return "local-qwen";
  }

  if (hasQwenConfig(env)) return "qwen";
  return "mock";
}

export function getLocalQwenConfig(env = process.env) {
  return {
    baseUrl: env.LOCAL_QWEN_BASE_URL || DEFAULT_LOCAL_QWEN_BASE_URL,
    model: env.LOCAL_QWEN_MODEL || DEFAULT_LOCAL_QWEN_MODEL
  };
}

export async function probeLocalQwen(env = process.env) {
  const { baseUrl } = getLocalQwenConfig(env);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/models`, {
      signal: controller.signal
    });

    return {
      reachable: response.ok,
      status: response.status,
      error: response.ok ? null : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      reachable: false,
      status: null,
      error: error instanceof Error ? error.message : "Connection error"
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function createQwenWorkflowPlan({ request }, env = process.env) {
  if (!hasQwenConfig(env)) {
    return createServerWorkflowRun({ request, mode: "mock" });
  }

  const client = new OpenAI({
    apiKey: env.DASHSCOPE_API_KEY,
    baseURL: env.DASHSCOPE_BASE_URL || DEFAULT_BASE_URL
  });

  const completion = await client.chat.completions.create({
    model: env.QWEN_MODEL || "qwen-plus",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are Vexa Autopilot, a public-safe hackathon demo browser agent. Return a concise plan summary for an approval-safe web browsing task. Never include secrets, real customer data, or private Tabi/Nami implementation details."
      },
      {
        role: "user",
        content: `Business request: ${request}`
      }
    ]
  });

  const planSummary =
    completion.choices[0]?.message?.content?.trim() ||
    "Qwen generated a safety-first workflow plan with approval gates.";

  return createServerWorkflowRun({ request, mode: "qwen", planSummary });
}

export async function askQwenForBrowserPlan({ objective, sandboxOrigin }, env = process.env) {
  const provider = getPlannerProvider(env);
  if (provider === "mock") return undefined;

  const client = new OpenAI({
    apiKey:
      provider === "local-qwen"
        ? env.LOCAL_QWEN_API_KEY || "local-qwen-not-needed"
        : env.DASHSCOPE_API_KEY,
    baseURL:
      provider === "local-qwen"
        ? getLocalQwenConfig(env).baseUrl
        : env.DASHSCOPE_BASE_URL || DEFAULT_BASE_URL
  });

  const completion = await client.chat.completions.create({
    model:
      provider === "local-qwen"
        ? getLocalQwenConfig(env).model
        : env.QWEN_MODEL || "qwen-plus",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content:
          "Return only JSON. You plan browser actions for a public-safe local sandbox. Allowed actions: navigate, click, extract, pause_for_approval. Only use URLs under the provided sandbox origin. Use selectors exactly from the available page map. Never request secrets, real websites, private browser profiles, or non-sandbox URLs."
      },
      {
        role: "user",
        content: JSON.stringify({
          objective,
          sandboxOrigin,
          pageMap: {
            storefront: {
              url: `${sandboxOrigin}/sandbox/storefront`,
              selectors: ["a[data-agent-link='refund-policy']"]
            },
            refundPolicy: {
              url: `${sandboxOrigin}/sandbox/refunds`,
              selectors: ["[data-agent-evidence='refund-window']"]
            },
            checkout: {
              url: `${sandboxOrigin}/sandbox/checkout`,
              selectors: ["[data-agent-evidence='checkout-return-note']"]
            }
          },
          requiredOutput:
            "JSON array of browser steps. Navigate storefront, click refund policy, extract refund window, navigate checkout, extract checkout note, then pause_for_approval."
        })
      }
    ]
  });

  const content = completion.choices[0]?.message?.content || "[]";
  return JSON.parse(stripCodeFence(content));
}

function stripCodeFence(value) {
  return String(value)
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
}
