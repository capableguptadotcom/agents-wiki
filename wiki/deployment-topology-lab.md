# Deployment Topology Lab

Current as of 2026-06-27.

For the canonical deployable container topology, see [System diagram spine](system-diagram-spine.qmd).

This note complements the interactive Deployment Topology section in [interactive.html](interactive.html#deployment-topology).

The operating blueprint explains who owns each layer. The deployment topology explains what gets deployed:

```text
surface plane
-> product API and context plane
-> agent runtime plane
-> capability gateway plane
-> workflow and event plane
-> source adapter plane
-> memory and knowledge plane
-> control plane
-> observability and release plane
```

The crux:

```text
The agent runtime is only one deployable plane.
Enterprise agent products are mostly integration, policy, workflow, source-truth, and lifecycle systems around that runtime.
```

For the source-to-architecture evidence chain behind these planes, use [Evidence chain architecture](evidence-chain-architecture.md).

## Plane Responsibilities

| Plane | Deploys | Owns | Must not own |
|---|---|---|---|
| Surface | Web app, voice, Slack/app bot, approval cards, timeline | User-visible status and decisions | Hidden side effects |
| Product API/context | AgentRun API, context binder, identity and tenant resolver | Work-object binding and ContextManifest | Model-inferred authority |
| Agent runtime | Agent workers, model gateway, tool loop, handoff coordinator | Plans, observations, drafts, stop reasons | Authorization or durable truth |
| Capability gateway | Tool registry, MCP servers, OpenAPI facade, token broker, policy gateway | Tool contracts, schemas, grants, side-effect classification | Broad connector passthrough |
| Workflow/event | Workflow engine, event bus, webhook receiver, scheduler | Durable execution, retries, compensation, source-confirmed events | Model-loop recovery |
| Source adapters | EHR, calendar, CRM, billing, repo, CI adapters | Source-specific read/write semantics and reconciliation | Source-of-truth ownership |
| Memory/knowledge | Memory proposal queue, vector/index service, skill repo, retention jobs | Governed retrieval, memory, skill proposals, deletion | Silent future behavior drift |
| Control plane | Agent registry, release manager, grant manager, rollout rules, kill switches | Versions, grants, autonomy, rollout, pause, rollback | Domain source truth |
| Observability/release | Trace collector, audit log, eval runner, dashboards | Debug, accountability, eval, incident, release evidence | Treating logs as policy |

## Simulated Deployment Review

This is a synthesized discussion between roles, not a quote from real people.

### Platform Architect

The product should not deploy "an agent" as one service with a bag of credentials. The correct shape is a runtime behind product-owned boundaries.

Recommendation:

Start with a control-plane/data-plane split. The data plane runs requests; the control plane decides which versions, tools, skills, memory classes, and rollout rules are active.

### Security Architect

The dangerous deployment shortcut is passing user or service tokens directly into a model-facing runtime. Tool calls should hit a gateway that validates agent, user, tenant, object, data class, side effect, and approval state.

Recommendation:

Use short-lived, audience-bound credentials at the gateway and store `PolicyDecision` plus `TokenAudit` records.

### SRE

Long-running side effects do not belong inside the model worker. Workers restart, models time out, and users close browsers. Workflow history and event correlation are the recovery mechanism.

Recommendation:

Anything that waits, retries, writes, sends, or needs compensation goes through workflow and emits domain events.

### Product Engineer

The surface must be a real work surface, not a chat transcript. Users need to see source evidence, exact approvals, current status, and recovery actions.

Recommendation:

Put the timeline, approval card, correction path, and source links in the domain object: bed request, account, ticket, or PR.

### Compliance / Risk

Trace, audit, and timeline are related but different. Trace helps engineering debug. Audit proves accountable action. Timeline helps users understand progress.

Recommendation:

Propagate shared IDs across all planes, but keep trace, audit, and timeline stores intentionally separate.

## Standard Anchors

- [CloudEvents](https://cloudevents.io/) helps standardize domain-event envelopes across workflow, source adapters, and product timelines.
- [W3C Trace Context](https://www.w3.org/TR/trace-context/) helps propagate trace identity across HTTP, workers, tools, and workflows.
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) anchor model, tool, token, latency, and agent observability.
- [Model Context Protocol](https://modelcontextprotocol.io/specification/latest) is useful at tool/resource connector boundaries, but it is not the product control plane.
- [OpenAPI](https://spec.openapis.org/oas/latest.html) remains useful for internal typed APIs and deterministic service contracts.
- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) frames risk governance across release, monitoring, incidents, and lifecycle improvement.

## Deployment Records

Minimum records that cross the topology:

```text
AgentRun
ContextManifest
AgentStep
ToolCall
PolicyDecision
Approval
WorkflowEvent
DomainEvent
SourceResponse
TimelineEvent
AuditEvent
TraceSpan
MemoryProposal
SkillChangeRequest
EvalRun
ReleaseBundle
IncidentControl
```

Each record should include enough IDs to join the run:

```text
run_id
agent_version_id
tenant_id
work_object_id
trace_id
workflow_id
tool_call_id
approval_id
audit_id
eval_case_id
release_bundle_id
```

## Healthcare Bed Flow Topology

```text
bed board / voice
-> product API and context binder
-> bounded bedflow-agent runtime
-> tool gateway for capacity reads and reserve_bed proposal
-> approval card
-> bed reservation workflow
-> ADT, EHR, bed-board, staffing, transport adapters
-> timeline, PHI audit, trace, eval sample
```

Key deployment rule:

The bedflow-agent worker can restart without losing the reservation because workflow history, not model memory, owns execution.

## Scheduling Topology

```text
account workspace or Slack thread
-> context binder for account, attendees, time window, and connector grant
-> scheduling-agent runtime
-> calendar connector with minimized free/busy output
-> approval for external send
-> invite workflow
-> provider events and CRM timeline update
```

Key deployment rule:

Calendar event truth comes from the provider. CRM timeline truth updates only after provider confirmation.

## Support Topology

```text
ticket workspace
-> context binder for ticket, account, invoice, entitlement, and policy
-> support-resolution-agent runtime
-> policy read, credit preview, apply_credit, and message-send tools
-> approval for credit and customer message
-> billing/message/ticket workflow
-> ledger, messaging, ticket reconciliation
```

Key deployment rule:

Do not deploy one convenience endpoint called `resolve_ticket`. It hides separate financial, message, and ticket-state side effects.

## Coding-Agent Topology

```text
issue / repo / PR surface
-> context binder for branch, issue, path scope, tests, and reviewer rules
-> code-change-agent runtime
-> repo tools with command allowlist and secret denial
-> workflow for tests, artifacts, PR creation, and review wait
-> CI, review, and branch protection events
```

Key deployment rule:

Editing, testing, PR creation, merge, and deploy are separate authority levels. PR-only mode is the safer first deployment.

## Anti-Patterns

1. One agent service with broad credentials.

The runtime becomes policy, connector, workflow, and source-truth owner by accident.

2. Chat as source of truth.

The transcript becomes the only place where status, approval, and recovery are visible.

3. Direct source writes from model workers.

Worker restarts, retries, or timeouts create duplicate or unreconciled side effects.

4. Trace as audit.

Trace may contain debug detail, redactions, or sampling gaps. Audit must prove accountable action.

5. MCP as the whole platform.

MCP can expose tools and resources. Product policy, approval, release, memory governance, and incident response still need their own planes.

## Related Notes

- [Architecture blueprint](architecture-blueprint.md)
- [Evidence chain architecture](evidence-chain-architecture.md)
- [Protocol runtime decision lab](protocol-runtime-decision-lab.md)
- [Identity and access lab](identity-access-lab.md)
- [Source-system integration lab](source-system-integration-lab.md)
- [Runtime ledger](runtime-ledger.md)
- [Agent control plane](agent-control-plane.md)
- [Agent operations lifecycle](agent-operations-lifecycle.md)
- [Eval and release harness](eval-release-harness.md)
