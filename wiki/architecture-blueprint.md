# Architecture Blueprint

This note explains how the pieces connect in an agent-native product. It builds on:

- [System diagram spine](system-diagram-spine.md)
- [Research and standards](research-standards.md)
- [Evidence chain architecture](evidence-chain-architecture.md)
- [Product object model lab](product-object-model-lab.md)
- [Architecture composition workbench](architecture-composition-workbench.md)
- [Protocol runtime decision lab](protocol-runtime-decision-lab.md)
- [Architecture review](architecture-review.md)
- [Design philosophy lab](design-philosophy-lab.md)
- [Implementation lab](implementation-lab.md)
- [Case studies](case-studies.md)
- [Runtime ledger](runtime-ledger.md)
- [Durable execution](durable-execution.md)
- [Intent to action router](intent-to-action-router.md)
- [Identity and access lab](identity-access-lab.md)
- [Source-system integration lab](source-system-integration-lab.md)
- [Deployment topology lab](deployment-topology-lab.md)

## Core Frame

An enterprise agent is not one component. It is a product actor moving through governed boundaries:

```text
work surface
-> context binder
-> agent runtime
-> tool and skill layer
-> policy gateway
-> approval
-> durable workflow
-> product and source-system state
-> memory governance
-> observability
-> eval and release process
```

Each boundary must answer four questions:

```text
Who owns this layer?
What enters and leaves it?
What can fail here?
What evidence proves it behaved correctly?
```

Each boundary should also pass the deep-module test:

```text
What complexity does this layer hide?
What invariant does it own?
What should callers not need to know?
What shallow wrapper are we rejecting?
What test proves the boundary works independently?
```

## Layer Ownership

| Layer | Owner | Input | Output | Failure to prevent | Evidence |
|---|---|---|---|---|---|
| Work surface | Product UX and domain team | User request in work context | AgentRun request and timeline entry | Detached chat acts on wrong object | Timeline in source work object |
| Context binder | Product API and identity | Session, tenant, screen, object, user claims | Resolved context or clarification | Wrong patient, customer, repo, tenant, or ticket | Context manifest |
| Identity and access | IAM, security, and platform | User claims, agent version, connector grant, token audience, scope, source ACL | Effective authority or denial | User, agent, connector, approval, or service account authority is confused | Access decision record |
| Agent runtime | Agent platform | Goal, context, skills, read tools, budgets | Plan, observations, ranked options, action proposal | Unbounded loop, invented state, weak evidence | Trace and stop reason |
| Tools and skills | Platform and service owners | Tool registry, schemas, skills, examples | Validated read result or proposed side effect | Prompt-only capability treated as authority | ToolCall record |
| Policy gateway | Security and compliance | Tool call, scopes, data class, side effect | Allowed, denied, approval_required | Prompt text treated as permission | Policy decision record |
| Approval | Product UX and audit owner | Exact action payload and source evidence | Approved, modified, rejected, escalated | Vague approval authorizes hidden action | Approval record and payload hash |
| Durable workflow | Backend and SRE | Approved payload, idempotency, workflow version | Side effects, compensation, final state | Retry duplicates or crash loses work | Workflow event history |
| Product state | Domain backend | Workflow result and source response | Updated work object or reconciliation state | Agent summary disagrees with source system | Domain event and source response |
| Memory | Product and compliance | Run outcome, correction, repeated preference | No memory, proposed memory, approved memory | Sensitive or wrong memory changes future behavior | MemoryItem source and use audit |
| Observability | SRE, compliance, agent engineering | Model, tool, workflow, policy, approval events | Trace, audit, timeline, metrics, eval sample | Logs exist but accountability is missing | Correlated IDs |
| Evals and release | Product, risk, SRE, agent engineering | Traces, incidents, corrections, proposed changes | Eval run, release bundle, canary, rollback | Silent behavior drift | Pinned release bundle |

## Boundary Contracts

The strongest architecture decision is separating ownership.

### Product Surface

Owns:

- entry point
- visible state
- source links
- approval card
- correction path
- recovery and escalation

Must not own:

- hidden tool execution
- durable business state
- invisible memory updates

### Agent Runtime

Owns:

- planning
- clarifying
- read-tool selection
- ranking
- drafting
- handoff recommendation

Must not own:

- authorization
- source-of-truth writes
- workflow recovery
- compliance audit
- release approval

### Tool Gateway

Owns:

- schema validation
- agent scope
- delegated user scope
- tenant and resource checks
- side-effect classification
- idempotency
- timeout and retry class

Must not own:

- vague natural-language permission
- unversioned tool behavior
- unlogged execution

### Workflow Engine

Owns:

- waits
- retries
- cancellation
- compensation
- resume after approval
- source-system reconciliation

Must not own:

- model reasoning
- hidden policy overrides
- final clinical or business judgment

### Memory Service

Owns:

- source
- scope
- data class
- retention
- owner
- approval status
- correction and deletion
- use audit

Must not own:

- secrets
- uncontrolled PHI
- unsupported model inferences
- unreviewed organization rules

## Scenario 1: Healthcare Bed Flow

Request:

```text
Hold the best monitored bed for this ED patient.
```

Architecture path:

1. Work surface captures voice inside ED bed board.
2. Context binder resolves encounter, facility, room, requester role, tenant, and selected patient.
3. Identity and access layer intersects user scope, agent grant, SMART/FHIR scope, facility policy, and source-system ACL.
4. Agent reads capacity, monitoring need, isolation, staffing, and near-term discharges.
5. Tool gateway validates read scopes and tool schemas.
6. Agent drafts `reserve_bed(encounter_id, bed_id, hold_minutes)`.
7. Policy marks the action `approval_required` because it is PHI-adjacent and changes operations.
8. User approves, modifies, rejects, or escalates exact action arguments.
9. Durable workflow reserves bed, notifies unit, creates transport task, and reconciles source state.
10. Product state moves to held only after source-system confirmation.
11. Trace, audit, timeline, and eval sample are written.
12. No patient fact becomes durable memory by default.

Key rule:

The agent coordinates the decision. It does not become the bed board, ADT, EHR, or clinical record.

For the authority chain behind this scenario, see [Identity and access lab](identity-access-lab.md). For the field-level source ownership, see [Source-system integration lab](source-system-integration-lab.md).

## Scenario 2: Enterprise Scheduling

Request:

```text
Schedule a quarterly review with the customer and internal stakeholders next week.
```

Architecture path:

1. Work surface starts from account workspace, calendar sidebar, command bar, or Slack thread.
2. Context binder resolves account, attendees, time window, purpose, customer timezone, and requester.
3. Agent reads calendars with minimal private detail and ranks slots.
4. Agent drafts agenda and customer-facing invite.
5. Policy marks external invite as approval-required communication.
6. User approves or edits attendees, slot, agenda, and message.
7. Workflow sends invite and monitors accept, decline, or no-response events.
8. Product state links meeting object to account timeline.
9. Approved preferences may become editable user memory.
10. Timezone and reschedule cases become evals.

Key rule:

The hard part is not finding a slot. It is coordinating preferences, private calendars, external communication, and follow-up state.

## Scenario 3: Support Resolution

Request:

```text
Resolve this billing dispute and update the customer.
```

Architecture path:

1. Work surface starts inside the ticket.
2. Context binder resolves ticket, account, entitlement, invoice, SLA, prior cases, and policy.
3. Agent reads evidence and drafts a policy-grounded resolution.
4. Agent proposes credit or refund only through typed tools.
5. Policy requires approval for financial adjustment and customer communication.
6. Manager reviews amount, policy basis, and exact customer response.
7. Workflow applies credit, sends message, and updates ticket.
8. Billing, messaging, and ticket systems confirm source-of-truth state.
9. Customer facts stay in source systems; policy insight can become reviewed knowledge.
10. Rejected credit and policy-edge cases become evals.

Key rule:

The agent should be strong at evidence and drafting, but financial side effects need explicit controls.

## Scenario 4: Code Change Agent

Request:

```text
Add approval gating to the workflow simulator and verify it.
```

Architecture path:

1. Work surface starts from issue, repo, PR, or development task.
2. Context binder resolves repository, branch, issue, allowed paths, test command, and reviewer expectations.
3. Agent inspects files, plans edit, changes scoped files, and runs tests.
4. Policy allows bounded edits but blocks secrets, destructive changes, merge, and deploy without approval.
5. Reviewer approves exact merge or deploy action, not broad intent.
6. Workflow runs checks and resumes from approved payload.
7. Branch, PR, CI, and deployment system remain source of truth.
8. Project preferences can persist only if reviewed and source-linked.
9. Trace records file reads, edits, commands, and failures.
10. Review comments and test failures become eval cases.

Key rule:

The agent-computer interface matters. The product should expose concise observations, safe commands, scoped writes, tests, and review gates.

## Design Review Checklist

Use this checklist before shipping any new agent capability:

- What work surface owns the request?
- What context object proves the right user, tenant, and work object were bound?
- Which tools are read-only, draft-only, write, external, admin, or memory-writing?
- Which policy decision is enforced outside the model?
- Which exact payload requires approval?
- Which workflow owns retries, waits, cancellation, and compensation?
- Which source system confirms final state?
- What memory can be proposed, and who can approve or delete it?
- Which IDs correlate trace, audit, timeline, workflow, and eval?
- Which evals block release?
- Which kill switch or rollback path exists?

## Minimum Vertical Slice

The first production learning slice should be narrow:

```text
create AgentRun
-> bind context
-> call read tools
-> propose write payload
-> require approval
-> execute durable workflow
-> update product state
-> write trace, audit, and timeline
-> replay eval
```

Success criteria:

- ambiguous context asks for clarification
- denied policy never executes a tool
- rejected approval never starts workflow
- duplicate retry produces one side effect
- source-system mismatch creates `needs_reconciliation`
- durable patient or customer memory is never written by default
- release bundle pins prompt, model, tools, policy, workflow, memory schema, and eval run
