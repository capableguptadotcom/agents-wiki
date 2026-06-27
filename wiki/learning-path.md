# Learning Path

This path turns the wiki into a curriculum. The goal is not to memorize terms. The goal is to be able to design, critique, and eventually build agent-native product systems.

## Module 0: Research and Architecture Blueprint

Learn:

The system has to connect research primitives, standards, product surfaces, domain state, security, workflow, memory, observability, and release gates.

Exercise:

Pick one workflow and map it across:

- work surface
- context binder
- agent runtime
- tools and skills
- policy gateway
- approval
- durable workflow
- product state
- memory
- observability
- eval and release

Proof:

You can explain which paper, standard, protocol, or case-study pattern informs each layer, and which layer owns the final product decision.

Use [Architecture composition workbench](architecture-composition-workbench.md) to perform this crosswalk interactively.

## Module 1: Mental Model

Learn:

```text
User intent
-> context binding
-> agent reasoning
-> policy and tools
-> approval
-> durable workflow
-> product state
-> timeline, audit, eval feedback
```

Exercise:

Draw the path for a scheduling request from command bar to calendar invite and timeline update.

Proof:

You can explain which layer owns context, reasoning, permission, approval, workflow, and state.

## Module 2: Product Primitives

Learn:

- Agent
- AgentVersion
- AgentRun
- ToolCall
- Approval
- MemoryItem
- AuditEvent
- EvalRun

Exercise:

Write example records for one support-agent run where the agent drafts a refund and waits for approval.

Proof:

You can replay what happened after an incident using product records, not chat history.

## Module 3: Tools and Skills

Learn:

Skills package know-how. Tools execute typed product capabilities.

Use [Skill lifecycle lab](skill-lifecycle-lab.md) to study how skill changes are proposed, reviewed, evaluated, released, used, and improved without silent drift.

Exercise:

Design a tool registry entry for `send_customer_reply`.

Include:

- input schema
- output schema
- side effect
- data class
- approval rule
- idempotency rule
- audit behavior

Proof:

You can identify whether a tool is read-only, draft-only, write, or external communication.

## Module 4: Memory

Learn:

Separate run state, conversation context, user preference, organization memory, source documents, and prohibited memory.

Exercise:

Classify five memories:

- user preference
- unit escalation rule
- patient-specific fact
- project decision
- API key

Proof:

You can define source, scope, retention, inspection, correction, and deletion for every durable memory.

## Module 5: Durable Workflow

Learn:

Agent loops are good for reasoning. Workflows are needed for waits, retries, cancellation, recovery, and side effects.

Exercise:

Write a state machine for:

```text
received
context_bound
planning
action_proposed
waiting_for_approval
executing
needs_reconciliation
completed
failed
cancelled
```

Proof:

You can explain how retry avoids duplicate writes.

## Module 6: Security

Learn:

Agents are scoped principals. Tool calls require agent scope, delegated user scope, tenant checks, and resource checks.

Exercise:

Create a policy matrix for:

- read
- draft
- write
- external communication
- admin change
- memory write

Proof:

You can identify what is enforced by policy infrastructure instead of prompt text.

## Module 7: UX

Learn:

Chat and voice are entry points. Work objects, timelines, approvals, settings, memory center, and run console are control surfaces.

Exercise:

Sketch the UX for an approval-gated scheduling agent.

Proof:

You can show where users inspect source data, approve action payloads, correct memory, and recover failures.

## Module 8: Observability

Learn:

Trace, audit, and timeline are different.

```text
Trace: debug behavior
Audit: prove accountable action
Timeline: explain progress to users
```

Exercise:

Map `run_id`, `trace_id`, `workflow_id`, `tool_call_id`, `approval_id`, and `audit_id` for one support case.

Proof:

You can answer what happened, who approved it, why it failed, and what evidence supports the result.

## Module 9: Evals

Learn:

Agent evals must test trajectory, not just final answers.

Exercise:

Write five eval cases for a support agent:

- correct tool choice
- permission denial
- approval rejection
- retry without duplicate side effect
- correct final product state

Proof:

You can say what blocks release and what is safe to canary.

## Module 10: Vertical Slice

Learn:

A thin working slice proves the platform contracts before scaling to many agents.

Build:

```text
text command
-> create run
-> bind context
-> propose action
-> preview tool
-> approve
-> workflow simulator
-> timeline
-> audit
-> eval replay
```

Proof:

- Rejected approval never writes.
- Retry does not duplicate.
- Timeline and audit both populate.
- Memory proposal is visible and rejectable.
- Eval replay can rerun the same case.

## Completion Standard

You understand the architecture when you can take a new product domain and answer:

```text
What is the work object?
What is the source of truth?
What can the agent read?
What can it write?
What requires approval?
What memory is allowed?
What is durable workflow state?
What is audit evidence?
What evals block release?
What UI surfaces expose control?
```
