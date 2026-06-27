# Paper-to-Product Lab

This note complements the interactive Theory Lab in `interactive.html`. The goal is to translate agent papers into product architecture decisions, not to memorize paper summaries.

For case-by-case adoption records that combine paper primitives with standards, public platform evidence, product records, and release-blocking evals, see the [Industry case architecture lab](industry-case-architecture-lab.md).

## Translation Rule

Every paper primitive should be translated through four questions:

```text
1. What capability does the paper show?
2. Which product boundary does that capability affect?
3. What does the paper not solve?
4. What evidence would prove the product implementation is safe enough?
```

For enterprise agents, the missing step is usually not "can the model do it?" The missing step is "where does this capability sit among identity, tools, policy, workflow, memory, audit, evals, and user control?"

## Paper Map

| Paper or family | What to learn | Product translation | What it does not solve |
| --- | --- | --- | --- |
| ReAct | Reason, act, observe loop | Persist run trajectories with plans, tools, observations, and stop reasons | Authorization, durability, audit, source truth |
| MRKL | Route language to external modules | Put deterministic business rules in owned tools and services | Tool governance, connector security, approval |
| Toolformer | Tool-use traces as learning data | Convert production traces into eval and improvement material | Runtime permission to call tools |
| Reflexion | Feedback and episodic learning | Turn reviewed failures into scoped lessons or evals | Trustworthy memory by default |
| Generative Agents | Memory stream, reflection, retrieval, planning | Separate event log, retrieved context, reflection, and approved memory | Enterprise accountability and regulated data handling |
| Voyager | Skill libraries improved by feedback | Treat skills as versioned artifacts with tests and rollback | Production release governance by itself |
| WebArena, AgentBench, GAIA | Long-horizon brittleness and realistic task pressure | Build product-specific staging worlds and trajectory evals | Product permissions, approvals, UX, and domain safety |
| SWE-agent | Agent-computer interface matters | Design domain-specific work surfaces and safe action affordances | Cross-domain governance |

## Real-Life Translation Examples

### Healthcare Bed Flow

User request:

```text
Book a telemetry bed for this ED patient.
```

Paper primitives in the product:

- ReAct: read capacity, observe patient constraints, rank candidates, stop at proposed payload.
- MRKL: use deterministic services for capacity, staffing, isolation, and placement policy.
- Reflexion: convert missed isolation cases into evals, not automatic patient memory.
- SWE-agent: provide a bed-flow interface with candidate beds, source links, uncertainty, and approval.
- WebArena/AgentBench mindset: test stale bed, wrong patient, PHI leakage, approval bypass, timeout, and reconciliation.

Shippable architecture:

```text
Bed-board surface
-> context binder
-> agent runtime
-> read tools
-> policy gateway
-> exact approval
-> durable reserve_bed workflow
-> source-system reconciliation
-> timeline, audit, trace, eval
```

### Enterprise Scheduling

User request:

```text
Schedule the quarterly customer review next week.
```

Paper primitives in the product:

- ReAct: read attendee constraints, observe conflicts, rank slots, draft invite.
- MRKL: timezone conversion, calendar reads, attendee resolution, and invite delivery are tools.
- Toolformer: good traces teach when to ask clarification instead of brute-forcing every slot.
- Memory papers: user preferences can persist only when visible and correctable.
- SWE-agent: calendar panel must show slot evidence, recipient preview, and message approval.

Hard product boundary:

The agent can coordinate, but it should not expose private calendar details or send customer-facing messages without approval when the message or recipients are nontrivial.

### Support Resolution

User request:

```text
Resolve this billing dispute and update the customer.
```

Paper primitives in the product:

- MRKL: policy lookup, invoice state, entitlement, and credit limits are deterministic modules.
- ReAct: trajectory should show what the agent read, which policy it used, and why it proposed the adjustment.
- Reflexion: failed policy interpretations become reviewed lessons or eval cases.
- Benchmarks: final answer correctness is not enough; tool sequence and approval behavior matter.

Hard product boundary:

Customer communication and financial adjustment are different side effects. They need separate approval and audit treatment.

### Code-Change Agent

User request:

```text
Add approval gating to the workflow simulator and verify it.
```

Paper primitives in the product:

- SWE-agent: the file/edit/test interface materially affects quality.
- ReAct: inspect, edit, test, observe, revise, summarize.
- Voyager: repo-specific skills can capture conventions and test commands.
- Reflexion: review comments can become future evals, but not unchecked durable memory.
- WebArena/AgentBench mindset: long-horizon work needs sandboxing, retries, and failure taxonomy.

Hard product boundary:

Editing code, merging, and deploying are separate authority levels. A coding agent can draft and test, but merge/deploy approval should be explicit.

## Deep-Agent Composition

A deep agent is not one magic loop. It is a composition:

```text
Planner
-> bounded subtask graph
-> tools and deterministic modules
-> workspace artifacts
-> memory retrieval
-> human interrupts
-> durable workflow
-> verification
-> learning proposal
```

How the papers combine:

- ReAct gives the inner loop.
- MRKL gives tool and module separation.
- Toolformer gives the idea that traces can improve tool use.
- Reflexion and Generative Agents give memory and reflection primitives.
- Voyager gives skill-library improvement.
- SWE-agent reminds us that the interface changes outcomes.
- WebArena, AgentBench, and GAIA warn us that broad tasks fail unless the environment, evals, and recovery are designed.

The product boundary:

The deep-agent harness may plan and coordinate, but product infrastructure still owns identity, policy, approval, workflow, source truth, audit, release, and incident response.

## Simulated Paper Review

This is a synthesized discussion between roles, not a quote from real people.

### Research Scientist

The papers show real primitives: tool use, trajectories, memory, skill libraries, and environment interfaces. But most papers optimize task completion, not enterprise accountability.

Recommendation:

Use papers to name primitives and failure classes. Do not use them as launch evidence.

### Platform Architect

Each primitive maps to a system boundary. ReAct maps to traceable steps. MRKL maps to typed tools. Memory papers map to memory governance. Benchmark papers map to eval infrastructure.

Recommendation:

For every primitive, define the product object and evidence record it creates.

### Security Owner

Tool use and memory are risk amplifiers. A model that can call tools or preserve lessons can also leak data, exceed authority, poison memory, or consume resources.

Recommendation:

Pair every paper primitive with a threat-model row and an eval case.

### Product Operator

The user does not care that the system implements a paper. The user cares whether the agent is visible, correctable, and recoverable inside the work object.

Recommendation:

Translate papers into work-surface behavior: evidence, preview, timeline, correction, escalation, and rollback.

## Product Evidence Checklist

Before claiming a paper primitive is productized, verify:

- There is a product object for the primitive, such as `AgentStep`, `ToolCall`, `MemoryProposal`, `SkillVersion`, or `EvalCase`.
- The primitive has an owner and lifecycle.
- The primitive has an allowed scope and policy boundary.
- It appears in traces where debugging matters.
- It appears in audit where accountable action matters.
- It can be evaluated in scenario-specific regression tests.
- Users or operators can inspect and correct the part that affects them.
- It is pinned in release bundles when behavior changes.

## Deep Dives To Build Next

- Agent trajectory schema: how to store plans, observations, tool calls, and stop reasons.
- Tool registry: how MRKL-style modules become governed product APIs.
- Memory governance: proposal, classification, approval, retention, use audit, and deletion.
- Skill registry: versioning, owners, allowed tools, examples, tests, and rollback.
- Staging world: fake but realistic environments for bed flow, scheduling, support, and coding agents.
- Agent-computer interface: domain-specific surfaces that improve both model behavior and user control.
