# Industry Pattern Teardowns

Current as of 2026-06-27.

This note complements the interactive Product Pattern Teardown in `interactive.html`. The goal is to study current agent products and platforms without treating any vendor page as a complete architecture blueprint.

For case-by-case architecture adoption records that combine public evidence, paper primitives, standards, lifecycle records, and release-blocking evals, use the [Industry case architecture lab](industry-case-architecture-lab.md).

The useful question is not:

```text
Which vendor should we copy?
```

The useful question is:

```text
Which product pattern is visible, which architecture layer does it prove, and what remains our responsibility?
```

## Teardown Method

For every product or platform example, separate six things:

| Question | Why it matters |
|---|---|
| What does the user see? | Reveals the product surface, trust affordances, and workflow entry point. |
| What source system is nearby? | Shows whether the agent is grounded in real work objects or detached chat. |
| What runtime pattern is visible? | Identifies loops, graph state, handoffs, tools, sessions, and streaming behavior. |
| What action boundary exists? | Determines where tools, approvals, workflows, and idempotency belong. |
| What governance is explicit? | Shows what is admin-controlled, permissioned, audited, evaluated, or releasable. |
| What is not proven publicly? | Prevents us from assuming hidden evals, memory controls, incident handling, or compliance evidence. |

## Current Product Patterns

### Salesforce Agentforce

Visible pattern:

- CRM-native agents near sales, service, marketing, commerce, and customer data.
- Business actions are framed around enterprise records and workflows.
- Trust and governance are part of the positioning, not an afterthought.

Architecture lesson:

```text
system of record
-> grounded agent
-> business action
-> workflow or CRM state update
-> admin governance
```

What to borrow:

- Put agents near records, cases, accounts, contacts, and service workflows.
- Treat actions as business operations, not generic function calls.
- Give admins a control plane for topics, actions, channels, rollout, and monitoring.

What remains ours:

- Domain-specific approval rules.
- Durable execution and source reconciliation.
- Product-specific evals and incident response.

### ServiceNow AI Agents

Visible pattern:

- Agents embedded in IT, HR, customer service, and enterprise workflows.
- Strong fit with tickets, requests, cases, SLAs, assignments, and service operations.

Architecture lesson:

```text
service workflow state
-> agent classification or resolution
-> governed action
-> ticket/request/case transition
-> operational audit
```

What to borrow:

- Anchor agents to explicit workflow states.
- Make routing, escalation, resolution, and SLA changes inspectable.
- Let existing process state constrain autonomy.

What remains ours:

- The actual service taxonomy and escalation policy.
- Evidence that an agent resolution is correct enough to close work.
- Evals for assignment, policy interpretation, customer response, and escalation.

### Microsoft Copilot Studio

Visible pattern:

- Low-code agent builder with triggers, instructions, tools, knowledge, channels, and publishing.
- Useful for understanding agent configuration as product data.

Architecture lesson:

```text
trigger
-> instructions
-> knowledge
-> tool or flow
-> channel
-> environment governance
```

What to borrow:

- Separate trigger, tool, knowledge, channel, and deployment controls.
- Treat every new trigger as an autonomy boundary.
- Treat every connector as a data and side-effect boundary.

What remains ours:

- Risk tiers for autonomous triggers.
- Approval rules for external communication and sensitive writes.
- Release gates for prompt, tool, workflow, and knowledge changes.

### Atlassian Rovo

Visible pattern:

- Agents inside issues, pages, project work, search, chat, and automation.
- Strong work-graph pattern: the agent is useful because the surrounding artifacts already have ownership and history.

Architecture lesson:

```text
work graph
-> source-linked context
-> draft or update artifact
-> owner review
-> project history
```

What to borrow:

- Update structured work artifacts, not only chat transcripts.
- Preserve links to issues, pages, comments, and source context.
- Require owner review for priority, assignment, and commitment changes.

What remains ours:

- Noise control.
- Priority and ownership governance.
- Evals for summarization fidelity, issue creation quality, and source attribution.

### Slack AI Apps And Agents

Visible pattern:

- Agents in channels, mentions, threads, messages, and assistant flows.
- Useful for intake, coordination, interruption, and notification.

Architecture lesson:

```text
collaboration surface
-> linked work object
-> product action proposal
-> approval or workflow in source system
-> status notification back to channel
```

What to borrow:

- Use chat where people already coordinate.
- Make agents easy to invoke from a thread or channel.
- Notify status changes and ask clarifying questions without forcing users to leave the conversation.

What remains ours:

- Do not make Slack the source of truth for regulated workflows.
- Bind every action to a product work object.
- Prevent sensitive data from being posted into the wrong channel.

### Cloudflare Agents

Visible pattern:

- Stateful deployed agents reachable through web apps, chat, email, voice, Slack, webhooks, or custom clients.
- Useful infrastructure pattern for agents as deployed objects, not just prompt calls.

Architecture lesson:

```text
deployed stateful agent object
-> tools and platform services
-> schedules or workflows
-> app-specific state and product integration
```

What to borrow:

- Think of agents as deployed runtime units.
- Keep runtime state explicit.
- Pair agent state with durable workflows for long-running actions.

What remains ours:

- Tenant model.
- Domain policy.
- Approval payloads.
- Audit records.
- Source-system reconciliation.
- Healthcare or enterprise compliance evidence.

### Vercel AI SDK Agents

Visible pattern:

- App-native streaming UI, bounded tool loops, structured outputs, and human-in-the-loop flows.

Architecture lesson:

```text
web app state
-> model/tool loop
-> streamed progress
-> structured output or approval card
-> app action or workflow handoff
```

What to borrow:

- Design the UI and tool loop together.
- Use structured output to bridge model text and product objects.
- Show progress, previews, and interruptions naturally in the app.

What remains ours:

- Durable workflow for critical side effects.
- Audit, tenant policy, and release management.
- Recovery after worker restart, timeout, cancellation, or partial source-system write.

### OpenAI Agents SDK

Visible pattern:

- Code-first orchestration around agents, tools, handoffs, guardrails, sessions, and tracing.

Architecture lesson:

```text
agent definition
-> runner
-> tools
-> handoff
-> guardrail
-> trace
```

What to borrow:

- Make agents, tools, handoffs, and tracing explicit code objects.
- Model specialist handoffs directly.
- Use traces as first-class debugging data.

What remains ours:

- Product identity and delegated authorization.
- Admin lifecycle.
- Compliance audit.
- Durable execution.
- Domain-specific evals.

### LangGraph And Deep Agents

Visible pattern:

- State graphs, persistence, interrupts, human checkpoints, long-horizon harnesses, subagents, and workspace artifacts.

Architecture lesson:

```text
graph state
-> node execution
-> tool or subagent
-> interrupt
-> resume
-> checkpoint history
```

What to borrow:

- Model long-running agent work as explicit state transitions.
- Use interrupts for human review, clarification, and approval.
- Keep workspace artifacts visible.

What remains ours:

- Source-system truth.
- Compliance audit.
- Business compensation.
- Release gates for graph, tool, prompt, and memory changes.

## Healthcare Pattern Comparison

Healthcare command centers, inpatient-flow products, and capacity-management tools are not "agents" in the generic chat sense. They are operational systems around patient flow, capacity, escalation, staffing, transport, discharge prediction, and standard work.

The pattern to copy is not autonomous medical decision-making. The pattern is:

```text
operations surface
-> source-of-truth context
-> recommendation
-> human accountable decision
-> workflow execution
-> reconciliation
-> operational learning
```

For a bed-flow agent, this means:

- voice is an entry point
- the bed board is the work surface
- FHIR or local ADT models anchor patient, encounter, location, and task state
- SMART-style launch context and scopes bind identity
- HIPAA-style safeguards shape access, audit, integrity, and transmission controls
- durable workflow handles bed hold, notification, transport, waits, cancellation, and reconciliation

## What This Means For Our Product

The industry examples converge around six repeatable patterns:

1. Native work surfaces beat detached chat.
2. Tools and actions need schemas, scopes, owners, and lifecycle.
3. Approval and human interruption are product workflows, not prompt text.
4. Durable execution is separate from model reasoning.
5. Memory and knowledge need governance and correction.
6. Observability, audit, evals, and release controls decide whether agents can improve safely.

## Evidence Checklist

Before adopting a pattern from any platform, ask:

- Which source object is the agent attached to?
- Which user, tenant, role, and delegated scopes are bound?
- Which tools are read-only, write-capable, external-communication, or financial/clinical side effects?
- Which actions need exact-payload approval?
- Which side effects need durable workflow execution?
- Which source system proves completion?
- Which trace, audit, and timeline records are written?
- Which failures become evals?
- Which memory or skill changes require review and release?
- Which part is vendor capability versus our product responsibility?

## Key Takeaway

```text
Industry examples show useful surfaces and runtime patterns.
They do not remove the need for product architecture.
The control plane, source truth, workflow recovery, audit, and eval lifecycle are still ours.
```
