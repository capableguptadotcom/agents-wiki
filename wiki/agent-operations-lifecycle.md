# Agent Operations Lifecycle

This note explains how to operate agent releases after the architecture, threat model, control plane, and run simulator are understood.

For the concrete eval artifact behind the eval gate, see [Eval and release harness](eval-release-harness.md).

For the specific path from trace evidence to skill draft, review, eval, release bundle, runtime use, and learning feedback, see [Skill lifecycle lab](skill-lifecycle-lab.md).

The interactive AgentOps section in `index.html` turns this lifecycle into a stage-by-stage walkthrough for four concrete changes:

- granting a healthcare `reserve_bed` write tool
- raising support refund autonomy
- enabling user-approved scheduling memory
- upgrading a coding-agent model and prompt bundle

## Core Lifecycle

Agent operations should treat every behavior change as a release operation:

```text
change request
-> risk review
-> eval gate
-> staging replay
-> canary rollout
-> production monitor
-> incident response
-> learning loop
```

This applies to prompt changes, model upgrades, tool grants, memory classes, workflow versions, policy changes, connector changes, and autonomy increases.

## Why This Matters

Most agent failures are not caused by one bad model answer. They come from unmanaged change:

- a prompt changes behavior in the middle of production
- a new tool gives broader access than intended
- a memory class persists bad or sensitive context
- a model upgrade changes tool choice or approval behavior
- a workflow retries a write without idempotency
- an incident has traces but no audit evidence
- a canary detects drift but there is no narrow rollback

The operations lifecycle turns these into managed release and incident patterns.

## Stage Guide

### 1. Change Request

The change request names what is changing, who owns it, and what product behavior it affects.

Examples:

- `reserve_bed` moves from unavailable to approval-gated write tool.
- support credit autonomy moves from draft-only to supervised under a threshold.
- scheduling memory moves from no durable memory to user-approved preferences.
- coding model moves from `code-agent:v7` to `code-agent:v8`.

Required records:

- `ChangeRequest`
- `OwnerApproval`
- `ReleaseBundleDraft`
- `ToolGrantDraft`, `MemorySchemaDraft`, `ModelChange`, or `AutonomyChange`

### 2. Risk Review

Risk review classifies the change by data, side effect, autonomy, destination, and blast radius.

Questions:

- Does the agent gain new data?
- Does it gain a side effect?
- Does it affect external communication?
- Does it affect regulated data such as PHI, PII, financial data, source code, or secrets?
- Does it raise autonomy?
- Which users, tenants, channels, tools, and workflows are affected?

Required records:

- `RiskReview`
- `ThreatModelRecord`
- `DataClassReview`
- `PolicyDecisionTemplate`

### 3. Eval Gate

The eval gate proves the change handles expected and dangerous trajectories.

For agents, evals must test trajectories, not only final answers:

- intent and context binding
- tool choice
- tool arguments
- denial and refusal behavior
- approval triggering
- memory write behavior
- retry and idempotency
- source-system reconciliation
- user timeline truthfulness
- cost and latency budget

Required records:

- `EvalCase`
- `EvalRun`
- `ReleaseGate`
- `FailureTaxonomy`

### 4. Staging Replay

Staging replay runs realistic workflows in a safe environment.

Examples:

- fake bed board and ADT connector for bed-flow writes
- fake billing ledger and message sandbox for support credits
- fake calendars for scheduling memory
- sandbox repos and fake secrets for coding agents

Required records:

- `StagingRun`
- `WorkflowHistory`
- `ToolCall`
- `AuditSample`
- `ArtifactBundle`

### 5. Canary Rollout

Canary rollout limits blast radius while observing real behavior.

Canary dimensions:

- tenant
- unit or queue
- user role
- tool
- memory class
- channel
- autonomy level
- repository cohort

Required records:

- `RolloutRule`
- `CanaryMetric`
- `AuditSample`
- `ReviewEvent`

### 6. Production Monitor

Production monitoring must serve several audiences:

| View | Audience | Purpose |
| --- | --- | --- |
| Run console | Operators | Current run status, pause, retry, cancel, inspect |
| Trace viewer | Engineering | Model, tool, retrieval, latency, cost, failure debugging |
| Audit export | Compliance | Who accessed, approved, wrote, notified, or compensated |
| User timeline | End user | Plain-language progress and recovery |
| Eval sampler | Agent team | Convert production cases into future regressions |

Signals to monitor:

- approval rate
- denial rate
- tool error rate
- source mismatch rate
- memory proposal acceptance and correction
- user edit rate
- incident rate
- p95 and p99 latency
- cost per successful run
- rollback and kill-switch frequency

### 7. Incident Response

Incident controls must be narrow. The answer should not always be "turn off the whole AI product."

Useful controls:

- pause one agent
- revoke one tool grant
- downgrade autonomy
- disable one memory class
- quarantine memory items
- pause a workflow version
- rollback one release bundle
- compensate source-system side effects
- route new work to draft-only mode

Required records:

- `IncidentRecord`
- `KillSwitchEvent`
- `ReleaseRollback`
- `MemoryQuarantine`
- `CompensationWorkflow`

### 8. Learning Loop

Every incident, rejection, correction, and near miss should update the evidence base.

Learning outputs:

- new eval case
- threat-model update
- policy patch
- tool schema change
- memory classification update
- UX correction
- release checklist update
- postmortem

The learning loop should not silently change production behavior. It creates a candidate change, which goes through the lifecycle again.

## Governed Improvement Loop

The interactive AgentOps section in [index.html](index.html#agentops) also includes a governed improvement loop workbench.

Use it when production evidence appears and the team is tempted to "just update the prompt" or "just add memory."

The decision rule:

```text
production signal
-> source evidence
-> choose route
-> create product artifact
-> review and eval
-> release bundle
-> monitored activation
```

The route matters because different evidence should change different artifacts:

| Signal | Correct route | Artifact | What must not happen |
|---|---|---|---|
| Bed-board source mismatch after workflow success | Eval first, then tool, policy, skill, and release | `EvalCase`, `ToolSchemaChange`, `PolicyVersion`, `ReleaseBundle` | Storing a bed-specific memory or letting workflow success override source truth |
| Private calendar title in scheduling memory proposal | Policy and tool redaction first | `MemoryPolicy`, `RedactionRule`, `ToolSchemaChange`, `EvalCase` | Relying on model carefulness or human review to catch prohibited fields |
| Duplicate support credit after billing timeout | Tool contract first | `ToolSchemaChange`, `WorkflowVersion`, `ReconciliationRecord`, `EvalCase` | Lowering autonomy only while leaving retry semantics unsafe |
| Overbroad coding PR rejected by maintainer | Skill plus policy and eval | `SkillDraft`, `CounterexampleSet`, `PolicyVersion`, `EvalCase` | Turning one reviewer comment into hidden repo memory |

### Route Checklist

Memory:

- Use only when future runs should retrieve the fact as governed context.
- Require source, scope, owner, retention, approval, correction, deletion, and use audit.
- Reject incident facts, source-system state, PHI, private calendar content, customer-specific financial facts, and single-reviewer preferences as durable memory by default.

Skill:

- Use when instructions, examples, counterexamples, or operating heuristics should change.
- Require owner review, allowed and prohibited authority, eval coverage, release bundle, and rollback target.
- A skill can guide tool choice, but it must not grant tool authority.

Tool contract:

- Use when schema, idempotency, timeout, source adapter, side-effect class, or observation shape is wrong.
- Require tool owner review, staging replay, policy mapping, and backward compatibility review.
- Tool fixes are often the right answer when the model behaved correctly but the system boundary failed.

Policy:

- Use when authorization, approval, denial, redaction, data class, autonomy, or external communication rules are wrong.
- Require risk review, denial tests, owner signoff, and versioned policy release.
- Policy decisions should be records, not hidden prompt text.

Eval:

- Use whenever the signal can recur and should block future releases.
- Require fixture, trajectory, assertions, severity, owner, and release gate.
- The model should not learn directly from the incident; future releases should prove they handle it.

Release:

- Use when active behavior, rollout, rollback, canary, or pinned versions must change.
- Require a release bundle that pins model, prompt, tools, policies, workflow, memory schema, skill versions, eval run, rollout, and rollback.
- A release is the only path from candidate improvement to production behavior.

## Real-Life Examples

### Healthcare Bed Tool Grant

Change:

```text
Grant BedFlowAgent the reserve_bed tool.
```

Controls:

- PHI review
- approval required for every write
- idempotency key
- source-system reconciliation
- one-unit canary
- kill switch for `reserve_bed`

Failure if unmanaged:

The agent reports a bed hold while the bed board disagrees, or duplicate retry creates operational confusion.

### Support Autonomy Increase

Change:

```text
Allow low-value credits under a finance threshold.
```

Controls:

- finance threshold
- policy citation
- customer-message preview
- daily audit sampling
- rollback to draft-only

Failure if unmanaged:

The agent applies a correct-looking but unauthorized credit and sends a customer reply that hides the policy gap.

### Scheduling Memory

Change:

```text
Persist user-approved QBR scheduling preferences.
```

Controls:

- allowed and prohibited fields
- user approval
- memory center
- deletion path
- use audit
- quarantine path

Failure if unmanaged:

Private calendar information becomes durable memory and influences future customer-facing invites.

### Coding Model Upgrade

Change:

```text
Upgrade coding-agent model and prompt.
```

Controls:

- golden run replay
- scope violation eval
- secret redaction eval
- PR-only canary
- rollback to previous release bundle

Failure if unmanaged:

The new model edits well but skips required tests, changes unrelated files, or reaches merge/deploy paths too early.

## Minimum Product Schema

An operations lifecycle usually needs these objects:

```text
ChangeRequest
ReleaseBundle
RiskReview
ThreatModelRecord
EvalCase
EvalRun
ReleaseGate
StagingRun
RolloutRule
CanaryMetric
MetricEvent
TraceSpan
AuditEvent
IncidentRecord
KillSwitchEvent
ReleaseRollback
Postmortem
```

## Release Bundle Manifest

Every production run should pin a release bundle:

```json
{
  "agent_id": "bedflow-agent",
  "release": "bedflow-agent:v3",
  "prompt_version": "triage-2026-06-27",
  "model_id": "model-id",
  "toolset_version": "bed-tools:v2",
  "policy_version": "phi-write:v4",
  "workflow_version": "bed-reservation-wf:v5",
  "memory_schema_version": "memory-policy:v2",
  "eval_run_id": "eval-884",
  "rollout_rule": "canary:north-hospital:telemetry-unit",
  "rollback_target": "bedflow-agent:v2"
}
```

## Operational Readiness Checklist

Before production rollout:

- The change has a named owner.
- The blast radius is explicit.
- The release bundle pins prompt, model, tools, policy, workflow, memory schema, and eval run.
- The threat model covers the new capability.
- The eval gate includes happy path, denial, approval, retry, source mismatch, memory, and incident cases.
- Staging replay exercises realistic fixtures.
- Canary scope is narrow and reversible.
- Monitoring has run, trace, audit, timeline, metric, and cost views.
- Kill switches are narrow.
- Rollback target is known.
- Incidents produce eval cases before autonomy is restored.
