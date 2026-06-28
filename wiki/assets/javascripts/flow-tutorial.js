(function () {
  const data = window.enterpriseAgentsFlowTutorialData;

  if (!data) {
    console.error("Missing enterpriseAgentsFlowTutorialData. Run scripts/generate-flow-tutorial-data.mjs before building the site.");
    return;
  }

  const { hero, steps, scenarios, checklist, readerNote } = data;

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

    return checklist.map((check, index) => {
      const checkStepIndex = steps.findIndex((candidate) => candidate.key === check.step);
      const ok = stop !== checkStepIndex || check.passWhenStatus.includes(scenario.status);
      const reached = currentIndex >= Math.min(index + 1, steps.length - 1);
      const label = check.label;
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
          <p class="tutorial-eyebrow">${escapeHtml(hero.eyebrow)}</p>
          <h2>${escapeHtml(hero.title)}</h2>
          <p>${escapeHtml(hero.body)}</p>
        </div>
        <div class="tutorial-crux">
          <strong>${escapeHtml(hero.cruxTitle)}</strong>
          <span>${escapeHtml(hero.cruxBody)}</span>
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
              <p>${escapeHtml(readerNote)}</p>
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
