(function () {
  const steps = [
    {
      key: "intent",
      label: "Intent",
      owner: "Work surface",
      title: "Turn a command into a product run",
      visible: "The charge nurse says: Book a monitored bed for this ED patient.",
      hidden: "The surface creates a run request with transcript, selected work object, channel, requester, and UI confidence.",
      invariant: "No agent work starts until the request is anchored to a product surface and a candidate work object.",
      crux: "A chat message is not a work object. The first product primitive is the run envelope.",
      records: {
        AgentRunRequest: {
          transcript: "Book a monitored bed for this ED patient.",
          surface: "bed-board",
          channel: "voice",
          selected_object_hint: "encounter/E-1042",
          requester_user_id: "u-221"
        },
        TimelineEvent: {
          type: "agent.requested",
          subject: "encounter/E-1042",
          visible_to_user: true
        }
      },
      shortcut: "Send the raw utterance to an LLM and let it infer this patient.",
      pattern: "Create a durable AgentRun request anchored to the selected product object."
    },
    {
      key: "context",
      label: "Context",
      owner: "Context binder",
      title: "Resolve the work object before reasoning",
      visible: "The UI shows the selected encounter, facility, source freshness, and ambiguity warnings.",
      hidden: "The binder resolves tenant, encounter, facility, role, channel, source references, and missing fields.",
      invariant: "The model never decides what this patient means.",
      crux: "Most dangerous agent bugs start as context bugs. Binding is a product service, not prompt text.",
      records: {
        ContextManifest: {
          context_manifest_id: "ctx_884",
          tenant_id: "hospital-a",
          work_object: "encounter/E-1042",
          facility: "north-campus",
          source_freshness_seconds: 42,
          ambiguity: []
        }
      },
      shortcut: "Let the model infer encounter ID from nearby page text.",
      pattern: "Use deterministic binding and stop on ambiguity before source reads."
    },
    {
      key: "authority",
      label: "Authority",
      owner: "Identity and capability layer",
      title: "Compute effective authority",
      visible: "The UI can explain whether this user and this agent may inspect and reserve beds.",
      hidden: "The product intersects user role, agent version grants, connector grants, source ACLs, data class, and side-effect level.",
      invariant: "A model cannot amplify user permissions or borrow hidden connector authority.",
      crux: "OAuth token, user role, agent grant, source ACL, and approval are different controls.",
      records: {
        AccessDecision: {
          access_decision_id: "access_553",
          user_role: "charge-nurse",
          agent_version_id: "bedflow-agent:v12",
          allowed_tools: ["read_capacity", "rank_beds", "preview_reserve_bed"],
          denied_tools: [],
          write_level: "approval_required"
        }
      },
      shortcut: "Expose every bed API as a tool because the user can see the page.",
      pattern: "Resolve grants before tool exposure and store the denial or allowance."
    },
    {
      key: "evidence",
      label: "Evidence",
      owner: "Runtime plus scoped specialists",
      title: "Gather evidence and propose a typed action",
      visible: "The UI shows candidate beds, constraints, source timestamps, and why one bed was chosen.",
      hidden: "The runtime calls read-only tools, delegates capacity ranking, stores source references, and drafts an exact action proposal.",
      invariant: "Evidence is source-linked. The agent proposes; it does not write.",
      crux: "A good answer is not enough. The proposal needs source references and typed arguments.",
      records: {
        SourceReference: {
          snapshot_id: "bedboard-snap-778",
          source: "bed-board",
          retrieved_at: "2026-06-27T14:00:42Z",
          fields: ["bed_id", "telemetry", "isolation", "status"]
        },
        ActionProposal: {
          tool: "reserve_bed",
          arguments: {
            encounter_id: "E-1042",
            bed_id: "T-418",
            hold_minutes: 20
          }
        }
      },
      shortcut: "Let the model call reserve_bed after choosing a bed in natural language.",
      pattern: "Separate read evidence, specialist result, and side-effect proposal."
    },
    {
      key: "policy",
      label: "Policy",
      owner: "Policy and approval boundary",
      title: "Classify risk and bind approval to exact payload",
      visible: "The approval card shows the exact bed, patient encounter, hold duration, evidence, risk, and alternatives.",
      hidden: "The policy gateway validates schema, classifies PHI and write risk, creates a policy decision, and opens an approval record with a payload hash.",
      invariant: "Approval authorizes one canonical payload hash, not vague intent.",
      crux: "Human-in-the-loop is weak unless the human sees and approves the exact arguments that will execute.",
      records: {
        PolicyDecision: {
          decision_id: "pol_733",
          result: "approval_required",
          reason: "source_system_write",
          data_class: "PHI",
          payload_hash: "sha256:7bb0...19f"
        },
        Approval: {
          approval_id: "apr_419",
          approver_role: "charge-nurse",
          status: "pending",
          expires_in_minutes: 10,
          payload_hash: "sha256:7bb0...19f"
        }
      },
      shortcut: "Ask: Should I book it? and treat yes as approval.",
      pattern: "Show exact payload, evidence, risk, expiry, and payload hash."
    },
    {
      key: "workflow",
      label: "Workflow",
      owner: "Durable workflow",
      title: "Execute side effects outside the model loop",
      visible: "The timeline shows reserving bed, waiting for source response, notifying unit, and retry state.",
      hidden: "A workflow resumes from the approved payload, uses an idempotency key, handles retries, and records each external effect.",
      invariant: "The model does not own retries, waits, cancellation, compensation, or duplicate prevention.",
      crux: "A side effect is a workflow problem. The agent should not be the transaction manager.",
      records: {
        WorkflowRun: {
          workflow_id: "wf_661",
          type: "reserve_bed",
          idempotency_key: "run_bed_1042:reserve_bed:T-418",
          input_payload_hash: "sha256:7bb0...19f",
          status: "running"
        },
        WorkflowEvent: {
          type: "source.write.requested",
          target: "bed-board",
          attempt: 1
        }
      },
      shortcut: "Let the model call the source write API directly and summarize success.",
      pattern: "Resume a durable workflow from an approved payload with idempotency."
    },
    {
      key: "verify",
      label: "Verify",
      owner: "Verifier and product projection",
      title: "Mark complete only from source truth",
      visible: "The user sees completed only after the bed board or ADT confirms the hold.",
      hidden: "The verifier compares expected state, source response, workflow history, timeline, and audit IDs.",
      invariant: "Completion is not model text. Completion requires source confirmation or human reconciliation.",
      crux: "A workflow success event is not always source truth. The product must reconcile reality.",
      records: {
        SourceResponse: {
          source_response_id: "src_902",
          source: "bed-board",
          accepted: true,
          bed_id: "T-418",
          hold_until: "2026-06-27T14:21:00Z"
        },
        VerificationResult: {
          verification_id: "ver_311",
          status: "completed",
          confirmed_by: "bed-board",
          projected_to_timeline: true
        }
      },
      shortcut: "Set completed after the workflow worker returns 200.",
      pattern: "Read source truth and project completed only after verification."
    },
    {
      key: "learn",
      label: "Learn",
      owner: "Eval, memory, and release gate",
      title: "Turn outcomes into governed improvement",
      visible: "The run may create an eval case or a reviewed memory proposal; it does not silently change future behavior.",
      hidden: "The product samples the trajectory, classifies corrections, proposes memory or skill changes, and requires release gates before behavior changes.",
      invariant: "Production behavior changes only through reviewed memory, skill, policy, prompt, tool, or workflow versions.",
      crux: "Learning is a lifecycle. Reflection inside one run is not a production update.",
      records: {
        EvalCase: {
          eval_case_id: "eval_144",
          source_run_id: "run_bed_1042",
          assertion: "completed_requires_source_confirmation",
          release_blocking: true
        },
        MemoryProposal: {
          proposal_id: "memprop_055",
          status: "review_required",
          scope: "unit-policy",
          contains_patient_fact: false
        }
      },
      shortcut: "Store the run transcript as memory and let the agent use it next time.",
      pattern: "Create evals and reviewed proposals; promote only through release gates."
    }
  ];

  const scenarios = {
    happy: {
      label: "Happy path",
      short: "Completes after source confirmation.",
      stopAt: null,
      status: "completed",
      lesson: "The whole chain works because each boundary writes proof before moving on.",
      overrides: {}
    },
    ambiguous: {
      label: "Ambiguous patient",
      short: "Stops before source reads.",
      stopAt: "context",
      status: "clarification_required",
      lesson: "The product must clarify the selected encounter before the runtime can use tools.",
      overrides: {
        context: {
          visible: "The UI shows two possible encounters and asks the nurse to choose one.",
          hidden: "The context binder refuses to create a complete ContextManifest.",
          records: {
            ClarificationRequest: {
              reason: "ambiguous_work_object",
              candidates: ["encounter/E-1042", "encounter/E-1042-revisit"],
              tool_calls_allowed: false
            }
          }
        }
      }
    },
    denied: {
      label: "Denied authority",
      short: "Stops before source write.",
      stopAt: "authority",
      status: "denied",
      lesson: "The agent cannot turn a read-only role into write authority.",
      overrides: {
        authority: {
          visible: "The UI explains that this user can view bed status but cannot reserve beds.",
          hidden: "AccessDecision denies `preview_reserve_bed` and prevents write-capable tools from being exposed.",
          records: {
            AccessDecision: {
              access_decision_id: "access_554",
              result: "denied",
              denied_tool: "preview_reserve_bed",
              reason: "role_lacks_bed_hold_authority",
              source_call_made: false
            }
          }
        }
      }
    },
    staleEvidence: {
      label: "Stale evidence",
      short: "Stops before proposal.",
      stopAt: "evidence",
      status: "clarification_required",
      lesson: "A bed recommendation built on stale source data cannot become an action proposal.",
      overrides: {
        evidence: {
          visible: "The UI warns that the bed board snapshot is 18 minutes old and asks to refresh.",
          hidden: "The source reference fails freshness policy, so the runtime cannot propose `reserve_bed`.",
          records: {
            SourceReference: {
              snapshot_id: "bedboard-snap-712",
              freshness_seconds: 1080,
              freshness_policy: "max_120_seconds",
              usable_for_write: false
            }
          }
        }
      }
    },
    modifiedApproval: {
      label: "Modified approval",
      short: "Re-enters policy.",
      stopAt: "policy",
      status: "recheck_required",
      lesson: "Changing bed, duration, recipient, amount, or message invalidates the old approval hash.",
      overrides: {
        policy: {
          visible: "The approver changes the bed from T-418 to T-419.",
          hidden: "The old approval is closed. A new canonical payload hash is created and policy runs again.",
          records: {
            Approval: {
              old_payload_hash: "sha256:7bb0...19f",
              new_payload_hash: "sha256:87ac...2d1",
              status: "modified",
              workflow_resumed: false,
              next_step: "policy_recheck"
            }
          }
        }
      }
    },
    workflowRetry: {
      label: "Workflow retry",
      short: "Retries without duplicate hold.",
      stopAt: null,
      status: "completed_after_retry",
      lesson: "The model is not involved in retry safety. The workflow and source adapter own idempotency.",
      overrides: {
        workflow: {
          visible: "The timeline shows a timeout followed by a retry, then a confirmed hold.",
          hidden: "The workflow reuses the same idempotency key, so the source system does not create a duplicate hold.",
          records: {
            WorkflowRun: {
              workflow_id: "wf_661",
              status: "completed",
              attempts: 2,
              idempotency_key: "run_bed_1042:reserve_bed:T-418",
              duplicate_write: false
            }
          }
        }
      }
    },
    sourceMismatch: {
      label: "Source mismatch",
      short: "Ends as needs_reconciliation.",
      stopAt: "verify",
      status: "needs_reconciliation",
      lesson: "The run cannot complete when product expectation and source truth disagree.",
      overrides: {
        verify: {
          visible: "The UI shows Needs reconciliation instead of Completed.",
          hidden: "The source response says T-418 is no longer available, so the product opens an operator reconciliation path.",
          records: {
            VerificationResult: {
              verification_id: "ver_312",
              status: "needs_reconciliation",
              expected: "bed T-418 held",
              actual: "bed T-418 unavailable",
              completed: false
            }
          }
        }
      }
    },
    unsafeMemory: {
      label: "Unsafe memory",
      short: "Blocks durable memory.",
      stopAt: "learn",
      status: "memory_rejected",
      lesson: "Patient facts from a run do not become future memory. Only reviewed organization-level learning can be promoted.",
      overrides: {
        learn: {
          visible: "The memory panel rejects a patient-specific fact and creates an eval instead.",
          hidden: "The memory proposal classifier detects PHI and blocks activation.",
          records: {
            MemoryProposal: {
              proposal_id: "memprop_056",
              status: "rejected",
              reason: "patient_specific_phi",
              affects_future_runs: false
            },
            EvalCase: {
              assertion: "patient_fact_never_promoted_to_memory",
              release_blocking: true
            }
          }
        }
      }
    }
  };

  const state = {
    stepIndex: 0,
    scenarioKey: "happy"
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mergedStep(step, scenario) {
    return { ...step, ...(scenario.overrides[step.key] || {}) };
  }

  function stopIndex(scenario) {
    return scenario.stopAt ? steps.findIndex((step) => step.key === scenario.stopAt) : -1;
  }

  function stepState(index, scenario) {
    const stop = stopIndex(scenario);
    if (stop === -1) return index < state.stepIndex ? "done" : index === state.stepIndex ? "active" : "pending";
    if (index < stop) return "done";
    if (index === stop) return "blocked";
    return "locked";
  }

  function statusLabel(scenario, index) {
    const stop = stopIndex(scenario);
    if (stop === index) return scenario.status;
    if (stop !== -1 && index > stop) return "not reached";
    if (index === state.stepIndex) return "inspecting";
    return "available";
  }

  function renderJson(records) {
    return escapeHtml(JSON.stringify(records, null, 2));
  }

  function renderScenarioButtons() {
    return Object.entries(scenarios).map(([key, scenario]) => `
      <button class="tutorial-scenario ${key === state.scenarioKey ? "is-active" : ""}" type="button" data-scenario="${key}">
        <span>${escapeHtml(scenario.label)}</span>
        <small>${escapeHtml(scenario.short)}</small>
      </button>
    `).join("");
  }

  function renderStepRail(scenario) {
    return steps.map((step, index) => `
      <button class="tutorial-step ${stepState(index, scenario)}" type="button" data-step="${index}">
        <span class="tutorial-step-number">${index + 1}</span>
        <span>
          <strong>${escapeHtml(step.label)}</strong>
          <small>${escapeHtml(step.owner)}</small>
        </span>
      </button>
    `).join("");
  }

  function renderFlow(scenario) {
    return steps.map((step, index) => `
      <button class="tutorial-flow-node ${stepState(index, scenario)}" type="button" data-step="${index}">
        <span>${index + 1}</span>
        ${escapeHtml(step.label)}
      </button>
    `).join("");
  }

  function renderChecklist(scenario, currentIndex) {
    const stop = stopIndex(scenario);
    const checks = [
      ["Context is bound before reasoning", stop !== 1],
      ["Authority is checked before tools", stop !== 2],
      ["Evidence is source-linked", stop !== 3],
      ["Approval binds exact payload", stop !== 4 || scenario.status === "recheck_required"],
      ["Workflow owns side effects", stop !== 5],
      ["Source truth controls completion", stop !== 6 || scenario.status === "needs_reconciliation"],
      ["Learning is reviewed before promotion", stop !== 7 || scenario.status === "memory_rejected"]
    ];

    return checks.map(([label, ok], index) => {
      const reached = currentIndex >= Math.min(index + 1, steps.length - 1);
      const className = ok ? "pass" : "fail";
      return `<li class="${className} ${reached ? "is-reached" : ""}">
        <span>${ok ? "Pass" : "Stop"}</span>${escapeHtml(label)}
      </li>`;
    }).join("");
  }

  function render(root) {
    const scenario = scenarios[state.scenarioKey];
    const step = mergedStep(steps[state.stepIndex], scenario);
    const stop = stopIndex(scenario);
    const blockedHere = stop === state.stepIndex;
    const afterStop = stop !== -1 && state.stepIndex > stop;
    const bannerClass = blockedHere ? "stop" : afterStop ? "locked" : "active";
    const bannerText = blockedHere
      ? `Run stops here: ${scenario.status}`
      : afterStop
        ? "This step is unreachable until the stop is resolved"
        : `Current state: ${statusLabel(scenario, state.stepIndex)}`;

    root.innerHTML = `
      <section class="tutorial-hero">
        <div>
          <p class="tutorial-eyebrow">Concrete vertical slice</p>
          <h2>Bed-flow run: from voice intent to verified product state</h2>
          <p>Switch scenarios and step through the run. Watch which product boundary owns each stop.</p>
        </div>
        <div class="tutorial-crux">
          <strong>The crux</strong>
          <span>The agent coordinates. Product records decide whether work may continue.</span>
        </div>
      </section>

      <section class="tutorial-scenarios" aria-label="Failure scenario selector">
        ${renderScenarioButtons()}
      </section>

      <section class="tutorial-layout">
        <aside class="tutorial-rail" aria-label="Run steps">
          ${renderStepRail(scenario)}
        </aside>

        <main class="tutorial-main">
          <div class="tutorial-flow" aria-label="Architecture flow">
            ${renderFlow(scenario)}
          </div>

          <div class="tutorial-status ${bannerClass}">
            <span>${escapeHtml(bannerText)}</span>
            <strong>${escapeHtml(scenario.lesson)}</strong>
          </div>

          <section class="tutorial-card">
            <div class="tutorial-card-header">
              <p>${escapeHtml(step.owner)}</p>
              <h3>${escapeHtml(step.title)}</h3>
            </div>

            <div class="tutorial-grid">
              <article>
                <h4>User-visible surface</h4>
                <p>${escapeHtml(step.visible)}</p>
              </article>
              <article>
                <h4>Behind the scenes</h4>
                <p>${escapeHtml(step.hidden)}</p>
              </article>
              <article>
                <h4>Boundary invariant</h4>
                <p>${escapeHtml(step.invariant)}</p>
              </article>
              <article>
                <h4>Why this is the crux</h4>
                <p>${escapeHtml(step.crux)}</p>
              </article>
            </div>

            <div class="tutorial-records">
              <div>
                <h4>Wrong shortcut</h4>
                <p>${escapeHtml(step.shortcut)}</p>
              </div>
              <div>
                <h4>Product pattern</h4>
                <p>${escapeHtml(step.pattern)}</p>
              </div>
              <div class="tutorial-json">
                <h4>Records written</h4>
                <pre><code>${renderJson(step.records)}</code></pre>
              </div>
            </div>
          </section>

          <section class="tutorial-bottom">
            <div>
              <h3>Release checklist</h3>
              <ul class="tutorial-checklist">
                ${renderChecklist(scenario, state.stepIndex)}
              </ul>
            </div>
            <div>
              <h3>How to read this</h3>
              <p>If a failure scenario reaches a dangerous action, the architecture is wrong. Your implementation should make the stop boring, explicit, auditable, and testable.</p>
            </div>
          </section>
        </main>
      </section>
    `;
  }

  function attach(root) {
    root.addEventListener("click", (event) => {
      const scenarioButton = event.target.closest("[data-scenario]");
      if (scenarioButton) {
        state.scenarioKey = scenarioButton.dataset.scenario;
        const stop = stopIndex(scenarios[state.scenarioKey]);
        state.stepIndex = stop === -1 ? 0 : stop;
        render(root);
        return;
      }

      const stepButton = event.target.closest("[data-step]");
      if (stepButton) {
        state.stepIndex = Number(stepButton.dataset.step);
        render(root);
      }
    });
  }

  function initTutorial() {
    document.querySelectorAll("[data-agent-tutorial]").forEach((root) => {
      if (root.dataset.tutorialReady) return;
      root.dataset.tutorialReady = "true";
      attach(root);
      render(root);
    });
  }

  document.addEventListener("DOMContentLoaded", initTutorial);
  document.addEventListener("DOMContentSwitch", initTutorial);
  if (window.document$?.subscribe) window.document$.subscribe(initTutorial);
})();
