# Site Template Decision

Status: accepted for current phase.

Decision:

```text
Keep Quarto as the canonical publishing stack for now.
Demote the old custom interactive app to derived labs.
Do not migrate to Astro/Starlight until reusable interactive islands become the main product.
```

## Why This Decision Exists

The current site has two problems:

1. The content is too broad and prose-heavy.
2. The custom `interactive.html` app is too large, visually weak, and not integrated with the Quarto documentation model.

Changing frameworks will not fix weak research standards. The first fix is a stronger documentation operating system, stricter navigation, diagrams, and a quieter engineering template.

## Template Comparison

| Option | Fit now | Strength | Cost | Decision |
|---|---|---|---|---|
| Quarto website | High | Markdown-first writing, citations, Mermaid diagrams, sidebars, search, GitHub Pages. | Less polished for component-heavy apps. | Keep. |
| Astro Starlight | Medium later | Excellent docs UX, MDX/components, better interactive islands. | Migration cost and frontend build ownership. | Revisit after contract pages stabilize. |
| Docusaurus | Medium later | Versioned docs, React ecosystem, large docs sites. | More framework surface than needed now. | Not now. |
| Nextra | Low to medium | Good MDX docs inside Next.js. | Couples wiki to Next.js app stack. | Not now. |
| Custom HTML app | Low | Full UI control. | Becomes a second product with hidden content. | Demote. |

## Target Aesthetic

The wiki should feel like an architecture manual:

- dense but readable pages
- left sidebar plus right table of contents
- restrained color and borders
- diagrams close to contracts
- compact tables for records and decisions
- callouts for Decision, Evidence, Failure, Proof
- no marketing hero
- no large decorative app shell

## Interactive Policy

Interactive work is allowed only when it does one of these:

- compares states that are hard to compare in prose
- runs a small deterministic simulator
- validates a schema or event trajectory
- exposes a visual graph that would be too dense as a static table

Interactive work is not allowed to be the only source of a contract, claim, or decision.

## Migration Plan

1. Keep Quarto and improve the template.
2. Add [Research operating system](research-operating-system.md).
3. Add [System diagram spine](system-diagram-spine.md).
4. Add [Interactive labs index](interactive-labs.md) and demote `interactive.html`.
5. Fix `interactive.html#section` deep links while the legacy app remains.
6. Rewrite contract pages under the new standard.
7. Revisit Astro/Starlight only after two or three labs prove they need component islands.

## Official Docs Consulted

- Quarto websites: https://quarto.org/docs/websites/
- Quarto diagrams: https://quarto.org/docs/authoring/diagrams.html
- Astro Starlight: https://starlight.astro.build/
- Docusaurus docs: https://docusaurus.io/docs
- Nextra docs: https://nextra.site/docs
