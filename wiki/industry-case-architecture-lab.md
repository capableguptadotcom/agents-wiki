# Industry Case Architecture Lab

Current as of 2026-06-27.

This note complements the interactive Case Architecture section in [interactive.html](interactive.html#case-architecture).

The purpose is to study public industry examples without overclaiming. Vendor pages, papers, and standards rarely expose a full production architecture. They are still useful when we separate:

```text
public evidence
-> architecture inference
-> product responsibility
-> release-blocking evidence
```

## Reading Rule

For every case study, ask five questions:

| Question | Why it matters |
|---|---|
| What public evidence exists? | Prevents copying imagined internals. |
| Which paper primitive explains the behavior? | Connects ReAct, MRKL, memory, skills, evals, and interfaces to product design. |
| Which standard constrains the boundary? | Keeps identity, tools, data, events, and risk management explicit. |
| What must our product still own? | Separates platform capability from source truth, approval, audit, and lifecycle governance. |
| What evidence blocks release? | Turns case-study learning into tests, traces, records, and incident controls. |

## Simulated Architecture Review

This is a synthesized discussion between roles, not a quote from real people.

### Research Lead

Papers give us primitives, not product permission. ReAct explains the inner loop; MRKL explains modular tools; Toolformer explains trace usefulness; Reflexion and Voyager explain learning pressure; SWE-agent explains that the action interface changes outcomes.

Recommendation:

Use papers to name the behavior and failure mode, then require a product record for that behavior.

### Platform Architect

The repeatable architecture is visible across cases:

```text
work surface
-> context binding
-> agent loop
-> typed capability
-> policy and approval
-> durable workflow
-> source reconciliation
-> timeline, audit, trace, eval
-> control-plane release
```

Recommendation:

Do not ask one runtime to own every boundary. SDKs own loops, APIs and MCP own capability exposure, workflow owns recovery, and the control plane owns lifecycle.

### Security Architect

The risky jump is from assistance to authority. Calendar sends, bed holds, credits, code edits, and ticket closure all look like "tool calls" but have different data classes, scopes, approvals, and recovery rules.

Recommendation:

Classify side effects before picking the protocol. Then bind user, agent, connector, service account, source object, and approval into one audit chain.

### Product Operator

Users trust agents when the work object stays visible. A ticket, bed request, account, calendar draft, or pull request gives users a place to inspect evidence, correct mistakes, and understand status.

Recommendation:

Build agents into the workflow surface. Detached chat is useful for intake, but not as the system of record.

### SRE / AgentOps

The lifecycle is where agent products fail quietly: a new prompt, tool schema, connector scope, memory rule, model, or workflow branch changes behavior without enough replay evidence.

Recommendation:

Pin versions in release bundles and require trajectory evals for every autonomy increase.

## Case Lessons

### Healthcare Bed Flow

Public evidence:

- Command-center and inpatient-flow products organize capacity, discharge prediction, staffing, transport, and escalation.
- FHIR and SMART provide useful data and launch boundaries.
- HIPAA-style safeguards force access, audit, integrity, authentication, and transmission controls around ePHI.

Product architecture:

```text
bed board or voice command
-> encounter and facility binding
-> capacity and constraint reads
-> agent-ranked candidates
-> policy and exact approval
-> reserve_bed workflow
-> ADT and bed-board reconciliation
-> PHI audit and eval sample
```

Crux:

The agent coordinates the operational decision. It should not become the clinical authority, the bed board, or the PHI memory store.

### Enterprise Scheduling

Public evidence:

- Collaboration agents show that chat and channels are useful intake surfaces.
- App-native agent loops show how progress, previews, and approval cards can live inside the product.
- OAuth, MCP, and calendar APIs help expose capabilities but do not decide product policy.

Product architecture:

```text
account or chat request
-> attendee and account binding
-> minimized calendar reads
-> slot ranking and invite draft
-> external-send approval
-> invite workflow
-> provider event reconciliation
-> CRM timeline update
```

Crux:

The hard part is not finding an open slot. It is preventing private calendar leakage, wrong-recipient sends, stale availability, and false completion.

### Customer Support Resolution

Public evidence:

- CRM and service-management agents are strongest near accounts, cases, tickets, workflows, policies, and approvals.
- Public examples show the surface and governance direction, not the full approval, ledger, or incident model.

Product architecture:

```text
ticket request
-> account, entitlement, invoice, and policy binding
-> agent evidence synthesis
-> resolution and reply proposal
-> credit approval and message approval
-> billing and notification workflow
-> ticket timeline and audit
```

Crux:

Financial writes and customer messages are separate side effects. A good support agent must not collapse them into one vague "resolve" tool.

### Code-Change Agent

Public evidence:

- Coding agents and SWE-agent-style research show the importance of workspace state, action affordances, tests, and review artifacts.
- OpenAI Agents SDK, LangGraph, MCP, and A2A-style delegation help build orchestration and tool boundaries.
- CI, review, branch protection, and deployment controls remain source-of-truth systems.

Product architecture:

```text
issue or task
-> repo, branch, path, command, and secret-policy binding
-> inspect, patch, test loop
-> patch artifact and command logs
-> review and CI workflow
-> release bundle
-> eval replay and rollback controls
```

Crux:

Editing, testing, reviewing, merging, and deploying are different authority levels. A coding agent can be highly capable while still having no merge or deploy authority.

## Evidence Ladder

Use this ladder when reading a source or vendor page:

1. Publicly stated capability.
2. Visible product surface.
3. Nearby source-of-truth object.
4. Implied architecture boundary.
5. Product-owned control not proven publicly.
6. Record that would prove the boundary.
7. Eval or incident test that would block release.

## Adoption Decision Record

Every case should produce a small record:

```json
{
  "decision_id": "case_arch_support",
  "case": "Customer support resolution agent",
  "public_evidence": ["..."],
  "architecture_inference": ["..."],
  "product_must_own": ["..."],
  "paper_primitives": ["MRKL", "ReAct", "Reflexion"],
  "standards_and_protocols": ["OpenAPI", "OAuth/OIDC", "MCP Authorization"],
  "records_to_persist": ["AgentRun", "PolicySource", "Approval", "BillingTransactionRef"],
  "release_blocking_eval": "Duplicate credit, stale policy, PII leak, and partial side-effect tests block release."
}
```

## Related Notes

- [Case studies](case-studies.md)
- [Industry pattern teardowns](industry-pattern-teardowns.md)
- [Paper-to-product lab](paper-to-product-lab.md)
- [Source atlas](source-atlas.md)
- [Architecture composition workbench](architecture-composition-workbench.md)
- [Protocol runtime decision lab](protocol-runtime-decision-lab.md)
- [Identity and access lab](identity-access-lab.md)
- [Eval and release harness](eval-release-harness.md)
