# Agent Threat Model

This note deepens the security layer of the wiki. The interactive Threat Model section turns these ideas into scenario cards for healthcare bed flow, scheduling, support resolution, and code-change agents.

## Core Framing

Agent risk is not only "the model may answer incorrectly." The harder product problem is that an agent can read context, select tools, propose side effects, write memory, notify people, and trigger workflows. That means the threat model must cover the whole execution system:

```text
User intent
-> context binder
-> agent runtime
-> tool and connector gateway
-> policy decision
-> approval or denial
-> durable workflow
-> source-of-truth update
-> timeline, audit, trace, eval, incident loop
```

The model should never be the enforcement boundary. It can reason, summarize, rank, ask clarifying questions, and propose actions. Enforcement belongs to product infrastructure: identity, scopes, typed tools, policy checks, approval records, workflow state, audit logs, release gates, and evals.

## Simulated Design Review

Simulated participants:

- Product architect: cares about where the agent becomes a first-class product actor instead of a chat feature.
- Security architect: cares about authorization, connector abuse, prompt injection, and data leakage.
- Healthcare operator: cares about patient-flow speed, bed-board truth, and failure recovery during surge conditions.
- Compliance owner: cares about PHI access, auditability, retention, and accountable approvals.
- Agent platform engineer: cares about runtime contracts, evals, release bundles, observability, and rollback.

Discussion:

- Product architect: The product should expose an agent run as a durable object with status, steps, approvals, and recovery, not hide it inside chat history. Otherwise users cannot tell what changed.
- Security architect: Prompt instructions are not controls. Every tool needs a schema, owner, side-effect label, data class, scopes, timeouts, and audit behavior.
- Healthcare operator: The agent can help with bed coordination only if the bed board remains the source of truth. A recommendation is not a reservation, and a reservation is not complete until the source system confirms it.
- Compliance owner: PHI should be minimized before it reaches the model, and channel notifications should not leak diagnosis or patient-specific details when operational context is enough.
- Agent platform engineer: Research papers justify parts of the loop, but production needs release bundles, golden traces, regression evals, and incident playbooks. Daily silent drift is not acceptable.

Key disagreements:

- Autonomy speed vs approval friction: operators want fast action, compliance wants exact approvals, and platform wants reproducibility. The practical compromise is autonomy ladders by data class and side effect.
- Memory usefulness vs poisoning risk: memory can improve repeated workflows, but only scoped, source-linked, reviewable memory should affect future side effects.
- Open connectors vs controlled tools: MCP-style ecosystems are useful, but product-owned tool registries and delegated authorization remain mandatory for enterprise workflows.

Synthesis:

An agent-native product should treat threat modeling as a product-design artifact. For every agent skill or tool, define the affected work object, data class, user authority, agent authority, side effect, approval requirement, evidence record, eval case, and incident response.

## Source Anchors

Papers and benchmarks:

- ReAct: useful for reason-act-observe trajectories, but trajectories must be traceable and policy checked before tools execute.
- MRKL and Toolformer: useful for modular tool use, but production tools need schemas, owners, and authorization outside the prompt.
- Reflexion and Generative Agents: useful for feedback and memory concepts, but memory must be proposed, scoped, reviewed, retained, and revocable.
- WebArena, AgentBench, GAIA, and SWE-agent: useful because they expose long-horizon brittleness, tool-use errors, and the need for task-specific evals.
- Voyager: useful for skill-library thinking, but enterprise skills need release and permission boundaries.

Standards and protocols:

- OWASP Top 10 for LLM Applications: anchors prompt injection, sensitive disclosure, excessive agency, supply-chain risk, insecure output handling, and resource consumption.
- NIST AI RMF and NIST GenAI Profile: anchors govern, map, measure, and manage risk practices for generative AI systems.
- MCP authorization and OAuth: anchors connector boundaries, delegated authorization, and the danger of overbroad token access.
- HIPAA Security Rule: anchors access control, audit controls, integrity, authentication, and transmission safeguards for healthcare workflows.
- OpenTelemetry GenAI conventions: anchors trace vocabulary across model calls, tools, retrieval, spans, and metrics.
- ISO/IEC 42001 and ISO/IEC 23894: anchors AI management system and risk management process design.

See [references.md](references.md) and [source-atlas.md](source-atlas.md) for the full map. See [Identity and access lab](identity-access-lab.md) for the dedicated actor, credential, approval, service identity, audit, and revocation model behind excessive agency and connector abuse.

## Threat Classes

| Threat | Product failure | Primary boundary | Required evidence |
| --- | --- | --- | --- |
| Prompt injection | Untrusted notes, tickets, pages, or messages control the agent | Context binder, instruction hierarchy, tool gateway | SourceReference, ContextManifest, ToolCall, PolicyDecision |
| Excessive agency | Agent can do more than the workflow requires | Agent identity, delegated scope, autonomy policy | AgentVersion, ToolRegistry, PolicyDecision, Approval |
| Sensitive disclosure | PHI, PII, secrets, or internal notes leave the right context | Data classification, destination policy, redaction | DataClassification, RedactionEvent, NotificationEvent, AuditEvent |
| Tool abuse | Connector or remote tool bypasses product permissions | Tool registry, token broker, egress policy | ConnectorGrant, ToolCall, PolicyDecision, TraceSpan |
| Memory poisoning | A bad or sensitive fact changes future runs | Memory proposal workflow, provenance, retention | MemoryProposal, MemoryItem, MemoryUseAudit, EvalCase |
| Source mismatch | Agent acts on stale, cached, or conflicting state | Source-of-truth read, workflow verification | SourceReference, DomainEvent, WorkflowEvent, TimelineEvent |
| Supply and drift | Model, prompt, skill, or tool changes behavior silently | Release bundle, eval gate, canary, rollback | ReleaseBundle, EvalRun, AgentVersion, IncidentRecord |
| Resource exhaustion | Agent consumes quota, time, workers, or budget | Run budget, limiter, timeout, queue policy | RunBudget, TraceSpan, MetricEvent, WorkflowEvent |

## Healthcare Bed-Flow Example

Intent:

```text
"Book a telemetry bed for this patient."
```

Threat-aware architecture:

1. Intake binds the request to the active encounter, user, unit, tenant, channel, and timestamp.
2. Context binder reads only the necessary bed-flow state: patient placement constraints, bed availability, staffing status, isolation constraints, and discharge forecasts.
3. Agent runtime ranks options and explains tradeoffs. It cannot reserve a bed directly.
4. Policy gateway sees PHI plus a write side effect and returns `approval_required`.
5. Approval card shows the exact `reserve_bed` payload, source evidence, risk label, and payload hash.
6. Durable workflow executes the approved reservation with idempotency and re-checks the bed board before writing.
7. Timeline shows pending, approved, held, failed, or needs_reconciliation. It does not claim success until the bed board confirms.
8. Audit log records PHI reads, policy decision, approval, tool call, source-system response, and final status.
9. Evals capture prompt-injection, stale-bed, PHI-redaction, approval-bypass, and retry-duplication tests.

## How The Pieces Connect

Context binder:

- Converts UI state, voice channel, selected work object, user claims, tenant, and source references into a bounded context object.
- Produces clarification when the target object is ambiguous.
- Labels every source by trust, freshness, and data class.

Agent runtime:

- Reasons over the bounded goal and allowed read tools.
- Produces plan, evidence, ranked options, clarification, or proposed payload.
- Emits traces but does not authorize itself.

Tool gateway:

- Owns typed tool schemas, tool metadata, connector credentials, timeouts, retries, and egress rules.
- Enforces allowed tool calls before credentials or connectors are reached.

Policy gateway:

- Evaluates agent identity, user authority, tenant, object, data class, side effect, autonomy level, and destination.
- Returns allowed, denied, approval_required, or clarification_required.

Approval service:

- Stores approver, timestamp, exact payload, payload hash, decision, reason, and resume token.
- Prevents stale or modified payloads from executing under an old approval.

Durable workflow:

- Owns waits, retries, idempotency, compensation, and final source-system verification.
- Survives process failure and prevents the model loop from managing long-running side effects.

Observability and evals:

- Traces explain how the run behaved.
- Audit explains accountable access and action.
- Evals turn incidents and near misses into release gates.

## Case-Study Patterns

Cloudflare Agents and Workflows:

- Useful pattern: stateful agent object plus durable workflow for background execution.
- Product lesson: separate conversational state from durable side effects and operational retries.

Vercel AI SDK agents and human-in-the-loop:

- Useful pattern: bounded tool loops in the application surface with approval before selected actions.
- Product lesson: the UI must expose proposed action, tool result, and approval boundary, not just stream text.

OpenAI Agents SDK:

- Useful pattern: agents, tools, handoffs, guardrails, sessions, and tracing as explicit runtime concepts.
- Product lesson: tracing and guardrails should feed product audit, eval, and release processes.

MCP:

- Useful pattern: common connector protocol for tools, resources, prompts, and authorization.
- Product lesson: a protocol does not remove the need for product-owned policy, tool metadata, scope review, and connector incident response.

Slack and collaboration agents:

- Useful pattern: agents meet users in channels where work already happens.
- Product lesson: chat should coordinate and notify; source truth, approvals, and audit must live in the product system.

Healthcare command centers:

- Useful pattern: operational dashboards coordinate patient flow across teams and systems.
- Product lesson: the agent should improve ranking, coordination, and exception handling while the bed board and clinical systems remain authoritative.

## Minimum Acceptance Criteria

Before an enterprise agent can perform a side effect:

- The agent has a versioned identity and scoped capability set.
- The user, tenant, work object, and source-of-truth records are bound.
- The tool is registered with schema, owner, data class, side effect, scopes, timeout, and idempotency policy.
- The policy gateway records an allow, deny, approval_required, or clarification_required decision.
- High-impact actions use exact-payload approval.
- The workflow verifies source truth before and after execution.
- Trace and audit records are correlated but permissioned separately.
- Memory writes are proposed, scoped, source-linked, and revocable.
- Release bundles pin model, prompt, tools, skills, policies, memory schema, and eval set.
- Threat cases exist for prompt injection, disclosure, excessive agency, connector abuse, memory poisoning, source mismatch, drift, and resource exhaustion.
