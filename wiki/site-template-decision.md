# Site Template Decision

Status: accepted for current phase.

Decision:

```text
Use Material for MkDocs as the canonical publishing stack.
Keep Markdown as source.
Keep the legacy interactive app as a carried lab, not the primary site.
```

## Why

The site needs to feel like a research documentation product:

- clear left navigation
- readable typography
- visible headings
- built-in search
- dark and light modes with accessible contrast
- Mermaid diagrams without custom rendering hacks
- GitHub Pages deployment from source

Quarto was workable for publishing, but the visual system felt academic and brittle after customization. Material for MkDocs is closer to the desired documentation experience.

## Comparison

| Option | Fit | Decision |
|---|---|---|
| Material for MkDocs | Strong docs UX, Markdown-first, search, Mermaid, GitHub Pages, low framework surface. | Adopt. |
| Jekyll / Just the Docs | Good GitHub Pages fit, but weaker built-in research-doc polish and diagram experience. | Do not use now. |
| Astro Starlight | Excellent if the site becomes component-heavy. More frontend ownership than needed today. | Revisit later. |
| Docusaurus | Strong large-docs framework, but React/versioning surface is heavier than needed. | Not now. |
| Custom HTML app | Full control but hides source and becomes a separate product. | Keep only as legacy lab. |

## Implementation

| Concern | Decision |
|---|---|
| Source directory | `wiki/` |
| Site config | `mkdocs.yml` |
| Theme | `material` |
| Custom style | `wiki/assets/stylesheets/research.css` |
| Diagram viewer | `wiki/assets/javascripts/diagram-viewer.js` |
| CI build | `.github/workflows/mkdocs-pages.yml` |
| Output | `site/` |

## Official Docs Consulted

- Material for MkDocs: https://squidfunk.github.io/mkdocs-material/
- Material diagrams: https://squidfunk.github.io/mkdocs-material/reference/diagrams/
- Material publishing: https://squidfunk.github.io/mkdocs-material/publishing-your-site/
- MkDocs configuration: https://www.mkdocs.org/user-guide/configuration/
- Just the Docs: https://just-the-docs.com/
- Astro Starlight: https://starlight.astro.build/
