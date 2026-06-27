# Architecture Decisions

Current as of 2026-06-27.

This note turns the wiki's research, standards, case studies, and simulator into architecture decision records for an agent-native product.

Use [Design philosophy lab](design-philosophy-lab.qmd) as the pre-ADR quality gate. A boundary should not become an ADR until it hides real complexity, owns an invariant, and has a proof test.

The core rule:

```text
Do not copy a platform pattern directly.
Convert every source into a product boundary decision.
Then require evidence before increasing autonomy.
```

## ADR Template

Use this lightweight template for each decision:

```text
# ADR: <boundary>

Status:
Owner:
Scenario:

## Decision
What we will build or enforce.

## Context
Why the decision exists and what failure it prevents.

## Adopt
The concrete design choices we are accepting.

## Reject
The tempting alternatives we are explicitly not accepting.

## Evidence Required
The records, tests, traces, audits, evals, or UI behavior that prove the decision works.

## Scenario Translation
How this decision appears in bed flow, scheduling, support, or coding-agent workflows.

## Source Anchors
The papers, standards, protocols, or product examples that influenced the decision.
```

## Decision Set

These are the first decisions the product should make explicit.

| Decision | Adopt | Reject | Evidence |
|---|---|---|---|
| Module depth | Deep modules with narrow interfaces, hidden implementation details, owned invariants, and proof tests | Shallow wrappers around prompts, tools, memory, or workflow steps | Module-depth review record and boundary eval |
| Work surface | Agent appears inside the source work object | Detached chat as source of truth | Timeline, action preview, correction path |
| Context binding | Resolve user, tenant, role, object, channel, and scopes before reasoning | Model infers authority from chat text | ContextManifest and ambiguity tests |
| Tools and skills | Skills teach; tools execute typed product APIs | Prompt-only hidden capability | Tool registry, ToolCall records, tool-choice evals |
| Policy gateway | Policy checks run outside the model | System prompt as authorization | PolicyDecision records and denied-call tests |
| Approval and handoff | Human approves exact payload | Vague approval of intent | Approval record, payload hash, resume token |
| Durable workflow | Side effects, waits, retries, and compensation live in workflow | Critical state inside model loop | Workflow history and idempotency proof |
| Memory governance | Memory is sourced, scoped, classified, retained, correctable, and auditable | Automatic durable memory from self-reflection | MemoryItem record and memory-use evals |
| Observability | Trace, audit, and timeline stay separate but correlated | One log stream for every audience | Correlated IDs and redaction policy |
| Evals and release | Behavior ships through pinned release bundles | Silent prompt/model/tool drift | Eval report, release bundle, canary, rollback |

## Scenario Translation

### Healthcare Bed Flow

The bed-flow case is the strictest example because it combines PHI, operational state, source-system truth, and human accountability.

Minimum decisions:

- The work surface is the bed board or selected encounter, not a detached assistant.
- The context binder resolves encounter, facility, role, tenant, current location, and source-system scopes.
- The agent can read capacity and constraints, but `reserve_bed` is a write tool behind policy and approval.
- The workflow owns reservation, notification, transport task creation, retries, and reconciliation.
- Patient-specific facts are read per run and not stored as durable agent memory by default.

### Enterprise Scheduling

The scheduling case is about privacy, preferences, external communication, and follow-up.

Minimum decisions:

- The work surface is the account workspace, calendar sidebar, or command bar.
- The context binder resolves attendees, account, purpose, time window, and time zones.
- Calendar reads are scoped and minimized.
- External invites require preview and approval.
- The workflow monitors accepts, declines, no-response states, and rescheduling.

### Support Resolution

The support case is about policy grounding, financial authority, and customer communication.

Minimum decisions:

- The work surface is the ticket.
- The context binder resolves ticket, account, entitlement, invoice, SLA, and policy.
- The agent can draft a resolution but cannot issue credit without financial approval.
- Customer-facing messages are reviewed before sending.
- Rejected or modified approvals become eval cases.

### Code-Change Agent

The coding case is a useful analog for product agents because it exposes workspace state, tools, tests, review, and rollback.

Minimum decisions:

- The work surface is the issue, repo run, diff review, and test result surface.
- The context binder resolves repo, branch, issue, allowed paths, and test command.
- The agent can inspect, edit, and run tests inside scope.
- Merge and deploy require explicit review.
- Failed tests and review comments become regression cases.

## Combination Rule

No single decision is enough.

The decisions must connect in this order:

```text
work surface
-> context binding
-> tools and skills
-> policy gateway
-> approval
-> durable workflow
-> product state
-> memory governance
-> observability
-> evals and release
```

If any link is missing, the system becomes either a demo, a risky automation, or an ungoverned prompt script.

## Evidence Ladder

Use this ladder before increasing autonomy:

1. Suggest only.
   Evidence: source-linked recommendations and user correction path.
2. Draft with approval.
   Evidence: exact payload preview, approval record, audit, and rejected-approval tests.
3. Supervised execution.
   Evidence: workflow recovery, idempotency, policy denials, and state reconciliation.
4. Policy-bounded autonomous execution.
   Evidence: low-risk tool class, strong evals, monitoring, rollback, and incident playbook.
5. Broad autonomy.
   Evidence requirement is usually too high for regulated enterprise workflows.

## Next Deep Dives

- Convert each decision into a formal ADR.
- Add JSON schemas for ContextManifest, ToolCall, PolicyDecision, Approval, WorkflowEvent, MemoryItem, AuditEvent, EvalCase, and ReleaseBundle.
- Build a test harness that replays one decision failure at a time.
- Add UI wireframes for work surface, approval, memory center, run timeline, and release gate.
- Use the [Agent maturity model](agent-maturity-model.md) to score each agent capability before increasing autonomy.
