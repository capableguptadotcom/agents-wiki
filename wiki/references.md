# Reference Map

The wiki uses these sources as anchor points. The goal is not to copy any one platform, but to extract product architecture patterns.

## Software Design Philosophy

- A Philosophy of Software Design, John Ousterhout: https://web.stanford.edu/~ouster/cgi-bin/aposd2ndEdExtract.pdf
  - Useful for deep modules, information hiding, complexity red flags, and the distinction between strategic and tactical programming.
- On the Criteria To Be Used in Decomposing Systems into Modules, David Parnas: https://doi.org/10.1145/361598.361623
  - Useful as the original information-hiding criterion: decompose around design decisions that should not leak to callers.

## Research Papers and Benchmarks

- ReAct: https://arxiv.org/abs/2210.03629
  - Useful for the reason, act, observe loop and trajectory-level debugging.
- MRKL Systems: https://arxiv.org/abs/2205.00445
  - Useful for modular neuro-symbolic routing between language models and external tools.
- Toolformer: https://arxiv.org/abs/2302.04761
  - Useful for thinking about tool-use traces as learning and evaluation data.
- Reflexion: https://arxiv.org/abs/2303.11366
  - Useful for feedback, episodic memory, and post-run reflection patterns.
- Generative Agents: https://arxiv.org/abs/2304.03442
  - Useful for separating memory stream, reflection, retrieval, and planning.
- Voyager: https://arxiv.org/abs/2305.16291
  - Useful for executable skill libraries improved through environment feedback.
- WebArena: https://arxiv.org/abs/2307.13854
  - Useful as a warning about long-horizon web-agent brittleness.
- AgentBench: https://arxiv.org/abs/2308.03688
  - Useful for multi-environment agent failure taxonomy.
- GAIA: https://arxiv.org/abs/2311.12983
  - Useful for real-world assistant tasks that require reasoning, tools, and browsing.
- SWE-agent: https://arxiv.org/abs/2405.15793
  - Useful for agent-computer interface design and software-agent evals.

## Standards, Protocols, and Governance

- OWASP Top 10 for LLM Applications: https://genai.owasp.org/llm-top-10/
  - Useful for prompt injection, sensitive disclosure, excessive agency, supply-chain, and resource-consumption threats.
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
  - Useful for Govern, Map, Measure, and Manage risk lifecycle thinking.
- NIST GenAI Profile: https://doi.org/10.6028/NIST.AI.600-1
  - Useful for generative-AI-specific risk management.
- ISO/IEC 42001: https://www.iso.org/standard/81230.html
  - Useful for AI management system governance.
- ISO/IEC 23894: https://www.iso.org/standard/77304.html
  - Useful for AI risk management process design.
- OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/
  - Useful for model, agent, tool, retrieval, span, event, metric, and trace vocabulary.
- CloudEvents specification: https://github.com/cloudevents/spec
  - Useful for common event envelopes across product, workflow, audit, and eval consumers.
- W3C Trace Context: https://www.w3.org/TR/trace-context/
  - Useful for trace propagation across agent runtime, tool gateway, workflow engine, and source-system adapters.
- Agent2Agent protocol: https://a2a-protocol.org/latest/specification/
  - Useful for cross-agent discovery, task delegation, and stateful communication boundaries.
- OAuth 2.0: https://datatracker.ietf.org/doc/html/rfc6749
  - Useful for delegated authorization boundaries.
- OpenID Connect Core: https://openid.net/specs/openid-connect-core-1_0.html
  - Useful for identity claims and authentication boundaries.
- OAuth 2.0 Security Best Current Practice: https://datatracker.ietf.org/doc/rfc9700/
  - Useful for modern OAuth security guidance such as avoiding deprecated flows, narrowing scopes, and protecting tokens.

## Agent Runtimes and Product Patterns

- Cloudflare Agents: https://developers.cloudflare.com/agents/
  - Useful for stateful agent objects, communication channels, harness/runtime/tool split, and edge-native deployment patterns.
- Cloudflare Workflows: https://developers.cloudflare.com/workflows/
  - Useful for durable background execution on Cloudflare.
- Vercel AI SDK agents: https://ai-sdk.dev/docs/agents/overview
  - Useful for bounded tool loops, agentic loops, and the difference between loop-based agents and structured workflows.
- Vercel AI SDK human-in-the-loop: https://ai-sdk.dev/docs/agents/human-in-the-loop
  - Useful for approval and confirmation patterns in app UIs.
- OpenAI Agents SDK: https://openai.github.io/openai-agents-python/agents/
  - Useful for agents, tools, handoffs, guardrails, sessions, and tracing.
- OpenAI Agents SDK handoffs: https://openai.github.io/openai-agents-python/handoffs/
  - Useful for runtime-level handoff concepts between agents.
- OpenAI Agents SDK tracing: https://openai.github.io/openai-agents-python/tracing/
  - Useful for run observability.

## Tool and Connector Layer

- Model Context Protocol specification: https://modelcontextprotocol.io/specification/2025-11-25
  - Useful for the distinction between tools, resources, prompts, transports, and authorization.
- Model Context Protocol authorization: https://modelcontextprotocol.io/specification/latest/basic/authorization
  - Useful for OAuth-style authorization guidance for remote MCP servers.
- MCP tools: https://modelcontextprotocol.io/specification/2025-11-25/server/tools
  - Useful for tool schema thinking.
- MCP resources: https://modelcontextprotocol.io/specification/2025-11-25/server/resources
  - Useful for separating context from action.
- Slack AI apps and agents: https://docs.slack.dev/ai/developing-agents
  - Useful for host-native collaboration surfaces.

## Durable Execution

- Temporal docs: https://docs.temporal.io/
  - Useful for event history, durable workflows, activity retries, and worker versioning.
- Temporal workflow message passing: https://docs.temporal.io/develop/typescript/message-passing
  - Useful for durable workflow signals, queries, updates, and external decision delivery.
- Inngest docs: https://www.inngest.com/docs
  - Useful for event-driven durable functions and step-level observability.
- LangGraph overview: https://docs.langchain.com/oss/python/langgraph/overview
  - Useful for graph-oriented agents, state, interrupts, and memory.
- LangGraph interrupts: https://docs.langchain.com/oss/python/langgraph/interrupts
  - Useful for human-in-the-loop pause and resume.
- LangChain Deep Agents: https://docs.langchain.com/oss/python/deepagents/overview
  - Useful for understanding planning, subagents, tool access, filesystem-style context, and long-horizon agent harness design.

## Healthcare and Compliance

- Johns Hopkins command center overview: https://www.hopkinsmedicine.org/news/articles/2016/03/command-center-to-improve-patient-flow
  - Useful for real-world patient-flow command-center thinking.
- Qventus healthcare automation platform: https://www.qventus.com/solutions/healthcare-automation-platform/
  - Useful for operational automation patterns around discharge planning and inpatient flow.
- LeanTaaS inpatient flow: https://leantaas.com/products/inpatient-flow/
  - Useful for capacity management and inpatient-flow product patterns.
- FHIR Appointment: https://build.fhir.org/appointment.html
  - Useful for scheduling planned healthcare events.
- FHIR Encounter: https://build.fhir.org/encounter.html
  - Useful for actual patient care and location progression.
- FHIR Location: https://build.fhir.org/location.html
  - Useful for facilities, units, rooms, beds, and operational location modeling.
- SMART App Launch scopes: https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html
  - Useful for scoped healthcare access.
- HHS HIPAA Security Rule guidance: https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html
  - Useful for access control, audit control, integrity, authentication, and transmission safeguards.

## Enterprise Agent Product Examples

- Salesforce Agentforce: https://www.salesforce.com/agentforce/
  - Useful for CRM/service agents, actions, channels, and enterprise agent positioning.
- Salesforce Agentforce how it works: https://www.salesforce.com/agentforce/how-it-works/
  - Useful for data, reasoning, actions, and trust-layer positioning.
- ServiceNow AI Agents: https://www.servicenow.com/products/ai-agents.html
  - Useful for workflow-integrated supervised and autonomous service operations patterns.
- Microsoft Copilot Studio agents: https://learn.microsoft.com/en-us/microsoft-copilot-studio/
  - Useful for enterprise agent building, publishing, governance, and connector patterns.
- Microsoft Copilot Studio autonomous agents: https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/autonomous-agents
  - Useful for triggers, instructions, tools, knowledge, and channels.
- Atlassian Rovo agents: https://support.atlassian.com/rovo/docs/agents/
  - Useful for work-management agents embedded in project, issue, and collaboration workflows.

## Product Pattern Notes

Current agent products converge around:

- native work surfaces, not just chat
- typed tools and action schemas
- explicit approval and handoff
- durable execution beyond a single HTTP request
- visible progress, timelines, and run status
- governed memory
- audit separate from traces
- evals and release gates

The wiki should keep these as reusable patterns rather than vendor-specific assumptions.

See also:

- [Product object model lab](product-object-model-lab.md), which maps release bundles, agent versions, runs, context, access, tools, approvals, workflow events, source responses, timeline, audit, traces, memory proposals, and eval cases as one product graph.
- [Intent to action router](intent-to-action-router.md), which defines how utterances, work-surface context, identity, candidate tools, policy classification, clarification, approval, and workflow handoff connect before execution.
- [Capability registry](capability-registry.md), which defines how skills, resources, tools, workflows, memory classes, and connectors are granted and revoked.
- [Skill lifecycle lab](skill-lifecycle-lab.md), which defines how skill changes move from evidence to authoring, review, eval, release, runtime proof, and learning.
- [Identity and access lab](identity-access-lab.md), which defines effective authority across user/session identity, agent version, delegated token scope, connector grant, tool gate, approval, workflow service identity, source-system ACL, audit, and revocation.
- [Subagent handoff simulator](subagent-handoff-simulator.md), which defines scoped handoff contracts between owner agents and specialists, including allowed tools, output schemas, prohibited authority, synthesis paths, and evals.
- [Memory governance](memory-governance.md), which defines memory classes, proposal review, use audit, correction, deletion, quarantine, retention, and bad-memory evals.
- [Memory lifecycle simulator](memory-lifecycle-simulator.md), which traces how a proposal becomes active memory, how future runs retrieve it with audit, and how correction, deletion, or quarantine feeds evals.
- [Approval handoff](approval-handoff.md), which defines exact-payload approval, modification, rejection, escalation, resume tokens, audit evidence, and eval cases.
- [Durable execution](durable-execution.md), which defines workflow ownership, idempotency, waits, cancellation, compensation, source reconciliation, platform fit, case-study walkthroughs, and durable-run evals.
- [Industry pattern teardowns](industry-pattern-teardowns.md), which decomposes current platform and product examples into visible surfaces, hidden architecture pieces, useful patterns, caveats, and evidence questions.
- [Architecture composition workbench](architecture-composition-workbench.md), which combines paper primitives, standards, product cases, product records, failure modes, and eval gates by architecture layer.
- [Evidence chain architecture](evidence-chain-architecture.md), which connects paper and benchmark evidence, standards, public product cases, deployable components, records, failures, and eval gates.
- [Protocol runtime decision lab](protocol-runtime-decision-lab.md), which decides when agent SDK loops, internal APIs, MCP, workflow engines, A2A delegation, events, and control-plane governance should own a boundary.
- [Industry case architecture lab](industry-case-architecture-lab.md), which turns public case evidence, paper primitives, standards, lifecycle records, and release-blocking evals into adoption decision records.
- [Paper-to-product lab](paper-to-product-lab.md), which turns research primitives into product boundaries, evidence records, evals, and workflow examples.
- [Source atlas](source-atlas.md), which translates these sources into architecture boundaries, product implications, caveats, and design questions.
- [Architecture decisions](architecture-decisions.md), which turns those boundaries into ADR-style product decisions and evidence requirements.
- [Agent maturity model](agent-maturity-model.md), which scores whether a candidate agent is ready for a higher autonomy level.
- [Product UX surfaces](product-ux-surfaces.md), which maps user-facing surfaces to backend records, controls, and recovery paths.
- [Agent threat model](agent-threat-model.md), which maps concrete agent failure modes to enforcement boundaries, evidence records, evals, and recovery paths.
- [Deployment topology lab](deployment-topology-lab.md), which maps deployable planes, services, stores, events, source adapters, control hooks, observability, and release evidence.
- [Source-system integration lab](source-system-integration-lab.md), which maps agent-visible fields to authoritative systems, standards or APIs, adapters, cache rules, policy scopes, reconciliation checks, and proof records.
- [Agent operations lifecycle](agent-operations-lifecycle.md), which maps release changes to risk review, eval gates, staging replay, canaries, production monitoring, incidents, and learning.
- [Eval and release harness](eval-release-harness.md), which maps production failures, traces, memory corrections, policy issues, and review comments into trajectory evals, datasets, eval runs, and release gates.
- [Runtime ledger](runtime-ledger.md), which connects run records, events, traces, audit, workflows, memory proposals, and eval cases through one correlation spine.
