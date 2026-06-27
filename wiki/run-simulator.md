# Run Simulator

The simulator is a browser-only vertical slice for the bed-flow agent. It does not call real services. Its purpose is to make the product records and lifecycle concrete.

The simulated run creates and updates:

- AgentRun
- ToolCall
- Approval
- WorkflowEvent
- AuditEvent
- TimelineEvent
- MemoryItem
- EvalCheck

## Happy Path

```text
request.received
-> context.bound
-> plan.created
-> tool.read.completed
-> approval.required
-> approval.approved
-> workflow.started
-> workflow.step.completed
-> product.updated
-> memory.proposed
-> eval.sampled
```

The important point is that the write does not happen when the model proposes it. The write happens after:

1. context is bound
2. evidence is gathered
3. action payload is previewed
4. policy requires approval
5. a human approves the exact payload
6. durable workflow resumes with an idempotency key
7. source-system state is verified

## Failure Modes

### Ambiguous Context

The run stops before tools.

Evidence:

- no ToolCall records
- run status is `needs_clarification`
- eval check proves ambiguous context blocks tools

### Tool Timeout

A read tool times out and retries safely.

Evidence:

- timed-out ToolCall record
- completed retry record
- no side-effecting write occurred during retry

### Approval Rejected

The run stops after approval rejection.

Evidence:

- approval decision is `rejected`
- no workflow events are created
- eval check proves rejected approval blocks workflow

### Source-System Mismatch

The workflow may run, but verification blocks completion.

Evidence:

- run status is `needs_reconciliation`
- timeline asks for operator review
- eval check proves mismatch blocks completed status

### Bad Memory Proposal

The run completes operationally, but memory governance rejects the memory item.

Evidence:

- MemoryItem status is `rejected`
- eval check proves bad memory stayed unavailable

## Why This Matters

This small simulator shows why agent-native products need more than a chat transcript. A real product needs durable records that can answer:

```text
What did the user ask?
What context was bound?
Which tools were called?
Which payload required approval?
Who approved or rejected it?
Which workflow executed?
What source-system state changed?
What audit evidence exists?
What memory was proposed?
What eval case was generated?
```

## Next Implementation Step

The next version could turn this browser-only simulator into a tiny backend:

```text
POST /agent-runs
POST /agent-runs/{run_id}/next
POST /approvals/{approval_id}/decision
GET /agent-runs/{run_id}/records
POST /eval-runs/replay
```

That would let us test idempotency, replay, persistence, and failure recovery with real API contracts.
