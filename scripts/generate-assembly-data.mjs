import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "wiki", "architecture-assembly-data.md");
const outputDir = path.join(root, "wiki", "assets", "generated");
const outputPath = path.join(outputDir, "assembly-data.js");

function readAssemblyData() {
  const markdown = fs.readFileSync(sourcePath, "utf8");
  const match = markdown.match(/```json assembly-data\n([\s\S]*?)\n```/);
  if (!match) {
    throw new Error("Missing ```json assembly-data fenced block in wiki/architecture-assembly-data.md");
  }
  return JSON.parse(match[1]);
}

function validate(data) {
  const problems = [];
  if (!Array.isArray(data.layers) || data.layers.length === 0) problems.push("layers must be a non-empty array");
  if (!data.scenarios || typeof data.scenarios !== "object") problems.push("scenarios must be an object");

  const layerKeys = new Set((data.layers || []).map((layer) => layer.key));
  for (const layer of data.layers || []) {
    for (const field of ["key", "label", "owner", "theory", "deepDive"]) {
      if (!layer[field]) problems.push(`layer ${layer.key || "(missing key)"} missing ${field}`);
    }
  }

  for (const [scenarioKey, scenario] of Object.entries(data.scenarios || {})) {
    for (const field of ["label", "domain", "intent", "risk", "sourceTruth", "outcome", "layers"]) {
      if (!scenario[field]) problems.push(`scenario ${scenarioKey} missing ${field}`);
    }
    for (const layerKey of layerKeys) {
      const detail = scenario.layers?.[layerKey];
      if (!detail) {
        problems.push(`scenario ${scenarioKey} missing layer ${layerKey}`);
        continue;
      }
      for (const field of ["example", "record", "upstream", "downstream", "invariant", "failure", "test", "implementation"]) {
        if (!detail[field]) problems.push(`scenario ${scenarioKey} layer ${layerKey} missing ${field}`);
      }
    }
  }

  if (problems.length) {
    throw new Error(problems.join("\n"));
  }
}

const data = readAssemblyData();
validate(data);

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputPath,
  `window.enterpriseAgentsAssemblyData = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);

console.log(`Generated ${path.relative(root, outputPath)} from ${path.relative(root, sourcePath)}`);
