# Deep Agent Lab

This note explains how a "deep agent" should be understood inside a real application.

For the product architecture that connects the harness to context binding, subagents, tools, approval, workflow, memory, observability, and release, see [Deep agent application architecture](deep-agent-application-architecture.md).

## Working Definition

A deep agent is not just an LLM with tools. It is a harness that can hold context over a longer task, plan work, use tools, delegate to specialized subagents or skills, write intermediate artifacts, ask for help, recover from failure, and produce a verifiable result.

For a product, that harness must be wrapped by product controls:

```text
deep agent harness
+ product identity
+ policy gateway
+ durable workflow
+ human approval
+ audit log
+ eval and release lifecycle
```

## Harness Anatomy

### Planner

The planner decomposes a vague goal into steps.

Example:

```text
Goal: hold the best monitored bed for this ED patient.
Plan:
1. Resolve encounter and constraints.
2. Read capacity and staffing.
3. Rank candidate beds.
4. Propose hold action.
5. Wait for approval.
6. Execute durable workflow.
```

Risk:

The planner can create a plausible but operationally invalid plan.

Control:

Use typed plan outputs, policy checks, and domain eval cases.

### Context Manager

The context manager decides what information enters the model context.

Example:

The model receives bed constraints and candidate summaries, not the entire patient chart.

Risk:

Too little context produces bad decisions. Too much context leaks sensitive data and confuses the model.

Control:

Use scoped retrieval, redaction, source links, and context budgets.

### Tool Caller

The tool caller executes typed product APIs through a gateway.

Example:

`fetch_capacity_snapshot` is allowed during planning. `reserve_bed` pauses for approval.

Risk:

A retry duplicates a side effect or a tool call bypasses policy.

Control:

Use idempotency keys, side-effect levels, tenant checks, and approval policies.

### Workspace

The workspace is where intermediate state and artifacts live.

Example:

A bed-flow agent may write a draft action payload, candidate ranking, and source evidence. A coding agent may edit files, run tests, and produce diffs.

Risk:

Intermediate artifacts become invisible authority or stale source of truth.

Control:

Make important artifacts visible in product state, timelines, and reviews.

### Subagents

Subagents are specialist workers with scoped responsibilities.

Example:

In a healthcare operations agent:

- capacity subagent ranks bed candidates
- policy subagent checks unit rules
- communication subagent drafts notifications
- reconciliation subagent checks source-system state

Risk:

Subagents create conflicting claims or unowned decisions.

Control:

Use explicit handoff contracts, owner agent synthesis, and final policy checks.

### Memory

Memory carries useful context across interactions.

Example:

Remember that a unit prefers escalation to the charge nurse after 10 minutes. Do not remember durable patient PHI by default.

Risk:

Memory turns incorrect or sensitive facts into future behavior.

Control:

Require classification, source, owner, retention, inspection, correction, and deletion.

Companion:

[Memory lifecycle simulator](memory-lifecycle-simulator.md) shows how a candidate becomes a reviewed `MemoryProposal`, an active `MemoryItem`, a `MemoryUseAudit`, and finally a correction, deletion, or quarantine event.

### Critic or Verifier

The verifier checks whether the result satisfies the goal and policy.

Example:

After bed reservation, verify that the source system reports bed `T-418` as held for encounter `E-1042`.

Risk:

The verifier only checks the agent message, not real product state.

Control:

Verify against source systems and product events.

## Product Examples

### Healthcare Bed-Flow Agent

Input:

```text
"Find a monitored bed for this ED patient and hold the best option."
```

Deep-agent behavior:

- planner decomposes the workflow
- context manager retrieves patient constraints and bed capacity
- capacity subagent ranks beds
- policy gateway requires approval for reservation
- workflow reserves bed and sends notifications
- verifier reconciles source-system state

### Enterprise Scheduling Agent

Input:

```text
"Schedule the quarterly review with finance, legal, and the customer team next week."
```

Deep-agent behavior:

- planner identifies attendees, constraints, time zones, and priority
- tool caller reads calendars
- subagent drafts agenda
- approval required before sending external invitations
- workflow monitors declines and reschedules if needed

### Customer Support Resolution Agent

Input:

```text
"Handle this billing dispute and update the customer."
```

Deep-agent behavior:

- planner reads ticket, account status, payment history, and policy
- tool caller drafts adjustment or refund request
- approval required for credit or refund
- communication tool sends approved response
- verifier checks ticket status and customer notification

### Code Change Agent

Input:

```text
"Add approval-gated bed reservation to the workflow simulator."
```

Deep-agent behavior:

- planner inspects repo
- tool caller edits files
- subagent or verifier runs tests
- review surface shows diff and risk
- merge or deployment remains a product decision

## What To Build In This Wiki Next

The next layer is the [Deep Agent Runbook](deep-agent-runbook.md), which turns the harness anatomy into an eight-stage run:

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

Current companion:

- [Subagent handoff simulator](subagent-handoff-simulator.md) turns the subagent part of the harness into scoped handoff contracts, specialist examples, control boundaries, and eval cases.

Remaining deep dives:

1. A visual harness diagram.
2. A memory write approval simulator.
3. A trace replay viewer.
4. A schema-first implementation lab.
5. A comparison of coding agents, workflow agents, and product agents.
