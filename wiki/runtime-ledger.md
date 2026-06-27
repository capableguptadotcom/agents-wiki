# Runtime Ledger

Current as of 2026-06-27.

For the canonical `AgentRun` state machine and correlation spine, see [System diagram spine](system-diagram-spine.md).

The runtime ledger explains how a real agent run connects across product UI, agent runtime, tool gateway, approval, workflow engine, source systems, audit, traces, memory, and evals.

For the ERD-style object graph behind these records, see [Product object model lab](product-object-model-lab.md).

The core idea:

```text
Every important agent action should create a durable product record,
and every record should carry enough IDs to connect it back to one run.
```

Without this layer, the product may have logs, traces, chat messages, workflow events, and audit rows, but no shared truth about what happened.

## Why This Matters

Agent-native products fail when the run is visible in one system but invisible or contradictory in another:

- the chat says the task completed, but the source system did not change
- the trace shows a tool call, but the audit log cannot prove approval
- the workflow retried a write, but no idempotency record proves it was not duplicated
- the user timeline says waiting, while the workflow already failed
- the eval dataset contains a failure, but cannot replay the same agent version, tool schema, or policy

The ledger prevents this by making the run a product object, not a transcript.

## Ledger Principle

Use separate records for separate jobs:

| Record family | Purpose | Not a substitute for |
|---|---|---|
| `AgentRun` | Durable work instance and status | Trace, audit, or workflow history |
| `AgentStep` | Planning, observation, and handoff steps | Compliance audit |
| `ToolCall` | Typed call, arguments, result ref, latency, policy | Product timeline |
| `AccessDecision` | Effective authority across user, agent, connector, scope, policy, approval, and source ACL | OAuth token or ID token |
| `PolicyDecision` | Allowed, denied, approval required | Human approval |
| `Approval` | Human decision on exact payload | Generic chat reaction |
| `WorkflowEvent` | Waits, retries, resume, compensation | Model reasoning |
| `SourceResponse` | Domain system acknowledgement | Agent summary |
| `TimelineEvent` | User-visible progress | Raw debug logs |
| `AuditEvent` | Accountable read, write, approval, notification | Full trace |
| `TraceSpan` | Debug behavior, cost, latency, errors | Compliance record |
| `MemoryProposal` | Candidate durable context | Automatic memory write |
| `EvalCase` | Future regression evidence | Production behavior change |

The ledger does not mean putting everything in one table. It means every system carries the same correlation spine.

## Correlation Spine

Every run should propagate:

```text
run_id
agent_version_id
tenant_id
requester_user_id
agent_principal_id
delegation_grant_id
connector_grant_id
trace_id
workflow_id
tool_call_id
approval_id
audit_id
eval_case_id
```

Recommended rule:

```text
If an incident cannot be reconstructed from these IDs,
the runtime architecture is not production-ready.
```

## Event Envelope

Use a consistent event envelope for product events. A CloudEvents-style shape is a practical baseline:

```json
{
  "specversion": "1.0",
  "type": "agent.propose",
  "source": "bed-board",
  "subject": "encounter/E-1042",
  "id": "run-bed-1042:propose",
  "time": "2026-06-27T14:00:00Z",
  "traceparent": "00-...",
  "data": {
    "run_id": "run-bed-1042",
    "agent_id": "bedflow-agent",
    "agent_version_id": "bedflow-agent:v3",
    "tenant_id": "north-hospital",
    "status": "approval_required",
    "records_written": ["ToolPreview", "PolicyDecision", "Approval", "TimelineEvent"]
  }
}
```

Why this shape:

- `type` lets consumers route product events.
- `source` names the emitting product component.
- `subject` points to the work object.
- `id` makes deduplication possible.
- `traceparent` connects product events to trace context.
- `data` carries product-specific evidence and IDs.

## Stage Walkthrough

### 1. Bind

The surface creates an `AgentRun` only after it can resolve identity, tenant, work object, and role.

Healthcare example:

```text
voice command
-> encounter/E-1042
-> tenant north-hospital
-> requester user-221
-> bedflow-agent:v3
```

Failure to prevent:

The agent acts on "this patient" without knowing which encounter is selected.

### 2. Observe

The runtime reads source evidence through scoped tools. It does not use memory as source truth.

Records:

- `AgentStep`
- `ToolCall`
- `SourceReference`
- `TraceSpan`
- `AuditEvent` when sensitive data is read

Healthcare example:

`fetch_capacity_snapshot` reads bed board, staffing, isolation, telemetry need, and near-term discharge signals.

### 3. Propose

The agent drafts an exact action payload, and policy decides whether it can execute.

Healthcare example:

```json
{
  "tool": "reserve_bed",
  "arguments": {
    "encounter_id": "E-1042",
    "bed_id": "T-418",
    "hold_minutes": 20
  },
  "policy_decision": "approval_required"
}
```

Important boundary:

The model can propose. The policy gateway decides whether this crosses a side-effect, data, or autonomy boundary.

### 4. Approve

Approval is a record on exact arguments, not a generic "looks good."

If the user modifies the bed, amount, invite body, test command, or customer message, the product creates a new payload hash.

### 5. Execute

Side effects run through a durable workflow.

The workflow owns:

- waits
- retries
- timeout handling
- idempotency
- resume after approval
- cancellation
- compensation

This is where Temporal, Inngest, LangGraph durable execution, Cloudflare Workflows, or an internal workflow engine belongs. The [Durable execution](durable-execution.md) note defines the deeper contract for workflow ownership, idempotency, cancellation, compensation, and source reconciliation.

### 6. Verify

The product should not mark the run complete until source truth confirms the result.

Examples:

- bed board confirms bed hold
- calendar provider confirms event ID and recipients
- billing ledger confirms credit
- CI confirms tests and PR state

If source truth disagrees, the run enters `needs_reconciliation`.

### 7. Learn

Learning outputs are proposals, not silent behavior changes:

- eval case
- memory proposal
- policy patch
- skill update
- tool schema change
- UX correction
- release backlog item

Every behavior change goes back through the AgentOps lifecycle.

## Standards Map

| Standard or pattern | How it fits |
|---|---|
| CloudEvents | Useful event envelope for product and workflow events. |
| W3C Trace Context | Propagates trace context across services and runtimes. |
| OpenTelemetry GenAI conventions | Provides vocabulary for GenAI model, tool, retrieval, and agent telemetry. |
| OAuth 2.0 and OIDC | Bind delegated API access and user identity. |
| MCP | Exposes tools, resources, and prompts through explicit connector boundaries. |
| Durable workflow history | Records waits, retries, resumes, and compensation. |
| FHIR and SMART | Anchor healthcare work objects, launch context, and scoped access. |
| HIPAA Security Rule | Forces access control, audit control, integrity, authentication, and transmission safeguards for ePHI. |

Useful references:

- CloudEvents specification: https://github.com/cloudevents/spec
- W3C Trace Context: https://www.w3.org/TR/trace-context/
- OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/
- Temporal documentation: https://docs.temporal.io/
- Model Context Protocol specification: https://modelcontextprotocol.io/specification/latest
- OAuth 2.0: https://datatracker.ietf.org/doc/html/rfc6749
- OpenID Connect Core: https://openid.net/specs/openid-connect-core-1_0.html
- HL7 FHIR: https://hl7.org/fhir/
- SMART App Launch: https://hl7.org/fhir/smart-app-launch/
- HIPAA Security Rule guidance: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html

## Product Views

The same run appears differently to different users:

| View | Reads from | Answers |
|---|---|---|
| User timeline | `TimelineEvent`, `AgentRun.status` | What is happening to my work object? |
| Operator console | `AgentRun`, `WorkflowEvent`, `ToolCall` | Can I pause, retry, cancel, or inspect? |
| Trace viewer | `TraceSpan`, model/tool telemetry | Why did the agent behave this way? |
| Audit export | `AuditEvent`, `Approval`, payload hash | Who approved what and what changed? |
| Eval loop | `EvalCase`, trace refs, source refs | What should prevent this failure next release? |
| Memory center | `MemoryProposal`, `MemoryItem` | What durable context may affect future runs? |

The [Memory lifecycle simulator](memory-lifecycle-simulator.md) expands the memory-center row into proposal, activation, retrieval, use audit, correction, and quarantine records.

The [Eval and release harness](eval-release-harness.md) expands the eval-loop row into trajectory cases, datasets, eval runs, release gates, blocking rules, and production signals.

The [Source-system integration lab](source-system-integration-lab.md) expands the source-system rows into authoritative field contracts, adapters, cache rules, policy scopes, and reconciliation evidence.

Design rule:

```text
Do not make users read traces.
Do not make auditors rely on traces.
Do not make engineers debug from audit rows alone.
```

## Real-Life Examples

### Healthcare Bed Flow

The ledger proves that a bed hold moved through context binding, PHI-scoped reads, approval, workflow execution, source-system reconciliation, audit, and eval sampling.

Crucial evidence:

- selected encounter
- requester role
- capacity snapshot reference
- exact `reserve_bed` payload
- approver and payload hash
- workflow history
- source-system confirmation
- audit event

### Enterprise Scheduling

The ledger separates private calendar reads from customer-facing invite writes.

Crucial evidence:

- attendee resolution
- calendar scopes
- external recipient list
- invite preview approval
- provider event ID
- decline monitor state
- editable memory proposal for scheduling preference

### Support Resolution

The ledger separates financial adjustment, customer communication, ticket state, and policy evidence.

Crucial evidence:

- account and invoice scope
- policy citation
- credit threshold
- manager approval
- billing ledger confirmation
- message delivery state
- ticket timeline update

### Code-Change Agent

The ledger separates inspect, edit, test, review, merge, and deploy authority.

Crucial evidence:

- allowed paths
- tool call outputs
- patch artifact
- test result
- review decision
- merge or deploy gate
- failure-to-eval conversion

## What To Dive Into Next

- Define JSON schemas for `AgentRun`, `ToolCall`, `Approval`, `WorkflowEvent`, `AuditEvent`, `TimelineEvent`, and `EvalCase`.
- Decide which events are CloudEvents-compatible and which are internal-only.
- Define redaction rules for trace payloads that contain PHI, PII, secrets, source code, or customer data.
- Design idempotency keys for each write tool.
- Build a replay tool that reconstructs a run from IDs.
- Build a reconciliation checker for each source system.
- Add eval case generation from rejected approvals, source mismatches, and operator corrections.
