# Source Atlas

Current as of 2026-06-27.

This note explains how to use papers, standards, protocols, platform examples, and healthcare case studies as architecture inputs for agent-native products.

The goal is not to collect impressive links. The goal is to decide what each source proves, what it does not prove, and which product boundary it should influence.

Use [Architecture decisions](architecture-decisions.md) after this atlas to convert source interpretation into ADR-style adopt, reject, evidence, and scenario decisions.

Use [Memory lifecycle simulator](memory-lifecycle-simulator.md) when translating memory papers into concrete product records, review gates, retrieval policy, and correction paths.

Use [Eval and release harness](eval-release-harness.md) when translating benchmark papers, observability conventions, and governance standards into release-blocking trajectory tests.

Use [Source-system integration lab](source-system-integration-lab.md) when translating domain standards such as FHIR, SMART, CRM, calendar, ticketing, billing, repository, and CI APIs into field-level source-of-truth contracts.

Use [Identity and access lab](identity-access-lab.md) when translating OAuth, OIDC, SMART, MCP Authorization, OWASP, and NIST into user, agent, connector, tool, approval, service identity, audit, and revocation records.

Use [Architecture composition workbench](architecture-composition-workbench.md) when a team needs to combine paper primitives, standards, product cases, records, failure modes, and release-blocking evals for one product layer.

Use [Evidence chain architecture](evidence-chain-architecture.md) when a team needs to connect each paper or benchmark claim to a standards boundary, a public case pattern, a deployable component, a product record, a failure mode, and an eval gate.

Use [Industry case architecture lab](industry-case-architecture-lab.md) when a team needs to turn public industry examples into explicit adoption records that separate evidence, inference, product responsibility, and release gates.

## Reading Rule

Every source should be translated into four product questions:

```text
Which architecture layer does it affect?
What product behavior should change because of it?
What boundary must remain outside the agent?
What evidence would prove our implementation is correct?
```

If a source cannot answer those questions, it may still be interesting, but it is not yet architecture evidence.

## Papers and Benchmarks

Papers are best used to identify primitives and failure modes.

| Source | Teaches | Product translation | Do not infer |
|---|---|---|---|
| ReAct | Reason, action, observation loops | Store runs as trajectories with tool calls and observations | Reasoning text is not audit or authorization |
| MRKL | Modular tool and symbolic-system routing | Put deterministic logic in typed services | The model should own business rules |
| Toolformer | Tool-use traces as learning data | Use traces for evals and training examples | Tool-call skill removes runtime policy |
| Reflexion | Feedback and episodic learning | Convert reviewed failures into evals or approved memory | Self-reflection should write memory automatically |
| Generative Agents | Memory stream, reflection, retrieval, planning | Separate event log, memory, reflection, and source context | Memory can replace source-system truth |
| CoALA | Memory, action, decision, and learning modules | Map cognitive memory types to governed product data classes | Cognitive architecture is not product governance |
| MemGPT | Explicit memory management for long-context agents | Treat memory movement as a controlled lifecycle | Unlimited context removes policy, owner, or retention needs |
| Voyager | Skill libraries improved through feedback | Version skills as release artifacts | Skills can evolve silently in production |
| WebArena | Long-horizon autonomous brittleness | Build staging worlds and trajectory evals | Benchmark success equals production safety |
| AgentBench | Cross-environment failure taxonomy | Track failures by layer and trajectory | Aggregate score is enough |
| GAIA | Real-world tool and reasoning tasks | Test deceptively simple tasks that hide product risk | Final answer correctness covers side effects |
| SWE-agent | Agent-computer interface matters | Design product-specific agent work surfaces | A generic chat box is enough |

## Standards and Protocols

Standards define boundaries. They do not automatically create a governed product.

| Source | Governs | Product translation | Boundary warning |
|---|---|---|---|
| MCP | Tool, resource, prompt, and transport boundary | Expose context and tools through explicit server contracts | MCP is not the whole control plane |
| MCP authorization | Remote connector authorization | Use scoped OAuth-style authorization and avoid token passthrough | Product policy must still check resource and side effect |
| A2A | Agent discovery and delegation | Use when another agent is a delegated actor | Prefer typed APIs or workflows when delegation is unnecessary |
| OAuth 2.0 | Delegated authorization | Bind scopes, audience, resource server, and revocation | OAuth is not authentication |
| OpenID Connect | Authentication and identity claims | Bind user, tenant, role, and session to runs | ID token is not permission to call APIs |
| SMART App Launch | Healthcare app launch and FHIR scopes | Bind launch context, patient or user context, FHIR audience, and granted scopes | SMART delegates an existing entity's permissions; local EHR policy still applies |
| OpenTelemetry GenAI | Trace vocabulary | Instrument model, tool, retrieval, errors, tokens, and latency | Trace is not compliance audit |
| OWASP LLM Top 10 | LLM app threat model | Control injection, excessive agency, data leakage, supply chain, and resource use | Prompt text is not a security boundary |
| NIST AI RMF and NIST GenAI Profile | Risk lifecycle | Govern, map, measure, and manage GenAI risk | Framework compliance is not product correctness |
| ISO/IEC 42001 and 23894 | AI management and risk process | Add lifecycle roles, supplier controls, risk treatment, and monitoring | Management process does not prove one action is safe |

## Product and Platform Cases

Industry examples show where agents are being embedded. They rarely show enough internals to copy their architecture directly.

| Example | Useful pattern | Product lesson |
|---|---|---|
| Salesforce Agentforce | CRM-native agents, data grounding, business actions | Put agents near the system of record |
| ServiceNow AI Agents | Workflow-native enterprise service agents | Agents need structured process state |
| Microsoft Copilot Studio | Triggers, instructions, tools, knowledge, channels | Separate trigger, action, knowledge, channel, and governance |
| Atlassian Rovo | Agents in issues, pages, chat, and automation | Update work artifacts, not just conversations |
| Slack AI apps and agents | Mentions, threads, assistant flows | Use chat as coordination, not source of truth |
| Cloudflare Agents | Stateful deployed agent runtime | Runtime state is not domain governance |
| Vercel AI SDK | App-native tool loops and human-in-the-loop UI | UI loops still need durable workflows for critical side effects |
| OpenAI Agents SDK | Agents, tools, handoffs, guardrails, tracing | SDK orchestration must plug into product control plane |
| LangGraph and Deep Agents | Graph state, interrupts, subagents, workspace artifacts | Useful harness, but product policy and audit remain separate |

## Healthcare Sources

Healthcare sources are important because they force source-of-truth thinking.

| Source | Architecture implication |
|---|---|
| FHIR Appointment, Encounter, Location, Task | Model planned events, actual care interactions, beds/units, and operational tasks explicitly |
| SMART App Launch | Bind launch context and FHIR scopes before reasoning |
| HIPAA Security Rule | Design access control, audit control, integrity, authentication, transmission security, and risk analysis around ePHI |
| Command-center and inpatient-flow products | Treat patient flow as a socio-technical operations problem, not just a scheduling algorithm |

## Bed-Flow Translation

The sources converge into this product path:

```text
voice or work-surface command
-> identity and context binding
-> source-system reads
-> agent trajectory
-> typed tool proposal
-> policy decision
-> exact approval payload
-> durable workflow
-> source-system reconciliation
-> timeline, audit, trace, and eval
-> governed learning or no memory write
```

The crux:

```text
The agent coordinates the decision.
The product owns authority.
The workflow owns recovery.
The source systems own truth.
The audit owns accountability.
The release process owns improvement.
```

## Deep-Dive Questions

- Which sources should become architecture decision records?
- Which source claims are strong enough to become release gates?
- Which are only inspiration or product pattern evidence?
- Which product boundaries are currently under-sourced?
- Which layers have too much theory and not enough case-study evidence?
- Which layers have vendor examples but weak internal architecture evidence?
- Which healthcare fields must map to FHIR or local source-system objects before the agent can act?
- Which evidence must be visible to the user versus only visible to operators, auditors, or developers?
