# JCR-45 Project Parity Audit

- Issue: `JCR-45`
- Verification date: March 21, 2026
- Runtime: Node `22` via `.nvmrc`
- Scope: Astro-managed project detail pages plus the generated `/projects.html` listing

## Verification contract

1. `dist/projects.html` must render the visible project cards declared by typed frontmatter in `src/content/projects/`.
2. Each Astro-managed project detail page must preserve legacy text content in `#jason-main`.
3. Each Astro-managed project detail page must preserve legacy media references and outbound links in `#jason-main`.

Covered detail routes:

- `/optimice.html`
- `/bankheist.html`
- `/pbc.html`
- `/tagit.html`
- `/falseawakening.html`
- `/runvendor.html`

## Accepted JCR-59 exception

- Previous/Next detail-page navigation is intentionally excluded from JCR-45 parity comparison.
- Reason: `JCR-59` moved those controls to curated data-driven rendering, and root `*.html` files are stale snapshots for that behavior.
- QA for Previous/Next flow must use generated output (`dist/` or `astro dev`), not the legacy root files.

## Automation

- `scripts/verify-jcr45-project-parity.mjs`
- Wired into `npm run verify:parity`

For the listing, the verifier parses project frontmatter and compares its sorted card contract with generated `dist/projects.html`; root `projects.html` is no longer an authoring baseline. Retained project-detail baselines are compared with generated `dist/*.html` output after:

- limiting comparison to `#jason-main`
- stripping HTML comments
- excluding the JCR-59-managed `work-pagination` block
- normalizing text whitespace

## Session result

- `npm run build:verify` passed under Node `22`.
- No remaining in-scope markdown/content parity gaps were found for JCR-45.
