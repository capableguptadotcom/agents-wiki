# Interactive Labs Index

Status: derived artifact index.

The old [interactive lab app](interactive.html) is not the canonical source of architecture knowledge. It is a carried artifact for state comparison and exploration while the wiki moves durable content into markdown, diagrams, schemas, and tests.

Rules:

- Canonical ideas live in markdown.
- Labs must link back to the page that owns the contract.
- A broken or confusing lab should be removed or replaced by a small focused widget.
- Deep links must work with `interactive.html#section`.

## High-Value Labs To Keep For Now

| Lab | Link | Canonical owner | Keep because |
|---|---|---|---|
| Architecture assembly | [Open](interactive.html#walkthrough) | [End-to-end architecture walkthrough](end-to-end-architecture-walkthrough.md) and [Architecture Assembly Data](architecture-assembly-data.md) | Lets readers inspect one layer across scenarios. |
| Runtime ledger | [Open](interactive.html#runtime-ledger) | [Runtime ledger](runtime-ledger.md) | Shows correlation across run, trace, workflow, audit, and eval. |
| Implementation contracts | [Open](interactive.html#implementation) | [Implementation lab](implementation-lab.md) | Compares API, schema, event, and failure contracts. |
| Deep run | [Open](interactive.html#deep-run) | [Deep agent runbook](deep-agent-runbook.md) | Shows stage ownership across a long-running task. |
| Approval handoff | [Open](interactive.html#approval-handoff) | [Approval handoff](approval-handoff.md) | Decision states are easier to compare interactively. |
| Simulator | [Open](interactive.html#simulator) | [Run simulator](run-simulator.md) | Small deterministic state progression remains useful. |

## Labs To Rebuild Or Remove

| Lab family | Problem | Replacement |
|---|---|---|
| Large overview sections | Duplicates markdown and hides durable concepts in JavaScript. | Move to contract pages and diagrams. |
| Pattern browsing | Too broad; weak evidence and no claim IDs. | Source registry plus claim ledger. |
| Visual maps | Not tied to implementation diagrams. | [System diagram spine](system-diagram-spine.md). |
| Learning path cards | Mostly static prose. | Quarto pages with exercises and proof checks. |

## Next Lab Standard

Any new lab needs:

1. canonical markdown owner
2. input data source in markdown or JSON checked into source
3. clear state transition or comparison
4. no hidden architecture claims
5. browser smoke test
6. link from this index

## Current Known Debt

- `interactive.html` is too large for the role it plays.
- The old app initializes every lab up front.
- The visual design does not match the Quarto site.
- Lab data is only partially markdown-backed.
- The app should eventually be split into focused widgets or retired.
