---
title: "Markdown-First Authoring System"
---

This page defines how the wiki should evolve now that Material for MkDocs owns the static site.

The goal is simple:

```text
Markdown is the source of understanding.
Material for MkDocs renders the documentation system.
Interactive labs prove selected contracts.
JavaScript should not become the hidden source of product theory.
```

## Source Contract

| Artifact | Source of truth | Role | Rule |
| --- | --- | --- | --- |
| Concept notes | `wiki/*.md` | Explain theory, examples, standards, and product decisions. | Every durable idea belongs in markdown first. |
| Site home | `wiki/index.md` | Introduce the learning path and route readers. | Keep it short; link to deeper notes. |
| Navigation | `mkdocs.yml` | Sidebar, navigation sections, search, theme, and render scope. | Every major markdown page should be reachable from the nav. |
| Interactive labs | `wiki/interactive.html` plus `wiki/assets/app.js` | Dense scenario switching, generated records, and live walkthroughs. | Every lab must have a markdown companion page. |
| Generated lab data | Markdown data files such as `wiki/architecture-assembly-data.md` | Structured scenario data that powers focused interactive labs. | Generated JS files are build artifacts, not durable source. |
| Styles | `wiki/assets/stylesheets/research.css` and `wiki/assets/styles.css` | Material theme refinement and carried lab style. | Styling should not encode architecture content. |
| Publishing | `.github/workflows/mkdocs-pages.yml` | Build and deploy Material for MkDocs to GitHub Pages. | CI must render from source, not commit generated `site/`. |

## Authoring Rules

1. Add or change product theory in markdown before changing the interactive lab.
2. If a lab introduces a new product object, add the object to the relevant markdown page.
3. If a lab introduces a new source, standard, paper, or vendor pattern, add it to [Reference map](references.md) or [Source atlas](source-atlas.md).
4. If a lab introduces a new workflow, add it to the home-page workflow table or a dedicated scenario page.
5. If a lab link uses `interactive.html#some-section`, the section ID must exist in `interactive.html`.
6. Do not put long-lived product decisions only inside `wiki/assets/app.js`.
7. Generated output stays out of Git: `site/`, `wiki/_site/`, and `wiki/.quarto/` are ignored.

## Lab Manifest

This table is the current manifest for the carried interactive lab. It tells us which markdown page owns the theory behind each interactive section and what should migrate next.

| Interactive section | Markdown owner | Current purpose | Migration status |
| --- | --- | --- | --- |
| [Primitives](interactive.html#primitives) | [Agent-native product wiki](agent-native-product-wiki.md) | First-class product primitives: agent, skill, tool, run, approval, memory, audit, eval, policy. | Keep summary interactive; canonical definitions in markdown. |
| [Object model](interactive.html#object-model) | [Product object model lab](product-object-model-lab.md) | Explore records and relationships behind a run. | Move schema tables into markdown first, then let lab render examples. |
| [Intent router](interactive.html#intent-router) | [Intent to action router](intent-to-action-router.md) | Show utterance, context, policy, tool choice, clarification, and handoff. | Keep scenarios in lab until scenario data can be sourced from markdown tables. |
| [Capability registry](interactive.html#capability-registry) | [Capability registry](capability-registry.md) | Skills, resources, tools, workflows, memory classes, and connectors as governable grants. | Move grant templates into markdown. |
| [Skill lifecycle](interactive.html#skill-lifecycle) | [Skill lifecycle lab](skill-lifecycle-lab.md) | Skill change from trace evidence to release and runtime proof. | Markdown owner is strong; lab can stay as simulator. |
| [Identity and access](interactive.html#identity-access) | [Identity and access lab](identity-access-lab.md) | User, agent, connector, tool, approval, workflow, source ACL, audit, revocation. | Keep as interactive authority-chain inspector. |
| [End-to-end walkthrough](interactive.html#walkthrough) | [End-to-end architecture walkthrough](end-to-end-architecture-walkthrough.md) and [Architecture Assembly Data](architecture-assembly-data.md) | Assembly path across surface, context, authority, loop, gateway, approval, workflow, source truth, memory, observability, release. | Scenario data now comes from markdown and generates a browser data asset. |
| [Approval handoff](interactive.html#approval-handoff) | [Approval handoff](approval-handoff.md) | Exact-payload approval, modification, rejection, escalation, resume. | Keep interactive because decision states are easier to compare live. |
| [Durable execution](interactive.html#durable-execution) | [Durable execution](durable-execution.md) | Workflow ownership, waits, retries, cancellation, compensation, reconciliation. | Move platform comparison into markdown tables. |
| [Memory governance](interactive.html#memory-governance) | [Memory governance](memory-governance.md) and [Memory lifecycle simulator](memory-lifecycle-simulator.md) | Memory classes, proposal, review, activation, retrieval, audit, correction, quarantine. | Keep lifecycle simulator; markdown owns policy. |
| [Threat model](interactive.html#threat-model) | [Agent threat model](agent-threat-model.md) | Failure scenarios mapped to controls, records, evals, recovery. | Add threat-to-record tables in markdown before adding new threat cases. |
| [Patterns](interactive.html#patterns) | [Industry pattern teardowns](industry-pattern-teardowns.md) | Product/platform pattern comparison. | Prefer markdown source tables for vendor patterns. |
| [Case architecture](interactive.html#case-architecture) | [Industry case architecture lab](industry-case-architecture-lab.md) | Adoption records grounded in evidence, inference, product responsibility, release gates. | Good candidate for markdown data tables. |
| [Design philosophy](interactive.html#design-philosophy) | [Design philosophy lab](design-philosophy-lab.md) | Deep modules and information hiding checks. | Keep markdown as canonical decision checklist. |
| [Research and standards](interactive.html#research-standards) | [Research and standards](research-standards.md) | Source-to-product contract workbench. | Move source contract records into markdown tables over time. |
| [Evidence chain](interactive.html#evidence-chain) | [Evidence chain architecture](evidence-chain-architecture.md) | Papers, standards, public cases, records, failures, eval gates. | Markdown is canonical; lab is crosswalk UI. |
| [Composition workbench](interactive.html#composition-workbench) | [Architecture composition workbench](architecture-composition-workbench.md) | Combine papers, standards, product cases, records, failures, evals by layer. | Keep as guided comparison. |
| [Protocol runtime](interactive.html#protocol-runtime) | [Protocol runtime decision lab](protocol-runtime-decision-lab.md) | Agent loop, internal API, MCP, workflow, A2A, event, control plane boundaries. | Good candidate for markdown decision matrix. |
| [Theory lab](interactive.html#theory-lab) | [Paper-to-product lab](paper-to-product-lab.md) | Translate research papers into product architecture decisions. | Markdown should own paper summaries and caveats. |
| [Source atlas](interactive.html#source-atlas) | [Source atlas](source-atlas.md) | Source family and layer filtering. | Move source items to markdown tables first. |
| [Decision workbench](interactive.html#decision-workbench) | [Architecture decisions](architecture-decisions.md) | ADR-style adopt/reject/evidence decisions. | Markdown ADR examples should lead. |
| [Maturity matrix](interactive.html#maturity-matrix) | [Agent maturity model](agent-maturity-model.md) | Score autonomy readiness and missing evidence. | Keep calculator interactive. |
| [Surface lab](interactive.html#surface-lab) | [Product UX surfaces](product-ux-surfaces.md) | Intake, work object, approval card, timeline, memory center, run console, channel surfaces, voice invocation. | Keep UI state comparison interactive. |
| [Blueprint](interactive.html#blueprint) | [Architecture blueprint](architecture-blueprint.md) | Operating blueprint by layer and workflow. | Markdown owns deployment logic. |
| [Deployment topology](interactive.html#deployment-topology) | [Deployment topology lab](deployment-topology-lab.md) | Deployable planes, stores, services, source adapters, controls, observability. | Add Mermaid topology diagrams in markdown. |
| [Source systems](interactive.html#source-systems) | [Source-system integration lab](source-system-integration-lab.md) | Field-level source contracts and reconciliation. | Markdown tables should remain canonical. |
| [Deep run](interactive.html#deep-run) | [Deep agent runbook](deep-agent-runbook.md) and [Deep agent application architecture](deep-agent-application-architecture.md) | Long-horizon run stages, subsystem boundaries, and ownership. | Keep stage ownership interactive. |
| [Control plane](interactive.html#control-plane) | [Agent control plane](agent-control-plane.md) | Registry, grants, memory policy, deployment, observability, incidents, release. | Move manifest examples to markdown. |
| [AgentOps](interactive.html#agentops) | [Agent operations lifecycle](agent-operations-lifecycle.md) and [Eval and release harness](eval-release-harness.md) | Change lifecycle, governed improvement loop, eval harness. | Markdown owns release process. |
| [Simulator](interactive.html#simulator) | [Run simulator](run-simulator.md) | Browser-only run event simulator. | Keep as interactive artifact. |
| [Labs](interactive.html#labs) | [Deep agent lab](deep-agent-lab.md), [Deep agent application architecture](deep-agent-application-architecture.md), [Subagent handoff simulator](subagent-handoff-simulator.md), [Implementation lab](implementation-lab.md) | Harness anatomy, product subsystem boundaries, subagent handoff, composer, trace, combo map. | Split into smaller markdown-owned labs later. |
| [Implementation](interactive.html#implementation) | [Implementation lab](implementation-lab.md) | Schemas, APIs, event stream, failures, minimum product-slice contracts. | Strong candidate for generated examples from markdown tables. |
| [Runtime ledger](interactive.html#runtime-ledger) | [Runtime ledger](runtime-ledger.md) | Correlated records and event payloads. | Markdown owns ledger schema; lab renders scenarios. |
| [Learning path](interactive.html#learning-path) | [Learning path](learning-path.md) | Structured study path and self-checks. | Markdown can fully own this page. |
| [Deep dives](interactive.html#dives) | [Deep-dive backlog](deep-dive-backlog.md) | Next modules and study plan. | Markdown owner already exists. |

## Migration Sequence

The next migration should be incremental:

1. Keep `interactive.html` as the stable user-facing lab.
2. Move one lab's scenario data into markdown tables.
3. Add a small build step that reads that markdown and emits a generated data file.
4. Update `wiki/assets/app.js` to read the generated data for that one lab.
5. Repeat only where the interaction benefits from structured data.

The first migration is the Architecture Assembly lab. Its explanatory source is [End-to-end architecture walkthrough](end-to-end-architecture-walkthrough.md), and its structured scenario source is [Architecture Assembly Data](architecture-assembly-data.md).
