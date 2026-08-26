# JCR-46 Dead Code and Stale Asset Cleanup

- Issue: `JCR-46`
- Audit date: August 22, 2026
- Baseline: `origin/dev` at `119b01e`
- Scope: conservative cleanup after the Astro and MDX migration

## Removed

### Obsolete source paths

- `src/components/LegacyRoutePage.astro`
  - Introduced by the initial Astro scaffold.
  - No runtime imports remain after canonical and project routes moved to dedicated Astro pages.
- `optimice.md`
  - Unreferenced root-level migration draft superseded by `src/content/projects/optimice.mdx`.

### Dead page fragments

Removed commented-out UI from both current Astro sources and their retained legacy parity baselines:

- Hidden boarding-pass project card from `src/pages/projects.html.astro` and `projects.html`.
- Hidden duplicate résumé call-to-action from `src/pages/about.html.astro` and `about.html`.

The live résumé navigation link remains unchanged.

### Stale assets and metadata

- Removed the boarding-pass thumbnail referenced only by the deleted hidden card.
- Removed 18 unreferenced template/demo images from `images/`.
- Removed 43 tracked `.DS_Store` files and added `.DS_Store` to `.gitignore`.

Total deleted: 64 files and 393,578 bytes.

## Reference audit

The cleanup used two checks before deletion:

1. Scanned generated HTML plus copied CSS and JavaScript for static asset references.
2. Searched the complete tracked source tree for exact references to each candidate.

`images/loc.png` initially appeared unused in generated markup but is referenced dynamically by `js/google_map.js`; it was retained. This is why the pass remained conservative rather than deleting every asset without a generated-HTML reference.

## Intentionally retained

- `backup/` and `ignore/` archival content. Only Finder metadata was removed from those trees.
- Root legacy HTML then used by JCR-39 and JCR-45 parity verification. JCR-109 and JCR-110 later retired the core-page and project-page baselines; only classified compatibility routes remain.
- Legacy microsites and their local assets: `date/`, `ResizeCounter/`, `snap/`, `keyboardranger/`, and `cocoen/`.
- Historical résumé PDFs and unreferenced project source media, which may be intentional archival or downloadable material.
- BinWatch migration paths and JCR-100 work areas, to avoid overlapping the active isolated JCR-100 work.

## Verification

- `npm run verify:ci`
  - Astro static build: passed, 11 pages built.
  - JCR-39 parity: passed.
  - JCR-45 project parity: passed.
  - JCR-58 structured project details: passed.
  - Internal links: passed, 417 references across 22 HTML files.
- `git diff --check`: passed.
- Tracked `.DS_Store` count after cleanup: 0.
