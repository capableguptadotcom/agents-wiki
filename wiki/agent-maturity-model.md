# Agent Maturity Model

Current as of 2026-06-27.

This note defines a practical maturity model for deciding when an enterprise agent can move from suggestion to approval-gated drafting, supervised execution, or policy-bounded autonomy.

The purpose is not to make autonomy feel inevitable. The purpose is to make every autonomy increase evidence-based.

## Autonomy Levels

| Level | Name | What the agent can do | Evidence required |
|---|---|---|---|
| 0 | No agent | Deterministic workflow only | Normal product tests |
| 1 | Suggest only | Recommend, summarize, explain, and ask clarifying questions | Source links, visible work surface, correction path |
| 2 | Draft with approval | Prepare exact action payloads for human approval | Typed tools, policy decisions, approval record, audit, rejected-approval tests |
| 3 | Supervised execution | Execute bounded workflows with review checkpoints | Durable workflow, idempotency, cancellation, source reconciliation, incident-ready observability |
| 4 | Policy-bounded autonomous | Execute low-risk actions inside strict policy and monitoring limits | Proven evals, low-risk tool class, canary, rollback, monitoring, incident playbook |
| 5 | Broad autonomy | Broad unsupervised execution | Usually not appropriate for regulated enterprise workflows |

## Maturity Dimensions

The matrix scores each scenario across ten product dimensions.

| Dimension | Why it matters | Example evidence |
|---|---|---|
| Work surface | Users need to see the agent where work happens | Timeline, source links, action preview, correction path |
| Context binding | The right object and authority must be bound before reasoning | ContextManifest, ambiguity tests, scoped claims |
| Tools and skills | Tools execute; skills instruct | Tool registry, schemas, side-effect class, tool-choice evals |
| Policy gateway | Security lives outside the model | PolicyDecision records, denied-call tests, injection tests |
| Approval and handoff | Human review must apply to exact payloads | Approval record, payload hash, resume token |
| Durable workflow | Real side effects need recovery | Workflow history, idempotency proof, compensation path |
| Product state | The source system remains authoritative | Domain event, source response, reconciliation state |
| Memory governance | Memory affects future behavior | Source, scope, owner, data class, retention, correction path |
| Observability | Different audiences need different evidence | Trace, audit, timeline, metrics, redaction policy |
| Evals and release | Improvement must be controlled | Eval report, release bundle, canary, rollback |

## Promotion Rule

Before increasing autonomy, ask:

```text
What new actions can the agent take?
What new data can it see?
What new side effects can it cause?
What new failure would hurt users, compliance, money, or operations?
What evidence proves that failure is controlled?
```

If the evidence is weak, keep the agent at the lower autonomy level and improve the missing dimension.

## Scenario Examples

### Healthcare Bed Flow

Current natural target: Level 2, draft with approval.

Why:

- The action touches PHI-adjacent operational state.
- The source system must remain authoritative.
- A bed hold affects patient flow and downstream teams.

Promotion blockers for Level 3:

- Durable workflow must prove retry, cancellation, compensation, and reconciliation.
- Observability must separate trace, audit, and user timeline.
- Release bundle must gate isolation, telemetry, source mismatch, duplicate retry, and rejected approval cases.

### Enterprise Scheduling

Current natural target: Level 1 or Level 2 depending on external communication risk.

Why:

- Calendar reads can leak private context.
- External invites create customer-facing communication.
- Rescheduling can become long-running workflow.

Promotion blockers:

- External-send policy and approval need exact payload design.
- Workflow needs accept, decline, no-response, and reschedule branches.
- Timezone and attendee-conflict evals need to become release gates.

### Support Resolution

Current natural target: Level 2, draft with approval.

Why:

- The agent can draft policy-grounded resolutions.
- Financial adjustments and customer messages need review.

Promotion blockers:

- Multi-system workflow must apply credit, send message, update ticket, and verify billing state.
- Policy-edge evals must block release.
- Customer facts should stay in source systems, not durable memory.

### Code-Change Agent

Current natural target: Level 3, supervised execution.

Why:

- The agent can inspect files, edit, run tests, and produce a diff.
- Merge and deploy should remain approval-gated.

Promotion blockers:

- Secret protection and destructive-command policy need explicit enforcement.
- Merge and deploy approval should be separate exact payloads.
- Review comments and failed tests should become regression cases.

## Deep-Dive Queue

Use the interactive maturity matrix to prioritize deeper work.

Common next dives:

- Work-surface UX and timeline.
- ContextManifest schema.
- Tool registry and side-effect classes.
- Policy gateway and denied-call tests.
- Approval payload schema and resume tokens.
- Durable workflow state machine.
- Source-system reconciliation.
- Memory center and use audit.
- Trace, audit, timeline, and redaction policy.
- Release bundle and trajectory eval format.
