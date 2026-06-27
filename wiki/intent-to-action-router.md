# Intent To Action Router

Current as of 2026-06-27.

This note complements the interactive Intent Router in `interactive.html`.

The central point:

```text
Intent classification is not enough.
The router decides the next safe product transition.
```

A user can say:

```text
Book a bed for this patient.
```

That utterance is not yet a tool call. It is an input to a routing pipeline that must bind context, compare tools, classify risk, ask clarification when needed, and stop before irreversible side effects.

## Router Responsibility

The router owns the path from request to next governed action:

```text
utterance or trigger
-> surface context
-> identity and tenant
-> work object binding
-> intent candidate
-> ambiguity check
-> candidate tools
-> policy classification
-> clarification, denial, approval, or workflow handoff
```

The router should not execute source-system writes directly. It should produce a route decision that downstream systems can inspect.

## Why A Simple Intent Classifier Fails

The sentence "book a bed" may map to `bed_assignment_request`, but that does not answer:

- Which patient or encounter?
- Which facility and tenant?
- Is the requester allowed to reserve beds?
- Is this a read, draft, preview, or write?
- Is PHI involved?
- Is source state fresh?
- Is approval required?
- Which workflow owns retries and cancellation?
- What should happen if context is ambiguous?

The product needs all of those answers before a write tool can execute.

## Route Decision Object

A useful route record looks like this:

```json
{
  "route_id": "route_bed_bind",
  "status": "context_bound",
  "channel": "voice",
  "utterance": "Book a monitored bed for this ED patient.",
  "requester": "charge_nurse/U-88",
  "work_object": "encounter/E-1042",
  "bound_intent": "bed_assignment_request",
  "chosen_tool_or_handoff": "reserve_bed_preview",
  "policy_decision": "approval_required",
  "stop_reason": "stop_before_write",
  "approval_payload": "reserve_bed(encounter_id=E-1042, bed_id=T-418, hold_minutes=20)",
  "workflow": "bed_hold_workflow:v5",
  "source_truth": "EHR, ADT, bed board, staffing roster"
}
```

This object belongs in traces and run records. It may also contribute to audit when the route allows sensitive reads, external messages, or side-effect previews.

## Routing Stages

### 1. Capture

Capture the utterance, trigger, channel, surface, user, and visible work object.

Examples:

- voice inside an ED bed board
- command bar inside a customer account
- ticket action inside support workspace
- issue command inside repo workspace
- Slack mention linked to a work object
- scheduled monitor event

Rule:

The channel is not the source of truth. It is only where the request entered.

### 2. Bind Context

Resolve the exact product object and authority boundary.

Healthcare bed flow:

```text
selected encounter
facility
tenant
requester role
bed board timestamp
monitoring need
isolation status
```

If "this patient" can refer to more than one encounter, the run enters `needs_clarification`.

### 3. Compare Candidate Tools

Do not jump straight from intent to write tool.

For bed flow:

```text
resolve_encounter
fetch_capacity_snapshot
rank_candidate_beds
reserve_bed_preview
reserve_bed
```

The safe order is:

```text
bind context
-> read current source state
-> compute or rank
-> preview exact side effect
-> policy and approval
-> durable workflow execution
```

### 4. Classify Policy

Policy should classify:

- agent scope
- delegated user scope
- tenant and object scope
- data class
- side-effect level
- destination
- external communication
- financial or clinical impact
- approval rule
- idempotency requirement
- workflow requirement

Possible route decisions:

| Decision | Meaning |
|---|---|
| `allowed` | Safe to continue without human approval, usually read or draft. |
| `denied` | User, agent, tenant, or tool is not authorized. |
| `clarification_required` | Context or requested outcome is ambiguous. |
| `approval_required` | Side effect is possible but needs exact-payload approval. |
| `workflow_only` | Execution must be delegated to durable workflow. |
| `escalation_required` | Risk, policy, or authority requires another owner. |

### 5. Stop At Handoff

A good router knows where to stop.

Stop conditions include:

- ambiguous work object
- missing required source evidence
- unsupported intent
- denied tool
- approval required
- external communication required
- durable workflow required
- budget exhausted
- policy uncertainty

Stopping is not failure. It is how the product remains governable.

### 6. Handoff To Workflow

After approval, the router does not execute the write itself. It hands off:

```text
approved payload
payload hash
resume token
idempotency key
workflow version
source-system adapter
```

The workflow owns retries, waits, cancellation, compensation, and source reconciliation.

## Real-Life Examples

### Healthcare Bed Flow

User:

```text
Book a monitored bed for this ED patient.
```

Route:

```text
voice in bed board
-> bind encounter E-1042
-> read capacity and constraints
-> rank beds
-> preview reserve_bed
-> approval_required
-> bed_hold_workflow
```

Failure to prevent:

The system reserves a bed for the wrong encounter because "this patient" was inferred from chat instead of selected work context.

### Enterprise Scheduling

User:

```text
Schedule the quarterly review next week.
```

Route:

```text
account command bar
-> bind account and meeting type
-> resolve attendees
-> read calendars
-> rank slots
-> draft invite
-> approval_required for external send
-> meeting_coordination_workflow
```

Failure to prevent:

The agent sends a customer invite with the wrong recipients or timezone because it treated a vague account-level request as complete.

### Support Resolution

User:

```text
Resolve this billing dispute and update the customer.
```

Route:

```text
ticket workspace
-> bind ticket, customer, invoice, policy
-> read evidence
-> draft adjustment and reply
-> approval_required for credit and customer message
-> support_resolution_workflow
```

Failure to prevent:

The customer reply is sent even though the billing ledger write failed.

### Code-Change Agent

User:

```text
Add approval gating to the workflow simulator.
```

Route:

```text
repo issue
-> bind repo, branch, issue, allowed paths
-> inspect files
-> edit scoped files
-> run tests
-> create patch
-> review_required before merge
-> merge workflow checks CI and commit SHA
```

Failure to prevent:

The agent treats "add this" as permission to merge or deploy without review.

## Router Evals

Minimum evals:

- ambiguous work object stops before tool calls
- wrong tenant or role denies access
- read tools are preferred before write previews
- unsupported intent becomes clarification or denial
- external communication requires approval
- financial, clinical, or repo merge action requires approval
- rejected approval never resumes workflow
- source state is re-read before side effects
- stale context blocks completion
- route decision records explain why a tool was chosen or blocked

## Product Interfaces

The router should feed several product surfaces:

- intake surface: show that the request was received and context is being resolved
- work object panel: show source evidence and candidate next actions
- approval card: show exact payload and why approval is required
- timeline: show route status, clarification, denial, approval, or workflow start
- run console: show route decision, policy inputs, candidate tools, and traces
- eval dashboard: show tool-choice and route-choice failures

## Key Takeaway

```text
Intent detection says what the user may want.
Routing decides what the product may safely do next.
Execution happens only after policy, approval, and workflow boundaries are satisfied.
```
