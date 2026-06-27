# Agent Control Plane

This note explains how to manage agents as first-class product citizens after the architecture and runbook are understood.

The control plane is the product layer that answers:

```text
Who owns this agent?
What can it access?
Which skills and tools are enabled?
What memory can it use or write?
Which version is running?
What evidence allowed release?
How do we observe, pause, roll back, or investigate it?
```

## Why It Exists

Without a control plane, agents become prompt scripts with unclear ownership. That breaks down when a product has many agents, many tools, regulated data, external communication, customer-facing actions, or long-running workflows.

A control plane should manage:

- agent registry and ownership
- skills and tool grants
- connector and MCP server access
- delegated user and agent scopes
- memory policy
- release bundles
- eval gates
- rollout and rollback
- run observability
- audit export
- incident response
- risk and compliance review

For the deeper authority-chain model covering user subjects, agent principals, delegated scopes, connector tokens, approval-scoped elevation, service identity, audit, and revocation, see [Identity and access lab](identity-access-lab.md).

For the boundary decision between agent SDKs, internal APIs, MCP, workflow engines, A2A, events, and control-plane governance, see [Protocol runtime decision lab](protocol-runtime-decision-lab.md).

For the specific lifecycle of skills as versioned artifacts with evidence, review, evals, release, runtime proof, and learning loops, see [Skill lifecycle lab](skill-lifecycle-lab.md).

For the deployable control-plane/data-plane split across surfaces, APIs, runtimes, gateways, workflows, adapters, memory, observability, and release, see [Deployment topology lab](deployment-topology-lab.md).

See [Agent operations lifecycle](agent-operations-lifecycle.md) for the stage-by-stage release flow from change request to risk review, eval gate, staging replay, canary, production monitoring, incident response, and learning.

## Core Objects

| Object | Purpose |
|---|---|
| Agent | Stable product actor with owner, purpose, status, autonomy, and scopes. |
| AgentVersion | Immutable behavior bundle: prompt, model, tools, policies, workflow, memory schema, eval result. |
| SkillGrant | Which skills an agent can use and under what version. |
| ToolGrant | Which tools an agent can call, with side effect, data class, approval rule, and idempotency. |
| ConnectorGrant | Which MCP servers, APIs, or external systems the agent may access. |
| MemoryPolicy | Which memory classes are allowed, prohibited, reviewed, retained, and visible to users. |
| ReleaseBundle | The deployable package for one behavior version. |
| EvalGate | Required test and replay evidence before rollout. |
| RolloutRule | Canary, tenant, role, tool, autonomy, or channel rollout configuration. |
| IncidentControl | Pause, revoke, rollback, quarantine memory, compensate, or escalate. |

## Agent Registry

Every agent needs:

- `agent_id`
- display name
- owner team
- escalation contact
- purpose
- prohibited domains
- default autonomy
- allowed channels
- current release
- status: draft, active, paused, retired

Example:

```json
{
  "agent_id": "bedflow-agent",
  "owner_team": "capacity-ops",
  "purpose": "Coordinate bed assignment requests",
  "status": "active",
  "default_autonomy": "draft_requires_approval",
  "current_release": "bedflow-agent:v3",
  "allowed_channels": ["bed_board", "voice"]
}
```

## Skill and Tool Access

Skills package know-how. Tools execute product capabilities.

The control plane should not grant a tool just because the prompt mentions it. Tool access should pass through:

1. tool owner review
2. schema review
3. data-class review
4. side-effect classification
5. approval rule
6. retry and idempotency rule
7. eval coverage
8. audit behavior

Example:

```json
{
  "tool_name": "reserve_bed",
  "agent_id": "bedflow-agent",
  "side_effect": "write",
  "data_class": "phi",
  "approval_rule": "required",
  "idempotency_rule": "encounter_id + bed_id + hold_minutes",
  "audit": "required"
}
```

## Memory Governance

Memory is product data.

For the deeper lifecycle model covering memory classes, proposals, use audit, correction, deletion, quarantine, retention, and evals, see [Memory governance](memory-governance.md).

Allowed memory examples:

- user preference
- team workflow preference
- organization-level rule with owner approval
- source-linked project convention

Prohibited or restricted examples:

- secrets
- unsupported model inference
- durable patient PHI by default
- private calendar details
- stale financial policy
- hidden customer facts

Every memory item should have:

- source
- scope
- owner
- data class
- retention
- approval status
- correction path
- deletion path
- use audit

## Release Bundle

Agent behavior should ship as a bundle:

```json
{
  "agent_id": "bedflow-agent",
  "version": "bedflow-agent:v3",
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

No production run should depend on unpinned prompt, model, tool, policy, workflow, or memory behavior.

## Release Gates

Different changes require different gates.

### Granting a Write Tool

Required gates:

- tool owner approval
- security review
- policy rule
- approval rule
- idempotency test
- audit test
- domain evals
- canary
- kill switch

Example:

Granting `reserve_bed` requires PHI review, approval gating, duplicate-write tests, source-system reconciliation, and one-unit canary.

### Increasing Autonomy

Required gates:

- risk review
- domain owner approval
- expanded eval suite
- production sampling
- narrower rollout
- rollback to lower autonomy

Example:

Moving support credits from draft-only to supervised execution needs financial thresholds, audit sampling, and policy-denial evals.

### Enabling Memory

Required gates:

- memory schema review
- user-visible memory center
- retention policy
- correction and deletion path
- bad-memory evals
- quarantine and kill switch

Example:

Scheduling preferences can persist only if user-approved and editable. Private calendar details stay prohibited.

### Upgrading a Model

Required gates:

- replay golden runs
- compare tool choice
- compare approval triggers
- compare refusals and denials
- compare cost and latency
- canary by tenant or queue
- rollback to previous release

Example:

A coding-agent model upgrade must replay inspect, edit, test, review, and merge-gate cases before rollout.

## Observability

The control plane should expose separate views:

| View | Audience | Answers |
|---|---|---|
| Run console | Product operators | What is the agent doing now? |
| Trace viewer | Engineering | Why did the model or tool chain behave this way? |
| Audit export | Compliance | Who approved what and what changed? |
| Timeline | End users | What happened to my work object? |
| Eval dashboard | Agent team | Did the new release regress? |
| Incident dashboard | SRE and risk | What is failing and what can we pause? |

Correlate all views with:

```text
run_id
trace_id
workflow_id
tool_call_id
approval_id
audit_id
tenant_id
agent_version_id
```

## Incident Controls

The control plane should support targeted response:

- pause one agent
- revoke one tool
- revoke one connector
- disable one memory class
- downgrade autonomy
- pause a rollout
- rollback release
- cancel or pause active runs
- run compensation workflow
- quarantine memory
- export audit bundle

Examples:

- Duplicate bed holds: disable `reserve_bed`, keep read-only recommendations active, start compensation review.
- Bad scheduling memory: quarantine user preference memory, replay affected scheduling runs.
- Support credit incident: set refund tool to approval-required, export audit, sample credits for review.
- Coding agent destructive edit: revoke write tool, require review-only mode, replay file-scope evals.

## Operating Reviews

Weekly or release review should ask:

- Which agents changed?
- Which tools were added, removed, or deprecated?
- Which autonomy levels changed?
- Which memory policies changed?
- Which evals failed?
- Which production incidents happened?
- Which cost, latency, denial, approval, or failure metrics moved?
- Which rollbacks or kill switches were used?
- Which risks need treatment?

## Product Rule

The control plane is not optional platform polish. It is the difference between:

```text
an agent demo
```

and

```text
a product actor that can be governed, observed, improved, paused, and trusted
```
