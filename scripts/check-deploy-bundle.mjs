import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const required = [
  "deploy/alibaba/README.md",
  "deploy/alibaba/docker-compose.yml",
  "deploy/alibaba/env.alibaba.example",
  "deploy/alibaba/console-one-paste.sh",
  "deploy/alibaba/bootstrap-ecs.sh",
  "deploy/alibaba/cloud-init.user-data.example",
  "deploy/alibaba/install-ecs-docker.sh",
  "deploy/alibaba/vexa-autopilot.service"
];

const failures = [];

for (const relative of required) {
  try {
    await stat(path.join(root, relative));
  } catch {
    failures.push(`Missing deployment file: ${relative}`);
  }
}

const envText = await readFile(path.join(root, "deploy/alibaba/env.alibaba.example"), "utf8");
if (!envText.includes("DASHSCOPE_API_KEY=")) {
  failures.push("env.alibaba.example must document DASHSCOPE_API_KEY");
}
if (/DASHSCOPE_API_KEY=.+[A-Za-z0-9]/.test(envText)) {
  failures.push("env.alibaba.example must not contain a real DASHSCOPE_API_KEY");
}
if (!envText.includes("VEXA_SANDBOX_ORIGIN=http://<ecs-public-ip>:8080")) {
  failures.push("env.alibaba.example must leave VEXA_SANDBOX_ORIGIN as an ECS placeholder");
}

const composeText = await readFile(path.join(root, "deploy/alibaba/docker-compose.yml"), "utf8");
if (!composeText.includes("8080:8080")) failures.push("docker-compose.yml must expose 8080:8080");
if (!composeText.includes("env.alibaba")) failures.push("docker-compose.yml must read deploy/alibaba/env.alibaba");

const bootstrapText = await readFile(path.join(root, "deploy/alibaba/bootstrap-ecs.sh"), "utf8");
if (!bootstrapText.includes("VEXA_PUBLIC_ORIGIN")) {
  failures.push("bootstrap-ecs.sh must support VEXA_PUBLIC_ORIGIN");
}
if (!bootstrapText.includes("docker compose -f")) {
  failures.push("bootstrap-ecs.sh must start the Docker Compose bundle");
}
if (/DASHSCOPE_API_KEY=(?!\$\{)[^<\s].*[A-Za-z0-9]/.test(bootstrapText)) {
  failures.push("bootstrap-ecs.sh must not contain a real DASHSCOPE_API_KEY");
}

const onePasteText = await readFile(path.join(root, "deploy/alibaba/console-one-paste.sh"), "utf8");
if (!onePasteText.includes("raw.githubusercontent.com/bypinkland-mi/vexa-autopilot")) {
  failures.push("console-one-paste.sh must document the raw GitHub one-paste URL");
}
if (!onePasteText.includes("bootstrap-ecs.sh")) {
  failures.push("console-one-paste.sh must delegate to bootstrap-ecs.sh");
}
if (!onePasteText.includes("VEXA_PUBLIC_ORIGIN")) {
  failures.push("console-one-paste.sh must support VEXA_PUBLIC_ORIGIN");
}
if (/DASHSCOPE_API_KEY=(?!\$\{)[^<\s].*[A-Za-z0-9]/.test(onePasteText)) {
  failures.push("console-one-paste.sh must not contain a real DASHSCOPE_API_KEY");
}

const cloudInitText = await readFile(
  path.join(root, "deploy/alibaba/cloud-init.user-data.example"),
  "utf8"
);
if (!cloudInitText.startsWith("#cloud-config")) {
  failures.push("cloud-init.user-data.example must start with #cloud-config");
}
if (!cloudInitText.includes("bootstrap-ecs.sh")) {
  failures.push("cloud-init.user-data.example must call bootstrap-ecs.sh");
}

if (failures.length > 0) {
  console.error("Deployment bundle check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, requiredFiles: required.length }, null, 2));
