# System Diagram Spine

Canonical diagrams for the product architecture.

Each diagram answers one implementation question. Use the `Expand` control on a rendered diagram to inspect it.

## Diagram Index

| Priority | Diagram | Purpose | Canonical owner |
|---|---|---|---|
| 1 | Product record ERD | Define durable objects and required links. | [Product object model lab](product-object-model-lab.md) |
| 2 | AgentRun state machine | Define valid run states and failure transitions. | [Runtime ledger](runtime-ledger.md) |
| 3 | Minimum vertical slice sequence | Define API order, records written, gates, and stop points. | [Architecture blueprint](architecture-blueprint.md) |
| 4 | Deployment container topology | Define deployable services, stores, adapters, and observability boundaries. | [Deployment topology lab](deployment-topology-lab.md) |
| 5 | Correlation spine | Define how IDs propagate across product, workflow, trace, audit, and eval stores. | [Runtime ledger](runtime-ledger.md) |
| 6 | Policy and approval gate flow | Define allow, deny, clarify, approval, stale-payload, and workflow-only branches. | [Approval handoff](approval-handoff.md) |

## 1. Product Record ERD

Question: what records must exist before a product agent can safely act?

``` mermaid
erDiagram
  AGENT ||--o{ AGENT_VERSION : releases
  RELEASE_BUNDLE ||--o{ AGENT_VERSION : pins
  AGENT_VERSION ||--o{ AGENT_RUN : executes
  AGENT_RUN ||--|| CONTEXT_MANIFEST : binds
  CONTEXT_MANIFEST ||--o{ SOURCE_REFERENCE : cites
  AGENT_RUN ||--o{ ACCESS_DECISION : checks
  AGENT_RUN ||--o{ TASK_GRAPH : plans
  AGENT_RUN ||--o{ SPECIALIST_HANDOFF : delegates
  AGENT_RUN ||--o{ TOOL_CALL : records
  TOOL_REGISTRY ||--o{ TOOL_CALL : validates
  TOOL_CALL ||--o{ POLICY_DECISION : gates
  POLICY_DECISION ||--o{ APPROVAL : requires
  APPROVAL ||--o{ WORKFLOW_RUN : resumes
  WORKFLOW_RUN ||--o{ WORKFLOW_EVENT : emits
  WORKFLOW_EVENT ||--o{ SOURCE_RESPONSE : confirms
  SOURCE_RESPONSE ||--o{ VERIFICATION_RESULT : reconciles
  AGENT_RUN ||--o{ TIMELINE_EVENT : projects
  AGENT_RUN ||--o{ AUDIT_EVENT : audits
  AGENT_RUN ||--o{ TRACE_SPAN : traces
  AGENT_RUN ||--o{ MEMORY_PROPOSAL : proposes
  AGENT_RUN ||--o{ EVAL_CASE : samples
  EVAL_CASE ||--o{ EVAL_RUN : evaluates
  EVAL_RUN ||--o{ RELEASE_BUNDLE : gates
```

Rule: every side effect must be reconstructable from `AgentRun`, `ToolCall`, `PolicyDecision`, `Approval`, `WorkflowEvent`, `SourceResponse`, `VerificationResult`, `TimelineEvent`, and `AuditEvent`.

## 2. AgentRun State Machine

Question: which run states can the UI, workflow engine, and incident process trust?

``` mermaid
stateDiagram-v2
  [*] --> received
  received --> binding_context
  binding_context --> clarification_required: ambiguous object
  clarification_required --> binding_context: user resolves
  binding_context --> denied: user or agent scope denied
  binding_context --> planning
  planning --> gathering_evidence
  gathering_evidence --> failed: read failure not recoverable
  gathering_evidence --> proposing_action
  proposing_action --> denied: policy denied
  proposing_action --> clarification_required: policy needs missing evidence
  proposing_action --> waiting_for_approval: approval required
  proposing_action --> executing_workflow: low-risk allowed action
  waiting_for_approval --> rejected: human rejects
  waiting_for_approval --> expired: approval expires
  waiting_for_approval --> proposing_action: human modifies payload
  waiting_for_approval --> executing_workflow: exact payload approved
  executing_workflow --> cancelling: user or operator cancels
  executing_workflow --> needs_reconciliation: source mismatch
  executing_workflow --> failed: workflow failure
  executing_workflow --> verifying
  verifying --> needs_reconciliation: source truth disagrees
  verifying --> completed: source truth confirms
  completed --> sampled_for_eval
  needs_reconciliation --> completed: operator resolves
  needs_reconciliation --> failed: compensation fails
  sampled_for_eval --> [*]
  denied --> [*]
  rejected --> [*]
  expired --> [*]
  failed --> [*]
```

Rule: no UI may show `completed` from model text. Completion requires source confirmation or an explicit human reconciliation record.

## 3. Minimum Vertical Slice Sequence

Question: what is the smallest end-to-end build that proves the architecture?

``` mermaid
sequenceDiagram
  participant Surface as Work surface
  participant RunAPI as AgentRun API
  participant Binder as Context binder
  participant Runtime as Agent runtime
  participant Gateway as Tool gateway
  participant Policy as Policy gateway
  participant Approval as Approval service
  participant Workflow as Durable workflow
  participant Source as Source adapter
  participant Ledger as Timeline/Audit/Trace
  participant Eval as Eval harness

  Surface->>RunAPI: POST /agent-runs
  RunAPI->>Ledger: AgentRun + received TimelineEvent
  RunAPI->>Binder: bind session, tenant, work object
  Binder-->>RunAPI: ContextManifest + AccessDecision
  RunAPI->>Runtime: start pinned AgentVersion
  Runtime->>Gateway: read source tools
  Gateway->>Policy: check grants and data class
  Policy-->>Gateway: allow read
  Gateway->>Source: read source snapshot
  Source-->>Runtime: SourceReference bundle
  Runtime->>Gateway: preview side-effect tool
  Gateway->>Policy: classify side effect
  Policy-->>Approval: approval_required with exact payload
  Approval-->>Workflow: approved payload + resume token
  Workflow->>Source: execute write with idempotency key
  Source-->>Workflow: SourceResponse
  Workflow->>Ledger: WorkflowEvent + AuditEvent
  Workflow->>RunAPI: VerificationResult
  RunAPI->>Eval: create EvalCase from trajectory
```

Rule: pass this sequence with a fake bed hold before broader agent platform work starts.

## 4. Deployment Container Topology

Question: which deployable component owns each enforcement boundary?

``` mermaid
flowchart TB
  subgraph Client["Product surfaces"]
    Voice["Voice or command bar"]
    WorkPanel["Work object panel"]
    ApprovalUI["Approval inbox"]
    Console["Run console"]
  end

  subgraph Control["Control plane"]
    AgentRegistry["Agent registry"]
    CapabilityRegistry["Capability registry"]
    ReleaseGate["Eval and release gate"]
    IncidentControl["Pause, revoke, rollback"]
  end

  subgraph Runtime["Runtime plane"]
    RunAPI["AgentRun API"]
    ContextBinder["Context binder"]
    AgentHarness["Agent harness"]
    ToolGateway["Tool gateway"]
    PolicyGateway["Policy gateway"]
  end

  subgraph Workflow["Execution plane"]
    ApprovalService["Approval service"]
    WorkflowEngine["Workflow engine"]
    SourceAdapters["Source adapters"]
    EventBus["Event bus"]
  end

  subgraph Stores["Stores"]
    ProductDB["Product DB"]
    WorkflowHistory["Workflow history"]
    TraceStore["Trace store"]
    AuditLog["Audit log"]
    EvalStore["Eval datasets"]
    MemoryStore["Memory store"]
  end

  subgraph Sources["External and domain systems"]
    EHR["EHR/ADT/bed board"]
    Calendar["Calendar/CRM"]
    Billing["Billing/ticketing"]
    Repo["Git/CI"]
  end

  Client --> RunAPI
  RunAPI --> ContextBinder
  ContextBinder --> PolicyGateway
  AgentHarness --> ToolGateway
  ToolGateway --> PolicyGateway
  PolicyGateway --> ApprovalService
  ApprovalService --> WorkflowEngine
  WorkflowEngine --> SourceAdapters
  SourceAdapters --> Sources
  WorkflowEngine --> EventBus
  EventBus --> ProductDB
  EventBus --> AuditLog
  AgentHarness --> TraceStore
  RunAPI --> ProductDB
  ReleaseGate --> EvalStore
  CapabilityRegistry --> ToolGateway
  AgentRegistry --> AgentHarness
  IncidentControl --> RunAPI
  IncidentControl --> ToolGateway
  MemoryStore --> AgentHarness
```

Rule: the model is not an enforcement boundary. Enforcement lives in context binding, capability grants, policy, approval, workflow, source adapters, audit, and release gates.

## 5. Correlation Spine

Question: which IDs must move together for debug, audit, replay, and eval sampling?

``` mermaid
flowchart LR
  Request["request_id"] --> Run["run_id"]
  Run --> Trace["trace_id"]
  Run --> Context["context_manifest_id"]
  Run --> Access["access_decision_id"]
  Run --> Tool["tool_call_id"]
  Tool --> Policy["policy_decision_id"]
  Policy --> Approval["approval_id"]
  Approval --> Workflow["workflow_id"]
  Workflow --> Source["source_response_id"]
  Source --> Verify["verification_id"]
  Run --> Timeline["timeline_event_id"]
  Run --> Audit["audit_id"]
  Run --> Eval["eval_case_id"]
  Run --> Memory["memory_proposal_id"]

  Trace --> TraceStore["trace store"]
  Audit --> AuditLog["audit log"]
  Workflow --> WorkflowHistory["workflow history"]
  Timeline --> ProductTimeline["product timeline"]
  Eval --> EvalDataset["eval dataset"]
  Memory --> MemoryReview["memory review queue"]
```

Rule: every write-side effect needs `run_id`, `tool_call_id`, `policy_decision_id`, `approval_id` when applicable, `workflow_id`, `source_response_id`, `audit_id`, and `trace_id`.

## 6. Policy And Approval Gate Flow

Question: how does a proposed action become allowed, denied, clarified, or approval-bound?

``` mermaid
flowchart TD
  Proposed["Tool call or action proposal"] --> Schema["Schema validation"]
  Schema -->|invalid| DenyMalformed["deny: malformed payload"]
  Schema --> Scope["Agent + user + tenant + object scope"]
  Scope -->|denied| DenyScope["deny: insufficient authority"]
  Scope --> SourceACL["Source-system ACL and connector grant"]
  SourceACL -->|denied| DenySource["deny: source access"]
  SourceACL --> DataClass["Data class and side-effect class"]
  DataClass -->|read-only allowed| ExecuteRead["execute read tool"]
  DataClass -->|missing evidence| Clarify["clarification required"]
  DataClass -->|low-risk allowed| WorkflowOnly["workflow-only execution"]
  DataClass -->|write or external communication| ApprovalRequired["approval required"]
  ApprovalRequired --> ApprovalRecord["Approval record + payload hash"]
  ApprovalRecord -->|approved exact payload| Resume["resume workflow"]
  ApprovalRecord -->|modified| NewHash["new payload hash; re-check policy"]
  ApprovalRecord -->|rejected| Rejected["stop run or replan"]
  ApprovalRecord -->|expired| Expired["expire resume token"]
  NewHash --> Proposed
  WorkflowOnly --> Resume
  Resume --> Idempotency["idempotency key"]
  Idempotency --> SourceWrite["source adapter write"]
  SourceWrite --> Verify["source reconciliation"]
```

Rule: approval authorizes only the canonical payload hash shown to the approver. Any modification re-enters policy.

## Diagram Backlog

| Diagram | Next page to update | Acceptance |
|---|---|---|
| Owner-agent and specialist graph | [Deep agent application architecture](deep-agent-application-architecture.md) | Shows owner synthesis, scoped subagents, workspace artifacts, prohibited authority. |
| Source reconciliation state machine | [Runtime ledger](runtime-ledger.md) | Shows `waiting`, `completed`, `needs_reconciliation`, `failed`, `cancelled`. |
| Release bundle dependency graph | [Eval and release harness](eval-release-harness.md) | Shows model, prompt, tools, policy, workflow, memory schema, eval run, rollout. |
| Store ownership map | [Product object model lab](product-object-model-lab.md) | Shows product DB, workflow history, audit log, trace store, eval store, memory store. |
| Product view projection map | [Product UX surfaces](product-ux-surfaces.md) | Shows what timeline, approval inbox, run console, memory center, and audit export read. |
