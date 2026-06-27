# Research and Standards

Current as of 2026-06-27.

This note is the research spine for the interactive wiki. It connects papers, standards, architecture layers, and product case studies so we can reason about enterprise agents as product systems, not just "LLM plus tools."

For source-by-source interpretation, use the companion [Source atlas](source-atlas.md). It maps each paper, standard, protocol, platform case, and healthcare source to the product boundary it should influence. For paper-by-paper product translation, use the [Paper-to-product lab](paper-to-product-lab.md). For current product and platform examples, use [Industry pattern teardowns](industry-pattern-teardowns.md). For case-level adoption records that separate public evidence, architecture inference, product responsibility, and release gates, use the [Industry case architecture lab](industry-case-architecture-lab.md). For concrete security and compliance scenarios, use the [Agent threat model](agent-threat-model.md). For skill changes as governed product artifacts, use the [Skill lifecycle lab](skill-lifecycle-lab.md). For memory mechanics, use the [Memory lifecycle simulator](memory-lifecycle-simulator.md). For release-blocking trajectory tests, use the [Eval and release harness](eval-release-harness.md). For field-level integration boundaries, use the [Source-system integration lab](source-system-integration-lab.md). For deployable service, store, event, control-plane, and observability topology, use the [Deployment topology lab](deployment-topology-lab.md). For the user, agent, delegated token, connector, approval, service identity, audit, and revocation chain, use the [Identity and access lab](identity-access-lab.md). For the layer-by-layer crosswalk that combines papers, standards, product cases, records, failures, and evals, use the [Architecture composition workbench](architecture-composition-workbench.md). For deciding which runtime or protocol should own a boundary, use the [Protocol runtime decision lab](protocol-runtime-decision-lab.md).

For the deeper source-to-architecture chain that connects paper evidence, standards, public cases, deployable components, product records, failures, and eval gates, use [Evidence chain architecture](evidence-chain-architecture.md).

## Thesis

The crux of agent-native product architecture is boundary design.

The papers tell us what capabilities are emerging:

- agents can interleave reasoning, action, and observation
- tools should be explicit modules, not hidden prompt tricks
- memory and reflection can improve behavior when feedback is reliable
- long-horizon tasks are brittle without purpose-built interfaces and evals

The standards tell us where the boundaries must be:

- connector boundaries: MCP, A2A, OAuth, OIDC
- observability boundaries: OpenTelemetry GenAI conventions, runtime traces, workflow history
- security boundaries: OWASP LLM risks, scoped identity, prompt-injection controls
- governance boundaries: NIST AI RMF, NIST GenAI Profile, ISO/IEC 42001, ISO/IEC 23894
- healthcare boundaries: FHIR, SMART App Launch, HIPAA Security Rule

The case studies show where adoption happens:

- agents appear inside work surfaces such as tickets, calendars, CRM records, Slack channels, Jira issues, bed boards, and command centers
- useful products combine agent reasoning with product permissions, workflow state, source-system truth, human approval, and audit
- "agent with tools" is only one layer of the system

## Simulated Discussion

This is a synthesized discussion between roles. It is not a quote from any real person or organization.

### Research Scientist

Why this role matters:

Research papers prevent us from mistaking demos for reliable systems.

Argument:

ReAct, Toolformer, MRKL, Reflexion, Generative Agents, Voyager, WebArena, AgentBench, GAIA, and SWE-agent show useful primitives: tool use, reason-act-observe loops, episodic memory, skill libraries, agent-computer interfaces, and trajectory evaluation. They do not prove that a broad autonomous agent is safe in a regulated product.

Recommendation:

Use research to define the architecture primitives, then validate them with product-specific evals and operational evidence.

### Platform Architect

Why this role matters:

The platform architect decides where agent runtime ends and product infrastructure begins.

Argument:

The system needs distinct layers:

- product surface
- context binder
- agent runtime
- connector or tool boundary
- policy gateway
- approval record
- durable workflow
- product state
- memory governance
- observability
- eval and release management

Collapsing these into one agent runtime makes recovery, audit, and permission enforcement hard.

Recommendation:

Build one vertical slice that proves every boundary: create run, bind context, call read tools, propose write tool, require approval, execute durable workflow, update product state, write audit, capture trace, replay eval.

### Security and Governance Owner

Why this role matters:

Agent behavior creates security and compliance risk through data access, tool execution, memory, external communication, and excessive autonomy.

Argument:

Prompt instructions are not controls. OWASP, NIST, ISO, OAuth, OIDC, SMART, and HIPAA all push the product toward scoped identity, explicit authorization, audit records, threat modeling, risk treatment, release gates, incident response, and continuous monitoring.

Recommendation:

Treat every tool, memory class, connector, and autonomy increase as a risk change with evidence requirements.

### Healthcare Domain Owner

Why this role matters:

The healthcare example forces domain truth, PHI, operational accountability, and source-system reconciliation.

Argument:

For a bed-flow agent, the hard part is not parsing "book a bed." The hard parts are resolving the right encounter, unit, bed, monitoring need, isolation constraint, staffing constraint, source-system state, approval authority, and patient privacy boundary.

Recommendation:

FHIR and SMART should anchor the integration model, HIPAA should anchor safeguards, and local hospital policy should define what the agent may recommend, draft, or execute.

### Product Operator

Why this role matters:

The operator experiences the agent in real work, not as an architecture diagram.

Argument:

Users will not trust an invisible loop. They need the agent inside the work object with evidence, alternatives, exact action preview, status, timeline, and recovery path.

Recommendation:

Design the user surface before increasing autonomy. Voice, chat, and Slack are entry points. The source-of-truth workspace is where the action must be visible.

### Skeptic

Why this role matters:

The skeptic prevents over-reading vendor demos and benchmark wins.

Argument:

Current products and papers show direction, but not enough proof for unsupervised enterprise autonomy. Benchmarks reveal brittleness; vendor pages rarely expose internal policy, eval, memory, and incident handling.

Recommendation:

Start narrow, supervised, and high-value. Make every failure become a regression case, policy control, or UX correction.

## Architecture Connection Map

| Layer | Sources to study | Product architecture implication | Evidence to require |
|---|---|---|---|
| Work surface | Slack agents, Salesforce Agentforce, ServiceNow AI Agents, Microsoft Copilot Studio, Atlassian Rovo | Agents should appear where work already lives: ticket, bed board, calendar, CRM record, issue, document, or channel. | Action preview, timeline, source links, correction path |
| Intent and context | FHIR, SMART launch context, OIDC claims, product screen state | Bind user, tenant, role, work object, patient/account/ticket, and source-system state before the model reasons. | Resolved context object, ambiguity record, clarification history |
| Agent loop | ReAct, MRKL, Toolformer, OpenAI Agents SDK, Vercel AI SDK | Represent the run as a trajectory of plan, action, observation, decision, and stop condition. | Agent trace, step limit, tool-choice evals |
| Connector boundary | MCP, A2A, OAuth 2.0, OIDC | Expose tools, resources, prompts, delegated agents, and scopes through explicit boundaries. | Tool registry, consent, token audience, server audit |
| Identity and access | OAuth 2.0, OIDC, SMART launch context, MCP Authorization, OWASP excessive agency | Treat user identity, agent principal, connector scope, tool grant, approval, service identity, and audit as separate records. | AccessDecision, DelegationGrant, ConnectorGrant, Approval, AuditEvent |
| Policy gateway | OWASP LLM Top 10, tenant policy, approval policy | Every side-effecting call needs schema validation, agent scope, user scope, tenant check, data-class check, approval rule, and idempotency. | Policy decision record, denied-call tests |
| Durable execution | Temporal, Inngest, LangGraph interrupts | Waits, retries, cancellation, compensation, and recovery should live outside the model loop. | Workflow history, resume token, idempotency key |
| Memory and skills | Reflexion, Generative Agents, Voyager, MemGPT, CoALA | Durable memory and skills are product data and release artifacts, not hidden prompt baggage. | Source, scope, owner, retention, correction, use audit, eval coverage |
| Observability | OpenTelemetry GenAI conventions, runtime tracing, workflow history | Trace behavior, audit accountable action, and show users a timeline. Keep these related but separate. | run_id, trace_id, workflow_id, tool_call_id, approval_id, audit_id |
| Risk and release | NIST AI RMF, NIST AI 600-1, ISO/IEC 42001, ISO/IEC 23894, WebArena, AgentBench, GAIA, SWE-agent | Agents ship through risk assessment, trajectory eval gates, canaries, rollback, incident review, and supplier/model inventory. | Risk register, eval report, release bundle, incident playbook |
| Domain source of truth | FHIR Appointment, Encounter, Location, Task; HIPAA safeguards | Domain systems and product DB remain authoritative. Agent memory does not become the medical or business record. | Source-system reconciliation, audit export, PHI safeguards |

## Standards-To-Product Contract Map

The interactive Research and Standards section in [index.html](index.html#research-standards) now includes a standards-to-product contract workbench.

Use it when a source sounds important but the team is not yet sure what to build. The rule is:

```text
source
-> product boundary
-> deep interface
-> hidden complexity
-> records and release gate
```

This keeps sources from leaking into the wrong layer. MCP should not become the policy engine. A2A should not replace simple APIs. OpenTelemetry should not become the audit system. OWASP should not execute workflows. NIST and ISO should not decide a single run. FHIR should not become the product's entire clinical policy model.

| Source family | Product boundary | Deep interface | Build artifact | Must not own |
|---|---|---|---|---|
| Agent papers and benchmarks | Agent loop and trajectory evaluation | `runTrajectory(agent_version, context_manifest, capability_set)` | Agent runner with persisted steps and replayable eval traces | Authorization, approval, source truth, release promotion |
| MCP | Tool, resource, prompt, and connector exposure | `registerConnectorCapability(server, tool_schema, resource_policy)` | Capability gateway wrapping MCP servers behind grants, side-effect classes, and audit | Tenant policy, approvals, PHI handling, memory writes |
| A2A | Delegated agent discovery and task state | `delegateTask(agent_card, task_contract, authority_scope)` | Delegation gateway with allowlists, task contracts, timeouts, and handoff traces | Local approvals, local writes, simple deterministic service calls |
| OAuth/OIDC/SMART | User identity, launch context, delegated tokens, connector grants | `bindDelegatedAuthority(user_session, work_object, requested_capability)` | Context and token broker separating identity, grants, tool access, approval, and audit | Business approval, workflow recovery, clinical source truth |
| Workflow and events | Approved side effects, waits, retries, cancellation, compensation | `startApprovedWorkflow(action_payload, approval_record, idempotency_key)` | Workflow boundary emitting domain, timeline, audit, and reconciliation events | Intent interpretation, tool choice, approval decision |
| OpenTelemetry and Trace Context | Model, tool, retrieval, workflow, cost, latency, and error telemetry | `emitAgentTelemetry(run_event, redaction_policy, correlation_ids)` | Telemetry adapter linking traces to audit, timeline, and eval IDs | Accountable audit, user timeline, compliance evidence by itself |
| OWASP LLM risks | Threat cases for prompts, tools, memory, connectors, retrieval, outputs, autonomy | `evaluateAgentThreat(change_set, capability_set, data_classes)` | Threat model and denial-test suite for every new authority path | Runtime execution, source truth, risk acceptance |
| NIST and ISO | Risk register, release management, monitoring, incidents, continuous improvement | `approveAgentRelease(release_bundle, risk_evidence, rollout_policy)` | Release manager pinning model, prompts, tools, policies, workflows, memory, evals, and rollback | Single-run approval, connector execution, source reconciliation |
| FHIR/SMART/HIPAA | Encounter, location, task, patient context, ePHI safeguards, reconciliation | `resolveClinicalWorkContext(launch_context, selected_work_object)` | Healthcare adapter layer with FHIR mappings, SMART scopes, PHI redaction, and audit | Medical record truth, clinical authority, patient-specific memory |
| Product platforms | Runtime, work surface, debugging, workflow, builder, and connector patterns | `selectPlatformPattern(product_boundary, ownership_gap, evidence_need)` | Platform fit record separating adopted pattern, ownership gap, and proof required | Domain policy, regulated approval, product-specific evals |

The product proof is not that a source exists. The proof is that the source has been translated into a small interface that hides the right complexity and produces durable evidence.

## Paper Map

| Paper | Primary source | Core contribution | Product architecture implication | Limit |
|---|---|---|---|---|
| ReAct | https://arxiv.org/abs/2210.03629 | Interleaves reasoning and acting with observations. | Store trajectories, not only final responses. | Reasoning traces are not proof or authorization. |
| MRKL Systems | https://arxiv.org/abs/2205.00445 | Combines language models with external modules and symbolic systems. | Use routing, typed tools, and deterministic services for deterministic work. | Integration and trust boundaries become the hard part. |
| Toolformer | https://arxiv.org/abs/2302.04761 | Shows models can learn API use from examples. | Treat tool traces as training and eval data. | Black-box tool use still needs runtime policy controls. |
| Reflexion | https://arxiv.org/abs/2303.11366 | Uses verbal feedback and episodic memory to improve later attempts. | Add post-run reflection only when feedback is reliable. | Bad feedback creates bad memory. |
| Generative Agents | https://arxiv.org/abs/2304.03442 | Uses memory streams, reflection, retrieval, and planning. | Separate event logs, reflection, retrieval, and planning. | Built for believability, not enterprise accountability. |
| CoALA | https://arxiv.org/abs/2309.02427 | Organizes language agents around memory, action, decision, and learning modules. | Map agent memory concepts to governed product data classes. | Cognitive architecture does not supply product approval, retention, or audit. |
| MemGPT | https://arxiv.org/abs/2310.08560 | Uses explicit memory management for long-context agents. | Treat memory movement as a controlled lifecycle, not unlimited prompt context. | Does not replace authorization, source truth, or correction controls. |
| Voyager | https://arxiv.org/abs/2305.16291 | Builds an executable skill library through environment feedback. | Treat skills as versioned artifacts that improve through verified outcomes. | Works best when execution is sandboxed and feedback is clear. |
| WebArena | https://arxiv.org/abs/2307.13854 | Realistic web tasks expose autonomous-agent brittleness. | Build staging environments and end-to-end functional evals. | Benchmarks may not match product workflows. |
| AgentBench | https://arxiv.org/abs/2308.03688 | Compares agents across multiple environments and failure modes. | Classify failures by trajectory, not only success rate. | Aggregate benchmark scores are not release evidence. |
| GAIA | https://arxiv.org/abs/2311.12983 | Tests real-world assistant tasks requiring tools and reasoning. | Use simple-looking real tasks to stress tool-chain robustness. | Single-answer tasks miss permissions, UX, side effects, and workflow state. |
| SWE-agent | https://arxiv.org/abs/2405.15793 | Shows agent-computer interface design affects software agents. | Design purpose-built interfaces for each product domain. | Domain-specific and still constrained by eval difficulty. |

## Standards and Governance Map

| Standard or protocol | Official source | Governs | Product implication | Caveat |
|---|---|---|---|---|
| Model Context Protocol | https://modelcontextprotocol.io/specification | Tool, resource, prompt, and transport boundary | Use MCP servers for explicit tool and context exposure. | MCP is not a full governance system. |
| MCP Authorization | https://modelcontextprotocol.io/specification/latest/basic/authorization | Remote MCP authorization | Use OAuth-style metadata, scopes, PKCE, HTTPS, and no token passthrough. | Authorization behavior depends on transport and implementation. |
| Agent2Agent protocol | https://a2a-protocol.org/latest/specification/ | Agent-to-agent discovery, delegation, and communication | Use when another agent becomes a delegated actor with state and capabilities. | Young ecosystem; expect churn. |
| OAuth 2.0 | https://datatracker.ietf.org/doc/html/rfc6749 | Delegated authorization | Separate authorization server, resource server, client, scopes, tokens, and revocation. | OAuth is not authentication. Bearer tokens are sensitive. |
| OpenID Connect | https://openid.net/specs/openid-connect-core-1_0.html | Authentication and identity claims | Bind user identity, tenant, role, and session to the run. | ID tokens are not API access grants. |
| OpenTelemetry GenAI conventions | https://opentelemetry.io/docs/specs/semconv/gen-ai/ | Model, agent, tool, retrieval, and GenAI observability vocabulary | Instrument model calls, tool calls, retrieval, errors, token usage, and correlation IDs. | Development status; prompt/output capture needs redaction. |
| OWASP Top 10 for LLM Applications | https://genai.owasp.org/llm-top-10/ | LLM app threat model | Design controls for injection, sensitive disclosure, excessive agency, poisoning, supply chain, and unbounded consumption. | Security guidance, not a compliance certification. |
| NIST AI RMF | https://www.nist.gov/itl/ai-risk-management-framework | AI risk governance | Use Govern, Map, Measure, Manage across the product lifecycle. | Voluntary framework; must be tailored. |
| NIST GenAI Profile | https://doi.org/10.6028/NIST.AI.600-1 | Generative AI risk profile | Add GenAI-specific risks around confabulation, misuse, provenance, privacy, and information integrity. | Does not replace domain law or product safety validation. |
| ISO/IEC 42001 | https://www.iso.org/standard/81230.html | AI management system | Build organizational controls, roles, lifecycle documentation, supplier controls, and improvement loops. | Certifies management process, not a specific agent outcome. |
| ISO/IEC 23894 | https://www.iso.org/standard/77304.html | AI risk management guidance | Integrate AI risk identification, treatment, monitoring, and review into SDLC. | Public page is limited; full text is paid. |
| SMART App Launch | https://hl7.org/fhir/smart-app-launch/ | Healthcare app launch and FHIR scopes | Use launch context, patient/user context, and scoped FHIR access. | Scope behavior varies by EHR implementation. |
| HIPAA Security Rule | https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html | ePHI security safeguards | Require access control, audit controls, integrity, transmission security, risk analysis, and incident process. | Not a complete clinical-safety framework. |
| HL7 FHIR | https://hl7.org/fhir/ | Healthcare resource model | Model Appointment, Schedule, Slot, Encounter, Location, Task, ServiceRequest, and HealthcareService explicitly. | Real implementations need profiles, extensions, and local rules. |

## Product Case Study Map

| Example | Official source | Pattern | Architecture layer | Do not overgeneralize |
|---|---|---|---|---|
| Salesforce Agentforce | https://www.salesforce.com/agentforce/how-it-works/ | CRM-native agents grounded in business data and enterprise actions. | SaaS system-of-record control plane. | Depends on Salesforce data, permissions, Flow, and CRM workflows. |
| ServiceNow AI Agents | https://www.servicenow.com/products/ai-agents.html | Workflow-native agents for IT, HR, customer service, and enterprise service processes. | Workflow platform plus governance. | Value comes from structured workflows and platform data, not chat alone. |
| Microsoft Copilot Studio | https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/autonomous-agents | Low-code agents with triggers, instructions, tools, knowledge, and deployment channels. | Low-code builder over Microsoft 365, Power Platform, connectors, and workflows. | Autonomous does not mean unsupervised everywhere. |
| Atlassian Rovo | https://support.atlassian.com/rovo/docs/agents/ | Agents embedded in Jira, Confluence, chat, editing flows, and automation rules. | Work graph and collaboration layer. | Strongest where work already lives in Atlassian or connected tools. |
| Slack AI apps and agents | https://docs.slack.dev/ai/ | Collaboration surface for agents, mentions, threads, and assistant flows. | Channel and work-surface layer. | Slack is usually not the source of truth. |
| Cloudflare Agents | https://developers.cloudflare.com/agents/ | Stateful, durable agents reachable from chat, email, voice, Slack, and webhooks. | Runtime and infrastructure layer. | You supply domain logic, UX, governance, and business semantics. |
| Vercel AI SDK agents | https://ai-sdk.dev/docs/agents/overview | TypeScript tool-loop agents for web apps and streaming UIs. | Application framework layer. | Not durable operations infrastructure by itself. |
| OpenAI Agents SDK | https://openai.github.io/openai-agents-python/agents/ | Code-first orchestration for agents, tools, handoffs, guardrails, and tracing. | Agent orchestration SDK layer. | Needs embedding into product, workflow, and domain controls. |
| LangGraph and Deep Agents | https://docs.langchain.com/oss/python/langgraph/overview | Durable graph agents, persistence, interrupts, and long-horizon harness patterns. | Orchestration and harness layer. | Product UI, permissions, governance, and process design remain yours. |
| Qventus | https://www.qventus.com/solutions/healthcare-automation-platform/ | AI teammates for hospital operations and care-flow automation. | Care operations automation layer. | Treat outcomes as vendor claims unless independently validated. |
| LeanTaaS iQueue | https://leantaas.com/products/inpatient-flow/ | Predictive and prescriptive capacity management. | Hospital capacity optimization layer. | Not autonomous clinical decision-making. |
| Johns Hopkins Capacity Command Center | https://www.hopkinsmedicine.org/emergency-medicine/c3 | Human-in-the-loop command center for patient flow. | Operations control layer. | The pattern includes people, protocols, escalation, and standard work, not software alone. |

## Healthcare Bed-Flow Architecture

The user request:

```text
Book a bed for this ED patient.
```

The product architecture should treat that as a governed run:

1. Work surface captures the command inside the bed board or ED workspace.
2. Context binder resolves user, role, tenant, facility, encounter, current location, and selected patient.
3. Agent reads capacity, monitoring need, isolation constraints, staffing, discharge forecasts, and unit policies.
4. Tool gateway validates read scopes and produces source-linked observations.
5. Agent ranks candidate beds and drafts a proposed `reserve_bed` payload.
6. Policy gateway detects PHI-adjacent write and requires approval.
7. User reviews exact action arguments, source links, alternatives, and risk.
8. Durable workflow executes reservation, notification, transport task, and reconciliation with idempotency.
9. Product state and source systems update.
10. Timeline, audit, trace, and eval sample are written.
11. Any proposed memory is classified, sourced, scoped, and approved before durable storage.

The architectural point:

The agent never owns bed truth. It coordinates a decision through source systems, workflow, policy, and accountable humans.

## Design Rules We Should Adopt

1. Treat agents as product principals.

Every agent has owner, purpose, version, scopes, memory policy, autonomy level, and release bundle.

2. Separate skills from tools.

Skills describe how to act. Tools execute product capabilities. Tools need schema, side-effect class, owner, timeout, idempotency, approval rule, and audit rule.

3. Put all writes behind a tool gateway.

The gateway checks agent scope, delegated user scope, tenant, resource, data class, approval rule, idempotency, and rate limits before execution.

4. Use durable workflows for side effects.

Any task that waits, writes, retries, crosses systems, or needs recovery belongs in workflow execution, not inside the model loop.

5. Make memory governed data.

Memory requires source, scope, owner, data class, retention, correction, deletion, and eval coverage. Patient-specific facts should usually be read from source systems per run.

6. Keep trace, audit, and timeline separate.

Trace helps debug. Audit proves accountable action. Timeline explains progress to users. They share IDs but serve different audiences.

7. Ship behavior through release bundles.

Prompts, model IDs, tool schemas, policies, workflow versions, memory schemas, eval datasets, and rollout rules should be pinned together.

8. Use public benchmarks as warnings, not release gates.

Benchmarks can teach failure modes. Product evals must test your intents, tools, policies, approval paths, memory behavior, source-system state, and UX recovery.

## Open Questions

These are the next topics worth deeper research:

- What is the minimal product schema for Agent, AgentVersion, AgentRun, ToolCall, Approval, MemoryItem, AuditEvent, EvalRun, and ReleaseBundle?
- How should an MCP server expose healthcare tools without leaking PHI or bypassing product authorization?
- When should A2A be used instead of ordinary product APIs, queues, or workflow handoffs?
- What memory UX lets users inspect, correct, approve, and delete memory without overwhelming them?
- What is the right eval dataset format for trajectory-level tests?
- How should OpenTelemetry GenAI spans map to product audit events without storing sensitive prompt or output data?
- Which actions can move from draft-with-approval to supervised execution, and what evidence would justify that autonomy change?
- How should hospital-specific operational rules be represented: policy engine, skill, rules service, or workflow code?

## First Vertical Slice

The first implementation should not attempt a broad assistant. It should prove the architecture:

```text
voice/text command
-> create agent run
-> bind context
-> read fake capacity and patient constraints
-> rank beds
-> propose reserve_bed payload
-> policy requires approval
-> user approves or rejects
-> workflow executes or stops
-> product state updates
-> timeline and audit append
-> trace is captured
-> eval replay checks the trajectory
```

Success criteria:

- ambiguous context never calls a write tool
- rejected approval never starts the write workflow
- retry never duplicates a reservation
- source-system mismatch creates `needs_reconciliation`, not `completed`
- patient-specific facts are not stored as durable memory
- every run pins agent version, model ID, prompt version, toolset version, policy version, workflow version, and eval run ID
