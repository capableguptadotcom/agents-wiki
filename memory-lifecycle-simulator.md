# Memory Lifecycle Simulator

Current as of 2026-06-27.

The interactive memory lifecycle lab in [index.html](index.html#memory-governance) shows the missing operational piece behind "agent memory":

```text
memory proposal != active memory
```

A proposal is evidence that something might be useful later. Active memory is governed product data that can influence future runs. The gap between those two states is where most real product risk lives.

## Why This Matters

Research systems often show agents improving through reflection, memory, or skill acquisition. Product systems need stricter boundaries:

- who proposed the memory
- which run, source, correction, or incident produced it
- which data class it contains
- who owns the memory
- where it may be reused
- which source system remains authoritative
- how a user sees, edits, deletes, or exports it
- which evals must pass before activation
- which future runs used it
- how bad memory is quarantined or superseded

Without this lifecycle, memory becomes hidden policy.

## Product Architecture

```text
AgentRun
-> post-run learning queue
-> MemoryProposal
-> memory policy classifier
-> owner review
-> eval and release gate
-> MemoryItem
-> runtime retrieval policy
-> MemoryUseAudit
-> correction, deletion, expiry, quarantine
-> eval case and release review
```

The model may suggest a candidate. It should not directly write durable product memory.

## Core Records

### MemoryProposal

Use for proposed context that is not active yet.

```json
{
  "proposal_id": "memprop-sch-884",
  "source_run_ids": ["run-sch-884"],
  "proposed_content": "User prefers 45-minute QBRs with metrics, risks, and next steps.",
  "source_ref": "approved-invite-edit:run-sch-884",
  "scope": "tenant:acme/user:user-118/meeting_type:QBR",
  "data_class": "user-preference",
  "owner": "user-118",
  "reviewer": "user-118",
  "retention": "180 days or until user deletion",
  "status": "proposed",
  "allowed_uses": ["draft QBR duration", "pre-fill agenda sections"],
  "blocked_uses": ["copy private calendar titles", "apply to another user"]
}
```

### MemoryItem

Use only after review, release, and eval gates.

```json
{
  "memory_id": "mem-user-118-qbr-v3",
  "proposal_id": "memprop-sch-884",
  "status": "active",
  "source_ref": "approved-invite-edit:run-sch-884",
  "scope": "tenant:acme/user:user-118/meeting_type:QBR",
  "owner": "user-118",
  "retention": "180 days or until user deletion",
  "release_bundle_id": "scheduling-agent:release-memory-v1",
  "use_audit_required": true
}
```

### MemoryUseAudit

Use for every meaningful retrieval that influences a draft, recommendation, route, or action.

```json
{
  "memory_use_id": "memuse-1021",
  "memory_id": "mem-user-118-qbr-v3",
  "run_id": "run-sch-1021",
  "retrieval_reason": "matching user and meeting type",
  "visible_explanation": "Using your saved QBR preference.",
  "downstream_tool_or_draft": "draft_calendar_invite",
  "policy_decision": "allowed"
}
```

## Stage Mechanics

### 1. Observe

Candidate sources:

- explicit user instruction
- repeated user correction
- reviewed incident
- owner-approved policy update
- approved workflow correction
- maintainer review comment
- post-run evaluation evidence

Bad source:

```text
The model thought this looked useful and wrote it to memory.
```

Self-reflection may create a candidate, not an active item.

### 2. Classify

Classify:

- memory class
- data class
- source reference
- scope
- owner
- reviewer
- retention
- allowed uses
- blocked uses
- source of truth

If classification is uncertain, keep the item proposed or reject it.

### 3. Review

Approval must cover the exact content, source, scope, retention, and allowed uses. The reviewer changes by class:

| Memory class | Reviewer |
|---|---|
| User preference | User |
| Team preference | Team owner |
| Organization rule | Domain owner and risk owner |
| Healthcare operational preference | Capacity owner, with compliance path if PHI-adjacent |
| Support policy route | Support policy owner and finance owner |
| Repo convention | Maintainer or CODEOWNERS path owner |
| Prohibited memory | Reject, redact, or incident-review only |

### 4. Activate

Activation should be a release event:

- memory item version created
- release bundle records behavior change
- bad-memory eval suite passes
- retrieval policy recognizes the new item
- rollback or quarantine path exists

Do not let memory change behavior outside the release lifecycle.

### 5. Use

Runtime retrieval should check:

- tenant match
- user, team, unit, queue, or repo scope
- work-object type
- data-class permission
- agent version
- memory status
- retention and expiry
- source still valid
- quarantine status
- visible reason requirement

Similarity search is not enough. Retrieval is a policy decision.

### 6. Correct

Correction paths:

- edit
- delete
- narrow scope
- shorten retention
- supersede with a new version
- quarantine immediately
- disable a memory class
- list affected runs
- replay evals

Bad memory should create an eval case. Otherwise the system learns only through anecdotes.

## Case Patterns

### Healthcare Bed Flow

Allowed:

```text
Telemetry unit wants charge-nurse escalation after a bed hold waits 10 minutes.
```

This can become a unit-scoped operational preference after capacity-owner review.

Blocked:

- durable patient PHI
- inferred diagnosis
- live bed availability
- live staffing state

Reason:

EHR, ADT, bed board, and staffing systems remain source truth. Memory can guide workflow preference, not medical or operational facts.

### Enterprise Scheduling

Allowed:

```text
User prefers 45-minute QBRs with metrics, risks, and next steps.
```

This can become a user-scoped preference after visible confirmation.

Blocked:

- private calendar titles
- unrelated attendee notes
- customer confidential details copied from a call
- cross-user reuse

### Support Resolution

Allowed:

```text
Billing disputes over stale invoice credits should route to finance review.
```

This can become source-linked policy guidance while the KB remains authoritative.

Blocked:

- customer account facts
- fraud signals
- stale refund thresholds
- another customer's billing state

### Code-Change Agent

Allowed:

```text
Workflow simulator changes require npm test before review.
```

This can become a repo-scoped convention after maintainer approval and source checks.

Blocked:

- secrets
- credentials
- long proprietary snippets
- unreviewed architectural guesses

## Paper And Standards Anchors

Use papers for architecture primitives:

- [Reflexion](https://arxiv.org/abs/2303.11366): feedback and episodic memory can improve repeated attempts, but bad feedback creates bad memory.
- [Generative Agents](https://arxiv.org/abs/2304.03442): memory streams, reflection, retrieval, and planning should be separated in product architecture.
- [MemGPT](https://arxiv.org/abs/2310.08560): long-context agents need explicit memory management, not unlimited prompt stuffing.
- [CoALA](https://arxiv.org/abs/2309.02427): cognitive-agent memory distinctions map well to product data classes, but product governance must be added.

Use standards and guidance for controls:

- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework): govern, map, measure, and manage memory risk across the lifecycle.
- [NIST AI 600-1](https://doi.org/10.6028/NIST.AI.600-1): treat provenance, privacy, information integrity, and misuse as GenAI-specific risks.
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/): memory must defend against injection, poisoning, sensitive disclosure, excessive agency, and vector/retrieval weaknesses.
- [Anthropic Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents): keep agentic systems composed from clear workflows and explicit tools instead of opaque autonomy.
- [LangGraph memory concepts](https://docs.langchain.com/oss/python/concepts/memory): semantic, episodic, and procedural memory are useful concepts, but enterprise products still need ownership, retention, audit, and correction.

## Design Review Questions

- Can a user tell what was remembered?
- Can an owner tell why it was remembered?
- Can security tell what data class it contains?
- Can runtime policy prove the scope match?
- Can the product show which future runs used it?
- Can deletion stop future retrieval?
- Can quarantine happen faster than a normal release?
- Can bad memory create a regression eval?
- Can source systems override memory every time?

## Implementation Slice

For a first build, implement only one durable memory class:

```text
user-scoped scheduling preference
```

Minimum slice:

- post-run proposal from repeated user edits
- confirmation card
- `MemoryProposal` table
- `MemoryItem` table
- `MemoryUseAudit` table
- memory center with edit and delete
- retrieval policy gate
- visible reason in invite draft
- deleted-memory eval
- cross-user leakage eval
- private-calendar-title rejection eval

Then repeat the pattern for team rules, organization rules, healthcare operational preferences, support policy routes, and repo conventions.

## Key Takeaway

```text
Memory is not a prompt optimization.
Memory is governed product data with a lifecycle.
```
