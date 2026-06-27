# Subagent Handoff Simulator

Current as of 2026-06-27.

This note complements the interactive Subagent Handoff Simulator in `index.html`.

The core rule:

```text
Subagents do bounded specialist work.
The owner agent synthesizes.
Product policy still decides what may happen next.
```

A deep agent becomes hard to manage when every specialist can see everything, call every tool, and make final decisions. The safer pattern is scoped delegation.

## Handoff Shape

Every specialist handoff should have:

```text
owner_agent
specialist
work_object
task
allowed_tools
forbidden_actions
output_schema
source_refs_required
budget
return_contract
```

The specialist returns a structured result. The owner agent can synthesize that result, but it should not silently override policy, approval, verifier results, or source-system truth.

## Why This Matters

Subagents are useful because they let the system split long work:

- context resolution
- capacity ranking
- policy lookup
- calendar ranking
- billing evidence
- communication drafting
- repo inspection
- test verification
- source reconciliation

But subagents also increase risk:

- conflicting recommendations
- unclear ownership
- excessive tool access
- hidden side effects
- stale intermediate artifacts
- unreviewed specialist memory
- final synthesis that ignores policy

The handoff contract is the control boundary.

## Healthcare Bed Flow

Owner:

```text
bedflow-owner-agent
```

Specialists:

| Specialist | Task | Cannot do |
|---|---|---|
| Context resolver | Bind encounter, tenant, facility, role, and bed board | Rank or reserve beds |
| Capacity specialist | Rank beds from capacity, staffing, monitoring, isolation, and discharge evidence | Reserve a bed or override policy |
| Policy specialist | Check unit rules, isolation conflicts, and approval requirement | Approve or execute |
| Communication specialist | Draft unit notification with minimum necessary details | Send before approval |
| Verifier | Reconcile bed board, ADT, timeline, and audit | Complete based on model summary |

Flow:

```text
owner agent
-> context resolver
-> capacity specialist
-> policy specialist
-> owner synthesis
-> policy gateway
-> approval
-> workflow
-> verifier
```

The capacity specialist can say "T-418 is best." It cannot reserve T-418. The owner agent can propose `reserve_bed`. It still cannot execute it without policy, approval, workflow, and verification.

## Enterprise Scheduling

Specialists:

- attendee resolver
- calendar specialist
- agenda or communication specialist
- response monitor

The key control is external communication. A communication specialist may draft an invite, but the product should require approval before sending it to a customer.

## Support Resolution

Specialists:

- policy specialist
- billing specialist
- reply specialist
- verifier

The key control is ordering. The reply specialist should not send a customer message until the billing workflow confirms whether credit succeeded.

## Code-Change Agent

Specialists:

- repo specialist
- patch specialist
- test specialist
- review specialist

The key control is authority separation. A patch specialist can edit scoped files. A review specialist can prepare a merge proposal. Neither should merge or deploy without explicit approval and workflow checks.

## Handoff Record

Example:

```json
{
  "handoff_id": "handoff_bed_capacity",
  "owner_agent": "bedflow-owner-agent",
  "work_object": "encounter/E-1042",
  "specialist": "Capacity specialist",
  "task": "Rank beds using current capacity, monitoring need, isolation constraints, staffing, and discharge forecasts.",
  "allowed_tools": [
    "fetch_capacity_snapshot",
    "get_patient_constraints",
    "list_near_term_discharges"
  ],
  "output_schema": "CandidateRanking",
  "evidence_required": "Every ranking factor links to capacity or patient-constraint source.",
  "prohibited_authority": "Cannot reserve a bed or override placement policy.",
  "return_to_owner": true,
  "final_decision_owner": "owner_agent_plus_policy_gateway"
}
```

## Evals

Minimum subagent evals:

- specialist cannot call a tool outside its grant
- specialist output must match schema
- specialist output must include source references
- owner agent must detect conflicting specialist outputs
- owner agent must not bypass policy after specialist recommendation
- approval must bind to owner synthesis, not raw specialist text
- workflow must verify source state after execution
- specialist memory proposals require review before reuse

## Product UI

The user does not need to see every internal specialist step. But the product should expose enough to build trust:

- source-linked evidence bundle
- why a specialist result was used or rejected
- exact action preview
- confidence or uncertainty
- timeline events for major handoffs
- operator run console for full specialist traces

## Key Takeaway

```text
Subagents improve decomposition.
Handoff contracts preserve ownership.
Policy, approval, workflow, and verification still decide what becomes product state.
```
