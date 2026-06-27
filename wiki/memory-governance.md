# Memory Governance

Current as of 2026-06-27.

Memory is not one feature. It is a set of product data classes with different risks, owners, lifecycles, and user controls.

The core rule:

```text
Memory may influence future behavior, so memory writes are product mutations.
```

Do not treat memory as a hidden prompt cache. Treat it as governed data with source, scope, owner, retention, correction, deletion, use audit, and eval coverage.

Companion artifact:

- [Memory lifecycle simulator](memory-lifecycle-simulator.md) walks through the concrete proposal-to-active-memory flow, including proposal records, owner review, release gates, runtime retrieval, use audit, correction, and quarantine.

## Memory Classes

| Class | What it is | Default decision | Control |
|---|---|---|---|
| Run state | Temporary execution state for one run | Store temporarily | Tied to `AgentRun`, never reused as knowledge |
| Conversation memory | Short-horizon context for the current interaction | Expire quickly | User-visible transcript or session context |
| User preference | Stable preference chosen by a user | Allow with consent | Memory center, edit, delete, use audit |
| Team or organization rule | Operational rule affecting many users | Require owner review | Version, source, approval, expiry, release gate |
| Source-linked knowledge | Indexed source documents or records | Keep source-owned | Cite source, freshness, permission, retrieval audit |
| Prohibited memory | Sensitive, unsupported, stale, or unsafe durable context | Reject or redact | Rejection audit, quarantine, eval case |

## Why Memory Is Hard

Memory changes the next run.

That means a small mistake can silently spread:

- a patient-specific fact affects future bed assignment
- a private calendar title leaks into a customer invite
- a customer fraud signal becomes hidden support context
- a repo secret is reused as coding-agent context
- a stale finance threshold continues after policy changes
- an inferred preference applies to the wrong user or tenant

The product should assume memory is unsafe until classified.

## Lifecycle

```text
observe candidate
-> classify
-> source and scope
-> policy decision
-> user or owner review
-> store with retention
-> retrieve with matching scope
-> show use reason
-> audit use
-> correct, delete, expire, or quarantine
-> add eval case when something goes wrong
```

### 1. Observe Candidate

A candidate memory can come from:

- explicit user request
- repeated user edit
- approved workflow correction
- incident review
- owner-approved policy update
- reviewed support or clinical operations pattern
- repo review comment

Bad source:

```text
The model reflected on itself and decided this should be remembered.
```

Self-reflection can propose a candidate. It should not directly write durable memory.

### 2. Classify

Every candidate needs classification:

```json
{
  "candidate": "User prefers 45-minute QBRs",
  "memory_class": "user_preference",
  "scope": "user:user-118",
  "data_class": "PII-light",
  "source_ref": "run-sch-884",
  "owner": "user-118",
  "approval_status": "proposed",
  "retention": "180 days",
  "prohibited_fields": ["private calendar titles", "customer confidential notes"]
}
```

If classification is uncertain, the memory should remain proposed or rejected.

### 3. Review

Different memory classes need different reviewers:

| Memory class | Reviewer |
|---|---|
| User preference | User |
| Team preference | Team admin or owner |
| Organization rule | Domain owner and risk owner |
| Healthcare operational rule | Capacity owner, compliance route if PHI-adjacent |
| Support policy memory | Policy owner or finance owner |
| Repo convention | Repo maintainer |
| Prohibited memory | Not normally approvable |

Approval must be on the exact memory content, scope, retention, and source.

### 4. Store

Minimum `MemoryItem` fields:

```text
memory_id
memory_class
status
content
source_ref
source_type
scope
owner_id
data_class
retention_until
created_by
approved_by
created_at
updated_at
supersedes_memory_id
policy_version
release_bundle_id
```

Important:

```text
Memory is not source truth.
```

Current patient, customer, calendar, billing, repository, or bed-board state should be read from source systems during the run.

### 5. Retrieve

Retrieval should pass a policy gate:

```text
tenant match
user or owner scope match
work-object type match
agent version allowed
memory class allowed
data class allowed
not expired
not quarantined
source still valid
use reason visible
```

The model should not pull every memory item just because vector search says it is similar.

### 6. Use Audit

Every meaningful memory use should record:

```text
memory_use_id
memory_id
run_id
agent_id
agent_version_id
retrieval_reason
visible_explanation
downstream_tool_or_draft
policy_decision
created_at
```

This lets the product answer:

- Which runs used this bad memory?
- Which customer messages did it affect?
- Which bed recommendations did it influence?
- Which users saw this memory?
- Did deletion stop future use?

### 7. Correct, Delete, Expire, Quarantine

Users and owners need controls:

- edit
- delete
- reject proposed memory
- shorten retention
- narrow scope
- view use history
- quarantine memory item
- disable memory class
- replay affected evals

Deletion should affect retrieval. Audit records may remain for compliance depending on policy.

## Real-Life Scenario Patterns

### Healthcare Bed Flow

Candidate:

```text
Telemetry unit wants charge-nurse escalation after a bed hold waits 10 minutes.
```

Allowed path:

- classify as organization operational preference
- source to run, policy note, or owner correction
- approve by capacity-ops owner
- scope to facility and unit
- expire or review periodically
- audit each use

Blocked memory:

- durable patient PHI
- inferred diagnosis
- current bed availability
- live staffing state

Why:

These belong in EHR, ADT, bed board, or staffing source systems, not agent memory.

### Enterprise Scheduling

Candidate:

```text
User prefers 45-minute QBRs with a metrics, risks, next-steps agenda.
```

Allowed path:

- classify as user preference
- require user confirmation
- show in memory center
- allow edit/delete
- use only for matching meeting type

Blocked memory:

- private calendar titles
- unrelated attendee notes
- customer confidential detail copied from a call

### Support Resolution

Candidate:

```text
Billing disputes over stale invoice credits should route to finance review.
```

Allowed path:

- classify as policy knowledge proposal
- require support policy owner approval
- link to source KB
- version with expiry
- still require financial approval for side effects

Blocked memory:

- hidden customer facts
- fraud signals
- another customer's billing state
- stale refund threshold

### Code-Change Agent

Candidate:

```text
Workflow simulator changes require npm test before review.
```

Allowed path:

- classify as repo convention
- require repo maintainer approval or source file link
- scope to repository and branch policy
- expose in coding run notes
- replace when tests or build system changes

Blocked memory:

- secrets
- credentials
- proprietary source snippets without need
- unreviewed architectural guesses

## Memory Versus Related Concepts

| Concept | Durable? | Source truth? | Who controls it? |
|---|---|---|---|
| Run state | No | No | Run lifecycle |
| Conversation context | Short-lived | No | Current user/session |
| Memory item | Yes | Usually no | User, team, owner, policy |
| Source document | Yes | Often yes | Source owner |
| Retrieved context | No | Reference only | Retrieval and policy layer |
| Reflection note | Proposed only | No | Review and eval process |
| Skill | Release artifact | No | Agent/platform owner |
| Eval case | Yes | Test evidence | Eval owner |

## Bad Patterns

- Auto-writing memory from every conversation.
- Storing current source-system state as memory.
- Letting vector similarity ignore tenant, user, data class, or work-object scope.
- Hiding memory use from users.
- Treating deletion as UI-only while retrieval still sees the item.
- Mixing user preferences, organization rules, and source facts in one store.
- Allowing memory to bypass approval, policy, or tool rules.
- Shipping memory behavior without bad-memory evals.

## Evals

Minimum memory eval suite:

- prohibited PHI memory is rejected
- private calendar detail is rejected
- customer fact is not copied into durable support memory
- source-system truth overrides memory
- deleted memory is not retrieved
- wrong-scope memory is denied
- expired memory is not retrieved
- quarantined memory is not retrieved
- memory use appears in user-visible reason and audit
- bad memory incident can identify affected runs

## Build Next

- Memory classification schema.
- Memory center UI.
- Retention and expiry jobs.
- Quarantine flow.
- Delete and export flow.
- Bad-memory eval dataset.
- Replay tool for runs affected by one memory item.

## Key Takeaway

```text
Use memory for stable, reviewed, scoped context.
Use source systems for facts.
Use evals for learning.
Use release bundles for behavior change.
```
