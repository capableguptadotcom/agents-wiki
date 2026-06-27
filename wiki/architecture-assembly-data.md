---
title: "Architecture Assembly Data"
---

This markdown file is the source of truth for the Architecture Assembly interactive lab in [interactive.html](interactive.html#walkthrough).

The generated browser data file is built by `scripts/generate-assembly-data.mjs` and is not the durable source. Edit this markdown block first, then regenerate.

```json assembly-data
{
  "layers": [
    {
      "key": "surface",
      "label": "Work surface",
      "owner": "Product UX and domain team",
      "theory": "The interface is part of the agent system. It supplies work-object context, command affordances, preview states, recovery actions, and user trust.",
      "standards": [
        "W3C Trace Context for correlation",
        "host app identity",
        "domain UI contracts"
      ],
      "cases": [
        "Slack agents",
        "Atlassian Rovo",
        "GitHub coding agent"
      ],
      "deepDive": "product-ux-surfaces.html"
    },
    {
      "key": "context",
      "label": "Context binder",
      "owner": "Product platform",
      "theory": "The model should not guess the tenant, patient, account, ticket, repo, selected object, or source snapshot. Bind them before reasoning.",
      "standards": [
        "OIDC claims",
        "SMART launch context",
        "FHIR Encounter when healthcare",
        "domain source references"
      ],
      "cases": [
        "Copilot Studio channels",
        "Agentforce data grounding",
        "healthcare command centers"
      ],
      "deepDive": "intent-to-action-router.html"
    },
    {
      "key": "authority",
      "label": "Authority chain",
      "owner": "Identity, security, and platform",
      "theory": "Agent authority is the intersection of user authority, agent release, connector grant, tool policy, source ACL, and approval state.",
      "standards": [
        "OAuth 2.0",
        "OIDC",
        "SMART scopes",
        "MCP authorization",
        "OWASP excessive agency"
      ],
      "cases": [
        "Microsoft Copilot Studio governance",
        "ServiceNow workflow permissions"
      ],
      "deepDive": "identity-access-lab.html"
    },
    {
      "key": "agentLoop",
      "label": "Agent loop",
      "owner": "Agent runtime team",
      "theory": "The loop plans, observes, calls read tools, clarifies, and drafts proposals under step budgets and stop conditions.",
      "standards": [
        "ReAct trajectories",
        "Toolformer-style tool traces",
        "OpenAI Agents SDK",
        "Vercel AI SDK",
        "LangGraph"
      ],
      "cases": [
        "Vercel AI SDK agents",
        "OpenAI Agents SDK",
        "LangGraph deep agents"
      ],
      "deepDive": "deep-agent-runbook.html"
    },
    {
      "key": "capability",
      "label": "Capability gateway",
      "owner": "Platform and connector team",
      "theory": "Tools, resources, prompts, workflows, and skills are capability grants, not model suggestions. The gateway owns schema, scope, and side-effect classification.",
      "standards": [
        "MCP latest specification",
        "OpenAPI",
        "JSON Schema",
        "FHIR resources",
        "CloudEvents"
      ],
      "cases": [
        "Agentforce actions",
        "ServiceNow AI Agent Studio",
        "Cloudflare Agents tools"
      ],
      "deepDive": "capability-registry.html"
    },
    {
      "key": "approval",
      "label": "Approval and handoff",
      "owner": "Product risk owner",
      "theory": "High-impact side effects pause on an exact payload. Approval is a record with approver, payload hash, decision, and resume token.",
      "standards": [
        "NIST AI RMF oversight",
        "Vercel human-in-the-loop",
        "LangGraph interrupts",
        "Temporal workflow messages"
      ],
      "cases": [
        "Vercel HITL examples",
        "enterprise workflow approval inboxes"
      ],
      "deepDive": "approval-handoff.html"
    },
    {
      "key": "workflow",
      "label": "Durable workflow",
      "owner": "Workflow platform",
      "theory": "Long-running side effects need durable history, idempotency, waits, retries, cancellation, compensation, and recovery independent of the chat turn.",
      "standards": [
        "Temporal workflows",
        "Inngest functions",
        "Cloudflare Workflows",
        "CloudEvents"
      ],
      "cases": [
        "ServiceNow workflows",
        "Cloudflare Agents with Workflows"
      ],
      "deepDive": "durable-execution.html"
    },
    {
      "key": "sourceTruth",
      "label": "Source truth",
      "owner": "Domain integration team",
      "theory": "The system of record decides what is true. Agent output, memory, and workflow state must reconcile with source responses.",
      "standards": [
        "FHIR",
        "SMART App Launch",
        "calendar APIs",
        "CRM APIs",
        "git and CI APIs"
      ],
      "cases": [
        "healthcare command centers",
        "Agentforce CRM grounding",
        "GitHub PR checks"
      ],
      "deepDive": "source-system-integration-lab.html"
    },
    {
      "key": "memorySkill",
      "label": "Memory and skills",
      "owner": "AgentOps and domain owners",
      "theory": "Learning changes future behavior. Store only sourced, scoped, reviewed, correctable, and release-tested memory or skill changes.",
      "standards": [
        "Reflexion",
        "Generative Agents",
        "Voyager",
        "OWASP memory poisoning risks",
        "NIST GenAI Profile"
      ],
      "cases": [
        "LangGraph memory",
        "Cloudflare Agents state",
        "enterprise custom instructions"
      ],
      "deepDive": "skill-lifecycle-lab.html"
    },
    {
      "key": "observability",
      "label": "Observability and audit",
      "owner": "SRE, compliance, and platform",
      "theory": "Traces explain runtime behavior; audit proves accountability. They share correlation IDs but serve different readers.",
      "standards": [
        "OpenTelemetry GenAI semantic conventions",
        "W3C Trace Context",
        "audit-control requirements"
      ],
      "cases": [
        "Sentry Seer-style investigation",
        "GitHub coding-agent logs",
        "ServiceNow control tower patterns"
      ],
      "deepDive": "runtime-ledger.html"
    },
    {
      "key": "release",
      "label": "Eval and release",
      "owner": "AgentOps release owner",
      "theory": "Production signals become offline evals, release gates, canaries, rollback plans, and autonomy promotion evidence.",
      "standards": [
        "AgentBench",
        "WebArena",
        "GAIA",
        "NIST AI RMF",
        "ISO/IEC 42001"
      ],
      "cases": [
        "GitHub coding-agent review loops",
        "ServiceNow AI Control Tower positioning"
      ],
      "deepDive": "eval-release-harness.html"
    }
  ],
  "scenarios": {
    "bed": {
      "label": "Healthcare bed flow",
      "domain": "regulated operations",
      "intent": "Hold the best monitored bed for this ED patient.",
      "user": "charge nurse in the ED bed board",
      "risk": "PHI, operational write, patient-flow impact",
      "sourceTruth": "EHR, ADT, bed board, staffing roster, facility policy",
      "outcome": "bed hold created only after source reread and exact approval",
      "layers": {
        "surface": {
          "example": "Voice command is captured inside the active ED bed-board screen.",
          "record": "TimelineEvent plus AgentRun input envelope",
          "upstream": "selected encounter, facility, authenticated nurse session",
          "downstream": "context binder receives one work object and source snapshot requirement",
          "invariant": "Detached voice cannot act on a patient until one encounter is bound.",
          "failure": "The agent reserves a bed for the wrong patient or facility.",
          "test": "Ambiguous or detached voice command asks for the exact encounter.",
          "implementation": "Add a command surface that passes selected object IDs, not only transcript text."
        },
        "context": {
          "example": "Binder resolves encounter E-1042, facility, role, unit, bed-board timestamp, monitoring need, and isolation state.",
          "record": "ContextManifest",
          "upstream": "surface envelope and SMART/FHIR launch context",
          "downstream": "agent loop can read only source references named in the manifest",
          "invariant": "The model never invents encounter, patient, role, or source version.",
          "failure": "Correct tool call runs against stale or cross-facility context.",
          "test": "Wrong facility, stale bed-board, or missing encounter blocks all tools.",
          "implementation": "Build a ContextManifest table with source_reference rows and freshness rules."
        },
        "authority": {
          "example": "Nurse session, bedflow-agent release, SMART scopes, facility policy, and tool grant intersect.",
          "record": "AccessDecision",
          "upstream": "authenticated user, agent version, connector grant, context manifest",
          "downstream": "capability gateway denies or allows each read and write",
          "invariant": "Agent authority is narrower than both user authority and connector capability.",
          "failure": "A broad EHR token is laundered through the agent.",
          "test": "Wrong token audience or missing facility role denies the MCP or source tool.",
          "implementation": "Store effective-authority decisions per tool call with user, agent, connector, and source evidence."
        },
        "agentLoop": {
          "example": "Agent reads capacity, patient constraints, staffing, and discharges, then ranks candidate beds.",
          "record": "AgentStep sequence",
          "upstream": "context manifest, access decision, read tool grants",
          "downstream": "proposal for reserve_bed_preview with uncertainty and alternatives",
          "invariant": "The loop can propose a write but cannot execute it.",
          "failure": "The model acts confident while missing isolation or staffing evidence.",
          "test": "Missing monitoring or isolation source forces clarification or read retry.",
          "implementation": "Use a step budget, required evidence checklist, and stop-before-write rule."
        },
        "capability": {
          "example": "Gateway exposes fetch_capacity_snapshot, rank_candidate_beds, reserve_bed_preview, and workflow-only reserve_bed.",
          "record": "ToolCall plus ToolGrant",
          "upstream": "agent step request, schemas, access decision",
          "downstream": "approval card or durable workflow receives an immutable payload",
          "invariant": "Write tools are not directly available to prompt text.",
          "failure": "MCP exposes a broad EHR action surface beyond bed flow.",
          "test": "Unregistered tool, wrong schema, or side-effect mismatch is denied.",
          "implementation": "Register tools with side_effect, data_class, idempotency, approval, and source reread metadata."
        },
        "approval": {
          "example": "Approver reviews reserve_bed(encounter_id=E-1042, bed_id=T-418, hold_minutes=20).",
          "record": "Approval",
          "upstream": "tool proposal, source links, policy decision, ranked alternatives",
          "downstream": "workflow receives resume token and approved payload hash",
          "invariant": "Approval binds one exact payload, not future bed-write permission.",
          "failure": "User approves a vague natural-language summary and hidden arguments change.",
          "test": "Payload mutation after approval invalidates the resume token.",
          "implementation": "Hash approval payloads and store approved, modified, rejected, and clarified decisions."
        },
        "workflow": {
          "example": "Workflow rereads bed status, reserves hold, notifies unit, creates transport task, and handles expiry.",
          "record": "WorkflowEvent history",
          "upstream": "approved payload, idempotency key, service credential",
          "downstream": "source systems, timeline, audit, reconciliation",
          "invariant": "Retries cannot create duplicate holds or skip compensation.",
          "failure": "Worker restart loses a half-completed bed reservation.",
          "test": "Timeout, duplicate retry, expired hold, and cancellation fixtures pass.",
          "implementation": "Use a durable workflow engine for writes, waits, expiry, and compensation."
        },
        "sourceTruth": {
          "example": "ADT or bed-management API confirms whether T-418 is still available before and after the hold.",
          "record": "SourceResponse and ReconciliationRecord",
          "upstream": "workflow action and source adapter",
          "downstream": "product state, timeline, eval sampler",
          "invariant": "Workflow success is not enough if the source system disagrees.",
          "failure": "The UI claims a bed is held while ADT shows conflict.",
          "test": "Source mismatch blocks completed status and creates recovery task.",
          "implementation": "Persist source response IDs, versions, and reconciliation status for every write."
        },
        "memorySkill": {
          "example": "A unit escalation preference may become reviewed organization memory; patient facts never become durable memory.",
          "record": "MemoryProposal or SkillVersion proposal",
          "upstream": "trace evidence, user correction, incident review",
          "downstream": "owner review, eval gate, future retrieval policy",
          "invariant": "Nothing learned from PHI affects future runs without source, scope, review, and deletion path.",
          "failure": "A stale patient-specific bed fact changes a future placement.",
          "test": "Patient-specific or unsupported memory proposals remain unavailable.",
          "implementation": "Route learning through proposal, review, release, retrieval audit, and deletion jobs."
        },
        "observability": {
          "example": "Trace spans cover model, retrieval, tool, approval, workflow, source adapter, and audit correlation.",
          "record": "TraceSpan, AuditEvent, RuntimeLedger row",
          "upstream": "every layer emits correlation IDs",
          "downstream": "run console, compliance export, incident review, eval sampler",
          "invariant": "Trace and audit are linked but redacted for their audiences.",
          "failure": "Incident review cannot prove who approved or which source data was used.",
          "test": "Every write has run_id, trace_id, approval_id, workflow_id, and source_response_id.",
          "implementation": "Adopt GenAI span naming and a separate append-only audit log with redaction policy."
        },
        "release": {
          "example": "The run is sampled into bed-flow regressions for ambiguity, source reread, approval, duplicate hold, and memory denial.",
          "record": "EvalCase, EvalRun, ReleaseBundle",
          "upstream": "trace, audit, user correction, incident outcome",
          "downstream": "release gate, canary, rollback, skill version",
          "invariant": "Agent behavior changes only through versioned releases.",
          "failure": "A prompt edit breaks approval behavior in production.",
          "test": "No release if bed-write, memory, source mismatch, or denial cases fail.",
          "implementation": "Build trajectory evals from production records and gate model, prompt, tool, policy, and skill changes."
        }
      }
    },
    "schedule": {
      "label": "Enterprise scheduling",
      "domain": "customer operations",
      "intent": "Schedule the quarterly review with the right people next week.",
      "user": "customer success manager in an account workspace",
      "risk": "private calendar data, external communication, customer trust",
      "sourceTruth": "calendar provider, directory, CRM account timeline",
      "outcome": "invite sent only after attendee, slot, agenda, and external-message approval",
      "layers": {
        "surface": {
          "example": "Command starts from account ACME-42, not generic chat.",
          "record": "AgentRun input envelope",
          "upstream": "account page, requester identity, current customer context",
          "downstream": "binder receives account ID and channel intent",
          "invariant": "Scheduling intent is attached to one account before reading calendars.",
          "failure": "Agent invites the wrong customer or uses another account's context.",
          "test": "Detached command asks for account and audience.",
          "implementation": "Pass selected account, channel, and external-send affordance to the command handler."
        },
        "context": {
          "example": "Binder resolves account team, customer contacts, target week, timezone, and meeting type.",
          "record": "ContextManifest",
          "upstream": "account workspace and CRM timeline",
          "downstream": "calendar and directory reads are scoped to required participants",
          "invariant": "Private calendar details are minimized before the model sees results.",
          "failure": "Calendar titles or unrelated attendees leak into reasoning.",
          "test": "Calendar adapter returns availability windows, not raw event details.",
          "implementation": "Represent availability, attendee roles, and timezone evidence as structured context."
        },
        "authority": {
          "example": "User can draft and approve account invites; agent can read availability through scoped calendar grant.",
          "record": "AccessDecision",
          "upstream": "OAuth grant, CRM role, account ownership",
          "downstream": "tool gateway allows read_calendars but gates send_customer_invite",
          "invariant": "Calendar access does not imply permission to send customer messages.",
          "failure": "Agent sends external mail without organizer authority.",
          "test": "Missing organizer permission blocks send tool.",
          "implementation": "Separate calendar read grant, CRM account authority, and external-send approval."
        },
        "agentLoop": {
          "example": "Agent resolves attendees, ranks slots, drafts agenda, and asks for missing required participants.",
          "record": "AgentStep sequence",
          "upstream": "context and read grants",
          "downstream": "exact invite draft for approval",
          "invariant": "The loop stops before external communication.",
          "failure": "Agent invents attendees or books an impossible timezone.",
          "test": "Missing required role triggers clarification.",
          "implementation": "Use attendee confidence thresholds and slot-ranking evidence."
        },
        "capability": {
          "example": "Gateway exposes resolve_attendees, read_availability, rank_slots, draft_invite, and send_customer_invite.",
          "record": "ToolCall plus ToolGrant",
          "upstream": "agent plan and schemas",
          "downstream": "approval card or send workflow",
          "invariant": "The calendar connector exposes scheduling tools, not whole mailbox access.",
          "failure": "MCP server exposes unrelated mail or file actions.",
          "test": "Unrelated connector tools are unavailable.",
          "implementation": "Register a narrow calendar tool surface with data minimization outputs."
        },
        "approval": {
          "example": "Approver sees recipients, time, agenda, customer-facing text, and source links.",
          "record": "Approval",
          "upstream": "draft invite and policy decision",
          "downstream": "meeting workflow receives approved payload hash",
          "invariant": "Approval is for one invite version.",
          "failure": "Recipient list changes after approval.",
          "test": "Recipient or body mutation invalidates approval.",
          "implementation": "Version invite drafts and bind approval to recipients plus body."
        },
        "workflow": {
          "example": "Workflow creates hold, sends invite, watches delivery, and records reschedule requests.",
          "record": "WorkflowEvent",
          "upstream": "approved invite",
          "downstream": "calendar provider, CRM timeline, notification surface",
          "invariant": "Retry does not duplicate invites.",
          "failure": "Network retry sends two customer invites.",
          "test": "Duplicate send uses same idempotency key.",
          "implementation": "Use provider message IDs and reconciliation events."
        },
        "sourceTruth": {
          "example": "Calendar provider confirms event ID and CRM timeline records the meeting.",
          "record": "SourceResponse",
          "upstream": "workflow and adapters",
          "downstream": "account timeline and run completion",
          "invariant": "Product state reflects provider confirmation.",
          "failure": "Timeline says scheduled while provider rejected invite.",
          "test": "Provider failure keeps run in recovery.",
          "implementation": "Reconcile calendar event ID, recipients, and CRM activity ID."
        },
        "memorySkill": {
          "example": "User-approved agenda preference may be stored; private calendar content is never durable memory.",
          "record": "MemoryProposal",
          "upstream": "approved edit or repeated user correction",
          "downstream": "future drafts for same user only",
          "invariant": "Deletion stops future personalization.",
          "failure": "Another user's calendar detail influences future invites.",
          "test": "Cross-user preference retrieval is denied.",
          "implementation": "Scope preference memory to user, meeting type, and retention."
        },
        "observability": {
          "example": "Trace links account command, attendee resolution, availability reads, approval, send workflow, and provider response.",
          "record": "TraceSpan and AuditEvent",
          "upstream": "surface, tools, approval, workflow",
          "downstream": "support investigation and eval sampling",
          "invariant": "Private calendar data is redacted from general traces.",
          "failure": "Customer complains and team cannot prove exact approved text.",
          "test": "Audit export includes approved invite hash and recipient list.",
          "implementation": "Keep redacted traces and full approval audit under separate access controls."
        },
        "release": {
          "example": "Timezone, attendee ambiguity, external-send approval, and duplicate-send cases gate scheduling changes.",
          "record": "EvalRun",
          "upstream": "production corrections and failed sends",
          "downstream": "agent release and canary",
          "invariant": "External-message behavior cannot change without regression coverage.",
          "failure": "New prompt sends invites before approval.",
          "test": "No release if external-send stop condition fails.",
          "implementation": "Replay golden scheduling trajectories before prompt or tool upgrades."
        }
      }
    },
    "support": {
      "label": "Support resolution",
      "domain": "service operations",
      "intent": "Resolve this billing dispute and credit the customer if policy allows.",
      "user": "support lead in a ticket workspace",
      "risk": "financial write, customer communication, policy drift",
      "sourceTruth": "ticket system, CRM, billing ledger, policy knowledge base",
      "outcome": "credit and customer reply proceed only with policy evidence and approval threshold",
      "layers": {
        "surface": {
          "example": "Command starts from ticket TCK-912 with customer and invoice visible.",
          "record": "AgentRun input envelope",
          "upstream": "ticket view and queue assignment",
          "downstream": "context binder resolves customer, invoice, and policy domain",
          "invariant": "The agent cannot act on a customer without the ticket object.",
          "failure": "Credit is applied to the wrong account.",
          "test": "Missing or duplicate account binding asks for clarification.",
          "implementation": "Attach ticket, customer, invoice, queue, and requester role to commands."
        },
        "context": {
          "example": "Binder resolves account, invoice, entitlement, payment state, and active policy version.",
          "record": "ContextManifest",
          "upstream": "ticket, CRM, billing, policy KB",
          "downstream": "agent loop reads only relevant billing and policy evidence",
          "invariant": "Policy version is explicit in every recommendation.",
          "failure": "Agent uses stale refund policy.",
          "test": "Stale or missing policy source blocks credit proposal.",
          "implementation": "Make policy KB version and billing source IDs required context fields."
        },
        "authority": {
          "example": "Support lead may approve small credits; finance approval is required over threshold.",
          "record": "AccessDecision",
          "upstream": "user role, account segment, financial threshold",
          "downstream": "gateway classifies credit_customer as approval or escalation",
          "invariant": "Customer communication authority is separate from ledger authority.",
          "failure": "Agent sends a promise before ledger approval.",
          "test": "Credit over threshold routes to finance approval.",
          "implementation": "Encode finance thresholds and communication holds in policy."
        },
        "agentLoop": {
          "example": "Agent compares ticket claims, invoice evidence, contract terms, and policy exceptions.",
          "record": "AgentStep sequence",
          "upstream": "context and read tools",
          "downstream": "credit proposal plus customer-reply draft",
          "invariant": "The loop cites evidence for every policy conclusion.",
          "failure": "Agent hallucinates refund eligibility.",
          "test": "Unsupported policy citation blocks draft approval.",
          "implementation": "Require citation coverage for ledger writes and customer replies."
        },
        "capability": {
          "example": "Gateway exposes read_invoice, retrieve_policy, draft_reply, propose_credit, and workflow-only apply_credit.",
          "record": "ToolGrant",
          "upstream": "schemas and policy classification",
          "downstream": "approval card or finance workflow",
          "invariant": "Billing writes never execute from model text.",
          "failure": "Generic connector gives the agent broad ledger access.",
          "test": "Unscoped ledger writes are denied.",
          "implementation": "Put billing tools behind a typed facade with idempotency and threshold policy."
        },
        "approval": {
          "example": "Approver reviews credit amount, policy citation, ledger account, and customer message.",
          "record": "Approval",
          "upstream": "proposal, policy evidence, risk threshold",
          "downstream": "credit workflow and reply workflow",
          "invariant": "Ledger credit and customer message can be approved separately.",
          "failure": "Agent sends a refund message after finance rejects the credit.",
          "test": "Rejected credit blocks external reply.",
          "implementation": "Use coupled approval states for financial action and communication."
        },
        "workflow": {
          "example": "Workflow applies credit, waits for ledger confirmation, then sends reply or creates recovery task.",
          "record": "WorkflowEvent",
          "upstream": "approved credit and reply payload",
          "downstream": "billing ledger, ticket update, customer notification",
          "invariant": "Customer reply follows ledger confirmation.",
          "failure": "Ticket is closed before the ledger commit succeeds.",
          "test": "Ledger timeout keeps ticket in pending state.",
          "implementation": "Model credit, confirmation, reply, and closure as separate durable steps."
        },
        "sourceTruth": {
          "example": "Billing ledger owns credit state; ticket timeline mirrors confirmed outcome.",
          "record": "SourceResponse",
          "upstream": "billing adapter and ticket adapter",
          "downstream": "timeline, audit, eval",
          "invariant": "Ticket resolution cannot override ledger state.",
          "failure": "Support UI says refunded but ledger has no credit.",
          "test": "Source mismatch creates reconciliation alert.",
          "implementation": "Persist ledger transaction ID and ticket activity ID together."
        },
        "memorySkill": {
          "example": "A reviewed policy edge case can update a support skill; one-off exceptions cannot become hidden policy.",
          "record": "SkillChangeProposal",
          "upstream": "manager correction, policy owner review, production trace",
          "downstream": "skill version and eval gate",
          "invariant": "Only policy owners can approve durable procedural changes.",
          "failure": "One exception silently changes all future billing decisions.",
          "test": "Unreviewed exception is unavailable to future runs.",
          "implementation": "Route policy corrections through skill lifecycle and KB ownership."
        },
        "observability": {
          "example": "Trace links ticket context, policy retrieval, ledger proposal, approval, workflow, and customer reply.",
          "record": "RuntimeLedger row",
          "upstream": "all execution layers",
          "downstream": "finance audit, incident review, eval sampler",
          "invariant": "Financial actions have durable audit separate from model trace.",
          "failure": "Finance cannot reconstruct why a credit was issued.",
          "test": "Audit export contains approver, policy citation, ledger transaction, and message hash.",
          "implementation": "Emit ledger-grade audit for money movement and redacted traces for runtime debugging."
        },
        "release": {
          "example": "Policy citation, threshold escalation, duplicate credit, and rejected-approval cases gate releases.",
          "record": "ReleaseBundle",
          "upstream": "sampled disputes, manager reviews, finance incidents",
          "downstream": "canary by queue and threshold",
          "invariant": "Financial autonomy increases only with passing evidence.",
          "failure": "Model upgrade broadens refund behavior.",
          "test": "No release if unsupported credit trajectory passes.",
          "implementation": "Maintain finance-specific trajectory tests and autonomy promotion rules."
        }
      }
    },
    "coding": {
      "label": "Coding agent",
      "domain": "software delivery",
      "intent": "Fix the failing auth test and open a PR.",
      "user": "engineer in a repository workspace",
      "risk": "code mutation, secrets, CI cost, deployment separation",
      "sourceTruth": "git repository, issue tracker, test runner, CI, branch protection",
      "outcome": "patch and PR are produced with tests; deployment remains a separate approval",
      "layers": {
        "surface": {
          "example": "Command starts from issue AUTH-271 with repo, branch, and failing check selected.",
          "record": "AgentRun input envelope",
          "upstream": "repo workspace, issue, check run",
          "downstream": "context binder creates repo manifest",
          "invariant": "The agent cannot edit outside the selected repo and branch scope.",
          "failure": "Patch targets the wrong repository or stale branch.",
          "test": "Missing repo or branch asks for clarification.",
          "implementation": "Attach repo, branch, commit SHA, allowed paths, and test intent to the run."
        },
        "context": {
          "example": "Binder resolves commit SHA, allowed paths, failing test command, issue context, and secret boundaries.",
          "record": "ContextManifest",
          "upstream": "git provider, issue tracker, CI artifacts",
          "downstream": "agent loop receives scoped filesystem and test affordances",
          "invariant": "Secrets and unrelated paths stay outside model context.",
          "failure": "Agent reads secrets or edits generated files outside scope.",
          "test": "Secret-like file and disallowed path access are denied.",
          "implementation": "Build a repo context manifest with allowlists, denied paths, and artifact links."
        },
        "authority": {
          "example": "Agent can read repo files, propose patches, run allowed tests, and open a draft PR; it cannot deploy.",
          "record": "AccessDecision",
          "upstream": "user permission, app installation, repo policy, branch protection",
          "downstream": "tool gateway grants file read, patch, test, and PR tools",
          "invariant": "Git provider scope does not bypass branch protection.",
          "failure": "Agent pushes directly to protected branch.",
          "test": "Protected-branch write and deploy command are denied.",
          "implementation": "Represent repo grants, path policy, branch rules, and CI permissions separately."
        },
        "agentLoop": {
          "example": "Agent inspects failure logs, edits scoped files, runs tests, summarizes diff risk, and prepares PR.",
          "record": "AgentStep sequence",
          "upstream": "repo manifest and tools",
          "downstream": "patch proposal and test evidence",
          "invariant": "The loop cannot claim success without artifact evidence.",
          "failure": "Agent reports fixed without running relevant tests.",
          "test": "Missing test artifact blocks completed status.",
          "implementation": "Require observe-edit-test-observe cycles and artifact capture."
        },
        "capability": {
          "example": "Gateway exposes read_file, apply_patch, run_test, open_pr, and review_comment tools with path and command allowlists.",
          "record": "ToolCall plus ToolGrant",
          "upstream": "agent action request and repo policy",
          "downstream": "filesystem sandbox, test runner, git provider",
          "invariant": "Shell access is constrained by command policy.",
          "failure": "MCP server executes arbitrary shell or leaks secrets.",
          "test": "Unapproved command, network target, and secret read are denied.",
          "implementation": "Expose coding tools through narrow schemas, not broad terminal authority."
        },
        "approval": {
          "example": "Reviewer approves PR merge, not every file edit; deploy approval stays separate.",
          "record": "ReviewDecision",
          "upstream": "diff, tests, risk summary, branch policy",
          "downstream": "merge workflow or requested changes",
          "invariant": "Code review is not production deploy permission.",
          "failure": "Agent merges or deploys after self-review.",
          "test": "Self-approval and deploy action are denied.",
          "implementation": "Bind review authority to branch protection and separate deployment gate."
        },
        "workflow": {
          "example": "Workflow opens draft PR, waits for CI and review, applies requested changes, and records merge state.",
          "record": "WorkflowEvent",
          "upstream": "patch, test artifacts, PR payload",
          "downstream": "git provider, CI, review surface",
          "invariant": "Long-running PR work survives process restarts and review delays.",
          "failure": "Agent loses state after CI fails and re-runs stale tests.",
          "test": "CI fail, branch divergence, and requested-changes fixtures resume correctly.",
          "implementation": "Use workflow state for PR lifecycle and branch freshness checks."
        },
        "sourceTruth": {
          "example": "Git commit, check runs, PR review state, and branch protection own delivery truth.",
          "record": "SourceResponse",
          "upstream": "git and CI adapters",
          "downstream": "run status, PR timeline, eval sampler",
          "invariant": "Agent memory or chat transcript cannot override CI and review state.",
          "failure": "Run says complete while tests are failing.",
          "test": "Failed or missing required check blocks done.",
          "implementation": "Persist commit SHA, check run IDs, review IDs, and branch protection evidence."
        },
        "memorySkill": {
          "example": "Reviewed repo convention may become scoped procedural memory; secrets and one-off hacks are rejected.",
          "record": "MemoryProposal or SkillVersion proposal",
          "upstream": "review comment, repeated patch pattern, test evidence",
          "downstream": "repo-scoped instruction and regression eval",
          "invariant": "Future runs retrieve only reviewed, repo-scoped guidance.",
          "failure": "A workaround from one branch becomes global coding behavior.",
          "test": "Wrong-repo and secret-like memory retrieval are denied.",
          "implementation": "Store repo conventions with owner, scope, source commit, and rollback path."
        },
        "observability": {
          "example": "Trace links issue, file reads, patch, tests, PR creation, CI, review, and eval sampling.",
          "record": "TraceSpan and AuditEvent",
          "upstream": "tool gateway, git provider, CI",
          "downstream": "run console, PR summary, regression set",
          "invariant": "Every claim in the PR summary points to artifacts.",
          "failure": "Reviewer cannot see why the agent changed a file.",
          "test": "PR contains diff summary, test command, result artifact, and risk note.",
          "implementation": "Emit action traces and create a human-readable PR evidence bundle."
        },
        "release": {
          "example": "Failed commands, stale branch, secret access, bad diff, and missing-test cases gate coding-agent releases.",
          "record": "EvalRun and ReleaseBundle",
          "upstream": "PR reviews, CI failures, trace samples",
          "downstream": "agent version, tool allowlist, repo canary",
          "invariant": "Agent upgrades prove behavior on repository fixtures before rollout.",
          "failure": "New model becomes more aggressive with shell tools.",
          "test": "No release if denied-command or secret-read cases fail.",
          "implementation": "Replay repo fixtures and branch-protection simulations for model and tool changes."
        }
      }
    }
  }
}
```
