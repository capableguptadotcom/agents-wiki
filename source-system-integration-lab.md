# Source-System Integration Lab

Current as of 2026-06-27.

The interactive source-system lab in [index.html](index.html#source-systems) turns a vague rule into a concrete engineering rule:

```text
Every agent-visible field needs an authoritative source.
```

The agent can reason, draft, rank, clarify, and coordinate. It should not become the system of record for patient state, calendar state, customer account state, billing state, repository state, review state, or deployment state.

For who is allowed to read or write each source, and which credential or approval proves it, use [Identity and access lab](identity-access-lab.md).

For where source adapters, workflow events, tool gateways, control-plane grants, and observability services sit in a deployable topology, use [Deployment topology lab](deployment-topology-lab.md).

## The Core Contract

For each field the agent sees or changes, define:

- authoritative source
- standard or API anchor
- read adapter
- write path
- cache rule
- policy scope
- reconciliation check
- failure to prevent
- records that prove the boundary held

If a product team cannot answer those items, the agent is likely reasoning over vague context.

## Integration Contract Record

Example for healthcare bed availability:

```json
{
  "contract_id": "source_bed_bed_availability",
  "agent_id": "bedflow-agent",
  "domain_field": "candidate beds, bed status, unit, location, equipment, hold state",
  "authoritative_source": "Bed board, ADT, location service",
  "standard_or_api_anchor": "FHIR Location plus local bed-management state",
  "read_adapter": "fetch_capacity_snapshot and list_candidate_beds",
  "write_path": "reserve_bed workflow writes through bed-board adapter after approval",
  "cache_rule": "snapshot is advisory; re-read immediately before write",
  "policy_scope": "facility and unit scope, side-effect classification, idempotency key",
  "reconciliation_check": "read-after-write confirms bed held for encounter E-1042",
  "failure_to_prevent": "Agent claims completion while bed board still shows the bed available.",
  "records_to_link": ["ToolCall", "WorkflowEvent", "ReconciliationRecord"]
}
```

## Healthcare Bed Flow

User request:

```text
Book a monitored bed for this ED patient.
```

Field map:

| Field | Authoritative source | Agent use |
|---|---|---|
| Encounter identity | EHR and ADT | Bind selected patient and active encounter before reasoning |
| Care constraints | EHR, ADT, placement policy | Rank candidate beds using current clinical and operational constraints |
| Bed availability | Bed board, ADT, location service | Read candidate beds and write hold only through approved workflow |
| Staffing capacity | Staffing roster, command center, transport system | Avoid operationally impossible recommendations |
| Placement policy | Policy KB and capacity-ops owner notes | Cite current policy and propose owner-reviewed memory only when appropriate |

FHIR and SMART help shape the boundary:

- [FHIR Encounter](https://hl7.org/fhir/encounter.html) anchors the care interaction and patient movement context.
- [FHIR Location](https://hl7.org/fhir/location.html) can represent facilities, units, rooms, beds, and operational status.
- [FHIR Task](https://hl7.org/fhir/task.html) can model operational work such as transport or follow-up tasks.
- [SMART App Launch](https://hl7.org/fhir/smart-app-launch/) anchors launch context and scoped FHIR access.
- [HIPAA Security Rule guidance](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html) anchors access, audit, integrity, and transmission safeguards for ePHI.

Important:

```text
FHIR gives resource shape.
It does not decide hospital placement policy, approval authority, or bed-board reconciliation semantics.
```

## Other Product Patterns

### Scheduling

Authoritative systems:

- CRM for account context
- calendar provider for live availability and event IDs
- directory for internal identities
- user-approved memory for editable preferences

Key rule:

```text
Memory may personalize the draft, but live calendar availability overrides memory.
```

### Support

Authoritative systems:

- ticketing system for case state
- billing ledger for invoices, credits, refunds, and balance
- policy KB for entitlement rules
- messaging provider for customer delivery state

Key rule:

```text
The ticket should not close until billing and messaging systems confirm their side effects.
```

### Coding Agent

Authoritative systems:

- repository for source state
- CI for verification state
- PR/review system for approval state
- secret manager and scanners for sensitive values

Key rule:

```text
The agent summary is not proof. Branch state, diff, tests, review, and CI are proof.
```

## Cache Rules

Not every source can be treated the same way.

| Source type | Cache stance |
|---|---|
| Patient, bed, calendar, billing, or branch state | Short-lived; refresh before side effects |
| Policy documents | Cache by version; invalidate on publication |
| User preferences | Retrieve through memory policy; deletion blocks future retrieval |
| CI results | Bind to exact commit, command, and artifact |
| Approval payloads | Immutable after approval request; changes create new hash |

Bad pattern:

```text
The model saw it earlier, so it is still true.
```

## Reconciliation

Every side effect needs a source confirmation path:

```text
approved payload
-> durable workflow
-> source-system write
-> read-after-write or provider acknowledgement
-> product state update
-> user timeline
-> audit and trace correlation
```

If confirmation fails, the product state should be:

```text
needs_reconciliation
```

not:

```text
completed
```

## Design Questions

- Which system owns each field?
- Which fields are read-only?
- Which writes require approval?
- Which writes require idempotency?
- Which fields can be cached?
- Which fields must be refreshed before a side effect?
- Which source response proves success?
- Which source mismatch blocks completion?
- Which records link the run, source response, workflow, audit, and timeline?
- Which fields must never become durable memory?

## Key Takeaway

```text
Agent-native products are integration products.
The agent coordinates work across sources.
The sources still own truth.
```
