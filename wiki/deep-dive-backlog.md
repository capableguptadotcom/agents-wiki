# Deep-Dive Backlog

This backlog turns the first wiki into a curriculum and design program.

## Module 0: Research and Standards Spine

Questions:

- Which papers inform the agent loop, memory, skill, and eval layers?
- Which standards define connector, security, observability, governance, and healthcare boundaries?
- Which industry case studies show work-surface adoption rather than chatbot demos?
- Where do MCP, A2A, OpenTelemetry, OWASP, NIST, ISO, FHIR, SMART, and HIPAA sit in the same architecture?

Artifacts to build:

- Paper-to-product matrix.
- Standards-to-architecture map.
- Case-study architecture table.
- Source-grounded vertical-slice decision record.

Current artifact:

- [Paper-to-product lab](paper-to-product-lab.md) translates ReAct, MRKL, Toolformer, Reflexion, Generative Agents, Voyager, WebArena, AgentBench, GAIA, SWE-agent, and deep-agent synthesis into product boundaries, evidence records, evals, and real workflow examples.
- [Source atlas](source-atlas.md) maps papers, standards, protocols, platform cases, and healthcare sources to product architecture boundaries.
- [Evidence chain architecture](evidence-chain-architecture.md) connects paper and benchmark claims, standards, public cases, deployable components, records, failures, and eval gates by product layer.
- [Architecture composition workbench](architecture-composition-workbench.md) combines papers, standards, industry cases, product records, failure modes, evals, and deeper dives by product layer and workflow.
- [Protocol runtime decision lab](protocol-runtime-decision-lab.md) compares agent SDK loops, internal APIs, MCP, workflow engines, A2A delegation, events, and control-plane governance by boundary ownership and failure mode.
- [Industry case architecture lab](industry-case-architecture-lab.md) turns public product evidence, paper primitives, standards, lifecycle records, and release gates into case-level adoption decision records.
- [Architecture decisions](architecture-decisions.md) converts those boundaries into ADR-style adopt, reject, evidence, scenario, and source-anchor decisions.
- [Agent maturity model](agent-maturity-model.md) turns those decisions into autonomy-readiness criteria and a deep-dive queue.
- [Design philosophy lab](design-philosophy-lab.md) applies deep-module and information-hiding checks to product boundaries before they become platform architecture.

## Module 1: Agent Product Objects

Questions:

- Which product layer owns each record, event, and decision in the architecture blueprint?
- Which control-plane object manages agent identity, tool access, memory policy, release, observability, and incident response?
- What fields should `Agent`, `AgentVersion`, `AgentRun`, `ToolCall`, `Approval`, `Memory`, and `EvalRun` contain?
- Which objects are product-visible and which are internal?
- What should be immutable after a run starts?

Artifacts to build:

- Architecture blueprint ownership map.
- Agent control-plane object model.
- Entity relationship diagram.
- JSON schemas.
- Example database migrations.
- Sample API contracts.

Current artifact:

- [Product object model lab](product-object-model-lab.md) maps release bundles, agent versions, runs, context manifests, access decisions, tool calls, approvals, workflow events, source responses, timeline, audit, traces, memory proposals, and eval cases as one queryable product graph.
- [Runtime ledger](runtime-ledger.md) connects AgentRun, ToolCall, Approval, WorkflowEvent, TimelineEvent, AuditEvent, TraceSpan, MemoryProposal, and EvalCase records through shared IDs, event payloads, product views, and standards anchors.
- [Intent to action router](intent-to-action-router.md) defines how utterances, work-surface context, identity, candidate tools, policy classification, clarification, approval, and workflow handoff connect before execution.
- [Identity and access lab](identity-access-lab.md) defines the effective-authority chain across user identity, agent principal, delegated connector scope, tool gate, approval, workflow service identity, source-system ACL, audit, and revocation.
- [Deployment topology lab](deployment-topology-lab.md) maps the deployable planes, services, stores, events, source adapters, control hooks, observability, and release evidence behind the operating blueprint.

## Module 2: Tool and Skill Registry

Questions:

- How do skills differ from tools?
- How do we expose internal APIs safely to agents?
- Should we adopt MCP at the boundary or keep an internal tool registry first?
- How are tool versions deprecated?

Artifacts to build:

- Tool registry schema.
- Example `reserve_bed`, `notify_unit`, `send_patient_message`, and `create_transport_task` tools.
- Tool permission matrix.
- Tool evaluation tests.

Current artifact:

- [Capability registry](capability-registry.md) defines skills, resources, read tools, write tools, workflows, memory classes, and connectors as governable capability grants with owners, scopes, schemas, gates, observability, and revocation.
- [Skill lifecycle lab](skill-lifecycle-lab.md) defines how skill changes move from trace evidence to authored examples, domain/security review, trajectory evals, release bundles, runtime proof, and learning loops.

## Module 3: Memory Governance

Questions:

- Which memories can update automatically?
- Which require approval?
- How does a user inspect, correct, delete, or export memory?
- What memory is prohibited in healthcare workflows?

Artifacts to build:

- Memory classification matrix.
- Memory approval workflow.
- Memory UI mock.
- Retention policy examples.

Current artifact:

- [Memory governance](memory-governance.md) defines memory classes, proposal and review lifecycle, use audit, correction, deletion, quarantine, retention, real scenario examples, and bad-memory evals.
- [Memory lifecycle simulator](memory-lifecycle-simulator.md) traces concrete proposal, classification, review, activation, runtime use, audit, correction, and quarantine records across healthcare, scheduling, support, and coding scenarios.

## Module 4: Durable Agent Runs

Questions:

- Which steps belong in the agent loop?
- Which steps belong in the durable workflow?
- How does the deep-agent runbook move from intake to plan to evidence to approval to workflow to verification to learning?
- How do retries avoid duplicate side effects?
- How do we cancel or resume a run?

Artifacts to build:

- Deep-agent runbook simulator.
- Temporal/Inngest/LangGraph comparison.
- Bed-flow workflow state machine.
- Retry and idempotency examples.
- Failure recovery playbook.

Current artifact:

- [Durable execution](durable-execution.md) defines workflow ownership, state machines, idempotency, waits, cancellation, compensation, source reconciliation, platform fit, case-study walkthroughs, and durable-run evals.
- [Subagent handoff simulator](subagent-handoff-simulator.md) defines scoped handoff contracts between owner agents and specialists, including allowed tools, output schemas, prohibited authority, synthesis paths, and evals.

## Module 5: Human Approval and Handoff

Questions:

- What actions require approval?
- What is the exact approval payload?
- How does the user modify an action before approval?
- How does the agent resume after handoff?

Artifacts to build:

- Approval card schema.
- Approval inbox mock.
- Handoff/resume state diagram.
- Audit log examples.

Current artifact:

- [Approval handoff](approval-handoff.md) defines exact-payload approvals, decision states, modification rules, resume tokens, approval inbox behavior, audit evidence, and rejected-approval evals.

## Module 6: Security and Compliance

Questions:

- How is an agent represented as a scoped principal?
- How are user scopes delegated?
- How do we avoid prompt-based security?
- How do HIPAA-style safeguards shape the architecture?

Artifacts to build:

- Policy engine sketch.
- Agent identity model.
- PHI access examples.
- Audit export format.

Current artifact:

- [Agent threat model](agent-threat-model.md) maps prompt injection, excessive agency, sensitive disclosure, connector abuse, memory poisoning, source mismatch, release drift, and resource exhaustion to controls, evidence records, evals, and recovery paths.
- [Identity and access lab](identity-access-lab.md) turns agent identity, OAuth/OIDC, SMART, MCP authorization, approval-scoped elevation, service identity, and audit into concrete product records and eval cases.

## Module 7: UX Patterns

Questions:

- When should the user interact through voice, chat, inline panel, or approval inbox?
- How much reasoning should be shown?
- How are uncertainty and failure communicated?
- How does Slack/Teams fit without becoming the source of truth?

Artifacts to build:

- Wireframes for command center, work object panel, timeline, and approval inbox.
- User journey maps.
- Error and clarification examples.

Current artifact:

- [Product UX surfaces](product-ux-surfaces.md) maps intake, work object panel, approval card, timeline, memory center, run console, and channel surfaces to backend records and failure paths.

## Module 8: Observability and Evals

Questions:

- What traces are needed for debugging?
- What audit logs are needed for compliance?
- What evals prevent regressions?
- How do production traces become future tests?

Artifacts to build:

- Trace schema.
- Audit event schema.
- Eval dataset examples.
- Release checklist.

Current artifact:

- [Agent operations lifecycle](agent-operations-lifecycle.md) shows how agent changes move through request, risk review, eval gate, staging replay, canary, production monitoring, incident response, and learning.
- [Eval and release harness](eval-release-harness.md) defines trajectory eval cases, datasets, eval runs, release gates, blocking rules, production signals, and concrete healthcare, support, scheduling-memory, and coding-agent release examples.
- [Runtime ledger](runtime-ledger.md) shows how production runs create the evidence that later feeds evals, incident review, memory proposals, and release changes.

## Module 9: Real-Life Product Pattern Studies

Examples to study:

- Cloudflare Agents: stateful agent objects, routing, tools, schedules, workflows.
- Vercel AI SDK: app-level agent loops, streaming UI, HITL patterns.
- OpenAI Agents SDK: agents, tools, handoffs, guardrails, tracing.
- Slack agents: agents inside collaboration surfaces.
- MCP: tools/resources/prompts as integration protocol.
- Temporal and Inngest: durable execution.
- LangGraph: graph-oriented agent state and interruption.
- Healthcare command centers: bed flow and capacity coordination.

Artifacts to build:

- Pattern cards.
- Tradeoff matrix.
- "Productizable vs marketing" scorecard.

Current artifact:

- [Industry pattern teardowns](industry-pattern-teardowns.md) studies Agentforce, ServiceNow, Copilot Studio, Rovo, Slack agents, Cloudflare Agents, Vercel AI SDK, OpenAI Agents SDK, LangGraph, and healthcare command-center patterns as architecture inputs rather than templates to copy.

## Module 10: Implementation Lab

Build a small vertical slice:

```text
Voice/text command
-> intent object
-> policy check
-> agent plan
-> action preview
-> approval
-> fake bed reservation workflow
-> timeline and audit
-> eval replay
```

Current artifact:

- [Run simulator](run-simulator.md) shows the browser-only version with AgentRun, ToolCall, Approval, WorkflowEvent, AuditEvent, TimelineEvent, MemoryItem, and EvalCheck records.
- [Source-system integration lab](source-system-integration-lab.md) maps agent-visible fields to authoritative source systems, standards or APIs, adapter contracts, policy scopes, cache rules, reconciliation checks, and proof records across healthcare, scheduling, support, and coding.

Success criteria:

- Runs persist across refresh.
- Tool calls are typed.
- Approval payload is exact.
- Retry does not duplicate reservation.
- Memory write is visible and reversible.
- Timeline shows human and agent actions.
