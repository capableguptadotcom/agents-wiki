# Deep Agent Runbook

This runbook explains how a deep agent behaves inside a product over multiple iterations.

The existing [Deep agent lab](deep-agent-lab.md) names the parts of the harness. This note shows those parts operating together:

```text
intake
-> plan
-> gather evidence
-> draft action
-> approval
-> execute workflow
-> verify
-> learn
```

## What Makes It "Deep"

A deep agent is not deeper because it uses more prompts. It is deeper because it can manage a longer work loop with:

- a durable run state
- a task graph
- a workspace for intermediate artifacts
- specialist subagents or skills
- typed tools
- approval checkpoints
- durable workflow execution
- verification against source systems
- governed memory proposals
- eval and release feedback

The product still owns identity, policy, source-of-truth state, audit, and release.

## Stage 1: Intake

Question:

```text
What exactly is the user asking, and what product object does it attach to?
```

Examples:

- Bed flow: bind voice command to encounter, facility, tenant, requester role, and bed board.
- Scheduling: bind account, attendees, time window, customer timezone, and requester.
- Support: bind ticket, customer account, invoice, entitlement, and policy set.
- Coding: bind repo, branch, issue, allowed paths, and test command.

Artifacts:

- transcript or command
- resolved context
- ambiguity check
- user and agent scope
- source references

Failure mode:

The model starts planning against the wrong patient, customer, ticket, repo, or tenant.

## Stage 2: Plan

Question:

```text
What work should happen, in what order, with what stop conditions?
```

The planner should produce a typed task graph, not just a natural-language plan.

For bed flow:

```text
resolve constraints
-> read capacity
-> rank beds
-> preview reservation
-> approval
-> workflow
-> verify source-system state
```

Controls:

- max steps
- tool budget
- approval checkpoints
- denied actions
- stop conditions

Failure mode:

The plan looks plausible but skips policy, source evidence, approval, or verification.

## Stage 3: Evidence

Question:

```text
What source-linked facts does the agent need before proposing action?
```

This is where read tools and specialist subagents matter.

Examples:

- Capacity specialist ranks beds.
- Calendar specialist ranks slots.
- Policy specialist checks refund rules.
- Repo specialist maps files and tests.

Artifacts:

- source-linked summaries
- ranked alternatives
- policy excerpts
- file maps
- constraint tables

Failure mode:

The agent confidently proposes an action from incomplete or ungrounded evidence.

## Stage 4: Draft Action

Question:

```text
What exact payload or artifact is the agent proposing?
```

Examples:

- `reserve_bed(encounter_id=E-1042, bed_id=T-418, hold_minutes=20)`
- `send_invites(recipients, time, agenda, body)`
- `apply_credit(account_id, amount, reason, policy_ref)`
- patch artifact plus diff summary

Controls:

- typed schema
- source evidence bundle
- payload hash
- immutable draft once approval is requested
- alternatives shown

Failure mode:

The product asks users to approve vague intent rather than exact side effects.

## Stage 5: Approval

Question:

```text
Which human decision is required before execution can continue?
```

Approval is a product record, not a chat reaction.

It should include:

- approver
- timestamp
- exact payload
- payload hash
- source links
- risk label
- decision
- modification or rejection reason
- resume token

Failure mode:

A rejected or modified payload later executes because a stale workflow resumed.

## Stage 6: Execute

Question:

```text
Which side effects must run durably with retries and idempotency?
```

The workflow engine owns execution. The model observes status but does not perform durable writes itself.

The companion [Durable execution](durable-execution.md) note expands this stage into ownership boundaries, workflow states, idempotency keys, waits, cancellation, compensation, source reconciliation, platform choices, and eval cases.

Examples:

- reserve bed, notify unit, create transport
- send calendar invite, monitor declines
- apply credit, send customer reply, update ticket
- run tests, store artifacts, merge only after approval

Controls:

- idempotency key
- retry policy
- timeout policy
- cancellation
- compensation
- source-system response capture

Failure mode:

The agent says success while the workflow failed, retried twice, or left source systems inconsistent.

## Stage 7: Verify

Question:

```text
Did the product and source systems actually reach the expected state?
```

Verification checks reality, not the agent message.

Examples:

- bed board confirms bed T-418 is held for E-1042
- calendar provider confirms event and recipients
- billing system confirms credit and ticket status
- tests pass and PR state matches expected result

Possible outcomes:

- completed
- waiting
- needs_reconciliation
- failed
- changes_requested

Failure mode:

The UI shows completion because the model summarized success, not because source systems confirmed it.

## Stage 8: Learn

Question:

```text
What should improve next time, and how do we prevent silent drift?
```

Learning can create:

- eval cases
- failure tags
- reviewed memory proposals
- skill update candidates
- release notes
- risk register changes

Learning must not directly mutate production behavior.

Controls:

- memory approval
- eval replay
- release bundle
- canary
- rollback

Failure mode:

The agent silently stores a wrong lesson or ships a prompt change that breaks approval, denial, retry, or memory behavior.

## Handoff Rules

Deep agents need clear ownership transitions:

| From | To | Handoff object |
|---|---|---|
| Product surface | Context binder | request plus screen/work object context |
| Context binder | Agent runtime | context manifest |
| Planner | Specialist subagent | scoped task and output schema |
| Specialist subagent | Owner agent | source-linked result |
| Agent runtime | Policy gateway | proposed tool call |
| Policy gateway | Approval system | exact payload and policy decision |
| Approval system | Workflow | approved payload and resume token |
| Workflow | Verifier | side-effect result and source response |
| Verifier | Release loop | eval candidate or incident signal |

For a focused simulator of the specialist handoff contract, see [Subagent handoff simulator](subagent-handoff-simulator.md).

The interactive Deep Run section in [interactive.html](interactive.html#deep-run) now adds a stage ownership map and run contract record. Use it to inspect which piece owns each stage:

| Stage | Owner | Product control | Records that prove it |
|---|---|---|---|
| Intake | Product surface and context binder | Bind session, tenant, role, channel, work object, ambiguity, and minimum context before model work. | `AgentRun`, `ContextManifest`, `AccessDecision`, `TimelineEvent` |
| Plan | Planner inside agent runtime | Pre-label risky steps and prevent unsupported actions from entering the task graph. | `AgentStep`, `TaskGraph`, `SkillVersion`, `TraceSpan` |
| Evidence | Agent runtime with read tools and specialist subagents | Route reads through tool gateway, source adapters, redaction, and scope checks. | `ToolCall`, `SourceReference`, `SpecialistResult`, `TraceSpan` |
| Draft action | Owner agent and tool gateway preview path | Create schema-valid, source-linked, idempotent, immutable previews. | `ActionProposal`, `ToolCallPreview`, `PayloadHash`, `TimelineEvent` |
| Approval | Approval service and human approver | Enforce approver eligibility, payload hash, expiry, audit, and resume token. | `Approval`, `PayloadHash`, `ResumeToken`, `AuditEvent` |
| Execute | Durable workflow engine | Own waits, retries, idempotency, cancellation, compensation, and source writes. | `WorkflowEvent`, `DomainEvent`, `SourceResponse`, `ReconciliationRecord` |
| Verify | Verifier, source adapters, and product state | Decide final state from source confirmations, timeline, audit, and reconciliation. | `SourceResponse`, `TimelineEvent`, `AuditEvent`, `VerificationResult` |
| Learn | Eval, memory, skill, and release owners | Gate memory, skills, prompt, tool, and policy changes through review and release evidence. | `EvalCase`, `MemoryProposal`, `SkillChangeRequest`, `ReleaseBundle` |

## Design Rule

The owner agent can synthesize. It should not silently override:

- policy decisions
- approval decisions
- source-system state
- verifier results
- memory governance
- release gates

## Minimum Implementation Slice

Build one run that proves the loop:

```text
create run
-> bind context
-> create typed plan
-> gather source evidence
-> draft exact action payload
-> require approval
-> execute durable workflow
-> verify source state
-> propose eval or memory item
```

Pass criteria:

- wrong or ambiguous context stops before tools
- side-effecting tool cannot run before policy
- approval is exact and payload-hashed
- rejected payload cannot execute
- retry does not duplicate side effect
- verifier can force `needs_reconciliation`
- memory proposal is separate from run state
- eval replay can test the full trajectory
