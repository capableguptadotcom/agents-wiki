import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "wiki", "interactive-flow-tutorial-data.md");
const outputDir = path.join(root, "wiki", "assets", "generated");
const outputPath = path.join(outputDir, "flow-tutorial-data.js");

function readTutorialData() {
  const markdown = fs.readFileSync(sourcePath, "utf8");
  const match = markdown.match(/```json flow-tutorial-data\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error("Missing ```json flow-tutorial-data fenced block in wiki/interactive-flow-tutorial-data.md");
  }
  return JSON.parse(match[1]);
}

function requiredString(problems, value, label) {
  if (typeof value !== "string" || value.trim() === "") problems.push(`${label} must be a non-empty string`);
}

function requiredObject(problems, value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) problems.push(`${label} must be an object`);
}

function validate(data) {
  const problems = [];

  requiredObject(problems, data.hero, "hero");
  for (const field of ["eyebrow", "title", "body", "cruxTitle", "cruxBody"]) {
    requiredString(problems, data.hero?.[field], `hero.${field}`);
  }

  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    problems.push("steps must be a non-empty array");
  }

  const stepKeys = new Set();
  for (const [index, step] of (data.steps || []).entries()) {
    for (const field of ["key", "label", "owner", "title", "visible", "hidden", "invariant", "crux", "shortcut", "pattern"]) {
      requiredString(problems, step[field], `steps[${index}].${field}`);
    }
    requiredObject(problems, step.records, `steps[${index}].records`);
    if (step.key) {
      if (stepKeys.has(step.key)) problems.push(`duplicate step key ${step.key}`);
      stepKeys.add(step.key);
    }
  }

  requiredObject(problems, data.scenarios, "scenarios");
  if (!data.scenarios?.happy) problems.push("scenarios.happy is required");

  for (const [scenarioKey, scenario] of Object.entries(data.scenarios || {})) {
    for (const field of ["label", "short", "status", "lesson"]) {
      requiredString(problems, scenario[field], `scenarios.${scenarioKey}.${field}`);
    }

    if (scenario.stopAt !== null && scenario.stopAt !== undefined && !stepKeys.has(scenario.stopAt)) {
      problems.push(`scenarios.${scenarioKey}.stopAt references unknown step ${scenario.stopAt}`);
    }

    requiredObject(problems, scenario.overrides, `scenarios.${scenarioKey}.overrides`);
    for (const [stepKey, override] of Object.entries(scenario.overrides || {})) {
      if (!stepKeys.has(stepKey)) problems.push(`scenarios.${scenarioKey}.overrides references unknown step ${stepKey}`);
      if (override.records !== undefined) requiredObject(problems, override.records, `scenarios.${scenarioKey}.overrides.${stepKey}.records`);
    }
  }

  if (!Array.isArray(data.checklist) || data.checklist.length === 0) {
    problems.push("checklist must be a non-empty array");
  }

  for (const [index, check] of (data.checklist || []).entries()) {
    requiredString(problems, check.label, `checklist[${index}].label`);
    if (!stepKeys.has(check.step)) problems.push(`checklist[${index}].step references unknown step ${check.step}`);
    if (!Array.isArray(check.passWhenStatus)) problems.push(`checklist[${index}].passWhenStatus must be an array`);
  }

  requiredString(problems, data.readerNote, "readerNote");

  if (problems.length) {
    throw new Error(problems.join("\n"));
  }
}

const data = readTutorialData();
validate(data);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputPath,
  `window.enterpriseAgentsFlowTutorialData = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);

console.log(`Generated ${path.relative(root, outputPath)} from ${path.relative(root, sourcePath)}`);
