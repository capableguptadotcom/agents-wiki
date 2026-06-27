# Visual Maps

This note captures the same maps shown in the interactive wiki. Use it when discussing architecture without opening the HTML page.

## 1. Request Sequence

```text
User/UI
  -> voice or command input
  -> clarification
  -> approval decision
  -> timeline inspection

Product API
  -> create agent run
  -> bind user, tenant, work object
  -> publish timeline events
  -> expose status

Agent runtime
  -> plan
  -> call read tools
  -> propose typed action
  -> pause for approval
  -> summarize outcome

Policy and workflow
  -> check scopes and side effects
  -> create approval record
  -> execute durable workflow
  -> retry or compensate

Systems and ops
  -> read/write source systems
  -> write audit
  -> capture trace
  -> sample for evals
```

Design point:

The agent does not own every step. Product APIs, policy, workflows, and source systems each own part of the execution contract.

## 2. Run State Machine

```text
received
-> context_bound
-> planning
-> action_proposed
-> waiting_for_approval
-> executing
-> completed
```

Exception paths:

```text
planning -> failed
waiting_for_approval -> cancelled
executing -> needs_reconciliation
needs_reconciliation -> completed
needs_reconciliation -> failed
```

Design point:

The UI should report state from the run state machine, not from the last chat message.

## 3. Memory Lifecycle

```text
observe
-> classify
-> source
-> approve
-> use
-> review
-> audit
```

Design point:

Memory is a governed product mutation. It needs source, scope, retention, inspection, correction, deletion, and audit.

## 4. Approval Handoff

```text
action_preview
-> policy_decision
-> approval_card
-> human_decision
-> resume_token
-> workflow_execution
-> audit_event
```

Design point:

Approval must be attached to exact action arguments. If the user modifies the payload, the approved hash changes.

## 5. Eval Release Loop

```text
collect traces and corrections
-> cluster failures
-> change prompt/tool/workflow/policy
-> replay evals
-> canary rollout
-> monitor production
-> rollback or promote
```

Design point:

Agents should not silently evolve in production. Improvement should move through versioned release bundles.

## Discussion Questions

- Which parts belong to the agent runtime and which belong to product infrastructure?
- What state does the frontend need to display truthfully?
- Where can retries create duplicate side effects?
- Which approvals can be batched and which must be action-specific?
- What should become durable memory and what should remain run state?
- Which production failures should automatically become eval cases?
