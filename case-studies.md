# Case Studies

These case studies are pattern studies. The point is not to copy a vendor or a healthcare product. The point is to see how the same agent-native primitives change when the domain, risk, user interface, and source of truth change.

For current product and platform examples, use the companion [Industry pattern teardowns](industry-pattern-teardowns.md). It separates visible surfaces, hidden architecture layers, useful patterns, caveats, and evidence questions.

For deeper evidence-backed mapping from papers, standards, platform examples, records, failures, and release gates into adoption decisions, use the [Industry case architecture lab](industry-case-architecture-lab.md).

## 1. Healthcare Bed-Flow Command Center

Real-life pattern:

Hospital command centers and inpatient-flow products focus on patient flow, capacity, discharge prediction, operational bottlenecks, staffing constraints, and care coordination.

Agent-native lesson:

The agent should be embedded in the bed board, bed request workspace, approval inbox, and activity timeline. Voice is only an entry point.

Architecture:

```text
voice command
-> context binder
-> patient and capacity read tools
-> candidate bed ranking
-> approval for reservation
-> durable workflow
-> source-system reconciliation
-> timeline, audit, eval sample
```

Controls:

- PHI access checks.
- Approval for bed reservation.
- Durable workflow for notifications and transport.
- Source-system reconciliation before claiming completion.
- No durable patient PHI memory by default.

Build exercise:

Create a fake `reserve_bed` workflow where retry cannot duplicate a hold and a rejected approval never executes.

## 2. Enterprise Scheduling Coordinator

Real-life pattern:

Scheduling assistants coordinate across calendars, time zones, priority, invite text, and follow-up workflows.

Agent-native lesson:

The hard part is not finding an open slot. The hard part is coordinating context, preferences, external communication, and rescheduling when people decline.

Architecture:

```text
command
-> resolve attendees and account
-> read calendars
-> rank slots
-> draft agenda and invite
-> approval for external send
-> workflow monitors responses
```

Controls:

- PII handling.
- Calendar access boundaries.
- External message preview.
- Time-zone validation.
- Reschedule workflow.

Build exercise:

Create a `send_invites` preview that requires approval when any attendee is external.

## 3. Customer Support Resolution Agent

Real-life pattern:

CRM and service-management agents operate inside tickets, policies, entitlements, approvals, customer communication, and audit trails.

Agent-native lesson:

The agent should ground every recommendation in policy and make customer-facing messages reviewable.

Architecture:

```text
ticket command
-> bind customer and policy context
-> read account and invoice
-> draft resolution
-> request approval for credit or refund
-> send approved response
-> update ticket timeline
```

Controls:

- Customer data scope.
- Financial approval.
- Policy citation.
- Message preview.
- Audit trail.

Build exercise:

Create a refund case where the agent must refuse to issue credit until approval exists.

## 4. Work-Management Agent

Real-life pattern:

Work-management agents live inside issues, project spaces, pages, comments, and planning workflows.

Agent-native lesson:

The agent is useful when it updates structured work artifacts with source links and owner review, not when it only writes a detached summary.

Architecture:

```text
mention or comment
-> bind project and permissions
-> summarize source thread
-> draft issues and acceptance criteria
-> owner review
-> update board and decision log
```

Controls:

- Project permissions.
- Source attribution.
- Owner review.
- No silent priority changes.

Build exercise:

Convert a support escalation into draft engineering issues, but require an owner to approve issue creation.

## 5. Code-Change Agent

Real-life pattern:

Coding agents demonstrate planning, file inspection, tool use, testing, diff generation, review, and handoff.

Agent-native lesson:

Coding agents are a good analog for product agents because both need workspace state, tool permissions, evidence, review, and rollback.

Architecture:

```text
issue request
-> bind repo and write scope
-> inspect files
-> plan edits
-> modify files
-> run tests
-> produce diff summary
-> review before merge or deploy
```

Controls:

- Repo scope.
- Branch isolation.
- Test gate.
- Diff approval.
- Secret isolation.

Build exercise:

Create a simulated coding run where tests fail, the run does not mark complete, and the failure becomes an eval case.

## 6. Analytics and Research Agent

Real-life pattern:

Research and BI agents combine retrieval, metrics queries, computation, charting, provenance, and decision memo drafting.

Agent-native lesson:

The agent should produce inspectable analysis with sources, caveats, and review before operational decisions.

Architecture:

```text
question
-> bind metric definitions and access
-> query data
-> retrieve policy context
-> run analysis
-> generate chart and memo
-> human review
-> save verified insight
```

Controls:

- Data access scope.
- Query provenance.
- Statistical caveats.
- Review before operational change.
- Source-linked knowledge storage.

Build exercise:

Ask why discharge delays increased and require the agent to show metric definition, query source, chart, caveat, and recommended follow-up.

## Cross-Case Pattern

Across all cases, the recurring shape is:

```text
work surface
-> context binding
-> agent reasoning
-> typed tools
-> policy and approvals
-> durable workflow when needed
-> product state
-> timeline and audit
-> eval feedback
```

The implementation changes by domain, but the platform primitives stay stable.
