# Protocol Runtime Decision Lab

Current as of 2026-06-27.

This note complements the interactive Protocol Runtime section in [interactive.html](interactive.html#protocol-runtime).
It answers a practical architecture question:

```text
When should we use an agent SDK loop, an internal API, MCP, a workflow engine,
A2A-style delegation, events/webhooks, or a product control plane?
```

The short answer:

```text
Use each pattern for the boundary it actually owns.
Do not let any one pattern become the whole agent platform.
```

## Boundary Rules

| Pattern | Owns | Must not own |
|---|---|---|
| Agent SDK loop | Planning, tool choice, observations, clarification, drafting, handoff | Authorization, durable writes, source truth, audit, release governance |
| Internal API | Owned business logic, schemas, validation, source adapters, idempotency | Hidden autonomy or broad tool access |
| MCP connector | Standard tool, resource, prompt, and connector exposure | Product policy, approval, source truth, or broad token passthrough |
| Workflow engine | Durable waits, retries, timers, approval resume, source reconciliation | Model reasoning or policy overrides |
| A2A delegation | Delegated agent identity, task contract, remote task state | Local approval, local source writes, or simple API calls |
| Events/webhooks | Async signals, wakeups, timeline updates, replayable domain events | Planning, authorization, or final business truth |
| Control plane | Agent registry, grants, release bundles, rollout, pause, rollback, audit export | Runtime reasoning or source-system state |

## Simulated Design Review

This is a synthesized discussion between roles, not quotes from real people or organizations.

### Platform Architect

The common mistake is to ask one tool to do everything. An SDK can run the loop, MCP can expose tools,
and a workflow engine can recover side effects, but none of them replaces product policy, audit, evals,
or source-system ownership.

### Security Architect

MCP and OAuth are useful, but connector authorization is not the same as product authorization. Every tool call
still needs user scope, agent grant, tenant, resource, data-class, side-effect, and approval checks.

### Product Engineer

Start with internal APIs for capabilities the product team owns. Use MCP when there is real cross-client or
external connector value. Use A2A only when another agent is a stateful delegated actor, not when a normal API
or workflow event is simpler.

### SRE

Any side effect that waits, retries, crosses systems, or can partially fail belongs in workflow state. The model
may observe workflow status, but the workflow should own retries, idempotency, cancellation, and compensation.

### Product Operator

The user should not care which protocol was used. They should see source evidence, status, approvals, recovery,
and a timeline in the work object.

## Scenario Guidance

### Healthcare Bed Flow

Use:

- Agent SDK loop to rank beds and draft an exact `reserve_bed` payload.
- Internal APIs for encounter resolution, capacity snapshots, ranking, and bed-hold preview.
- MCP only when capacity or EHR-adjacent tools need a standard connector boundary.
- Workflow engine for approved bed hold, unit notification, transport task, and reconciliation.
- Events for bed status changes, acknowledgements, and reconciliation failures.
- Control plane for PHI-sensitive tool grants, rollout, kill switch, audit export, and eval gates.

Do not:

```text
Let the model own the bed hold.
Let an MCP server decide hospital policy.
Let a workflow service account lose user and agent context.
```

### Enterprise Scheduling

Use:

- Agent SDK loop for attendee resolution, slot ranking, agenda drafting, and clarification.
- Internal APIs for free/busy minimization, recipient resolution, and CRM writes.
- MCP for calendar or SaaS connectors when standard discovery and auth boundaries help.
- Workflow engine for approved invite send, RSVP monitoring, and reschedule handling.
- Events for provider delivery, accept, decline, and no-response signals.
- Control plane for external-send autonomy, connector revocation, memory policy, and model upgrades.

Do not:

```text
Expose private calendar details to the model.
Send customer-facing invites from broad delegated access.
Treat Slack or Teams as the source of truth.
```

### Support Resolution

Use:

- Agent SDK loop for evidence gathering, policy interpretation, and draft response.
- Internal APIs for ticket, billing, entitlement, policy, and messaging tools.
- MCP for bounded ticket or billing resources if multiple clients need the same connector.
- Workflow engine for credit application, ledger verification, message delivery, and ticket update.
- Events for ledger transaction, delivery receipt, escalation, and ticket state.
- Control plane for finance thresholds, tool revocation, canary, audit export, and incident response.

Do not:

```text
Collapse credit and customer reply into one vague side effect.
Let a connector expose hidden refund APIs.
Close the ticket before billing and messaging systems confirm.
```

### Code-Change Agent

Use:

- Agent SDK loop for planning, file inspection, scoped patching, test orchestration, and summary.
- Internal APIs or repo tools for path-scoped reads, patches, commands, PR creation, and review reads.
- MCP when repo tools need a standard connector boundary and strict token audience validation.
- Workflow engine for tests, artifact retention, review waiting, PR state, and merge/deploy gating.
- Events for CI, review, branch update, and deployment status.
- Control plane for repo write grants, command allowlists, model upgrades, golden runs, and review-only mode.

Do not:

```text
Expose a generic shell as a tool.
Let a coding agent merge or deploy through the same grant used for patching.
Store secrets or one-off hacks as durable memory.
```

## Decision Checklist

Before choosing a runtime or protocol, answer:

1. Does this need model reasoning, or deterministic service logic?
2. Is the capability owned by our product team, or by an external tool/server?
3. Is a standard connector boundary useful, or is an internal typed API safer?
4. Does the task wait, retry, resume after approval, or need compensation?
5. Is another agent truly a delegated actor, or would a normal API be clearer?
6. Which event wakes the next step or updates the user timeline?
7. Which control-plane record grants, rolls out, pauses, revokes, or audits this capability?
8. Which eval would prove the chosen boundary is not being abused?

## Anti-Patterns

1. Agent SDK as workflow engine.

The model loop retries or waits in memory and reports success after source-system failure.

2. MCP as policy engine.

The connector exposes tools and the product forgets to enforce tenant, object, data-class, approval, and source ACL.

3. A2A for simple calls.

The system adds agent-to-agent delegation where a typed API or workflow event would be simpler and easier to audit.

4. Event as truth.

A webhook or notification is treated as completion without source-system confirmation.

5. Control plane as decoration.

Agents ship without tool grants, connector revocation, release bundles, canaries, eval gates, or incident controls.

## Product Rule

```text
Agent SDKs coordinate cognition.
Internal APIs and MCP expose capability.
Workflow engines recover side effects.
Events connect state changes.
A2A delegates to another actor only when needed.
The control plane governs the whole lifecycle.
```

## Related Notes

- [Capability registry](capability-registry.md)
- [Identity and access lab](identity-access-lab.md)
- [Architecture composition workbench](architecture-composition-workbench.md)
- [Durable execution](durable-execution.md)
- [Agent control plane](agent-control-plane.md)
- [Runtime ledger](runtime-ledger.md)
- [Agent threat model](agent-threat-model.md)
