---
title: "Enterprise Agents Wiki"
subtitle: "Product architecture for governed AI agents."
---

Build agents as product actors, not chat widgets.

[System diagrams](system-diagram-spine.md)
[Research standard](research-operating-system.md)

## Context

The product invariant:

```text
Agent coordinates.
Product authorizes.
Workflow executes.
Source confirms.
Audit records.
Eval gates release.
```

The architecture starts when an intent becomes a governed product run:

```text
intent
-> AgentRun
-> ContextManifest
-> AccessDecision
-> ToolCall preview
-> PolicyDecision
-> Approval
-> WorkflowRun
-> SourceResponse
-> VerificationResult
-> TimelineEvent + AuditEvent
-> EvalCase
```

## First Slice

Use a fake bed-reservation flow. It is concrete enough to expose the hard parts without needing a live hospital system.

| Step | Required proof |
|---|---|
| Bind request | selected encounter, tenant, actor, role, source freshness |
| Check authority | user grants, agent grants, connector grants, source ACL |
| Gather evidence | source references with timestamps and data class |
| Propose action | exact `reserve_bed` payload before execution |
| Gate policy | allow, deny, clarify, or approval-required decision |
| Approve | payload hash, approver, expiry, resume token |
| Execute | durable workflow with idempotency key |
| Verify | source-system confirmation or `needs_reconciliation` |
| Learn | eval case or reviewed memory proposal, never silent mutation |

## Read Order

| Page | Use it for |
|---|---|
| [System diagram spine](system-diagram-spine.md) | Canonical ERD, state machine, sequence, topology, correlation, and policy flow. |
| [Architecture blueprint](architecture-blueprint.md) | Layer boundaries and the minimum product architecture. |
| [Implementation lab](implementation-lab.md) | API, schema, event, and error-contract work queue. |
| [Runtime ledger](runtime-ledger.md) | Run state, correlation IDs, timeline, audit, trace, and eval records. |
| [Approval handoff](approval-handoff.md) | Human approval as a payload-bound product record. |
| [References](references.md) | Source inventory; still needs claim-level citations. |

## Current Standard

Accepted pages must contain:

| Requirement | Meaning |
|---|---|
| Boundary | What this page owns and what it does not own. |
| Contract | Schema, API, state machine, event, or invariant. |
| Evidence | Claim-level source or explicit assumption. |
| Failure mode | At least one negative path. |
| Release test | What blocks promotion. |

## Next Work

| Priority | Output |
|---|---|
| 1 | Convert `references.md` into a claim-level source registry. |
| 2 | Turn `implementation-lab.md` into JSON Schemas and API contracts. |
| 3 | Define deterministic grant resolution in identity and capability pages. |
| 4 | Specify approval payload hashing, expiry, modification, and resume semantics. |
| 5 | Define eval fixtures and trajectory assertions for release gating. |
