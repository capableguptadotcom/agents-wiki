# End-To-End Architecture Walkthrough

This note is the long-form companion to the Architecture Assembly lab in [interactive.html](interactive.html#walkthrough).

The purpose is to answer the core product question:

```text
When a user asks an agent to do real work, which product layer owns each decision?
```

A first-class agent product is not:

```text
prompt -> model -> tool call
```

It is:

```text
work surface
-> context binder
-> authority chain
-> bounded agent loop
-> capability gateway
-> exact approval
-> durable workflow
-> source-system reconciliation
-> memory and skill proposal
-> observability and audit
-> eval and release gate
```

Each layer is a deep module. It hides a hard design decision and exposes a small contract to the next layer. If the product lets these boundaries blur, the agent becomes hard to secure, debug, evaluate, or improve.

## Layer Contract

| Layer | Product question | Minimum record | What it hides | Failure if skipped |
| --- | --- | --- | --- | --- |
| Work surface | Where did this request happen, and what object was selected? | `AgentRun` input envelope, `TimelineEvent` | channel details, selected object, user-visible recovery | detached chat acts on wrong object |
| Context binder | Which tenant, patient, account, ticket, repo, source snapshot, and ambiguity state are bound? | `ContextManifest`, `SourceReference` | source lookup and disambiguation | model guesses missing context |
| Authority chain | Who may do what through which agent, connector, source, and tool? | `AccessDecision`, `DelegationGrant` | OAuth, OIDC, SMART, connector, source ACL, agent release | permission laundering |
| Agent loop | What should be read, clarified, ranked, drafted, or stopped? | `AgentStep`, `ToolCall` | model selection, prompt, planning, step budget | unbounded or overconfident action |
| Capability gateway | Which tools, resources, prompts, workflows, and skills are actually callable? | `ToolGrant`, `ToolCall`, schema version | MCP, OpenAPI, JSON Schema, token broker, side-effect policy | broad connector passthrough |
| Approval | Which exact payload may continue? | `Approval` with payload hash | human decision UI, modification, rejection, resume token | vague approval grants broad power |
| Durable workflow | How do side effects survive waits, retries, cancellation, and recovery? | `WorkflowEvent`, idempotency key | Temporal/Inngest/LangGraph/Cloudflare workflow mechanics | duplicate or lost write |
| Source truth | What system confirms the real domain state? | `SourceResponse`, `ReconciliationRecord` | EHR, ADT, calendar, CRM, ledger, git, CI semantics | UI says done while source disagrees |
| Memory and skills | What can affect future runs? | `MemoryProposal`, `MemoryItem`, `SkillVersion` | review, scope, retention, deletion, rollback | hidden drift or poisoned memory |
| Observability and audit | Can humans reconstruct what happened? | `TraceSpan`, `AuditEvent`, runtime ledger row | tracing, redaction, compliance audit | incident cannot be explained |
| Eval and release | Can future behavior change safely? | `EvalCase`, `EvalRun`, `ReleaseBundle` | datasets, gates, canaries, rollback | silent regression in production |

## Real-Life Assembly Examples

### Healthcare Bed Flow

Request:

```text
Hold the best monitored bed for this ED patient.
```

The work surface must pass the selected encounter, facility, nurse role, and bed-board snapshot. The context binder must resolve source references before the model reasons. SMART and FHIR can help shape launch context and healthcare resources, but local ADT, bed-board, staffing, and facility policy still decide operational truth.

The agent may rank candidate beds, but `reserve_bed` should be a workflow-owned write. The approval card should bind exactly:

```text
reserve_bed(encounter_id=E-1042, bed_id=T-418, hold_minutes=20)
```

The workflow rereads the source before writing, stores the source response, records audit, and samples the run into evals for ambiguous patient, stale bed board, duplicate hold, missing approval, and unsafe memory.

### Enterprise Scheduling

Request:

```text
Schedule the quarterly review with the right people next week.
```

The account workspace supplies account context. The binder resolves the account team, customer participants, time window, timezone, and calendar scopes. Calendar tools should return minimized availability, not raw private event data. Sending an external invite is not the same authority as reading availability.

The agent can draft recipients, slot, and agenda. The approval card binds recipient list, time, body, and customer-facing text. The workflow sends the invite, records provider message IDs, reconciles delivery, and stores only user-approved preferences as scoped memory.

### Support Resolution

Request:

```text
Resolve this billing dispute and credit the customer if policy allows.
```

The ticket surface supplies ticket, customer, account, invoice, queue, and requester role. The binder pins the active policy KB version. The agent compares ticket claim, invoice evidence, contract terms, and policy. The capability gateway separates `draft_reply`, `propose_credit`, and workflow-only `apply_credit`.

Credit approval and customer-message approval may need separate decision states. The workflow applies credit, waits for ledger confirmation, then sends the reply. A policy edge case can become a skill proposal only after policy-owner review and release-gating evals.

### Coding Agent

Request:

```text
Fix the failing auth test and open a PR.
```

The repo surface supplies issue, branch, commit SHA, failing check, allowed paths, and test intent. The binder builds a repo context manifest and keeps secrets plus unrelated paths out of model context. The agent can inspect files, patch, run allowed tests, and open a draft PR. It should not self-approve, push to protected branches, or deploy.

The source truth is git, CI, check runs, PR review state, and branch protection. Review comments can become future eval cases or repo-scoped instruction proposals, but a one-off workaround should not become global coding behavior.

## How The Standards Connect

No single standard or framework owns the whole product. Use each one at the boundary it was designed for.

| Anchor | Where it fits | Product interpretation |
| --- | --- | --- |
| ReAct, MRKL, Toolformer | agent loop and tool reasoning | useful for trajectories, modules, and tool traces |
| Reflexion, Generative Agents, Voyager | memory and skill evolution | useful primitives, but product governance must decide scope and review |
| SWE-agent, WebArena, AgentBench, GAIA | interface and eval pressure | long-horizon agents fail through trajectories, not just final text |
| MCP latest spec | tool, resource, prompt, and transport boundary | exposes capabilities, but does not replace product policy |
| A2A protocol | delegated agent boundary | use when another agent is an actor, not just when an API would do |
| OpenTelemetry GenAI conventions | runtime telemetry | traces model, agent, tool, and retrieval behavior |
| W3C Trace Context | cross-service correlation | connects surface, runtime, gateway, workflow, and source adapters |
| OAuth, OIDC, SMART | delegated access and identity | bind user, audience, scope, launch context, and source access |
| FHIR | healthcare resource shape | model Encounter, Location, Task, Appointment, but local systems still own operations |
| OWASP LLM Top 10 and agentic threats | security threat model | prompt injection, excessive agency, disclosure, connector abuse, and memory poisoning |
| NIST AI RMF, NIST GenAI Profile, ISO/IEC 42001 | governance and release lifecycle | map, measure, manage, incident, release, and accountability controls |
| Temporal, Inngest, LangGraph, Cloudflare Workflows | durable execution | waits, retries, interrupts, and recovery should outlive a model call |

Current product and platform examples help identify patterns, not complete architectures:

- Cloudflare Agents shows stateful deployed agents, tools, schedules, and workflow integration.
- Vercel AI SDK shows app-native agents, streaming UI, and human-in-the-loop patterns.
- OpenAI Agents SDK shows tools, handoffs, guardrails, sessions, and tracing concepts.
- LangGraph and Deep Agents show graph state, interrupts, subagents, filesystem-style context, and long-horizon harnesses.
- Salesforce Agentforce, ServiceNow AI Agents, Microsoft Copilot Studio, Atlassian Rovo, and Slack agents show that useful enterprise agents live inside work surfaces and enterprise data.

## Product Design Rule

Ask this for every proposed agent feature:

```text
Which layer owns the design decision, and what record proves it?
```

Examples:

- "Can the model call this tool?" belongs to the capability gateway and authority chain.
- "Should this write pause?" belongs to policy and approval.
- "What happens after approval?" belongs to durable workflow.
- "Is the task complete?" belongs to source truth and reconciliation.
- "Can this lesson affect future runs?" belongs to memory, skills, eval, and release.
- "Can we explain this incident?" belongs to observability and audit.

## Build Sequence

For a real product, build the smallest vertical slice that proves every boundary:

1. One work surface command with object context.
2. One `ContextManifest` with source references and ambiguity state.
3. One read tool and one write preview tool behind the capability gateway.
4. One approval card with payload hash.
5. One durable workflow with idempotency and source reread.
6. One source reconciliation record.
7. One audit row and one trace with shared correlation IDs.
8. One memory rejection path and one reviewed memory proposal path.
9. One eval case generated from a failed or corrected run.
10. One release bundle that proves the slice before rollout.

This sequence is deliberately smaller than a full agent platform, but it exercises the crux: agents as first-class product citizens need contracts, records, ownership, and feedback loops at every boundary.

## Primary Anchors

- [Model Context Protocol latest specification](https://modelcontextprotocol.io/specification/latest)
- [MCP authorization](https://modelcontextprotocol.io/specification/latest/basic/authorization)
- [A2A protocol specification](https://a2a-protocol.org/latest/specification/)
- [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions/tree/main/docs/gen-ai)
- [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [OWASP Agentic AI threats and mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1)
- [FHIR Encounter](https://build.fhir.org/encounter.html), [FHIR Location](https://build.fhir.org/location.html), and [FHIR Task](https://build.fhir.org/task.html)
- [SMART App Launch scopes and launch context](https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html)
- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Vercel AI SDK Agents](https://ai-sdk.dev/docs/agents/overview)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/agents/)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangChain Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview)
