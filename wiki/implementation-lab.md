# Implementation Lab

This lab translates the agent-native product model into backend contracts. It is intentionally concrete: schemas, APIs, events, and failure handling.

For the relationship model that connects release bundles, agent versions, runs, context, access, tools, approvals, workflow events, source responses, timeline, audit, trace, memory proposals, and eval cases, see [Product object model lab](product-object-model-lab.md).

For the end-to-end record chain across UI, traces, workflow history, audit, memory, and evals, see the companion [Runtime ledger](runtime-ledger.md).

For exact-payload approval, modification, rejection, escalation, and workflow resume behavior, see [Approval handoff](approval-handoff.md).

For the route decision that happens before tool preview, approval, or workflow handoff, see [Intent to action router](intent-to-action-router.md).

## 1. Minimal Data Model

### agents

Purpose:

Agent identity, ownership, default policy, and lifecycle status.

Fields:

```text
agent_id
owner_team
purpose
status
default_autonomy
created_at
updated_at
```

Example:

```json
{
  "agent_id": "bedflow-agent",
  "owner_team": "capacity-ops",
  "purpose": "Coordinate bed assignment requests",
  "status": "active",
  "default_autonomy": "draft_requires_approval"
}
```

### agent_versions

Purpose:

Immutable release bundle for reproducibility.

Fields:

```text
version_id
agent_id
prompt_version
model_id
toolset_version
policy_version
workflow_version
eval_run_id
released_at
```

Rule:

Every run pins an `agent_version_id`. Do not let a running workflow silently move to a new prompt, tool schema, or policy bundle.

### tool_registry

Purpose:

Product API surface that agents may call.

Fields:

```text
tool_name
description
input_schema
output_schema
owner_team
side_effect
data_class
approval_rule
idempotency_rule
timeout_ms
retry_policy
status
```

Rule:

Tools grant capability only through the gateway. A skill can recommend a tool, but cannot bypass tool policy.

### agent_runs

Purpose:

Durable execution instance.

Fields:

```text
run_id
agent_version_id
requester_user_id
tenant_id
channel
status
workflow_id
trace_id
created_at
completed_at
failure_reason
```

Rule:

User-facing status should come from this table or its timeline projection, not from the chat transcript.

### approvals

Purpose:

Human decision on exact action arguments.

Fields:

```text
approval_id
run_id
tool_name
arguments_json
arguments_hash
decision
approver_user_id
decision_reason
created_at
decided_at
```

Rule:

If the user modifies the arguments, create a new payload hash. Do not treat a modified approval as approval of the original payload.

### memory_items

Purpose:

Governed durable context.

Fields:

```text
memory_id
scope
data_class
content
source_ref
confidence
status
retention_until
created_by
approved_by
created_at
updated_at
```

Rule:

Patient-specific facts should be read from source systems during each run unless there is a strong product and compliance reason to store them.

### audit_events

Purpose:

Append-only accountability record.

Fields:

```text
audit_id
run_id
actor_id
actor_type
resource_ref
action
policy_decision
approval_id
result_hash
created_at
```

Rule:

Traces can be sampled or redacted. Audit events must be durable and retention-aware.

### eval_runs

Purpose:

Release gate and regression evidence.

Fields:

```text
eval_run_id
agent_version_id
dataset_id
pass_rate
critical_failures
approved_for_release
created_at
```

Rule:

Any incident that reveals a new failure mode should become an eval case.

## 2. API Contracts

### Create a run

```http
POST /agent-runs
```

```json
{
  "agent_id": "bedflow-agent",
  "input": "Find a monitored bed for this ED patient.",
  "channel": "voice",
  "context_ref": {
    "screen": "ed-bed-board",
    "selected_encounter_id": "E-1042"
  }
}
```

Response:

```json
{
  "run_id": "run-1042",
  "status": "received",
  "trace_id": "trace-abc"
}
```

### Preview a tool action

```http
POST /agent-runs/{run_id}/tool-previews
```

```json
{
  "tool_name": "reserve_bed",
  "arguments": {
    "encounter_id": "E-1042",
    "bed_id": "T-418",
    "hold_minutes": 20
  }
}
```

Response:

```json
{
  "policy_decision": "approval_required",
  "approval_id": "apr-77",
  "idempotency_key": "E-1042:T-418:20"
}
```

### Decide an approval

```http
POST /approvals/{approval_id}/decision
```

```json
{
  "decision": "approved",
  "approver_user_id": "user-221",
  "comment": "Telemetry bed T-418 is appropriate."
}
```

Response:

```json
{
  "approval_id": "apr-77",
  "status": "approved",
  "workflow_resume_token": "resume-333"
}
```

### Read a run timeline

```http
GET /agent-runs/{run_id}/timeline
```

Response:

```json
{
  "run_id": "run-1042",
  "events": [
    "intent.bound",
    "plan.created",
    "approval.required",
    "workflow.started"
  ]
}
```

## 3. Event Catalog

The event stream keeps the UI, workflow, audit, and eval systems aligned.

The runtime ledger should carry a shared correlation spine across these events: `run_id`, `agent_version_id`, `tenant_id`, `trace_id`, `workflow_id`, `tool_call_id`, `approval_id`, `audit_id`, and `eval_case_id`.

Core events:

```text
intent.bound
plan.created
tool.read.completed
tool.previewed
approval.required
approval.decided
workflow.started
workflow.step.completed
product.updated
audit.written
memory.proposed
eval.sampled
run.completed
run.failed
```

Design rule:

Events should be meaningful product events, not raw log messages.

## 4. Failure Handling

### Ambiguous context

Stop before tool execution. Ask for clarification. Record ambiguity evidence.

Test:

```text
If two encounters match "this patient", no side-effecting tool may be called.
```

### Tool timeout

Retry idempotent reads. For writes, route through durable workflow with idempotency keys.

Test:

```text
If reserve_bed retries twice, only one hold may exist.
```

### Approval rejected

Do not execute the original payload. Close or replan.

Test:

```text
Rejected approval must never start the write workflow.
```

### Source-system mismatch

Mark run as `needs_reconciliation`. Pause downstream actions.

Test:

```text
If source system does not confirm the write, UI must not show completed.
```

### Bad memory proposal

Reject, redact, or require approval.

Test:

```text
Patient-specific facts must not become organization memory.
```

## 5. Build Exercise

Implement a fake vertical slice:

```text
POST /agent-runs
-> context object
-> plan object
-> tool preview
-> approval record
-> durable workflow simulator
-> product event stream
-> audit events
-> eval sample
```

The first browser-only version is captured in [Run simulator](run-simulator.md).

The interactive Implementation section in [index.html](index.html#implementation) also includes a minimum product slice contract workbench. Use it to inspect the contract that must exist at each boundary:

| Build step | Boundary | Persist | Blocking test |
|---|---|---|---|
| Create run | Product surface -> AgentRun API | `AgentRun`, `TimelineEvent` | Missing work object or agent version rejects before model invocation. |
| Bind context | Context binder -> Agent runtime | `ContextManifest`, `AccessDecision`, sensitive `AuditEvent` | Ambiguous object creates clarification and no tool call. |
| Plan run | Agent runtime -> Runtime ledger | `AgentStep`, `TaskGraph`, `TraceSpan` | Side-effecting tool before approval is rejected by policy precheck. |
| Preview tool | Agent runtime -> Tool gateway | `ToolCallPreview`, `PolicyDecision`, `PayloadHash` | Denied scope or malformed payload creates no source call. |
| Approve action | Approval surface -> Workflow engine | `Approval`, `ResumeToken`, `AuditEvent`, `TimelineEvent` | Payload change invalidates approval. |
| Execute workflow | Workflow engine -> Source adapter | `WorkflowEvent`, `SourceResponse`, `DomainEvent` | Worker replay cannot duplicate side effects. |
| Verify and learn | Verifier -> Eval, memory, release harness | `VerificationResult`, `EvalCase`, `MemoryProposal`, `TimelineEvent` | Source mismatch prevents completed state and creates eval evidence. |

Completion criteria:

- A run can be resumed after approval.
- Rejected approval never executes a write.
- Retry does not duplicate a side effect.
- Timeline and audit are both populated.
- Memory proposal is visible and rejectable.
- Eval replay can rerun the same case.
