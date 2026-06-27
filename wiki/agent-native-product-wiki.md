# Agent-Native Product Wiki

This document is the long-form companion to the interactive walkthrough in `index.html`.

## 1. The Mental Model

The common mistake is to model agents as:

```text
UI -> chat -> LLM -> response
```

That is useful for support, Q&A, and simple copilots, but it is not enough for products where agents change product state.

The deeper model is:

```text
UI or voice command
-> product API
-> intent and context binder
-> agent runtime
-> policy and tool gateway
-> durable workflow engine
-> workers and integrations
-> product state
-> timeline, audit, traces, evals
```

The agent is not the whole system. It is one actor inside a product execution system.

## 2. First-Class Product Primitives

### Agent

An `Agent` is a product principal with identity, owner, purpose, version, allowed scopes, autonomy level, model configuration, memory policy, and lifecycle status.

Example:

```json
{
  "agent_id": "bedflow-agent",
  "owner_team": "capacity-operations",
  "purpose": "Coordinate bed assignment requests",
  "autonomy_level": "draft_requires_approval",
  "allowed_units": ["ED", "ICU", "Telemetry"],
  "status": "active"
}
```

### Skill

A `Skill` is a packaged capability: instructions, examples, domain policy, required tools, safety boundaries, and evaluation cases.

The important distinction:

- Skill: what the agent knows how to do.
- Tool: what the agent can execute.

See [Capability registry](capability-registry.md) for the fuller access model covering skills, resources, read tools, write tools, workflows, memory classes, and connectors.

See [Identity and access lab](identity-access-lab.md) for the authority-chain model covering user identity, agent principals, delegated connector scopes, tool gates, approval-scoped elevation, workflow service identity, audit, and revocation.

### Tool

A `Tool` is a typed product API callable by an agent. It must have input schema, output schema, owner, permission scope, data classification, side-effect level, idempotency behavior, timeout, retry policy, and approval requirement.

Example:

```json
{
  "tool": "reserve_bed",
  "side_effect": "write",
  "data_class": "phi",
  "requires_approval": true,
  "idempotency_key": "bed_request_id + candidate_bed_id"
}
```

### Run

An `AgentRun` is a durable execution instance. It should survive browser refreshes, worker restarts, network failures, and human delays.

Minimum fields:

```text
run_id
agent_version_id
requester_user_id
status
current_step
created_at
completed_at
failure_reason
workflow_id
trace_id
```

### Approval

An `Approval` is a product decision record. It should approve exact action arguments, not vague intent.

See [Approval handoff](approval-handoff.md) for the deeper model covering approval cards, payload hashes, modification, rejection, escalation, resume tokens, audit, and evals.

Bad:

```text
Approve booking a bed.
```

Good:

```text
Approve reserve_bed(patient_encounter_id=E123, bed_id=T-418, hold_minutes=20).
```

### Memory

Memory is governed product data. It should not be a hidden scratchpad.

See [Memory governance](memory-governance.md) for the deeper model covering run state, conversation context, user preferences, organization rules, source-linked knowledge, prohibited memory, use audit, correction, deletion, and evals. See [Memory lifecycle simulator](memory-lifecycle-simulator.md) for the concrete proposal, activation, retrieval, audit, and quarantine mechanics.

See [Eval and release harness](eval-release-harness.md) for the deeper model covering trajectory eval cases, datasets, eval runs, release gates, production signals, and blocking rules.

See [Source-system integration lab](source-system-integration-lab.md) for the field-level model covering authoritative systems, standards or APIs, adapters, cache rules, policy scopes, reconciliation, and proof records.

Separate:

- Run state: temporary state for one execution.
- Conversation memory: recent interaction context.
- User preference memory: stable user preferences.
- Organization memory: approved operational policy.
- Domain memory: indexed source documents.

For healthcare, durable patient PHI memory should be avoided by default. Patient facts should come from the source system during each run.

### Evaluation

An `Evaluation` is a release gate and regression tool. It should test agent behavior, tool choices, refusal behavior, approval rules, memory writes, and failure recovery.

## 3. Runtime Split

The core architectural split:

```text
Agent runtime = reasoning, planning, tool choice, clarification, handoff
Workflow engine = durability, retries, waits, cancellation, recovery
Tool gateway = permissions, schemas, side effects, audit
Product DB = source of truth
```

The agent should not be the source of truth. The workflow should not invent reasoning. The tool gateway should not depend on prompt obedience.

## 4. Healthcare Bed-Flow Example

User command:

```text
"Find a monitored bed for the ED patient in room 12 and hold the best option."
```

Execution:

1. Voice service transcribes the request.
2. Context binder resolves user, role, current screen, patient encounter, facility, and active shift.
3. Intent classifier maps the request to `bed_assignment_request`.
4. Agent gathers constraints: acuity, monitoring need, isolation, sex/gender policy, staffing, ETA, discharges, unit rules.
5. Tool gateway checks whether the agent can read relevant capacity and patient context.
6. Agent ranks candidate beds and explains tradeoffs.
7. Policy decides whether reservation requires approval.
8. Approval card shows exact action arguments.
9. Durable workflow reserves the bed, notifies the unit, creates transport/EVS tasks if needed, and updates source systems.
10. Timeline and audit entries record every read, proposal, approval, write, notification, and failure.

## 5. Autonomy Ladder

Use autonomy levels instead of a binary agent/non-agent distinction.

```text
Level 0: no agent
Level 1: suggest only
Level 2: draft action requiring approval
Level 3: supervised execution with explicit review points
Level 4: policy-bounded autonomous execution
Level 5: broad autonomy, usually not appropriate for regulated workflows
```

For healthcare operations, start at Level 1 or Level 2. Move to Level 3 only after evals, operational trust, and audit coverage are strong.

## 6. Security Model

Key rules:

- Agents are scoped principals.
- Prompt text is not security.
- Tools enforce authorization.
- Tenant and patient boundaries are checked at tool gateway.
- Side-effecting tools require idempotency.
- High-risk actions require approval.
- Audit logs are append-only and separate from traces.
- Secrets are never exposed to model context.

See [Agent threat model](agent-threat-model.md) for the scenario-by-scenario mapping from prompt injection, excessive agency, disclosure, connector abuse, memory poisoning, source mismatch, drift, and resource exhaustion to controls, evidence, evals, and recovery.

## 7. Memory Model

Memory writes should be treated like product mutations.

Every durable memory should answer:

```text
What is being remembered?
Who or what proposed it?
What source proves it?
Who can inspect it?
Who can delete it?
When does it expire?
Can it affect future actions?
Does it contain PHI, PII, secrets, or regulated data?
```

## 8. Observability and Evals

You need both:

- Traces: debugging and performance.
- Audit: compliance and accountability.

Track:

```text
trace_id
workflow_id
run_id
agent_version_id
tool_call_id
approval_id
user_id
tenant_id
resource_id
model_id
prompt_version
policy_version
```

Evals should cover:

- correct intent classification
- correct tool selection
- refusal when scope is missing
- approval triggered for risky actions
- memory write proposals
- recovery after tool failure
- no duplicate side effects on retry
- latency and cost budget

## 9. UX Surfaces

See [Product UX surfaces](product-ux-surfaces.md) for the dedicated surface-by-surface interaction model.

The product should include:

- Command bar and voice input.
- Work object agent panel.
- Approval inbox.
- Activity timeline.
- Agent settings.
- Memory and permissions center.
- Run console for operators.
- Slack or Teams mention surface for coordination.

Chat is a surface. It is not the system of record.

## 10. What Makes This AI-Native

The product becomes AI-native when:

- agents are modeled in the domain
- users can see and control what agents do
- agents operate through governed tools
- runs are durable and inspectable
- memory is visible and correctable
- agent releases are evaluated and versioned
- failures produce recoverable product state
- trust is built into the workflow, not bolted on
