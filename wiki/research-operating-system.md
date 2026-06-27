# Research Operating System

This wiki is not a story collection. It is an engineering research manual for building AI-native products.

Every durable page must help a builder answer one of these questions:

```text
What boundary are we designing?
What claim are we making?
What source supports it?
What contract implements it?
What failure does it prevent?
What test proves it?
```

If a paragraph does not answer one of those questions, it should be removed or moved to a backlog note.

## Page Classes

| Class | Purpose | Required proof |
|---|---|---|
| Source registry | Track papers, standards, platform docs, and case studies as evidence, not decoration. | Citation key, source type, version/date, claim IDs, caveats. |
| Architecture decision | Adopt, reject, or constrain a product boundary. | Decision, alternatives, consequence, evidence, acceptance test. |
| System contract | Define records, APIs, state machines, event payloads, and invariants. | JSON Schema/OpenAPI/state diagram or executable fixture. |
| Vertical slice | Show one end-to-end workflow in a real domain. | Inputs, records written, side effects, failure paths, evals. |
| Governance control | Define security, access, approval, memory, release, incident, or audit behavior. | Enforcement point, denial cases, audit evidence, rollback path. |
| Derived lab | Interactive or visual artifact that helps compare states. | Link to canonical markdown source and explicit limitation. |

## Page Header Contract

Each non-index page should start with a small metadata block:

```yaml
page_class: system-contract
status: draft | review | accepted | deprecated
owner: agent-platform | product | security | domain | sre
canonical: true | false
last_verified: 2026-06-27
depends_on:
  - references.md
  - architecture-decisions.md
```

The header is not bureaucracy. It prevents the current problem: readers cannot tell which pages are authoritative, which are exploratory, and which are stale.

## Claim Ledger

Every important claim needs an ID. Use this shape:

| Claim ID | Claim | Evidence | Confidence | Caveat | Boundary |
|---|---|---|---|---|---|
| CLM-RUN-001 | A side-effecting agent run needs durable workflow state outside the model loop. | Temporal workflow docs, Cloudflare Workflows docs, LangGraph interrupts, internal retry tests. | High | Runtime choice varies by stack. | Durable execution |
| CLM-AUTH-001 | Prompt text is not an authorization boundary. | OWASP LLM Top 10, OAuth/OIDC, MCP authorization, internal denial tests. | High | Product policy still has to define resource-specific rules. | Identity and access |
| CLM-MEM-001 | Durable memory must be sourced, scoped, reviewable, correctable, and deletable. | OWASP memory risks, NIST AI RMF, internal memory lifecycle tests. | Medium | Domain retention rules differ. | Memory governance |

Rules:

- A claim can cite a paper, standard, product doc, internal ADR, incident, trace, or test.
- A platform marketing page can support a product-pattern claim, not a safety claim.
- A benchmark can support a failure-mode claim, not production readiness.
- A standard can support a boundary requirement, not a claim that one implementation is correct.
- An internal invariant is not real until a test, schema, trace, or audit example proves it.

## Evidence Classes

| Evidence class | Use for | Strength | Failure mode |
|---|---|---|---|
| Peer-reviewed or arXiv paper | Agent primitives, benchmark lessons, failure modes. | Medium | Research setting may not match production. |
| Standards and specs | Authorization, observability, governance, domain models. | High for vocabulary and boundary shape. | Specs do not implement product policy. |
| Official platform docs | Runtime and vendor capability patterns. | Medium | Public docs omit internal architecture and risk controls. |
| Public case study | Adoption pattern and user workflow. | Low to medium | Often lacks evidence, baseline, and failure data. |
| Internal ADR | Accepted product decision. | High internally | Must cite source evidence and alternatives. |
| Test fixture or eval run | Behavior proof. | High for covered cases. | Coverage can be narrow or stale. |
| Incident or trace sample | Real failure evidence. | High for diagnosis. | Sensitive and context-specific. |

## Required Sections

Use this page skeleton for most architecture pages:

```text
1. Decision or thesis
2. Scope and non-goals
3. Claim ledger
4. Architecture diagram
5. Product contracts
6. Failure modes and controls
7. Vertical-slice example
8. Evals and acceptance criteria
9. Source notes and caveats
10. Open questions with owner and exit criteria
```

## Writing Rules

- Prefer record names, schemas, state transitions, and tests over adjectives.
- Replace "should" with an invariant, owner, and pass/fail test.
- Do not write simulated stakeholder debates as evidence.
- Do not repeat the same thesis across pages. Link to the accepted decision.
- Do not cite a source family when one exact source is needed.
- Do not use the old `interactive.html` app as the canonical source for a concept.
- Every visual must explain a boundary, lifecycle, data relationship, or failure path.

## Readiness Gate

A page is not accepted until it has:

- one claim ledger with evidence links
- one implementation diagram or state machine when the topic is architectural
- one concrete record/API/event/schema example when the topic is buildable
- one negative case
- one acceptance test
- explicit caveats for external sources

## Rewrite Queue

The first pages to bring under this standard:

| Priority | Page | Why |
|---|---|---|
| 1 | [references.md](references.md) | It must become the source registry backing claim IDs. |
| 2 | [implementation-lab.md](implementation-lab.md) | It should become the canonical backend contract spec. |
| 3 | [identity-access-lab.md](identity-access-lab.md) and [capability-registry.md](capability-registry.md) | The grant-resolution algorithm is central and currently too implicit. |
| 4 | [approval-handoff.md](approval-handoff.md) | Exact-payload approval needs a formal state machine and hash contract. |
| 5 | [eval-release-harness.md](eval-release-harness.md) | Evals need fixture format, assertion DSL, and release thresholds. |
| 6 | [agent-threat-model.md](agent-threat-model.md) | Threat cases need controls, records, denial evals, and incident paths. |

## Source Anchors For This Standard

- Quarto website docs: https://quarto.org/docs/websites/
- Quarto diagrams docs: https://quarto.org/docs/authoring/diagrams.html
- Diataxis documentation framework: https://diataxis.fr/
- OWASP Top 10 for LLM Applications: https://genai.owasp.org/llm-top-10/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- OpenTelemetry GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/
