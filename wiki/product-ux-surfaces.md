# Product UX Surfaces

Current as of 2026-06-27.

This note explains the user-facing surfaces an agent-native product needs. The main point is simple:

```text
Chat, voice, and Slack are entry points.
The product work object is the control surface.
The source system remains the system of record.
```

## Surface Map

For the deeper approval and resume model behind the approval card, see [Approval handoff](approval-handoff.md).

For the intake route that binds utterance, work object, identity, candidate tools, policy, clarification, approval, and workflow handoff, see [Intent to action router](intent-to-action-router.md).

For the record lifecycle behind the memory center, see [Memory lifecycle simulator](memory-lifecycle-simulator.md).

| Surface | User purpose | Behind-the-scenes records |
|---|---|---|
| Intake | Start or clarify a request | AgentRun, ContextManifest, TimelineEvent |
| Work object panel | Inspect source evidence, draft, alternatives, and uncertainty | AgentStep, ToolCall, SourceReference, DraftArtifact |
| Approval card | Approve, modify, reject, clarify, or escalate exact action payload | Approval, PolicyDecision, PayloadHash, AuditEvent |
| Timeline | Understand current status and what happened | TimelineEvent, WorkflowEvent, DomainEvent |
| Memory center | Inspect, approve, correct, delete, and audit memory | MemoryItem, MemoryUseAudit, RetentionPolicy |
| Run console | Debug, audit, replay, pause, disable, or escalate | TraceSpan, AuditEvent, EvalCase, ReleaseBundle, IncidentRecord |
| Channel surface | Coordinate in Slack, Teams, email, or notification systems | NotificationEvent, ChannelThreadRef, TimelineEvent |

## Voice Invocation Contract

The interactive Surface Lab in [index.html](index.html#surface-lab) includes a voice invocation workbench.

Voice is not a permission model. It is an intake surface that must attach speech to a product work object, confidence signal, context manifest, and safe next transition.

The voice path should be:

```text
speech capture
-> transcript and alternatives
-> work-object context binding
-> clarification when confidence or context is weak
-> source-linked preview
-> exact approval
-> durable workflow handoff
```

Minimum records:

| Stage | User sees | Records |
|---|---|---|
| Capture | Microphone state and selected work object | `AgentRun`, `VoiceCaptureEvent`, `TimelineEvent` |
| Transcript | Editable transcript and domain terms | `TranscriptRecord`, `UtteranceAlternative`, `RedactionEvent` |
| Context bind | Resolved user, role, tenant, work object, and source freshness | `ContextManifest`, `AccessDecision`, `SourceReference` |
| Clarify | Narrow question when "this patient" or the requested action is ambiguous | `RouteDecision`, `ClarificationRequest`, `TimelineEvent` |
| Preview | Evidence, alternatives, risk, and exact payload | `ToolCall`, `SourceReference`, `ActionProposal`, `PolicyDecision` |
| Approve | Exact side-effect payload with approve, modify, reject, clarify, or escalate | `Approval`, `PayloadHash`, `ResumeToken`, `AuditEvent` |
| Handoff | Workflow status, source confirmation, timeline, and recovery controls | `WorkflowEvent`, `ReconciliationRecord`, `AuditEvent`, `EvalCase` |

Design rules:

- Do not let a transcript become a tool argument until the work object and authority are bound.
- Show transcript confidence and correction for clinically or financially meaningful terms.
- Treat deictic language such as "this patient", "this account", "this ticket", and "this repo" as references to the current product surface, not as free text.
- If the selected object is missing or ambiguous, ask a narrow clarification before reading sensitive source data.
- Do not execute writes from voice confirmation alone unless the exact payload and approval record are visible.
- Timeline completion requires source-system confirmation, not a spoken or model-generated success message.

## Design Rule

Every surface should answer:

```text
What is the agent doing?
What source evidence is it using?
What can the user control?
What product record changes if the user clicks?
What happens if the user rejects, cancels, or finds a mistake?
Where is the authoritative state?
```

If a surface cannot answer those questions, it is probably just a chat interface, not a product control surface.

## Healthcare Bed Flow

The bed-flow agent should appear in the bed board or encounter workspace.

Required surfaces:

- Intake: voice or command bar tied to the selected encounter.
- Work object panel: candidate beds, constraints, monitoring need, isolation status, staffing, discharges, source links.
- Approval card: exact `reserve_bed` payload.
- Timeline: requested, context bound, ranked, approval required, held, needs reconciliation, cancelled.
- Memory center: patient facts blocked; unit-level preference proposed only for owner review.
- Run console: trace, PHI audit, workflow history, source-system response, eval sample.
- Channel surface: unit notification or clarification linked back to the bed board.

Failure path:

If the bed board and product timeline disagree, the timeline must show `needs_reconciliation`, not `completed`.

## Enterprise Scheduling

The scheduling agent should appear in the account workspace, calendar sidebar, or command bar.

Required surfaces:

- Intake: account-linked command or Slack mention.
- Work object panel: attendees, ranked slots, conflicts, timezone notes, agenda draft.
- Approval card: exact recipients, slot, agenda, invite text, and conference details.
- Timeline: ranked, approved, sent, accepted, declined, no response, reschedule pending.
- Memory center: editable user preferences such as default meeting duration or agenda template.
- Run console: calendar tool calls, delivery status, timezone evals, external-send audit.
- Channel surface: clarification and stakeholder coordination with account linkback.

Failure path:

If an external attendee declines or quorum fails, the run should branch to a reschedule workflow instead of silently ending.

## Support Resolution

The support agent should appear inside the ticket.

Required surfaces:

- Intake: ticket command or queue-triggered suggestion.
- Work object panel: policy citations, invoice timeline, entitlement, prior cases, draft response.
- Approval card: exact credit amount, policy basis, and customer reply.
- Timeline: evidence gathered, manager approval requested, credit applied, reply sent, ticket updated.
- Memory center: reviewed policy knowledge; no durable customer facts copied from source systems.
- Run console: policy lookup trace, financial approval audit, billing response, message delivery, eval case.
- Channel surface: manager review request that links back to the ticket.

Failure path:

If approval is rejected, the credit tool and customer reply must not execute.

## Code-Change Agent

The coding agent should appear in the issue, repo workspace, run log, and PR/diff review surface.

Required surfaces:

- Intake: issue or repo command with branch, path scope, and test command.
- Work object panel: plan, inspected files, proposed diff, tests, risks, open questions.
- Approval card: exact merge or deploy action after review.
- Timeline: files inspected, edits applied, tests run, PR created, review waiting, merged, deployed.
- Memory center: source-linked repo conventions; no secrets or unreviewed guesses.
- Run console: commands, file diffs, test output, review comments, audit events, regression cases.
- Channel surface: reviewer notification linked to the PR or issue.

Failure path:

If tests fail, the timeline should show failed verification and the run should not claim completion.

## Interface Anti-Patterns

- Floating chat that can perform hidden writes.
- Approval buttons without exact payloads.
- Channel threads that become the only operational record.
- Memory written silently after a run.
- Timeline that reports success before source-system confirmation.
- Raw traces shown to users as if they were product progress.
- Audit logs that contain too much sensitive prompt or tool output.
- Agent settings that change behavior without release, eval, or rollout controls.

## Build Checklist

For each new agent capability:

- Identify the source work object.
- Define the intake path and clarification path.
- Design the work object panel.
- Define exact approval cards for every side effect.
- Define user timeline events.
- Define memory proposal and correction UX.
- Define operator run console fields.
- Define channel notifications and linkbacks.
- Verify which backend records each surface writes.
- Add failure cases to evals and release gates.
