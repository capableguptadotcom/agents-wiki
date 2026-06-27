# Skill Lifecycle Lab

Current as of 2026-06-27.

This note complements the interactive Skill Lifecycle section in [interactive.html](interactive.html#skill-lifecycle).

The core rule:

```text
Skills guide behavior.
Tools execute capabilities.
Policy grants authority.
Workflow owns recovery.
Release bundles control change.
```

A skill should never be a hidden prompt edit that silently changes production behavior. Treat it as a governed product artifact with owner, version, source evidence, examples, counterexamples, allowed tools, prohibited authority, evals, release status, and rollback.

## Why Skills Need A Lifecycle

Papers such as Voyager show why reusable skill libraries are powerful: agents can improve by capturing successful patterns. Enterprise products need the opposite pressure at the same time: no hidden authority, no silent drift, no unreviewed memory, no untested behavior changes.

That means a production skill has to move through gates:

```text
evidence
-> author
-> review
-> eval
-> release
-> runtime use
-> learning or incident feedback
```

## Skill Manifest

Minimum fields:

```json
{
  "skill_id": "billing_dispute_resolution_skill@v7",
  "owner": "support policy owner",
  "purpose": "Guide evidence gathering, policy citation, and resolution drafting.",
  "source_evidence": ["policy appeal review", "duplicate credit incident"],
  "allowed_tools": ["read_ticket", "check_refund_policy", "draft_resolution"],
  "prohibited_authority": ["apply_credit", "send_customer_reply"],
  "data_class": "customer PII + financial",
  "examples": ["approved low-risk adjustment draft"],
  "counterexamples": ["duplicate credit denial", "stale policy refusal"],
  "eval_suite": "support_skill_v7_regression",
  "release_bundle": "support-agent:v12",
  "rollback_target": "billing_dispute_resolution_skill@v6"
}
```

## Simulated Skill Review

This is a synthesized discussion between roles, not a quote from real people.

### Domain Owner

The skill should encode real operating knowledge: policy interpretation, triage heuristics, examples, and counterexamples. It should not override the source policy or become a hidden rulebook.

Recommendation:

Require source links for every new instruction and counterexample.

### Platform Architect

The skill is part of `AgentVersion`, not ambient prompt text. A run must record `skill_version`, and a release must pin the skill with model, prompt, tools, workflow, memory schema, and eval run.

Recommendation:

Make skill grants explicit and revocable by agent, tenant, workflow, and autonomy tier.

### Security Owner

Skills are dangerous when they smuggle authority. A sentence like "go ahead and credit the customer" is not a permission model.

Recommendation:

Every skill must list prohibited authority and denial evals.

### Product Operator

Skills improve only when they reduce repeated human correction without hiding why the agent changed behavior.

Recommendation:

Turn corrections into proposed examples or eval cases first. Do not auto-edit the active skill.

### SRE / AgentOps

Skill changes cause production drift if they bypass release. A bad skill can change tool choice, memory use, approval behavior, or user-facing language.

Recommendation:

Treat skill activation as a release operation with canary, metrics, kill switch, rollback, and incident review.

## Case Patterns

### Healthcare Bed Flow

Skill:

```text
bed_assignment_triage_skill@v4
```

It can teach the agent how to weigh telemetry need, isolation status, staffing, unit acceptance, discharge forecasts, and escalation language.

It must not:

- reserve a bed
- store patient PHI as durable memory
- bypass placement policy
- hide uncertainty from the charge nurse

Blocking evals:

- wrong-patient context
- stale capacity
- isolation mismatch
- approval bypass

### Enterprise Scheduling

Skill:

```text
qbr_scheduling_skill@v5
```

It can teach attendee resolution, timezone handling, agenda templates, fallback slots, and external-recipient approval patterns.

It must not:

- read private calendar bodies
- send external invites
- remember private calendar titles
- invent provider delivery status

Blocking evals:

- private title redaction
- timezone conflict
- external-recipient approval
- declined-invite workflow

### Support Resolution

Skill:

```text
billing_dispute_resolution_skill@v7
```

It can teach evidence gathering, policy citation, threshold examples, escalation rules, and safe customer-reply drafting.

It must not:

- apply credit
- send customer messages
- use stale policy
- store customer facts in organization memory

Blocking evals:

- duplicate credit
- stale policy
- separate credit and message approvals
- customer PII in examples

### Code-Change Agent

Skill:

```text
repo_editing_skill@v9
```

It can teach repository conventions, allowed test commands, patch discipline, and review handoff expectations.

It must not:

- run unbounded shell
- read secrets
- merge pull requests
- deploy production

Blocking evals:

- denied path edit
- denied command
- secret-read attempt
- failed-test completion claim

## Product Records

Skills should create or reference:

- `SkillChangeRequest`
- `SkillDraft`
- `ExampleSet`
- `CounterexampleSet`
- `ToolDependencyMap`
- `DomainReview`
- `SecurityReview`
- `EvalCase`
- `EvalRun`
- `SkillVersion`
- `SkillGrant`
- `ReleaseBundle`
- `AgentStep`
- `IncidentControl`

## What Changes The Answer

A skill can move faster when:

- it is read-only
- it affects only wording or formatting
- it has narrow scope
- it has strong eval coverage
- it has a safe rollback target

A skill needs stronger gates when:

- it influences tool choice
- it affects approval behavior
- it touches PHI, PII, financial, source code, or external communication
- it changes memory retrieval or memory writes
- it increases autonomy

## Related Notes

- Source anchors:
  - [Voyager](https://arxiv.org/abs/2305.16291): reusable skill libraries and environment feedback.
  - [Reflexion](https://arxiv.org/abs/2303.11366): feedback and episodic learning, with bad-feedback risk.
  - [SWE-agent](https://arxiv.org/abs/2405.15793): agent-computer interface and action affordances.
  - [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework): governed lifecycle, measurement, and risk management.
  - [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/): excessive agency, sensitive disclosure, supply-chain, and vector/retrieval risks.

- [Capability registry](capability-registry.md)
- [Agent control plane](agent-control-plane.md)
- [Agent operations lifecycle](agent-operations-lifecycle.md)
- [Eval and release harness](eval-release-harness.md)
- [Memory governance](memory-governance.md)
- [Protocol runtime decision lab](protocol-runtime-decision-lab.md)
- [Architecture composition workbench](architecture-composition-workbench.md)
