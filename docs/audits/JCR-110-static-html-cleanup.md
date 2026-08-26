# JCR-110 Static HTML Source Cleanup

- Issue: `JCR-110`
- Audit date: August 26, 2026
- Base: `origin/dev` at `cde6e6f`
- Scope: tracked HTML sources outside generated `dist/`

## Inventory and disposition

The post-JCR-109 repository contained 19 tracked HTML sources outside `dist/`. Every file was classified before removal.

### Astro-replaced project sources removed

| Deleted source | Public output owner |
| --- | --- |
| `optimice.html` | `src/content/projects/optimice.mdx` through `src/pages/[routeKey].html.astro` |
| `bankheist.html` | `src/content/projects/bankheist.mdx` through `src/pages/[routeKey].html.astro` |
| `pbc.html` | `src/content/projects/pbc.mdx` through `src/pages/[routeKey].html.astro` |
| `tagit.html` | `src/content/projects/tagit.mdx` through `src/pages/[routeKey].html.astro` |
| `falseawakening.html` | `src/content/projects/falseawakening.mdx` through `src/pages/[routeKey].html.astro` |
| `runvendor.html` | `src/content/projects/runvendor.mdx` through `src/pages/[routeKey].html.astro` |
| `binwatch.html` | `src/content/projects/binwatch.mdx` through `src/pages/[routeKey].html.astro` |

These files were migration snapshots, not runtime inputs. Their public `.html` URLs remain registered in `astroManagedProjectRoutes` and are generated into `dist/` by Astro.

### Root compatibility routes retained

| Source | Classification | Runtime reason |
| --- | --- | --- |
| `portfolio.html` | Active redirect | Preserves the published compatibility URL and meta-refreshes to `/projects.html`; copied byte-for-byte into `dist/`. |
| `work.html` | Reachable legacy route | Still directly reachable and copied byte-for-byte into `dist/`; migrating or removing it is outside this ticket. |

### Standalone routes retained

| Sources | Classification | Runtime reason |
| --- | --- | --- |
| `date/index.html`, `date/heart.html` | Standalone microsite | Birthday-picker experience with local assets and behavior. |
| `ResizeCounter/index.html` | Standalone demo | Independent resize-counter tool. |
| `snap/index.html` | Standalone microsite | Independent static experience with local assets. |
| `keyboardranger/Website/index.html`, `keyboardranger/game.html`, `keyboardranger/slider.html` | Standalone game/demo | Multi-file interactive experiment with its own scripts and assets. |
| `cocoen/docs/demo.html`, `cocoen/docs/demo-jquery.html` | Library demos | Public demos for the retained Cocoen distribution. |

These files remain passthrough sources because they are intentionally independent from the portfolio's Astro page shell.

### Archival source retained

| Source | Classification | Reason |
| --- | --- | --- |
| `backup/index.html` | Archival artifact | It is under the repository's protected `backup/` area and is not copied into `dist/`. |

No unclassified or dead HTML source remains after the seven project baselines are removed.

## Migration machinery removed

- Removed the seven duplicate entries from `rootLegacyRoutes`; only `portfolio.html` and `work.html` remain there.
- Made `parityCriticalRoutes` derive generated project coverage from `astroManagedRoutes` rather than deleted root sources.
- Removed project-level `legacySource` schema/frontmatter metadata, including templates and authoring documentation.
- Replaced JCR-45's root-file detail comparison with a typed project-listing contract in `scripts/verify-project-content.mjs`.
- Added `scripts/verify-static-html-inventory.mjs` to reject reintroduced project baselines, unclassified static HTML, missing retained exceptions, or missing generated project outputs.

## Asset reference audit

Every local `src`/`href` in the seven deleted sources was compared with generated project output and exact references across the remaining tracked source tree.

- `project/bankheist/thumb.png` appeared only inside a commented-out block in the deleted BankHeist source.
- Thirteen `project/runvendor/JPEG/Pixel_RunVendorReport-*.jpg` files (`2`, `3`, `4`, `5`, `6`, `7`, `9`, `12`, `14`, `16`, `17`, `20`, and `22`) appeared only in commented-out blocks in the deleted Run! Vendor source.
- Together these 14 files occupy 8,306,410 bytes.

They are proven unused by generated pages and remaining tracked references, but they were preserved as historical project-report material because this ticket does not explicitly authorize deleting archival media. No project assets or scripts were removed.

## Verification

- `npm run build:verify`: passed; 12 Astro pages built and all source, route, project-content, and structured-detail contracts passed.
- `npm run verify:ci`: passed; internal-link verification checked 502 references across 23 generated HTML files.
- Private HTTPS smoke test: all seven removed-source project URLs returned HTTP 200 as Astro detail pages; nine standalone routes returned HTTP 200; `portfolio.html` and `work.html` were byte-identical to their retained sources.
- Clean-base comparison: all 370 generated files were byte-identical to a fresh `origin/dev` build, with no changed, missing, or added output files.
- Browser QA: `/projects.html` and `/optimice.html` rendered at 1440×1000 and 390×844 viewports. The desktop layout and collapsed mobile navigation rendered correctly. Existing right-edge clipping at the narrow viewport was confirmed as pre-existing by the byte-identical clean-base comparison and filed separately as `JCR-112`.
- `git diff --check`: passed.
