# Evidence Chain Architecture

Current as of 2026-06-27.

This note complements the interactive Evidence Chain section in [interactive.html](interactive.html#evidence-chain).

The purpose is to get to the crux of product-native agents:

```text
paper or benchmark evidence
-> standard or protocol boundary
-> public product or case-study pattern
-> deployable product component
-> product record
-> failure mode
-> release-blocking eval
```

Do not treat any one source family as the whole answer.

Papers explain capabilities and failure modes. Standards define boundaries. Public product cases show adoption patterns. Production architecture still needs identity, policy, tools, workflow, memory, audit, observability, evals, and lifecycle control.

## Simulated Discussion

This is a synthesized discussion between roles, not quotes from real people or organizations.

### Research Lead

Why this role belongs:

The research lead prevents us from turning demos into product claims.

Argument:

ReAct, MRKL, Toolformer, Reflexion, Generative Agents, CoALA, MemGPT, Voyager, WebArena, AgentBench, GAIA, SWE-agent, SWE-bench, WorkArena, tau-bench, AppWorld, and OSWorld support useful primitives: reason-act-observe loops, modular tools, trace data, memory, skill libraries, stateful environments, and benchmarked trajectories.

They do not prove safe business autonomy. Newer benchmarks keep showing the same weakness: agents struggle with long-horizon, stateful, policy-constrained work.

Evidence standard:

An enterprise feature should not cite a paper as launch proof. It should translate the paper into a product record, a failure mode, and a product-specific eval.

### Platform Architect

Why this role belongs:

The platform architect decides how the pieces connect.

Argument:

The core stack should separate these deployable planes:

```text
surface
-> context and identity
-> agent runtime
-> capability gateway
-> workflow and events
-> source adapters
-> memory and skills
-> control plane
-> observability and release
```

MCP, OpenAPI, A2A, CloudEvents, OpenTelemetry, OAuth, and workflow engines each govern different boundaries. None of them is the whole agent platform.

Evidence standard:

Before we claim the architecture is real, one vertical slice should prove run creation, context binding, scoped tool calls, approval, durable workflow, source reconciliation, audit, trace, eval replay, and rollback.

### Security And Governance Owner

Why this role belongs:

Agents amplify identity, data, connector, memory, tool, and side-effect risk.

Argument:

Prompt rules are not security controls. OWASP, OAuth/OIDC, MCP authorization, NIST AI RMF, ISO/IEC 42001, ISO/IEC 23894, HIPAA, and local policy all push us toward explicit records:

- user identity
- agent principal
- connector grant
- tool grant
- delegated token
- approval
- service identity
- audit event
- release bundle

Evidence standard:

Every new tool, memory class, autonomy tier, external communication path, and source write should be treated as a risk change with threat cases and denial tests.

### Product Operator

Why this role belongs:

The operator sees whether the agent fits actual work.

Argument:

The strongest public product patterns are not generic chatbot patterns. They put agents in work surfaces: tickets, issues, PRs, incidents, Slack threads, CRM records, calendars, service workflows, and command centers. Users trust visible artifacts: source links, action previews, timelines, status, corrections, and recovery.

Evidence standard:

If the user cannot inspect what the agent read, what it plans to do, what is waiting for approval, what succeeded, and how to undo or escalate, the product is not ready for higher autonomy.

### Healthcare Domain Owner

Why this role belongs:

Healthcare forces source-of-truth and accountability discipline.

Argument:

For bed flow, the agent does not "book a bed" by intent alone. It must bind encounter, facility, location, bed status, monitoring need, isolation, staffing, transport, policy, and approval authority. FHIR and SMART shape the data and authorization boundary; HIPAA shapes safeguards. Local ADT, bed-board, staffing, and command-center systems still own operational truth.

Evidence standard:

No completion state should come from agent text. Completion requires source-system confirmation or an explicit unresolved state.

### Skeptic

Why this role belongs:

The skeptic prevents over-reading vendor pages and benchmark headlines.

Argument:

Cloudflare Agents, Vercel AI SDK, Copilot coding agent, Agentforce, ServiceNow AI Agents, Copilot Studio, Rovo, Slack agents, Sentry Seer, LangGraph, and healthcare command centers show important patterns. They rarely expose enough internals to prove policy, evals, memory governance, incident handling, or source reconciliation.

Evidence standard:

Use public cases as pattern evidence only. The product still needs its own release gates and operational proof.

## Layer Evidence Chain

| Layer | Paper evidence | Standard or protocol boundary | Public product pattern | Deployable components | Records and eval |
|---|---|---|---|---|---|
| Work surface | SWE-agent, WebArena, GAIA show interface and environment matter. | OIDC, SMART launch, Trace Context bind session and correlation. | Slack agents, Copilot coding agent, Rovo show agents inside work surfaces. | Work-object panel, command adapter, approval card, timeline, source links. | `AgentRun`, `TimelineEvent`; ambiguous object eval. |
| Context and identity | Toolformer and AgentBench show tool use and environment failures. | OAuth, OIDC, token exchange, MCP authorization, SMART scopes. | Copilot Studio, Agentforce, ServiceNow rely on platform identity and connectors. | Context binder, token broker, agent principal registry, connector grant store. | `AccessDecision`, `DelegationGrant`; no permission laundering eval. |
| Agent loop | ReAct, MRKL, CoALA explain loop, modules, decision, memory, action. | JSON Schema, Trace Context, OpenTelemetry GenAI. | Vercel AI SDK, OpenAI Agents SDK, LangGraph show runtime patterns. | Agent runner, model gateway, loop orchestrator, step budget manager. | `AgentStep`, `ToolCall`; side-effect stop-condition eval. |
| Tools and sources | MRKL, Toolformer, Voyager support typed modules and skill learning. | MCP, OpenAPI, JSON Schema, FHIR, OWASP LLM risks. | Agentforce actions, ServiceNow workflows, Cloudflare Agents tools. | Tool registry, MCP servers, API facade, policy gateway, source adapters. | `ToolGrant`, `PolicyDecision`; denied-tool evals. |
| Workflow and events | WebArena, SWE-agent, WorkArena show long-horizon state brittleness. | CloudEvents, AsyncAPI, Trace Context. | Cloudflare Workflows, ServiceNow workflows, GitHub PR/check flows. | Workflow engine, event bus, webhook receiver, idempotency store. | `WorkflowEvent`, `ReconciliationRecord`; partial-failure eval. |
| Memory and skills | Reflexion, Generative Agents, MemGPT, Voyager show memory and skill primitives. | NIST AI RMF, OWASP LLM risks, ISO/IEC 42001, retention policy. | LangGraph persistence, stateful Cloudflare Agents, enterprise knowledge grounding. | Memory proposal queue, retrieval index, skill repository, retention jobs. | `MemoryProposal`, `SkillVersion`; deletion and scope eval. |
| Observability and release | AgentBench, SWE-bench, AI Agents That Matter, AppWorld stress reproducibility and state verification. | OpenTelemetry GenAI, Trace Context, NIST GenAI Profile, ISO/IEC 23894. | Sentry Seer, Copilot coding logs, AI control tower patterns. | Trace collector, audit log, eval runner, release manager, incident dashboard. | `EvalRun`, `ReleaseBundle`; autonomy-promotion evals. |
| Domain source truth | GAIA, WebArena, SWE-agent show multi-source verification pressure. | FHIR, SMART, HIPAA, CloudEvents. | Healthcare command centers, Qventus, LeanTaaS show operational source-truth patterns. | FHIR/domain adapter, source reference store, reconciler, redaction service. | `SourceReference`, `PHIAuditEvent`; source-confirmation eval. |

## Papers And Benchmarks: What To Take Seriously

Use these as architecture evidence, not launch evidence.

| Source | What it contributes | Product implication |
|---|---|---|
| [ReAct](https://arxiv.org/abs/2210.03629) | Reason, action, observation trajectories. | Persist steps, tools, observations, stop reasons, and summaries. |
| [MRKL Systems](https://arxiv.org/abs/2205.00445) | Modular LLM plus external tools and symbolic systems. | Put deterministic business rules in owned services and tools. |
| [Toolformer](https://arxiv.org/abs/2302.04761) | Tool-call examples as learning signal. | Turn tool traces into evals and demonstrations, not permission. |
| [Reflexion](https://arxiv.org/abs/2303.11366) | Feedback and episodic memory can improve later attempts. | Use reviewed failures for evals or scoped memory proposals. |
| [Generative Agents](https://arxiv.org/abs/2304.03442) | Memory stream, reflection, retrieval, planning. | Separate events, retrieved context, reflections, and durable memory. |
| [CoALA](https://arxiv.org/abs/2309.02427) | Cognitive architecture for language agents. | Use memory/action/decision/learning as a checklist, not governance. |
| [MemGPT](https://arxiv.org/abs/2310.08560) | Explicit memory movement beyond fixed context. | Govern memory writes, retrieval, deletion, and use audit. |
| [Voyager](https://arxiv.org/abs/2305.16291) | Executable skill library built from feedback. | Treat skills as versioned release artifacts with tests and rollback. |
| [WebArena](https://arxiv.org/abs/2307.13854) | Realistic web tasks expose long-horizon brittleness. | Build staging worlds and state-based workflow evals. |
| [AgentBench](https://arxiv.org/abs/2308.03688) | Multi-environment benchmark and failure pressure. | Evaluate by task class and trajectory, not one demo. |
| [GAIA](https://arxiv.org/abs/2311.12983) | Real assistant tasks need tools and reasoning. | Test simple-looking requests that hide source and tool risk. |
| [SWE-agent](https://arxiv.org/abs/2405.15793) | Agent-computer interface changes performance. | Design domain-specific interfaces, not only chat. |
| [SWE-bench](https://www.swebench.com/) | Real issue-to-patch benchmark. | Require reviewable diffs, tests, and artifacts for coding agents. |
| [WorkArena](https://arxiv.org/abs/2403.07718) | Enterprise knowledge-work benchmark. | Recreate top SaaS workflows as product eval suites. |
| [tau-bench](https://arxiv.org/abs/2406.12045) | Tool-agent-user policy conversations. | Track policy violations and reliability over multi-turn interactions. |
| [AppWorld](https://arxiv.org/abs/2407.18901) | Multi-app API agents with state tests. | Use state diffs to catch collateral damage. |
| [OSWorld](https://arxiv.org/abs/2404.07972) | Real desktop benchmark. | Sandbox broad computer-use agents and narrow permissions. |
| [AI Agents That Matter](https://arxiv.org/abs/2407.01502) | Evaluation rigor for agent claims. | Measure cost, variance, baselines, reproducibility, and pass rates. |

## Standards And Protocols: Where They Fit

| Boundary | Sources | Stack placement |
|---|---|---|
| Identity and delegated access | [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749), [OAuth 2.1 draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/), [OIDC Core](https://openid.net/specs/openid-connect-core-1_0.html), [Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693) | Identity service, token broker, connector grant store. |
| Tool and context exposure | [MCP latest](https://modelcontextprotocol.io/specification/latest), [MCP authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | MCP servers, tool gateway, authorization checks. |
| Agent-to-agent delegation | [A2A protocol](https://a2a-protocol.org/latest/specification/) | Delegated agent boundary when another agent is an actor. |
| API contracts | [OpenAPI](https://spec.openapis.org/oas/latest.html), [JSON Schema](https://json-schema.org/specification) | Internal APIs, generated clients, argument validation. |
| Events and workflows | [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/latest), [CloudEvents](https://cloudevents.io/) | Event bus, workflow history, provider callbacks. |
| Observability | [W3C Trace Context](https://www.w3.org/TR/trace-context/), [OpenTelemetry GenAI](https://opentelemetry.io/docs/specs/semconv/gen-ai/) | Trace propagation, GenAI telemetry, model/tool/retrieval spans. |
| Security | [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/), [OWASP Agentic AI threats](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/) | Threat model, prompt-injection controls, least privilege, tool gating. |
| Governance | [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework), [NIST GenAI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence), [ISO/IEC 42001](https://www.iso.org/standard/81230.html), [ISO/IEC 23894](https://www.iso.org/standard/77304.html) | Risk register, release gates, incident process, AI management system. |
| Healthcare | [HL7 FHIR](https://hl7.org/fhir/), [SMART App Launch](https://hl7.org/fhir/smart-app-launch/), [HIPAA Security Rule](https://www.hhs.gov/hipaa/for-professionals/security/index.html) | EHR/FHIR adapters, SMART scopes, PHI safeguards, audit controls. |

## Product And Case Patterns

| Case | What the public source shows | What our product still owns |
|---|---|---|
| [Cloudflare Agents](https://developers.cloudflare.com/agents/) | Stateful runtime, tools, channels, Durable Objects, human-in-the-loop examples. | Domain semantics, permissions, approvals, evals, business data, source truth. |
| [Vercel AI SDK Agents](https://ai-sdk.dev/docs/agents/overview) | App-native tool loops, streaming UI, model/provider abstraction. | Durable workflow, identity, memory governance, source reconciliation. |
| [GitHub Copilot coding agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Async coding work through issues, branches, logs, tests, and PRs. | Repo instructions, CI gates, review/merge/deploy policy. |
| [Microsoft Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/) | Builder, channels, connectors, tools, knowledge, enterprise controls. | Task semantics, escalation, knowledge hygiene, outcome metrics. |
| [Salesforce Agentforce](https://www.salesforce.com/agentforce/) | CRM-native agents grounded in enterprise data and actions. | Process design, action semantics, source-of-truth mapping, approval policy. |
| [ServiceNow AI Agents](https://www.servicenow.com/products/ai-agents.html) | Workflow-native agents, AI Agent Studio, agent teams, governance surfaces. | Workflow maturity, CMDB/data quality, remediation authority, ops handoff. |
| [Atlassian Rovo agents](https://support.atlassian.com/rovo/docs/agents/) | Agents in Jira, Confluence, chat, automation, and Teamwork Graph contexts. | Verified agent definitions, content quality, approval rules, adoption paths. |
| [Slack AI apps](https://docs.slack.dev/ai/) | Channels, DMs, threads, mentions, split panes, streaming responses. | Runtime, enterprise tools, consent, escalation, workspace policy. |
| [Sentry Seer](https://docs.sentry.io/product/ai-in-sentry/seer/) | Telemetry-grounded debugging, root cause, suspect commits, PR creation. | Instrumentation quality, repo access, deployment/revert policy. |
| [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) and [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview) | Durable orchestration, persistence, interrupts, subagents, filesystem/tools patterns. | Product UX, hosting security, domain data model, permissions, eval suite. |
| [Johns Hopkins Capacity Command Center](https://www.hopkinsmedicine.org/news/articles/2021/03/capacity-command-center-celebrates-5-years-of-improving-patient-safety-access) | Human-in-the-loop patient-flow command center with operational dashboards. | Clinical authority, EHR/ADT integration, standard work, staffing, audit. |

## Healthcare Bed-Flow Translation

Request:

```text
Book a monitored bed for this ED patient.
```

Product-native architecture:

```text
bed-board or voice surface
-> SMART/OIDC user and encounter context
-> context binder resolves patient, facility, location, tenant, and ambiguity
-> agent reads capacity, monitoring need, isolation, staffing, transport, and policy
-> tool gateway validates read scopes and side-effect classes
-> agent drafts exact reserve_bed payload and alternatives
-> approval card captures exact human decision
-> workflow executes hold, notification, transport task, wait, retry, cancel, reconcile
-> source adapters confirm ADT/bed-board state
-> timeline, audit, trace, eval sample, and release evidence are written
-> memory proposal is reviewed or rejected; patient facts remain in source systems
```

Crux:

```text
The agent coordinates the decision.
The product owns authority.
The workflow owns recovery.
The source systems own truth.
The audit owns accountability.
The release process owns improvement.
```

## Minimum Shippable Vertical Slice

Build one narrow slice before broad platform work:

1. Surface creates `AgentRun` from a selected work object.
2. Context binder writes `ContextManifest`.
3. Identity service writes `AccessDecision` and `ConnectorGrant`.
4. Agent runtime writes `AgentStep` and read-only `ToolCall` records.
5. Tool gateway writes `PolicyDecision`.
6. Approval service records exact action payload and approver.
7. Workflow engine executes approved write with idempotency.
8. Source adapter writes `SourceResponse` and `ReconciliationRecord`.
9. Timeline, audit, trace, and metrics share correlation IDs.
10. Eval harness replays the run and blocks unsafe releases.

## Open Questions To Resolve Next

- Which work surface will be the canonical user-visible state for each agent?
- Which capabilities are MCP servers, internal APIs, workflow-only writes, or A2A delegations?
- Which data can enter memory, which can only enter evals, and which must never be stored?
- What is the exact release bundle schema for prompt, model, tool, policy, workflow, skill, memory, and eval versions?
- What product-specific staging world will reproduce healthcare bed flow, scheduling, support, and coding side effects?
- Which eval failures block release versus reduce rollout percentage?
- What audit export is required for PHI, financial writes, external communications, and source-code mutations?

## Related Notes

- [Research and standards](research-standards.md)
- [Source atlas](source-atlas.md)
- [Paper-to-product lab](paper-to-product-lab.md)
- [Architecture composition workbench](architecture-composition-workbench.md)
- [Deployment topology lab](deployment-topology-lab.md)
- [Source-system integration lab](source-system-integration-lab.md)
- [Identity and access lab](identity-access-lab.md)
- [Eval and release harness](eval-release-harness.md)
