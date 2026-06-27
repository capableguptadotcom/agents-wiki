# Identity and Access Lab

Current as of 2026-06-27.

This lab explains how to make agents first-class product actors without giving them vague or excessive authority.

The short version:

```text
effective authority
= authenticated user/session
AND agent version grant
AND connector or delegated token scope
AND tenant/resource policy
AND data and side-effect policy
AND exact approval when required
AND source-system ACL
```

If any part is missing, the agent should clarify, degrade to a read-only path, request approval, or stop.

## Why This Exists

Capability registry answers what the agent can use. Source-system integration answers where truth lives.
Identity and access answers who the agent is acting for, which credential is used, and what proves the action
was allowed.

Enterprise failures usually come from collapsing these into one vague idea:

- OIDC identity becomes mistaken for API authorization.
- OAuth delegated access becomes mistaken for blanket agent authority.
- A connector token is passed through to a tool with the wrong audience.
- Approval becomes a broad future permission instead of one exact payload.
- A workflow service account writes to a source system without user and agent context.
- Trace logs are treated as audit evidence even though they do not prove accountability.

## Simulated Architecture Review

This is a synthesized discussion between roles, not quotes from real people or organizations.

### Product Platform Architect

The agent needs a product principal: `Agent`, `AgentVersion`, owner, purpose, status, allowed channels,
autonomy ceiling, tool grants, memory policy, and release bundle. A user request should create an
`AgentRun`, not a free-floating model call.

### IAM and Security Architect

The core rule is intersection, not inheritance. The agent should not inherit everything the user can do,
and the user should not gain access through the agent. OAuth access tokens need the right audience,
resource, scope, expiry, and holder. ID tokens establish identity; they are not API credentials.

### Source-System Owner

Source systems still enforce their own ACLs. Healthcare, calendar, billing, and repository systems should
receive scoped calls through adapters or connectors, not arbitrary agent-generated requests. If a workflow
uses a service account, it still needs user, agent, approval, and policy context attached.

### Compliance and Audit Owner

Audit must reconstruct the actor chain: requester, agent version, connector, delegated scope, policy decision,
approver, payload hash, workflow identity, source response, and revocation path. A trace helps debugging;
it is not enough for regulated audit.

### Product Operator

The UI must show when the agent is acting for the user, when it is asking for approval, and when a workflow
is executing. Approval should preview exact arguments, source evidence, alternatives, expiry, and recovery path.

## Identity Chain

| Actor | Product question | Typical credential | Record |
|---|---|---|---|
| User subject | Who made the request? | OIDC session, host session, enterprise SSO | `SessionContext` |
| Agent principal | Which product actor is running? | `AgentVersion`, release bundle, capability grants | `AgentVersion` |
| Delegated client | What external access was delegated? | OAuth access token, SMART token, connector token | `DelegationGrant` |
| Connector or MCP server | Which tool boundary is being used? | connector grant, resource-server token, MCP auth metadata | `ConnectorGrant` |
| Policy gateway | Is this action allowed now? | product policy decision | `AccessDecision` |
| Approver | Who approved the side effect? | approval record with payload hash | `Approval` |
| Workflow/service identity | What executed the durable side effect? | service credential plus run context | `WorkflowEvent` |
| Source system | What actually changed? | source response and source ACL | `SourceResponse` |
| Audit owner | Can we reconstruct and revoke? | audit export and incident controls | `AuditEvent` |

## Standards Anchors

OAuth 2.0 is delegated authorization. Use it for scoped API access, not for proving user identity by itself.

OpenID Connect adds an identity layer and ID token. Use it to bind user/session identity, tenant, and claims.
Do not pass ID tokens to tools as API credentials.

SMART App Launch profiles OAuth/OIDC for FHIR apps. Use launch context, `aud`, granted FHIR scopes,
patient or user context, and EHR-specific permission behavior to constrain healthcare agents.

MCP Authorization defines how remote MCP servers and clients should handle OAuth-style authorization.
Treat MCP servers as protected resource boundaries. Do not pass unrelated upstream tokens through the MCP server.

OWASP LLM and agentic security guidance is the risk frame: prompt injection, excessive agency, tool misuse,
privilege abuse, sensitive data disclosure, supply-chain risk, and insecure inter-agent communication.

NIST AI RMF is the governance frame: map the identities, data flows, tools, risks, and third-party dependencies;
measure misuse cases; manage residual risk; govern the lifecycle.

## Paper-To-Architecture Translation

Papers such as ReAct, MRKL, Toolformer, Reflexion, Generative Agents, Voyager, WebArena, AgentBench,
GAIA, and SWE-agent explain why agents need explicit action loops, tools, memory, skills, environment
feedback, and trajectory evals.

They do not supply enterprise authority. The product must add:

- identity binding before the loop starts
- tool authorization at every action
- approval for high-impact side effects
- source-system reconciliation after writes
- durable workflow execution outside the model loop
- audit and revocation paths
- evals that test denied scopes, modified approvals, stale tokens, and excessive agency

## Scenario Patterns

### Healthcare Bed Flow

The agent begins inside a bed board or ED workspace. The product binds the nurse, facility, encounter,
patient context, and SMART/FHIR scopes before reasoning. The agent may read placement context and capacity
through scoped tools. A bed hold is a PHI-adjacent operational write, so it requires exact approval and
durable workflow execution.

Key rule:

```text
SMART context and FHIR scopes allow reads.
The product policy and approval record authorize the bed-hold side effect.
The workflow service account executes the write with user and agent context.
```

### Enterprise Scheduling

The agent can read free/busy data and account context with minimal scopes. It should not read private calendar
titles or send customer invites from broad delegated access. External sends require preview and exact approval.

### Support Resolution

The agent can gather ticket, invoice, entitlement, and policy evidence. Applying a credit and sending a customer
reply are separate side effects with separate policy and approval checks.

### Code-Change Agent

The agent may inspect a repository, edit scoped paths, run allowlisted commands, and open a PR. Merge and deploy
remain separate authority levels protected by review, branch protection, required checks, and exact approval.

## Case Study Lessons

Current product patterns converge around this architecture:

- Cloudflare Agents emphasize durable, stateful agents across channels.
- Vercel AI SDK separates tool loops, subagents, streaming UI, model routing, and telemetry.
- Microsoft Copilot and Agent 365 emphasize enterprise agent registry, lifecycle, access, and governance.
- Salesforce Agentforce and ServiceNow AI Agents place agents inside CRM and workflow systems with actions, orchestrators, data grounding, and logs.
- GitHub Copilot coding agent shows agents producing reviewable branches, logs, tests, commits, and PRs instead of only chat output.
- Slack shows collaboration surfaces where humans can invoke, watch, interrupt, and hand off agent work.

The common lesson is that first-class agents live inside product surfaces, source-system permissions, workflows, approvals, logs, and release controls.

## Anti-Patterns

1. Broad token passthrough.

The agent or MCP server receives a token issued for another resource and uses it with unrelated tools.

2. ID token as API permission.

The product knows who the user is but has not proven what the user or agent can do.

3. Connector as policy engine.

The connector exposes capabilities, but product policy still decides whether this user, agent, tenant, object, and side effect are allowed.

4. Approval as blanket permission.

Approval should bind to one payload hash, source evidence, risk label, expiry, and resume token.

5. Service account without context.

Workflow credentials may execute the action, but audit must still carry user, agent, approval, policy, and idempotency context.

6. Trace as audit.

Traces are useful for engineering. Audit is the accountable record of access and side effects.

## Eval Cases

Identity and access evals should become release blockers:

- denied user scope never calls the tool
- revoked connector grant stops future calls
- expired token causes reauthorization or graceful stop
- narrower granted SMART scope narrows the agent action
- rejected approval never starts workflow
- modified payload requires new approval
- workflow preserves user and agent context when using service identity
- source-system denial becomes `needs_reconciliation`, not `completed`
- audit export reconstructs the full actor chain

## Architecture Fit

Use this lab with:

- [Capability registry](capability-registry.md): what can be used
- [Source-system integration lab](source-system-integration-lab.md): where truth and source ACLs live
- [Agent control plane](agent-control-plane.md): where grants, revocation, pause, rollout, and ownership live
- [Architecture blueprint](architecture-blueprint.md): where identity binding and policy gates sit in the system
- [Runtime ledger](runtime-ledger.md): which records correlate the run
- [Agent threat model](agent-threat-model.md): how excessive agency, connector abuse, prompt injection, and audit gaps fail
