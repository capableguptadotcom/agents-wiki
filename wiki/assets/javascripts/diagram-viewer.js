(function () {
  let renderId = 0;

  async function renderMermaidSources() {
    if (!window.mermaid) {
      setTimeout(renderMermaidSources, 300);
      return;
    }

    if (!window.__agentMermaidInitialized) {
      window.mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "default" });
      window.__agentMermaidInitialized = true;
    }

    const blocks = [...document.querySelectorAll("pre.agent-mermaid-source")]
      .filter((block) => !block.dataset.mermaidRendered);

    for (const block of blocks) {
      block.dataset.mermaidRendered = "true";
      const source = block.querySelector("code")?.textContent?.trim();
      if (!source) continue;

      try {
        const id = `agent_mermaid_${Date.now()}_${renderId++}`;
        const rendered = await window.mermaid.render(id, source);
        const frame = document.createElement("div");
        frame.className = "agent-diagram diagram-frame";
        frame.innerHTML = rendered.svg;
        block.replaceWith(frame);
      } catch (error) {
        const message = document.createElement("div");
        message.className = "agent-diagram-error";
        message.textContent = `Diagram failed to render: ${error.message || error}`;
        block.replaceWith(message);
      }
    }
  }

  function diagramLabel(svg, index) {
    let node = svg.parentElement;
    while (node && !node.matches(".md-content")) {
      let previous = node.previousElementSibling;
      while (previous) {
        if (previous.matches("h1, h2, h3")) return previous.textContent.trim();
        const nested = previous.querySelector?.("h1, h2, h3");
        if (nested) return nested.textContent.trim();
        previous = previous.previousElementSibling;
      }
      node = node.parentElement;
    }
    const title = document.querySelector(".md-content h1");
    return title?.textContent?.trim() || `Diagram ${index + 1}`;
  }

  function eligibleDiagram(svg) {
    const box = svg.getBoundingClientRect();
    const text = svg.textContent || "";
    return box.width > 180 && box.height > 120 && /mermaid|AgentRun|Workflow|Policy|AGENT|Source|Runtime/.test(text);
  }

  function closeLightbox(lightbox) {
    document.body.classList.remove("diagram-lightbox-open");
    lightbox.remove();
  }

  function openLightbox(svg, label) {
    let zoom = 1;
    const lightbox = document.createElement("div");
    lightbox.className = "diagram-lightbox";
    const panel = document.createElement("div");
    panel.className = "diagram-lightbox-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", label);

    const toolbar = document.createElement("div");
    toolbar.className = "diagram-lightbox-toolbar";
    const title = document.createElement("strong");
    title.textContent = label;
    const spacer = document.createElement("span");
    spacer.className = "diagram-lightbox-spacer";

    const zoomOut = document.createElement("button");
    zoomOut.type = "button";
    zoomOut.textContent = "Zoom -";
    zoomOut.dataset.zoomOut = "true";
    const zoomReset = document.createElement("button");
    zoomReset.type = "button";
    zoomReset.textContent = "Reset";
    zoomReset.dataset.zoomReset = "true";
    const zoomIn = document.createElement("button");
    zoomIn.type = "button";
    zoomIn.textContent = "Zoom +";
    zoomIn.dataset.zoomIn = "true";
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "Close";
    close.dataset.close = "true";

    toolbar.append(title, spacer, zoomOut, zoomReset, zoomIn, close);
    const scroll = document.createElement("div");
    scroll.className = "diagram-lightbox-scroll";
    panel.append(toolbar, scroll);
    lightbox.appendChild(panel);

    const clone = svg.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.classList.add("diagram-lightbox-svg");
    scroll.appendChild(clone);

    function setZoom(nextZoom) {
      zoom = Math.max(0.5, Math.min(3, nextZoom));
      clone.style.transform = `scale(${zoom})`;
      clone.style.transformOrigin = "top left";
      clone.style.width = `${100 / zoom}%`;
    }

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target.closest("[data-close]")) closeLightbox(lightbox);
      if (event.target.closest("[data-zoom-in]")) setZoom(zoom + 0.25);
      if (event.target.closest("[data-zoom-out]")) setZoom(zoom - 0.25);
      if (event.target.closest("[data-zoom-reset]")) setZoom(1);
    });

    document.body.appendChild(lightbox);
    document.body.classList.add("diagram-lightbox-open");
    setZoom(1);
    close.focus();
  }

  function enhanceDiagrams() {
    const diagrams = [...document.querySelectorAll(".md-content svg")]
      .filter((svg) => !svg.dataset.diagramViewerReady && eligibleDiagram(svg));

    diagrams.forEach((svg, index) => {
      svg.dataset.diagramViewerReady = "true";
      const frame = svg.closest(".agent-diagram, .mermaid") || svg.parentElement;
      if (!frame) return;
      frame.classList.add("diagram-frame");
      const label = diagramLabel(svg, index);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "diagram-expand-button";
      button.textContent = "Expand";
      button.setAttribute("aria-label", `Expand ${label}`);
      button.addEventListener("click", () => openLightbox(svg, label));
      frame.appendChild(button);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderMermaidSources().then(enhanceDiagrams);
    setTimeout(enhanceDiagrams, 750);
    setTimeout(enhanceDiagrams, 1800);
  });

  document.addEventListener("DOMContentSwitch", () => {
    renderMermaidSources().then(enhanceDiagrams);
    setTimeout(enhanceDiagrams, 750);
  });

  if (window.document$?.subscribe) {
    window.document$.subscribe(() => {
      renderMermaidSources().then(enhanceDiagrams);
      setTimeout(enhanceDiagrams, 750);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const lightbox = document.querySelector(".diagram-lightbox");
    if (lightbox) closeLightbox(lightbox);
  });
})();
