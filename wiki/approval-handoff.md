# Approval and Handoff

Current as of 2026-06-27.

For the canonical policy and approval gate flow, see [System diagram spine](system-diagram-spine.qmd).

Approval is not a button that says "looks good." In an agent-native product, approval is a product record attached to exact action arguments, source evidence, policy decision, payload hash, approver authority, audit, and workflow resume behavior.

The core rule:

```text
Approve exact payloads, not vague intent.
Resume workflows from approved payloads, not chat messages.
```

## Why This Matters

Agents often fail at the boundary between recommendation and action:

- the user approves a summary, but the hidden tool arguments differ
- the agent modifies an action after approval
- a rejected approval still starts a workflow
- an approval expires but the run resumes anyway
- a manager approval is needed, but the system treats a lower-level approval as enough
- a user modifies a payload, but audit still points to the original hash
- an approval happens in Slack, but the product work object never records it

The product should make the approval boundary explicit and durable.

## Approval Object

Minimum fields:

```text
approval_id
run_id
work_object_ref
agent_id
agent_version_id
tool_name
policy_decision_id
policy_reason
requested_payload_json
requested_payload_hash
approved_payload_json
approved_payload_hash
decision
decision_reason
approver_user_id
approver_role
approval_owner
created_at
expires_at
decided_at
workflow_resume_token
audit_id
```

Important invariant:

```text
If payload changes, the approved hash changes.
```

Do not let approval of the original payload authorize a modified payload.

## Decision Types

| Decision | Meaning | Workflow effect |
|---|---|---|
| Approve | Exact payload is accepted | Issue resume token and execute workflow |
| Modify | Human edits payload before approving | Create new hash, approve modified payload, execute modified workflow |
| Reject | Human denies the payload | Do not issue resume token |
| Clarify | Human asks for more evidence | Return to agent runtime without side effect |
| Escalate | Another owner is required | Wait for second decision or higher authority |
| Expire | Approval was not decided in time | Block workflow and replan or close |
| Cancel | Requester or operator cancels | Cancel run or workflow branch |

## State Machine

```text
approval_required
-> payload_locked
-> approved
-> resume_token_issued
-> workflow_running
-> source_verified
-> completed
```

Modification path:

```text
approval_required
-> payload_modified
-> new_hash_created
-> modified_approved
-> resume_token_issued
-> workflow_running
```

Rejection path:

```text
approval_required
-> rejected
-> workflow_blocked
-> run_replanned_or_closed
-> eval_sampled
```

Clarification path:

```text
approval_required
-> clarification_requested
-> agent_reads_more_evidence
-> new_payload_or_no_action
```

Escalation path:

```text
approval_required
-> escalated
-> owner_notified
-> waiting_for_second_decision
-> resume_or_reject
```

## Approval Card

An approval card should show:

- action name
- exact arguments
- payload hash or stable preview ID
- policy reason
- data class
- side-effect class
- source evidence
- alternatives
- expected workflow result
- downstream notifications
- idempotency key
- expiration
- approver authority
- approve, modify, reject, clarify, and escalate controls

It should not hide arguments behind a natural-language summary.

## Handoff Contract

The agent runtime hands off to the approval service:

```json
{
  "run_id": "run-bed-1042",
  "tool_name": "reserve_bed",
  "policy_decision": "approval_required",
  "requested_payload": {
    "encounter_id": "E-1042",
    "bed_id": "T-418",
    "hold_minutes": 20
  },
  "source_refs": ["capacity_snapshot:cap-448", "constraint_summary:cs-991"],
  "risk_label": "PHI-adjacent write",
  "workflow_after_approval": "bed_hold_workflow:v5"
}
```

The workflow should resume only from the approval record:

```json
{
  "approval_id": "apr-bed-77",
  "decision": "approved",
  "approved_payload_hash": "sha256:...",
  "workflow_resume_token": "resume-bed-77",
  "idempotency_key": "run-bed-1042:reserve_bed:T-418"
}
```

The workflow should not resume from a model message.

## Real-Life Examples

### Healthcare Bed Hold

Action:

```text
reserve_bed(encounter_id=E-1042, bed_id=T-418, hold_minutes=20)
```

Why approval is required:

- PHI-adjacent context
- operational side effect
- live capacity change
- source-system reconciliation required

Modify example:

The charge nurse changes bed `T-418` to `T-421` and hold time from 20 to 15 minutes. The product creates a new payload hash and executes only the modified payload.

Rejected approval must not start the bed-hold workflow.

### Enterprise Scheduling

Action:

```text
send_customer_invite(recipients, slot, agenda, message)
```

Why approval is required:

- external communication
- calendar privacy
- customer-facing content
- timezone and recipient risk

Modify example:

The account owner adds an executive, changes the slot, and edits the agenda. The modified invite gets a new hash and delivery receipt.

### Support Resolution

Action:

```text
apply_credit_and_send_reply(ticket_id, account_id, amount, message)
```

Why approval is required:

- financial adjustment
- customer communication
- policy citation
- billing ledger side effect

Design note:

Credit approval and customer-message approval may be separate decisions. A manager may approve the message but reject the credit.

### Code-Change Agent

Action:

```text
merge_branch(repo, branch, merge_target, required_checks)
```

Why approval is required:

- source code mutation
- merge authority
- deploy authority may be separate
- failed checks must block execution

Design note:

Approving a patch is not the same as approving merge, and approving merge is not the same as approving deploy.

## Product Surfaces

| Surface | Approval behavior |
|---|---|
| Work object panel | Shows source evidence, proposed payload, alternatives, and uncertainty |
| Approval inbox | Queues pending approvals by owner, SLA, data class, and side effect |
| Channel notification | Links to approval card; does not become source of truth |
| Run timeline | Records approval requested, decided, expired, escalated, or rejected |
| Run console | Shows policy decision, payload hashes, resume token, workflow state |
| Audit export | Shows approver, decision, payload hash, action, resource, and result |

## Eval Cases

Minimum approval eval suite:

- vague approval text does not execute a hidden payload
- modified payload creates a new hash
- rejected approval never starts workflow
- clarification request never executes action
- escalation waits for required owner
- expired approval blocks resume
- approval from wrong role is denied
- workflow resumes only with valid token
- source-system mismatch prevents completed status
- duplicate retry uses idempotency key

## Industry Pattern Anchors

Useful patterns from current tooling:

- Vercel AI SDK human-in-the-loop patterns show app-level confirmation before tools continue.
- LangGraph interrupts show graph execution pausing for human input and resuming with state.
- Temporal workflow messages and signals show durable workflows receiving external decisions.
- OpenAI Agents SDK handoffs and guardrails show runtime-level delegation and safety concepts.

These are useful patterns, not complete product governance. The product still owns domain policy, exact approval records, audit, source truth, and release gates.

## Build Next

- Approval card schema.
- Approval inbox mock.
- Payload hash utility.
- Resume token API.
- Approval expiry job.
- Escalation routing table.
- Separate approval records for multi-side-effect actions.
- Rejected-approval eval dataset.
- Workflow tests proving no resume without approval.

## Key Takeaway

```text
The agent proposes.
Policy decides whether approval is required.
The human approves exact payloads.
The workflow resumes from approval records.
Audit proves what changed.
Evals prevent approval bypass regressions.
```
