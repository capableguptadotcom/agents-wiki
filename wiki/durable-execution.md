# Durable Execution

Current as of 2026-06-27.

Durable execution is the product layer that keeps an agent-native workflow correct after approval. It owns waits, retries, cancellation, compensation, source-system reconciliation, and recovery after process failure.

The core rule:

```text
The agent proposes and observes.
The workflow executes and recovers.
The source system proves completion.
```

## Why This Matters

An agent loop is usually not enough for enterprise work because real product actions:

- wait for humans
- wait for external systems
- cross multiple APIs
- retry after timeouts
- need cancellation
- need compensation
- must survive browser refreshes and worker restarts
- must reconcile with a source of truth

If the model loop owns these steps, failures become hard to replay, audit, or recover.

## Ownership Split

| Layer | Owns | Must not own |
|---|---|---|
| Agent runtime | Planning, evidence, drafting, clarification, observation, summary | Durable side effects, retries, source truth |
| Tool gateway | Schema, scopes, data class, policy, idempotency check | Business recovery |
| Approval service | Human decision, payload hash, resume token | Hidden action mutation |
| Workflow engine | Waits, retries, timers, cancellation, compensation, verification branch | Model reasoning |
| Source systems | Authoritative final state | Agent memory or chat transcript |
| Product UI | Timeline, status, recovery controls | Raw workflow internals as user-facing truth |

## How The Pieces Connect

Durable execution is not only a backend job queue. It is the bridge between the agent's proposed action and the product's authoritative state.

```text
AgentRun
-> proposed ToolCall
-> policy decision
-> exact-payload approval
-> WorkflowExecution
-> ActivityAttempt
-> SourceSystemRequest
-> SourceSystemResponse
-> ProductStateUpdate
-> TimelineEvent
-> AuditEvent
-> EvalCase
```

The connection points matter:

- `AgentRun` records the user's intent, context, evidence, plan, and stop reason.
- `ToolCall` records the typed action proposal and immutable arguments.
- `Approval` records the exact payload hash, decision, actor, and resume token.
- `WorkflowExecution` records state, waits, retries, cancellation, compensation, and recovery history.
- `SourceSystemRequest` records the authoritative write request with an idempotency key.
- `SourceSystemResponse` records whether the source system actually accepted the change.
- `TimelineEvent` gives the user a product-native view of progress.
- `AuditEvent` gives compliance and incident review a stable evidence trail.
- `EvalCase` turns production failures into future regression tests.

This is the product boundary that prevents an impressive agent trace from being mistaken for a completed business process.

## State Machine

Useful baseline:

```text
created
-> waiting_for_approval
-> approved
-> workflow_started
-> activity_scheduled
-> activity_completed
-> verifying_source
-> completed
```

Exception states:

```text
waiting_for_approval -> rejected
waiting_for_approval -> expired
workflow_started -> waiting_for_external_signal
workflow_started -> cancel_requested
activity_scheduled -> retrying
activity_completed -> needs_reconciliation
needs_reconciliation -> compensation_required
compensation_required -> compensated
any_active_state -> failed
```

The frontend should show status from this state machine, not from the last model message.

## Idempotency

Every write tool needs an idempotency strategy.

Examples:

| Workflow | Idempotency key |
|---|---|
| Bed hold | `encounter_id + bed_id + hold_minutes` |
| Calendar invite | `account_id + meeting_type + start_time` |
| Support credit | `ticket_id + amount + policy_ref` |
| Code merge | `repo + branch + target + commit_sha` |

Design rules:

- Reads can usually retry safely.
- Writes retry only with idempotency keys or provider-level deduplication.
- Some actions should be non-retryable and require human review after failure.
- The idempotency key should be in the tool call, workflow event, audit record, and source-system request.

## Waits and Signals

Waiting is workflow state, not model activity.

Examples:

- wait for approval
- wait for unit acknowledgement
- wait for calendar accept or decline
- wait for billing ledger confirmation
- wait for CI checks
- wait for escalation owner

The agent may observe waiting status and summarize it, but it should not spin in a prompt loop.

## Cancellation

Cancellation needs to distinguish:

```text
Before side effect: stop safely.
After side effect: compensate or reconcile.
```

Examples:

- cancel pending bed hold before reservation: no source change
- cancel after bed hold: release bed and notify unit
- cancel invite before send: close draft
- cancel invite after send: send cancellation
- cancel credit before ledger write: stop
- cancel credit after ledger write: reverse or adjust through finance workflow
- cancel code merge before merge: close pending queue item
- cancel after merge: revert or corrective PR

## Compensation

Business compensation is not the same as code rollback.

Rolling back a prompt or model does not undo:

- a bed hold
- a sent invite
- a credit
- a customer reply
- a merged branch
- a memory write

Compensation should be a domain workflow with its own audit.

## Verification

The workflow should verify source truth after execution.

Completion should require:

- expected source-system response
- product database update
- user timeline event
- audit event
- no unresolved reconciliation failure

If source truth disagrees, mark:

```text
needs_reconciliation
```

Do not show `completed` because the model summarized success.

## Research And Standards Anchors

No single paper or vendor defines the whole stack. The useful pattern is to separate agent cognition from durable operations:

| Source family | What it contributes | Product architecture implication |
|---|---|---|
| ReAct | Reason, act, observe trajectories | Agent traces should be inspectable, but side effects still need workflow ownership |
| MRKL and Toolformer | Model routing to tools | Tools need typed schemas, scopes, and idempotency contracts |
| Reflexion and Generative Agents | Reflection and memory patterns | Learning is a proposal pipeline, not silent source-of-truth mutation |
| Voyager and deep-agent harnesses | Skill accumulation, workspaces, subagents | Skills must be granted, versioned, evaluated, and revoked through product controls |
| WebArena, AgentBench, GAIA, SWE-agent | Long-horizon task brittleness and eval pressure | Durable execution needs replay, state inspection, and failure-to-eval conversion |
| CloudEvents | Common event envelope | Agent, workflow, audit, and eval consumers can share event shape |
| W3C Trace Context | Cross-service correlation | Agent runtime, gateway, workflow, and source adapter should share trace IDs |
| OpenTelemetry GenAI conventions | Agent/model/tool telemetry vocabulary | Traces should distinguish model, tool, retrieval, workflow, and handoff spans |
| Temporal, Inngest, LangGraph, Cloudflare Workflows | Durable history, step retries, interrupts, waits, recovery | Workflow state should outlive any one prompt, request, worker, or browser session |

The current industry pattern is convergence, not uniformity:

- Agent frameworks make planning, tool use, handoffs, memory, and streaming easier.
- Workflow engines make long-running state, retries, timers, waits, and recovery tractable.
- Event and trace standards make cross-service inspection possible.
- Governance frameworks make identity, authorization, audit, human control, and risk review explicit.

The product architecture has to combine these. Picking an agent SDK alone does not answer idempotency, cancellation, source reconciliation, audit evidence, or release gating.

For the broader decision guide covering agent SDKs, internal APIs, MCP, workflow engines, A2A, events, and control plane, see [Protocol runtime decision lab](protocol-runtime-decision-lab.md).

## Platform Fit

Different tools fit different layers:

| Platform pattern | Good fit | Watch out |
|---|---|---|
| Temporal | Long-running workflows, activity retries, signals/updates, durable history, worker versioning | Requires deterministic workflow discipline |
| Inngest | Event-driven app workflows, step retries, background jobs, web product integration | Product still owns domain policy and audit |
| LangGraph | Agent state graphs, interrupts, persistence, human checkpoints, long-horizon harnesses | Graph state is not source truth by itself |
| Cloudflare Workflows | Deployed workflow steps near Cloudflare infrastructure | Domain governance remains outside runtime |
| Internal engine | Narrow, product-specific workflows | Must still support history, retry, idempotency, cancellation, inspection |

The platform choice should not change the product contract:

```text
workflow_id
run_id
approved_payload_hash
idempotency_key
activity history
retry policy
source response
final state
audit reference
```

## Real-Life Examples

### Healthcare Bed Hold

Workflow:

```text
approved reserve_bed payload
-> re-read bed board
-> reserve bed with idempotency key
-> notify unit
-> create transport task if needed
-> wait for acknowledgement
-> verify bed board
-> update timeline
```

Failure handling:

- stale bed: replan or needs reconciliation
- duplicate retry: idempotency key maps to one hold
- cancellation after hold: release bed and notify unit
- unit timeout: escalate to charge nurse

### Scheduling

Workflow:

```text
approved invite payload
-> create calendar event
-> store provider event ID
-> notify account timeline
-> wait for accept or decline
-> branch to reschedule if quorum fails
```

Failure handling:

- duplicate send: provider event key prevents duplicate invite
- decline: reschedule branch
- wrong recipient: cancellation and correction notice

### Support Resolution

Workflow:

```text
approved credit and reply
-> apply credit with ledger key
-> send approved customer reply
-> update ticket
-> verify ledger and delivery
```

Failure handling:

- credit fails: do not send misleading reply
- message fails: retry delivery or route to agent/human
- ledger mismatch: needs reconciliation
- wrong credit: finance compensation workflow

### Code-Change Agent

Workflow:

```text
approved merge
-> run required checks
-> store test artifacts
-> check branch protection
-> merge by commit SHA
-> verify PR and CI state
```

Failure handling:

- tests fail: block merge
- merge conflict: return to agent or reviewer
- accidental merge: revert or corrective PR
- deploy: separate approval and workflow

## Evals

Minimum durable-execution evals:

- read timeout retries safely
- write timeout does not duplicate side effect
- rejected approval never starts workflow
- approval resume token is required
- cancellation before write stops cleanly
- cancellation after write compensates or escalates
- source mismatch blocks `completed`
- workflow can resume after process restart
- stale workflow version does not silently mix with new policy
- operator can inspect run and workflow state

## Build Next

- Workflow state machine schema.
- Idempotency key registry.
- Retry policy matrix by tool.
- Cancellation API.
- Compensation workflow templates.
- Source reconciliation checker.
- Workflow history viewer.
- Eval harness for retry and source mismatch.
- Backend version of the browser simulator.

## Key Takeaway

```text
Deep agents are useful because they coordinate.
Durable workflows are necessary because they recover.
Source systems are authoritative because they prove what happened.
```
