import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const wikiRoot = path.join(root, "wiki");
const problems = [];

function walk(dir, predicate, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["_site", ".quarto"].includes(entry.name)) walk(fullPath, predicate, out);
    } else if (predicate(fullPath)) {
      out.push(fullPath);
    }
  }
  return out;
}

function existsAsSourceOrOutput(resolvedPath) {
  if (fs.existsSync(resolvedPath)) return true;
  if (resolvedPath.endsWith(".html")) {
    const withoutHtml = resolvedPath.slice(0, -5);
    return fs.existsSync(`${withoutHtml}.md`) || fs.existsSync(`${withoutHtml}.qmd`);
  }
  return false;
}

function isExternal(raw) {
  return /^(https?:|mailto:|tel:|#)/i.test(raw);
}

function extractRefs(text) {
  const refs = [];
  for (const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) refs.push(match[1]);
  for (const match of text.matchAll(/(?:href|src)=['"]([^'"]+)['"]/g)) refs.push(match[1]);
  return refs;
}

function targetWithoutFragment(raw) {
  return raw.split("#")[0].split("?")[0];
}

function fragment(raw) {
  const index = raw.indexOf("#");
  return index === -1 ? "" : raw.slice(index + 1).split("?")[0];
}

const sourceFiles = [
  ...walk(wikiRoot, (file) => /\.(md|qmd|html|yml|yaml)$/i.test(file)),
  path.join(root, "README.md")
];

const interactivePath = path.join(wikiRoot, "interactive.html");
const interactiveHtml = fs.readFileSync(interactivePath, "utf8");
const interactiveIds = new Set([...interactiveHtml.matchAll(/\sid=["']([^"']+)["']/g)].map((match) => match[1]));

for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const raw of extractRefs(text)) {
    if (!raw || isExternal(raw) || raw.startsWith("javascript:")) continue;

    const target = targetWithoutFragment(raw);
    const hash = fragment(raw);
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(target));
    const relativeFile = path.relative(root, file);

    if (!existsAsSourceOrOutput(resolved)) {
      problems.push(`${relativeFile}: missing local link target ${raw}`);
      continue;
    }

    if (target.endsWith("interactive.html") && hash && !interactiveIds.has(hash)) {
      problems.push(`${relativeFile}: missing interactive anchor #${hash}`);
    }

    if (target.endsWith("index.html")) {
      problems.push(`${relativeFile}: local links should target index.qmd or interactive.html, not ${raw}`);
    }
  }
}

const quartoConfig = fs.readFileSync(path.join(wikiRoot, "_quarto.yml"), "utf8");
for (const match of quartoConfig.matchAll(/^\s*-\s+([A-Za-z0-9_.\/-]+\.(?:md|qmd|html))\s*$/gm)) {
  const listed = match[1];
  const resolved = path.join(wikiRoot, listed);
  if (!existsAsSourceOrOutput(resolved)) {
    problems.push(`wiki/_quarto.yml: missing sidebar/navbar target ${listed}`);
  }
}

for (const required of ["_quarto.yml", "index.qmd", "interactive.html", "docs.css"]) {
  if (!fs.existsSync(path.join(wikiRoot, required))) {
    problems.push(`wiki/${required} is required for the Quarto site`);
  }
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(`Verified ${sourceFiles.length} source files and ${interactiveIds.size} interactive anchors.`);
