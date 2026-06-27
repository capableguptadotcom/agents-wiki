# Deep Agent Application Architecture

Current as of 2026-06-27.

## Context

A deep agent in a product is a governed run subsystem.

It is not:

- a chat box
- a model loop with tools
- a hidden workflow runner
- a memory store that mutates itself

It is:

```text
work intent
-> governed AgentRun
-> exact product state transition
-> source-confirmed outcome
```

## Ownership Rule

```text
Agent runtime coordinates.
Product records authorize.
Policy gates risk.
Workflow executes side effects.
Source systems confirm truth.
Audit and eval decide release.
```

If a model can bypass this chain, the product does not have an agent architecture. It has an automation script with a natural-language front end.

## Product Boundary

``` mermaid
flowchart LR
  Surface["Work surface"] --> Binder["Context binder"]
  Binder --> Access["Access decision"]
  Access --> Runtime["Owner agent runtime"]
  Runtime --> Workspace["Run workspace"]
  Runtime --> Specialists["Scoped subagents"]
  Specialists --> Runtime
  Runtime --> Gateway["Capability gateway"]
  Gateway --> Policy["Policy gateway"]
  Policy --> Approval["Approval service"]
  Approval --> Workflow["Durable workflow"]
  Workflow --> Source["Source systems"]
  Source --> Verify["Verifier"]
  Verify --> Timeline["Product timeline"]
  Verify --> Eval["Eval case"]
  Runtime --> Trace["Trace and run console"]
  Policy --> Audit["Audit event"]
  Approval --> Audit
  Workflow --> Audit
```

The public interface is `AgentRun`. Everything else is internal unless a user, operator, auditor, or release gate needs it.

## Required Records

| Record | Purpose | Cannot be inferred from |
|---|---|---|
| `AgentRun` | durable work unit | chat transcript |
| `ContextManifest` | selected object, tenant, actor, freshness | prompt text |
| `AccessDecision` | effective authority | model confidence |
| `TaskGraph` | planned work units | hidden reasoning |
| `SpecialistHandoff` | scoped delegation | subagent name |
| `ToolCall` | typed capability request | natural-language intent |
| `PolicyDecision` | allow, deny, clarify, approval-required | tool schema alone |
| `Approval` | human decision over exact payload hash | yes/no chat reply |
| `WorkflowRun` | durable side-effect execution | model loop state |
| `SourceResponse` | source-system result | product cache |
| `VerificationResult` | completed or needs reconciliation | generated summary |
| `TimelineEvent` | user-visible product history | trace span |
| `AuditEvent` | accountability evidence | observability log |
| `EvalCase` | regression sample | anecdotal success |
| `MemoryProposal` | reviewed learning candidate | conversation history |

## Run Contract

Store this before any write:

```json
{
  "run_id": "run_bed_1042",
  "agent_version_id": "bedflow-agent:v12",
  "work_object": {
    "type": "encounter",
    "id": "E-1042",
    "tenant_id": "hospital-a",
    "surface": "bed-board"
  },
  "requested_by": {
    "user_id": "u-221",
    "role": "charge-nurse",
    "channel": "voice"
  },
  "context_manifest_id": "ctx_884",
  "access_decision_id": "access_553",
  "allowed_side_effect_level": "approval_required",
  "required_records": [
    "source_references",
    "policy_decision",
    "approval",
    "workflow_events",
    "verification_result",
    "audit_events"
  ],
  "stop_conditions": [
    "ambiguous_work_object",
    "policy_denied",
    "approval_rejected",
    "source_reconciliation_failed",
    "tool_budget_exceeded"
  ]
}
```

## Bed-Flow Slice

Input:

```text
Book a monitored bed for this patient.
```

The product must not call `reserve_bed` from this text. It must create a governed run.

``` mermaid
sequenceDiagram
  participant User
  participant Surface as Bed board or voice surface
  participant Binder as Context binder
  participant Runtime as Owner agent
  participant Capacity as Capacity specialist
  participant Policy as Policy gateway
  participant Approval as Approval service
  participant Workflow as Bed reservation workflow
  participant Source as ADT and bed board
  participant Verify as Verifier

  User->>Surface: "Book a monitored bed for this patient"
  Surface->>Binder: transcript + selected encounter + session
  Binder->>Runtime: ContextManifest + AccessDecision
  Runtime->>Capacity: rank monitored beds
  Capacity-->>Runtime: candidates + source references
  Runtime->>Policy: preview reserve_bed payload
  Policy-->>Approval: approval_required + payload hash
  Approval-->>Workflow: approved payload + resume token
  Workflow->>Source: reserve with idempotency key
  Source-->>Workflow: SourceResponse
  Workflow-->>Verify: result
  Verify-->>Surface: completed or needs_reconciliation
```

Minimum UI surface:

| Panel | Shows |
|---|---|
| Context | encounter, facility, actor, role, source freshness |
| Evidence | source references and candidate beds |
| Proposal | exact reservation payload |
| Approval | approve, modify, reject, clarify, escalate |
| Timeline | workflow and reconciliation status |
| Learning | eval case or reviewed memory proposal |

## Specialist Limits

| Specialist | Allowed | Forbidden |
|---|---|---|
| Context resolver | identify encounter, facility, user role | rank or reserve beds |
| Capacity specialist | read capacity and constraints | create hold |
| Policy specialist | explain applicable rule | override policy service |
| Communication drafter | draft notification | send before workflow confirms |
| Reconciliation specialist | compare ADT, bed board, timeline | mark complete from model text |

Subagents return evidence-bound results. They do not receive ambient authority.

## Memory And Skill Updates

``` mermaid
flowchart LR
  Run["Production run"] --> Signal["Correction or failure"]
  Signal --> Eval["Eval case"]
  Signal --> Memory["Memory proposal"]
  Signal --> Skill["Skill change request"]
  Memory --> Review["Owner review"]
  Skill --> Review
  Eval --> Gate["Release gate"]
  Review --> Gate
  Gate --> Version["Pinned version"]
  Version --> Canary["Canary or rollback"]
```

Rules:

- run state is not memory
- patient facts are not durable memory by default
- memory needs source, scope, owner, retention, correction, deletion, and use audit
- skill changes need versioning, evals, release notes, rollback, and runtime proof
- production behavior changes only through a release bundle

## Release Gate

Replay these before promotion:

| Eval family | Blocks release when |
|---|---|
| context binding | ambiguous work object reaches tool call |
| authority | denied scope reaches source adapter |
| approval | modified payload executes under old hash |
| workflow | retry duplicates side effect |
| source truth | mismatch becomes completed |
| memory | sensitive fact becomes durable memory |
| audit | side effect lacks correlated audit event |

## Source Anchors

| Source family | Product use |
|---|---|
| ReAct, MRKL, Toolformer | trajectories, modular tool routing, tool-call evidence |
| Reflexion, Generative Agents, Voyager | reviewed memory and skill lifecycle, not silent mutation |
| WebArena, AgentBench, GAIA, SWE-agent | long-horizon failure modes and interface sensitivity |
| LangGraph, Deep Agents, OpenAI Agents SDK, Vercel AI SDK | orchestration primitives |
| MCP, A2A | tool/resource contracts and delegated-agent boundaries |
| OpenTelemetry GenAI, W3C Trace Context, CloudEvents | correlation and observability |
| OAuth, OIDC, SMART App Launch, FHIR, HIPAA | identity, healthcare context, and regulated records |
| OWASP LLM Top 10, NIST AI RMF, ISO 42001 | risk, governance, and lifecycle controls |
| Temporal, Inngest, Cloudflare Workflows | durable side-effect execution |

See [References](references.md) and [Source atlas](source-atlas.md) for the source inventory.

## Decision Test

For every proposed agent feature, answer:

```text
What object is the agent acting on?
What authority does it have?
What evidence did it use?
What exact action did it propose?
Who approved it?
What workflow executed it?
What did the source system confirm?
What did the user see?
What was audited?
What became an eval?
What can become memory or a skill?
Which version will behave this way tomorrow?
```
