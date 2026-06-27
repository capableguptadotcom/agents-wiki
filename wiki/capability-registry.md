# Capability Registry

This note explains how agents should get access to skills, tools, resources, workflows, memory, and connectors as first-class product capabilities.

The short version:

```text
Skills teach.
Resources inform.
Tools execute.
Workflows recover.
Memory persists.
Connectors expose external capability.
Policy grants or denies.
Observability proves what happened.
```

Do not grant capability through prompt text. Grant it through versioned registry objects with owners, scopes, schemas, side-effect metadata, evals, and revocation paths.

For the actor and credential chain behind those grants, see [Identity and access lab](identity-access-lab.md).

For deciding whether a capability should be exposed as an internal API, MCP server, workflow step, A2A delegation, event, or control-plane grant, see [Protocol runtime decision lab](protocol-runtime-decision-lab.md).

For the deeper lifecycle of skill changes, including evidence, authoring, review, evals, release bundles, runtime use, and incident learning, see [Skill lifecycle lab](skill-lifecycle-lab.md).

## Why This Exists

Enterprise agents fail when the capability model is vague:

- a "skill" secretly contains operational authority
- a read tool is treated like a write tool
- an MCP server exposes more APIs than intended
- a memory class stores sensitive data because no policy owns it
- a workflow is started from a vague approval
- a connector token is broader than the current task
- a tool schema changes without evals or owner review

A capability registry makes each of those boundaries explicit.

## Capability Types

| Type | What it is | Product rule |
| --- | --- | --- |
| Skill | Instructions, examples, domain policy, required tools, eval cases | Version and release-gate it |
| Resource | Readable context, source reference, or bounded document/data view | Minimize, classify, source-link, and audit sensitive reads |
| Read tool | Typed executable read, search, ranking, validation, or calculation | Own schema, timeout, owner, rate limit, trace |
| Write tool | Product mutation or external communication | Require side-effect class, idempotency, approval, audit, compensation |
| Workflow | Durable execution for waits, retries, approval resume, verification | Own recovery outside the model loop |
| Memory class | Governed persistence beyond one run | Require source, scope, retention, approval, correction, deletion |
| Connector | External API, MCP server, SaaS connector, or internal service boundary | Use explicit scopes, token audience, allowlists, revocation, audit |

## Access Grant Lifecycle

```text
register capability
-> classify side effect and data
-> assign owner
-> define schema and scopes
-> attach evals and threat cases
-> grant to agent version
-> narrow by user, tenant, and work object at runtime
-> observe every use
-> review, revoke, or roll back when behavior changes
```

## Grant Record

A useful grant record should answer:

```json
{
  "capability_grant_id": "grant_bedflow-agent_reserve_bed",
  "agent_id": "bedflow-agent",
  "capability_id": "reserve_bed@v2",
  "kind": "typed executable write",
  "scope": "facility:north-hospital telemetry beds",
  "data_class": "PHI",
  "side_effect": "write",
  "approval_rule": "required",
  "records": ["ToolGrant", "Approval", "ToolCall", "AuditEvent"],
  "revocation": "revoke reserve_bed@v2 for bedflow-agent"
}
```

The important point is that the grant belongs to a specific agent version and can be revoked without deleting the whole agent.

## Real-Life Examples

### Healthcare Bed Flow

User request:

```text
Book a telemetry bed for this ED patient.
```

Capabilities:

- Skill: `bed_assignment_triage_skill@v3`
- Resource: `encounter_context_resource`
- Read tool: `fetch_capacity_snapshot@v2`
- Write tool: `reserve_bed@v2`
- Workflow: `bed_reservation_workflow@v5`
- Memory class: `unit_escalation_preference_memory`
- Connector: `ehr_capacity_mcp_server`

Rule:

The agent can learn placement rules through the skill, read capacity through tools, and propose `reserve_bed`. The actual bed hold requires exact approval and durable workflow execution.

### Enterprise Scheduling

Capabilities:

- Skill: `qbr_scheduling_skill@v4`
- Resource: `availability_summary_resource`
- Read tool: `rank_available_slots@v3`
- Write tool: `send_calendar_invites@v3`
- Workflow: `meeting_coordination_workflow@v4`
- Memory class: `qbr_user_preference_memory`
- Connector: `calendar_connector`

Rule:

Private calendar details should not become durable memory or customer-facing text. External invites require exact recipient and message preview.

### Support Resolution

Capabilities:

- Skill: `billing_dispute_resolution_skill@v6`
- Resource: `ticket_evidence_resource`
- Read tool: `check_refund_policy@v4`
- Write tool: `apply_credit@v5`
- Workflow: `billing_resolution_workflow@v6`
- Memory class: `support_policy_knowledge_memory`
- Connector: `billing_connector`

Rule:

Policy interpretation is not financial authority. Credits and customer messages need separate side-effect handling, approval rules, and audit evidence.

### Code-Change Agent

Capabilities:

- Skill: `repo_editing_skill@v8`
- Resource: `repo_context_resource`
- Read tool: `run_test_command@v3`
- Write tool: `merge_pull_request@v2`
- Workflow: `pr_verification_workflow@v3`
- Memory class: `repo_convention_memory`
- Connector: `repo_tools_connector`

Rule:

The agent may draft and test code under a scoped branch. Merge and deploy remain separate authority levels with explicit approval.

## How This Maps To Standards

MCP:

- Good for exposing tools, resources, and prompts through a common protocol.
- Not a full governance system by itself.
- Product policy still decides which agent can use which server, tool, resource, and scope.

OpenAPI:

- Useful for stable operation identity, input/output schemas, and security schemes.
- Product teams can map tool entries to API operations and owners.

OAuth:

- Useful for delegated authorization and scoped connector access.
- Avoid broad token passthrough. Use task-specific scopes and token audiences.

OpenTelemetry GenAI:

- Useful for tracing model, tool, retrieval, and agent spans.
- Trace helps debugging; audit still records accountable action.

## Common Design Mistakes

1. Treating a skill as a tool.

A skill can say how to book a bed. It should not itself book the bed.

2. Treating a connector as a policy engine.

An MCP server or SaaS connector can expose tools. It does not decide whether a particular product action is safe for this user, tenant, patient, customer, ticket, or repo.

3. Treating memory as context cache.

Durable memory affects future behavior. It needs source, scope, retention, approval, and deletion.

4. Treating approval as a chat reaction.

Approval should bind to exact payload hash, not a broad natural-language intention.

5. Treating evals as answer checks.

Capability evals must test tool choice, arguments, approval triggers, retries, denials, memory writes, and final source state.

## Readiness Checklist

Before granting a capability:

- It has a stable ID and owner.
- It has a type: skill, resource, read tool, write tool, workflow, memory class, or connector.
- It has input/output schema when executable.
- It has data class and side-effect class.
- It has allowed agents and agent versions.
- It has user, tenant, object, and environment scope.
- It has approval and idempotency rules where relevant.
- It has observability fields.
- It has eval and threat-model coverage.
- It has a revocation and rollback path.
