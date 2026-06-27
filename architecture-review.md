# Architecture Review

This guide is the discussion companion for the interactive Architecture Review section. Use it when deciding what should become product infrastructure and what should stay inside the agent runtime.

## Review Rule

For every aspect, ask:

```text
What is the real product example?
Who owns the decision?
What can fail?
What evidence proves the design works?
What do we need to dive into next?
```

Then run the module-depth check from [Design philosophy lab](design-philosophy-lab.md):

```text
Does this boundary hide real complexity behind a narrow interface?
What invariant does it own?
What implementation detail must not leak to callers?
What shallow alternative are we rejecting?
What test proves the boundary is deep enough?
```

## 1. Memory

Thesis:

Memory is governed product data, not a hidden vector store.

Real example:

A bed-flow agent proposes remembering that the telemetry unit wants escalation to the charge nurse after 10 minutes. This may be valid organization memory. Patient-specific clinical facts should not become durable memory by default.

Decision rule:

Durable memory must have scope, source, data class, retention, owner, and user-visible correction path.

Failure mode:

Incorrect memory silently changes future actions.

Deep dives:

- memory schema
- memory approval UI
- retention jobs
- memory eval cases

## 2. Tools and Skills

Thesis:

Skills explain how to act. Tools are typed product APIs that can actually do things.

Real example:

A bed assignment skill may describe triage rules, but only the `reserve_bed` tool can hold a bed.

Decision rule:

Every side-effecting tool must define side effect, data class, approval rule, idempotency rule, and audit behavior.

Failure mode:

A retry or hallucinated tool call changes state twice or bypasses authorization.

Deep dives:

- tool registry
- MCP boundary
- tool simulator
- idempotency testing

## 3. Security

Thesis:

Prompt text is not a security boundary.

Real example:

A support agent may summarize a ticket, but it cannot issue a refund unless both user and agent scopes allow it and approval exists.

Decision rule:

Agent scope and delegated user scope must both pass before a tool call executes.

Failure mode:

The model sees sensitive data or performs a write because a prompt said it was allowed.

Deep dives:

- policy engine
- agent identity
- secret isolation
- audit export

## 4. Durable Workflow

Thesis:

Agent loops are not durable business workflows.

Real example:

After bed reservation approval, the workflow reserves the bed, notifies the unit, waits for acceptance, creates transport, and reconciles source-system state.

Decision rule:

Any task that waits, writes, retries, or crosses systems belongs in a durable workflow.

Failure mode:

The agent says completed while a worker crash left the source system unchanged.

Deep dives:

- workflow state machine
- compensation design
- resume tokens
- workflow engine comparison

## 5. UX

Thesis:

Chat and voice are entry points. Serious products need work surfaces.

Real example:

A hospital operator should see the agent inside the bed request workspace with candidates, source links, approval payload, and timeline.

Decision rule:

Every agent action should appear in the relevant work object, not only in chat history.

Failure mode:

Users cannot tell what the agent did, why it is waiting, or how to correct it.

Deep dives:

- approval inbox
- timeline UI
- memory center
- run console

## 6. Deployment

Thesis:

Agents should not silently evolve in production.

Real example:

A new bed-ranking prompt should ship with tool schema, policy, memory schema, workflow version, and eval results as one release bundle.

Decision rule:

A run pins agent version, prompt version, model ID, toolset version, policy version, workflow version, and eval run ID.

Failure mode:

A prompt update changes behavior mid-run and no one can reproduce the incident.

Deep dives:

- release bundle manifest
- canary policy
- rollback plan
- kill switches

## 7. Observability

Thesis:

Traces debug behavior. Audit proves accountable action. You need both.

Real example:

A trace shows model calls, retries, latency, and cost. The audit log shows who approved `reserve_bed` and what resource changed.

Decision rule:

Every run propagates run ID, trace ID, workflow ID, tool call ID, approval ID, tenant ID, and agent version ID.

Failure mode:

An incident has logs but no accountable record, or an audit event without enough debug context.

Deep dives:

- trace schema
- audit schema
- redaction policy
- run console

## 8. Evals

Thesis:

Evals are the release gate that keeps agent improvement from becoming uncontrolled drift.

Real example:

If a bed-flow run ignores isolation status, that run becomes a regression case before the next prompt or tool release.

Decision rule:

No release without tests for intent, tool choice, approval triggering, memory behavior, denial, retries, and product state.

Failure mode:

A change improves demos while breaking safety, approval, or recovery paths.

Deep dives:

- eval dataset format
- golden runs
- synthetic failures
- online sampling

## Discussion Output Template

For any aspect, write:

```text
Decision:
Assumptions:
Evidence needed:
Owner:
Failure mode:
Test or eval:
Open question:
```
