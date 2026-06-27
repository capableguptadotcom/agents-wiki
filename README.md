# Enterprise Agents Wiki

This workspace is a learning and architecture wiki for building agents as first-class product citizens.

Open the interactive walkthrough:

- [wiki/index.html](wiki/index.html)

Supporting notes:

- [Agent-native product wiki](wiki/agent-native-product-wiki.md)
- [Aspect-by-aspect playbook](wiki/aspect-playbook.md)
- [Product object model lab](wiki/product-object-model-lab.md)
- [Intent to action router](wiki/intent-to-action-router.md)
- [Capability registry](wiki/capability-registry.md)
- [Skill lifecycle lab](wiki/skill-lifecycle-lab.md)
- [Identity and access lab](wiki/identity-access-lab.md)
- [Memory governance](wiki/memory-governance.md)
- [Memory lifecycle simulator](wiki/memory-lifecycle-simulator.md)
- [Approval handoff](wiki/approval-handoff.md)
- [Durable execution](wiki/durable-execution.md)
- [Deep agent lab](wiki/deep-agent-lab.md)
- [Deep agent runbook](wiki/deep-agent-runbook.md)
- [Subagent handoff simulator](wiki/subagent-handoff-simulator.md)
- [Implementation lab](wiki/implementation-lab.md)
- [Case studies](wiki/case-studies.md)
- [Industry pattern teardowns](wiki/industry-pattern-teardowns.md)
- [Industry case architecture lab](wiki/industry-case-architecture-lab.md)
- [Visual maps](wiki/visual-maps.md)
- [Architecture review](wiki/architecture-review.md)
- [Design philosophy lab](wiki/design-philosophy-lab.md)
- [Research and standards](wiki/research-standards.md)
- [Evidence chain architecture](wiki/evidence-chain-architecture.md)
- [Architecture composition workbench](wiki/architecture-composition-workbench.md)
- [Protocol runtime decision lab](wiki/protocol-runtime-decision-lab.md)
- [Paper-to-product lab](wiki/paper-to-product-lab.md)
- [Source atlas](wiki/source-atlas.md)
- [Architecture decisions](wiki/architecture-decisions.md)
- [Agent maturity model](wiki/agent-maturity-model.md)
- [Product UX surfaces](wiki/product-ux-surfaces.md)
- [Agent threat model](wiki/agent-threat-model.md)
- [Architecture blueprint](wiki/architecture-blueprint.md)
- [Deployment topology lab](wiki/deployment-topology-lab.md)
- [Source-system integration lab](wiki/source-system-integration-lab.md)
- [Agent control plane](wiki/agent-control-plane.md)
- [Agent operations lifecycle](wiki/agent-operations-lifecycle.md)
- [Eval and release harness](wiki/eval-release-harness.md)
- [Run simulator](wiki/run-simulator.md)
- [Runtime ledger](wiki/runtime-ledger.md)
- [Learning path](wiki/learning-path.md)
- [Deep-dive backlog](wiki/deep-dive-backlog.md)
- [Reference map](wiki/references.md)

## Working Thesis

An agent-native product is not a chatbot attached to an app. It is a product system where agents have identity, scoped permissions, typed tools, governed memory, durable execution, observable behavior, human approval paths, and release lifecycle controls.

The core architecture is:

```text
User intent
-> context binding
-> bounded agent reasoning
-> policy and tool gateway
-> approval when required
-> durable workflow execution
-> product state update
-> timeline, audit, traces, eval feedback
```

## Current Wiki Version

This first version focuses on a healthcare bed-flow example because it forces the hard product questions:

- Who is the actor: user, agent, workflow, or system integration?
- What is the source of truth?
- Which actions require approval?
- How are tools scoped?
- What can memory store?
- How does a run recover after failure?
- How do we test and roll out changes safely?
- Which papers, standards, protocols, and product case studies inform each architecture layer?
- Which product layer owns context, reasoning, tools, policy, approvals, workflow, state, memory, observability, and release?

## Next Direction

Use the research and standards map plus the deep-dive backlog to turn each wiki section into a deeper module with examples, exercises, diagrams, and implementation sketches.
