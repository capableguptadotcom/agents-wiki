# Architecture Composition Workbench

Current as of 2026-06-27.

This note complements the interactive Composition section in [interactive.html](interactive.html#composition-workbench).
Its purpose is to show how the pieces combine:

```text
paper primitive
-> standard or protocol boundary
-> product or platform case pattern
-> product architecture record
-> failure mode
-> release-blocking eval
```

The mistake to avoid is choosing one source family as the whole answer.

Papers explain useful primitives. Standards define boundaries. Product cases show adoption patterns.
Your product still needs records, policy, UX, workflow, audit, evals, and incident controls.

For the focused runtime and protocol choice guide, see [Protocol runtime decision lab](protocol-runtime-decision-lab.md).

For case-by-case architecture adoption records grounded in public evidence, papers, standards, and product lifecycle records, see [Industry case architecture lab](industry-case-architecture-lab.md).

For the deeper evidence chain that connects each layer to paper claims, standards, public cases, deployable components, product records, failure modes, and eval gates, see [Evidence chain architecture](evidence-chain-architecture.md).

## Simulated Architecture Discussion

This is a synthesized discussion between roles, not quotes from real people or organizations.

### Research Lead

Papers such as ReAct, MRKL, Toolformer, Reflexion, Generative Agents, Voyager, WebArena, AgentBench,
GAIA, and SWE-agent are useful because they name primitives: trajectories, tool use, modular routing,
memory, reflection, skill libraries, environment interfaces, and trajectory evals.

They do not prove enterprise authority, compliance, source truth, or operational recovery.

### Platform Architect

The architecture must be a layered execution system:

```text
surface
-> context
-> identity and access
-> agent loop
-> tools and sources
-> approval and workflow
-> memory and learning
-> observability and release
```

Each layer must produce records. Without records, the architecture cannot be debugged, audited, evaluated,
or improved safely.

### Security and IAM Owner

OAuth, OIDC, SMART, and MCP Authorization do not collapse into one "agent identity" concept. User identity,
delegated scopes, connector grants, tool grants, approval, service identity, and source-system ACLs need
separate records.

### Product Operator

Users experience the architecture through a work surface. If the agent is invisible after invocation, users
will not trust it. They need status, alternatives, approval previews, source evidence, timelines, and recovery.

### Skeptic

Vendor case studies are directional. They show where the market is going, but they rarely expose enough
internal details about policy, evals, incidents, memory governance, or source reconciliation. Use them as
pattern evidence, not proof.

## Layer Crosswalk

| Layer | Paper anchor | Standard or protocol anchor | Product case pattern | Required record |
|---|---|---|---|---|
| Work surface | SWE-agent, WebArena | Host app permissions, audit timeline | Slack agents, GitHub Copilot cloud agent | `AgentRun`, `TimelineEvent`, `Approval` |
| Context binding | GAIA, SWE-agent | OIDC, SMART/FHIR, directory APIs | Salesforce Agentforce, Microsoft Copilot agents | `ContextManifest`, `SourceReference` |
| Identity and access | Toolformer, AgentBench | OAuth, OIDC, SMART, MCP Authorization | Microsoft Agent 365, ServiceNow AI Agents | `AccessDecision`, `DelegationGrant` |
| Agent loop | ReAct, MRKL, Toolformer | Trace context, tool schemas | Vercel AI SDK, OpenAI Agents SDK | `AgentStep`, `ToolCall`, `TraceSpan` |
| Tools and sources | MRKL, Toolformer, Voyager | MCP, OpenAPI, JSON Schema, FHIR | Agentforce actions, ServiceNow workflows | `ToolRegistry`, `SourceReference` |
| Approval and workflow | ReAct, WebArena | NIST AI RMF, CloudEvents, workflow history | Cloudflare Agents and Workflows, ServiceNow workflows | `Approval`, `WorkflowEvent` |
| Memory and learning | Reflexion, Generative Agents, Voyager | OWASP LLM risks, NIST AI RMF, retention policy | Agentforce context engineering, coding-agent instructions | `MemoryProposal`, `MemoryUseAudit` |
| Observability and release | AgentBench, WebArena, SWE-agent | OpenTelemetry GenAI, W3C Trace Context, ISO 42001 | GitHub coding-agent artifacts, ServiceNow control tower | `EvalRun`, `ReleaseBundle`, `AuditEvent` |

## Scenario Translation

### Healthcare Bed Flow

The request:

```text
Book a monitored bed for this ED patient.
```

The composition:

- Surface: bed board with voice, candidate beds, source links, and approval card.
- Context: encounter, patient, facility, requester role, tenant, bed-board snapshot.
- Identity: OIDC/SMART user context, agent grant, connector scope, approval authority.
- Agent loop: plan reads, gather constraints, rank beds, draft hold payload.
- Tools: capacity, clinical constraints, staffing, placement policy, reserve bed.
- Approval/workflow: exact bed-hold payload, idempotent workflow, notifications, reconciliation.
- Memory: no durable patient memory; only reviewed unit-level operational preferences.
- Observability/release: PHI audit, trace redaction, source response, eval replay.

Release-blocking eval:

```text
If encounter is ambiguous, no patient read or bed write can occur.
```

### Enterprise Scheduling

The request:

```text
Schedule the quarterly customer review next week.
```

The composition:

- Surface: account workspace, calendar sidebar, Slack or Teams thread.
- Context: account, attendees, organizer, time window, customer timezone.
- Identity: calendar free/busy scope, account permission, external-send approval.
- Agent loop: resolve attendees, read availability, rank slots, draft agenda.
- Tools: directory, CRM, calendar, memory preferences, invite sender.
- Approval/workflow: exact recipients, time, agenda, message, provider confirmation.
- Memory: user-approved scheduling preferences only.
- Observability/release: provider event, CRM timeline, message audit, reschedule evals.

Release-blocking eval:

```text
Recipient or message mutation after approval must require a new approval.
```

### Support Resolution

The request:

```text
Resolve this billing dispute and update the customer.
```

The composition:

- Surface: ticket workspace with policy, invoice, draft credit, and reply preview.
- Context: ticket, account, invoice, entitlement, SLA, policy version.
- Identity: support queue permission plus finance threshold policy.
- Agent loop: gather evidence, interpret policy, draft credit and reply proposals.
- Tools: ticket, billing ledger, CRM, policy KB, messaging provider.
- Approval/workflow: credit approval, reply approval, ledger write, delivery receipt, ticket update.
- Memory: reviewed policy insight only; customer facts remain in source systems.
- Observability/release: ledger audit, ticket timeline, duplicate-credit eval.

Release-blocking eval:

```text
Ticket completion requires ledger transaction and customer-message delivery proof.
```

### Code-Change Agent

The request:

```text
Update the workflow simulator and verify it.
```

The composition:

- Surface: issue, repo workspace, run log, diff, test result, PR.
- Context: repo, branch, allowed paths, base commit, test command, review policy.
- Identity: repo app token, branch scope, command allowlist, protected merge policy.
- Agent loop: inspect files, patch, test, summarize, request review.
- Tools: file read, patch, test, artifact, PR, review.
- Approval/workflow: review approval tied to exact commit and checks.
- Memory: source-linked repo conventions; no secrets or one-off hacks.
- Observability/release: artifacts, eval replay, release bundle, rollback.

Release-blocking eval:

```text
The agent cannot claim completion without a diff artifact and verification artifact.
```

## How To Use The Workbench

For any proposed agent feature, walk the layer list:

1. What does the paper literature actually contribute?
2. Which standard or protocol constrains this boundary?
3. Which industry case shows a similar product pattern?
4. Which product record proves the layer behaved correctly?
5. What failure would be unacceptable?
6. Which eval blocks release if that failure appears?
7. What needs a deeper design note, schema, or simulator?

## Product Rule

```text
No layer is optional.
The product may implement a layer simply at first,
but every layer needs an owner, evidence record, failure mode, and eval.
```

That is the difference between an agent demo and an agent-native product.

## Related Notes

- [Research and standards](research-standards.md)
- [Evidence chain architecture](evidence-chain-architecture.md)
- [Source atlas](source-atlas.md)
- [Paper-to-product lab](paper-to-product-lab.md)
- [Industry pattern teardowns](industry-pattern-teardowns.md)
- [Architecture blueprint](architecture-blueprint.md)
- [Runtime ledger](runtime-ledger.md)
- [Identity and access lab](identity-access-lab.md)
