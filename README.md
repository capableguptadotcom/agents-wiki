# Enterprise Agents Wiki

This repository is an engineering research manual for building AI-native products.

The goal is not to write broad essays about agents. The goal is to define patterns that an engineering team can build, test, audit, and operate.

Published site:

- https://capableguptadotcom.github.io/agents-wiki/

Local source entry points:

- [wiki/index.md](wiki/index.md)
- [wiki/research-operating-system.md](wiki/research-operating-system.md)
- [wiki/system-diagram-spine.md](wiki/system-diagram-spine.md)
- [wiki/implementation-lab.md](wiki/implementation-lab.md)

## Quality Bar

Each accepted page should answer:

```text
What boundary are we designing?
What claim are we making?
What source supports it?
What contract implements it?
What failure does it prevent?
What test proves it?
```

The working standard is defined in [Research operating system](wiki/research-operating-system.md).

## Current Architecture Thesis

An agent-native product is not a chatbot attached to an application.

It is a product system where:

- agents have pinned identity and version
- context is bound before reasoning
- tools are typed and policy-gated
- approvals bind to exact payloads
- workflows own durable side effects and recovery
- source systems remain authoritative
- memory is governed, reviewable, and revocable
- traces, timelines, and audit logs are separate but correlated
- evals and release gates control improvement

## Canonical Build Path

The first complete vertical slice is:

```text
create AgentRun
-> bind ContextManifest
-> create AccessDecision
-> plan TaskGraph
-> read source evidence
-> preview side-effect tool
-> require exact Approval
-> run durable WorkflowRun
-> store SourceResponse
-> create VerificationResult
-> write TimelineEvent and AuditEvent
-> sample EvalCase
```

See [System diagram spine](wiki/system-diagram-spine.md) for the ERD, run state machine, sequence diagram, deployment topology, correlation map, and policy gate flow.

## Site Stack

The site now uses Material for MkDocs because the artifact is a research documentation system: Markdown source, polished navigation, search, Mermaid diagrams, readable tables, and GitHub Pages deployment.

Decision record:

- [Site template decision](wiki/site-template-decision.md)

The old custom lab app remains available but is no longer the canonical source:

- [Interactive labs index](wiki/interactive-labs.md)
- [Legacy app](wiki/interactive.html)

## Rewrite Priorities

1. Convert `references.md` into a source registry with citation keys, evidence classes, caveats, and supported claim IDs.
2. Convert `implementation-lab.md` into the canonical contract spec with JSON Schemas, API contracts, event payloads, lifecycle enums, and errors.
3. Rewrite identity and capability pages around deterministic grant resolution.
4. Rewrite approval around state transitions, payload hashing, expiry, modification, escalation, and resume tokens.
5. Make eval/release executable with fixtures, assertions, thresholds, reports, and CI hooks.
6. Replace simulated debates with threat cases, controls, evidence records, denial evals, and incident paths.

## Verification

Current local verification commands:

```powershell
node scripts/generate-assembly-data.mjs
node --check wiki/assets/generated/assembly-data.js
node --check wiki/assets/app.js
node scripts/verify-wiki.mjs
```

GitHub Actions installs Material for MkDocs, builds `wiki/` into `site/`, uploads the static artifact, and deploys GitHub Pages.
