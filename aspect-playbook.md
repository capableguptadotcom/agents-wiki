# Aspect-by-Aspect Playbook

This playbook expands the core architecture into practical design questions, examples, and implementation artifacts.

## 1. Invocation Surfaces

Theory:

Users should be able to invoke agents where work already happens: voice, command bar, workflow screen, Slack or Teams thread, scheduled trigger, API event, or background monitor.

Real-life pattern:

- Slack-style agents are useful for collaborative invocation and status updates.
- Healthcare operations often need command-center invocation from a bed board or work queue.

Design rule:

Invocation is not the source of truth. It creates or updates a product work object.

Build next:

- `POST /agent-runs` API.
- Command bar that creates a run.
- Work item link attached to every run.

## 2. Intent and Context Binding

Theory:

Before an agent reasons, the product must bind user, role, tenant, current screen, selected work item, source records, and allowed scopes.

Real-life example:

The voice command "book a bed for this patient" is unsafe unless "this patient" resolves to one encounter in the current facility and the requester is allowed to act on it.

Design rule:

Clarify before acting when context is ambiguous.

Build next:

- Context object schema.
- Ambiguity detector.
- Clarification UI.

## 3. Agent Runtime

Theory:

The runtime owns reasoning, planning, clarification, read-tool usage, action proposal, and handoff. It should have max steps, stop conditions, and typed outputs.

Real-life pattern:

Vercel and OpenAI-style agent loops are useful for app-level tool use. They are not the durable source of truth for critical business processes.

Design rule:

Use the agent for judgment and orchestration, not hidden authority.

Build next:

- Agent runner interface.
- Structured plan output.
- Tool call transcript.
- Handoff contract.

## 4. Skills

Theory:

Skills package domain know-how: instructions, examples, decision rules, required tools, and eval cases.

Real-life example:

A bed assignment skill may include telemetry needs, isolation conflicts, staffing rules, unit acceptance rules, and escalation language.

Design rule:

Skills can guide behavior, but they cannot grant permission.

Build next:

- Skill manifest.
- Skill versioning.
- Skill-to-tool dependency map.
- Skill evals.

## 5. Tools

Theory:

Tools are executable product APIs. They need schemas, scopes, owners, side-effect levels, retry rules, and audit behavior.

Real-life example:

`fetch_capacity_snapshot` is read-only. `reserve_bed` is a write. `notify_unit` is external communication. They require different controls.

Design rule:

Every side effect must be idempotent or explicitly non-retryable.

Build next:

- Tool registry table.
- Tool gateway middleware.
- Idempotency key convention.
- Tool simulator for evals.

## 6. Memory

Theory:

Memory is not one thing. Separate run state, conversation context, user preferences, organization policy, source documents, and prohibited memory.

Real-life example:

It may be acceptable to remember that a unit wants escalation after 10 minutes. It is usually not acceptable to store durable patient PHI in agent memory when source systems can be queried.

Design rule:

Durable memory writes need source, classification, retention, inspection, correction, and deletion.

Build next:

- Memory classification matrix.
- Memory proposal queue.
- Memory center UI.
- Retention job.

## 7. Security and Permissions

Theory:

Agents are scoped principals. They can also act with delegated user authority, but the product must check both agent scope and user scope.

Real-life example:

A BedFlowAgent may read bed capacity across a facility but only reserve beds for units where the requester has operational authority.

Design rule:

Prompt text is not a security boundary.

Build next:

- Agent identity model.
- Policy decision log.
- Tenant and resource checks.
- Secret isolation.

## 8. Human Approval

Theory:

Approval is a product record attached to an exact action payload.

Real-life example:

Approve `reserve_bed(encounter_id=E-1042, bed_id=T-418, hold_minutes=20)`, not "approve the plan."

Design rule:

Users must be able to approve, modify, reject, request clarification, or escalate.

Build next:

- Approval schema.
- Approval inbox.
- Action preview component.
- Handoff/resume contract.

## 9. Durable Workflow

Theory:

Workflow engines own long-running execution, waits, retries, cancellation, recovery, and compensation.

Real-life example:

After approval, the workflow reserves the bed, notifies the unit, waits for acceptance, creates transport, and handles timeout escalation.

Design rule:

Agent calls and external side effects should be activities or steps with replay-safe behavior.

Build next:

- Workflow state machine.
- Retry policy.
- Compensation plan.
- Cancellation/resume API.

## 10. Product State and Domain Model

Theory:

Agent outputs must become domain events or product state transitions, not just chat messages.

Real-life example:

Healthcare scheduling may involve FHIR `Appointment`, `Encounter`, and `Location`. Bed-flow state must reconcile with the authoritative EHR/ADT or capacity system.

Design rule:

The product timeline should never claim success unless the source system confirms it.

Build next:

- Domain event model.
- Source-system write response mapping.
- Timeline projection.
- Reconciliation job.

## 11. Observability and Audit

Theory:

Traces help engineers debug. Audit logs help the business prove what happened. They overlap but should not be treated as the same artifact.

Real-life example:

A trace may show latency and model/tool calls. An audit entry must show actor, resource, action, approval, timestamp, and final outcome.

Design rule:

Every important run needs `trace_id`, `workflow_id`, `run_id`, `tool_call_id`, and `approval_id`.

Build next:

- Trace schema.
- Audit event schema.
- Redaction rules.
- Run console.

## 12. Evals and Improvement Loop

Theory:

Agents should improve through controlled releases, not hidden daily mutation.

Real-life example:

If the agent ranked the wrong bed because it ignored isolation status, that incident becomes a regression case before release.

Design rule:

No release without trajectory evals, tool permission tests, memory tests, approval tests, and retry tests.

Build next:

- Eval dataset format.
- Golden run replay.
- Synthetic failure cases.
- Release gate report.

## 13. Deployment and Rollback

Theory:

Agent releases bundle code, prompts, models, tools, policies, memory schemas, workflow definitions, and eval results.

Real-life example:

A prompt rollback does not undo a bed reservation, sent message, or memory write. Business compensation is separate from software rollback.

Design rule:

Always have kill switches for agent, tool, scope, run type, autonomy level, and tenant rollout.

Build next:

- Release bundle manifest.
- Canary policy.
- Tool kill switch.
- Compensation workflow.

## 14. UX Surfaces

Theory:

Users need control surfaces, not just conversation. The serious UI is command center, work item panel, approval inbox, timeline, settings, and run console.

Real-life example:

In bed-flow, the agent should appear inside the bed request workspace with candidate beds, source links, risk explanation, and action preview.

Design rule:

Chat/voice is an input surface. The product workflow is the system of record.

Build next:

- Command center mock.
- Work item agent panel.
- Timeline component.
- Agent settings page.
