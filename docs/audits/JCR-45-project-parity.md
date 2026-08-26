# JCR-45 Project Parity Audit

- Issue: `JCR-45`
- Original verification date: March 21, 2026
- Runtime: Node `22` via `.nvmrc`
- Historical scope: Astro-managed project detail pages plus the generated `/projects.html` listing

> **Superseded baseline:** JCR-110 removed the six root project-detail snapshots formerly used by this audit. Project MDX and generated behavior are now authoritative; this document records the migration gate rather than defining a current root-file authoring baseline.

## Current verification contract

1. `dist/projects.html` must render the visible project cards declared by typed frontmatter in `src/content/projects/`.
2. Migrated detail entries must remain MDX-authored and render through the generic `src/pages/[routeKey].html.astro` route.
3. Generated project routes, media, outbound links, and detail navigation must pass the structured-content and internal-link checks.

Covered migrated routes include:

- `/optimice.html`
- `/bankheist.html`
- `/pbc.html`
- `/tagit.html`
- `/falseawakening.html`
- `/runvendor.html`
- `/binwatch.html`
- `/cat-ai.html`

## Navigation ownership

JCR-59 moved Previous/Next controls to curated data-driven rendering. QA for that flow uses generated output (`dist/` or `astro dev`) and `scripts/verify-jcr58-structured-project-details.mjs`.

## Automation

- `scripts/verify-project-content.mjs` validates the project listing against normalized typed frontmatter.
- `scripts/verify-jcr58-structured-project-details.mjs` validates MDX authorship, generic route rendering, and detail navigation.
- `scripts/verify-internal-links.mjs` validates generated local page and asset references.
- All are wired into `npm run verify:ci`.

The deleted root project files are no longer read by build or verification code.
