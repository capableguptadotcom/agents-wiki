# Product Object Model Lab

Current as of 2026-06-27.

This note complements the interactive Object Model section in [interactive.html](interactive.html#object-model).

The goal is to make "agents as first-class product citizens" concrete. In a real product, an agent is not only a model call, a prompt, a workflow, or a chat transcript. It is a set of durable product records that can be queried, audited, replayed, tested, and governed.

## Core Rule

```text
If a run cannot be reconstructed from product records,
the agent is still a demo.
```

The runtime can stream text. The product object model must persist evidence.

## Object Graph

```text
ReleaseBundle
-> AgentVersion
-> AgentRun
-> ContextManifest
-> AccessDecision
-> ToolCall
-> PolicyDecision
-> Approval
-> WorkflowEvent
-> SourceResponse
-> TimelineEvent
-> AuditEvent
-> TraceSpan
-> MemoryProposal
-> EvalCase
```

This is not one database table. It is a correlation spine across product DB, workflow history, trace store, audit log, source adapter ledger, memory queue, and eval harness.

## Simulated Object-Model Review

This is a synthesized discussion between roles, not quotes from real people or organizations.

### Product Architect

Why this role matters:

The product architect decides which concepts become product objects and which remain implementation details.

Argument:

`AgentRun` must be the durable user-facing work instance. `TraceSpan` can debug behavior, `WorkflowEvent` can explain recovery, and `AuditEvent` can prove accountability, but none of those should replace the run object.

Recommendation:

Design the run object first, then attach the runtime, workflow, source, audit, memory, and eval records to it through stable IDs.

### Data Architect

Why this role matters:

The data architect prevents loosely related logs from becoming an impossible investigation problem.

Argument:

The model needs a normalized relationship graph:

- one `AgentRun` has many `AgentStep`, `ToolCall`, `TimelineEvent`, `AuditEvent`, and `TraceSpan` records
- one `Approval` belongs to one exact payload hash
- one `WorkflowEvent` belongs to a workflow and a run
- one `SourceResponse` proves source-system truth
- one `EvalCase` may reference a production run without rewriting it

Recommendation:

Use immutable IDs, foreign-key style links, append-only event tables where accountability matters, and separate stores for traces and audit.

### Security And Compliance Owner

Why this role matters:

The object model determines whether access, approval, and audit can be proven after the fact.

Argument:

`AccessDecision`, `PolicyDecision`, and `Approval` must remain separate. OAuth/OIDC tokens, MCP grants, SMART scopes, approval payloads, and source-system ACLs are different controls. Collapsing them into a single "allowed" boolean hides risk.

Recommendation:

Every sensitive read or write should reference the user, agent principal, connector grant, policy decision, approval when required, and source-system response.

### SRE / AgentOps

Why this role matters:

SRE needs to recover, replay, pause, roll back, and explain failures.

Argument:

Object design must support operations:

- pause runs by `agent_version_id`, tenant, tool, or workflow
- identify retries by idempotency key
- reconstruct what changed after a model upgrade
- generate evals from incidents and source mismatches
- separate sampled debug traces from required audit rows

Recommendation:

Make `release_bundle_id`, `agent_version_id`, `run_id`, `trace_id`, `workflow_id`, `tool_call_id`, `approval_id`, and `eval_case_id` first-class correlation fields.

### Domain Operator

Why this role matters:

The operator experiences product records as the work timeline.

Argument:

In healthcare bed flow, a nurse does not want to inspect raw traces. They need a timeline showing selected encounter, candidate bed evidence, pending approval, approved payload, source confirmation, and recovery state. The same pattern holds for calendar invites, billing credits, and pull requests.

Recommendation:

`TimelineEvent` should be a deliberate projection from deeper records, not the only record.

## Record Responsibilities

| Record | Writer | Primary purpose | Must not replace |
|---|---|---|---|
| `ReleaseBundle` | Release manager | Pins prompt, model, tools, policies, workflow, memory, skills, evals | Product audit |
| `AgentVersion` | Control plane | Immutable runtime behavior version | Workflow history |
| `AgentRun` | Product API | Durable work instance and status | Chat transcript |
| `ContextManifest` | Context binder | Resolved user, tenant, work object, source refs | Model inference |
| `AccessDecision` | Identity/policy service | Effective authority chain | OAuth token |
| `ToolCall` | Tool gateway | Typed tool request/result evidence | Business approval |
| `PolicyDecision` | Policy gateway | Allow, deny, or require approval | Human decision |
| `Approval` | Approval service | Human decision on exact payload | Generic confirmation |
| `WorkflowEvent` | Workflow engine | Durable execution, retry, wait, compensation | Agent loop |
| `SourceResponse` | Source adapter | Domain system acknowledgement | Agent summary |
| `TimelineEvent` | Timeline projector | User-visible progress | Audit or trace |
| `AuditEvent` | Audit service | Accountable read/write/approval record | Debug log |
| `TraceSpan` | Observability service | Runtime behavior, cost, latency, errors | Compliance record |
| `MemoryProposal` | Learning loop | Candidate durable context for review | Active memory |
| `EvalCase` | Eval harness | Regression and release-blocking case | Production fix |

## Healthcare Bed-Flow Example

Request:

```text
Book a monitored bed for this ED patient.
```

Product record chain:

```text
ReleaseBundle rel-bedflow-2026-06-27
-> AgentVersion bedflow-agent:v3
-> AgentRun run-bed-1042
-> ContextManifest ctx-bed-1042
-> AccessDecision access-bed-1042
-> ToolCall fetch_capacity_snapshot
-> ToolCall reserve_bed preview
-> PolicyDecision approval_required
-> Approval apr-bed-77
-> WorkflowEvent wf-bed-1042 activity.started
-> SourceResponse bed-board confirmed
-> TimelineEvent bed hold visible to user
-> AuditEvent PHI read/write accountability
-> TraceSpan model/tool/workflow debug path
-> MemoryProposal reviewed or rejected
-> EvalCase source-confirmation-before-complete
```

Key invariant:

```text
AgentRun cannot become completed from agent text.
It needs source confirmation or an unresolved reconciliation state.
```

## Scenario Differences

| Scenario | Object-model pressure | Example invariant |
|---|---|---|
| Healthcare bed flow | PHI, patient movement, source reconciliation, human accountability | No bed hold completion without ADT or bed-board confirmation. |
| Enterprise scheduling | Calendar privacy, external recipients, memory preferences | Invite recipients and body cannot change after approval without reapproval. |
| Support resolution | Financial write, customer message, ticket state | Ticket cannot close until credit and customer-message delivery are confirmed or explicitly unresolved. |
| Code-change agent | Source mutation, tests, review, secrets, merge/deploy split | Run cannot claim completion without patch artifact and verification artifact. |

## Minimal Schemas

### AgentRun

```json
{
  "run_id": "run-bed-1042",
  "agent_id": "bedflow-agent",
  "agent_version_id": "bedflow-agent:v3",
  "tenant_id": "north-hospital",
  "requester_user_id": "user-221",
  "work_object_ref": "encounter/E-1042",
  "channel": "voice",
  "status": "waiting_for_approval",
  "trace_id": "trace-bed-1042",
  "workflow_id": "wf-bed-1042"
}
```

### ContextManifest

```json
{
  "context_manifest_id": "ctx-bed-1042",
  "run_id": "run-bed-1042",
  "tenant_id": "north-hospital",
  "requester_user_id": "user-221",
  "work_object_ref": "encounter/E-1042",
  "data_class": "PHI",
  "source_refs": ["bed-board-snapshot/snap-441"],
  "ambiguity_status": "resolved"
}
```

### Approval

```json
{
  "approval_id": "apr-bed-77",
  "run_id": "run-bed-1042",
  "tool_name": "reserve_bed",
  "arguments_hash": "sha256:exact-payload",
  "decision": "approved",
  "approver_user_id": "user-221",
  "decided_at": "2026-06-27T15:30:00Z"
}
```

### EvalCase

```json
{
  "eval_case_id": "evalcase-bed-isolation-07",
  "source_run_id": "run-bed-1042",
  "agent_version_id": "bedflow-agent:v3",
  "scenario": "Healthcare bed flow",
  "assertions": [
    "context_resolved",
    "approval_required_before_write",
    "source_confirmation_before_complete"
  ],
  "severity": "release_blocking",
  "status": "active"
}
```

## ERD-Style Rules

1. `AgentRun.agent_version_id` is required.
2. `ContextManifest.run_id` is required before agent reasoning.
3. `AccessDecision.context_manifest_id` is required before tool exposure.
4. `ToolCall.policy_decision_id` is required for every side-effecting tool.
5. `Approval.arguments_hash` must match the workflow payload hash.
6. `WorkflowEvent.idempotency_key` must exist before any retryable write.
7. `SourceResponse` is required before product completion for source-owned state.
8. `AuditEvent` is append-only and should not depend on trace retention.
9. `MemoryProposal` is not active memory.
10. `EvalCase` references the production run but never mutates it.

## Build Questions

- Which tables live in the product DB versus workflow history, trace store, audit log, and vector index?
- Which records are append-only?
- Which IDs must be visible in the user timeline?
- Which records must survive deletion or redaction requests, and under what policy?
- Which records become part of a compliance export?
- Which records can be sampled, and which are mandatory?
- Which fields must be redacted before trace export?
- Which source-system confirmations are required before completion?

## Related Notes

- [Runtime ledger](runtime-ledger.md)
- [Implementation lab](implementation-lab.md)
- [Architecture blueprint](architecture-blueprint.md)
- [Deployment topology lab](deployment-topology-lab.md)
- [Identity and access lab](identity-access-lab.md)
- [Source-system integration lab](source-system-integration-lab.md)
- [Eval and release harness](eval-release-harness.md)
