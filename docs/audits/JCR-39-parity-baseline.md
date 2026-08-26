# JCR-39 Parity Baseline (Single Source of Truth)

> **Historical snapshot:** JCR-109 removed the root core-page authoring baselines, and JCR-110 removed the root project-page baselines. Current sources are `src/pages/*.astro`, shared Astro components, and typed content collections; `.html` names below are public outputs, not root authoring files unless explicitly classified as retained compatibility routes.

- Issue: `JCR-39`
- Snapshot date: February 19, 2026
- Owner: Jason Tse
- Purpose: define the migration acceptance contract for route/content/style/behavior parity.
- Scope note: this baseline inventories deployable site paths and assets in current repo state. `backup/` and `ignore/` are archival and excluded from migration parity scope.

## 1. Public Route Inventory

### 1.1 Canonical root routes

| Route | Source file | Current behavior |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | Homepage with typing animation and side-nav shell |
| `/projects.html` | `src/pages/projects.html.astro` | Portfolio listing page |
| `/about.html` | `src/pages/about.html.astro` | About page |
| `/contact.html` | `src/pages/contact.html.astro` | Contact page with embedded map |
| `/optimice.html` | `src/content/projects/optimice.mdx` | Astro-generated project detail page |
| `/bankheist.html` | `src/content/projects/bankheist.mdx` | Astro-generated project detail page |
| `/binwatch.html` | `src/content/projects/binwatch.mdx` | Astro-generated project detail page |
| `/pbc.html` | `src/content/projects/pbc.mdx` | Astro-generated project detail page |
| `/tagit.html` | `src/content/projects/tagit.mdx` | Astro-generated project detail page |
| `/falseawakening.html` | `src/content/projects/falseawakening.mdx` | Astro-generated project detail page |
| `/runvendor.html` | `src/content/projects/runvendor.mdx` | Astro-generated project detail page |

### 1.2 Redirect and legacy routes

| Route | Source file | Current behavior |
| --- | --- | --- |
| `/portfolio.html` | `portfolio.html` | Meta refresh redirect to `/projects.html` |
| `/work.html` | `work.html` | Legacy template-like page still directly reachable |

### 1.3 Standalone tool/microsite routes

| Route | Source file |
| --- | --- |
| `/date/index.html` | `date/index.html` |
| `/date/heart.html` | `date/heart.html` |
| `/ResizeCounter/index.html` | `ResizeCounter/index.html` |
| `/snap/index.html` | `snap/index.html` |
| `/keyboardranger/Website/index.html` | `keyboardranger/Website/index.html` |
| `/keyboardranger/game.html` | `keyboardranger/game.html` |
| `/keyboardranger/slider.html` | `keyboardranger/slider.html` |

### 1.4 Non-canonical but public helper/demo routes

| Route | Source file | Notes |
| --- | --- | --- |
| `/cocoen/docs/demo.html` | `cocoen/docs/demo.html` | Library demo page |
| `/cocoen/docs/demo-jquery.html` | `cocoen/docs/demo-jquery.html` | Library demo page |

## 2. Media/Asset Inventory

### 2.1 Directory inventory snapshot

| Path | Files | Size |
| --- | ---: | ---: |
| repo root (`.`) | n/a | `1.8G` |
| `css/` | `7` | `296K` |
| `js/` | `12` | `240K` |
| `fonts/` | `10` | `1.6M` |
| `images/` | `25` | `656K` |
| `download/` | `21` | `13M` |
| `project/` | `218` | `427M` |
| `keyboardranger/` | `44` | `13M` |
| `date/` | `4` | `20K` |
| `ResizeCounter/` | `5` | `24K` |
| `snap/` | `5` | `664K` |
| `cocoen/docs/` | `11` | `2.2M` |

### 2.2 File-type snapshot (`images/` + `download/` + `project/`)

- `png`: `123`
- `jpg`: `74`
- `pdf`: `25`
- `gif`: `13`
- `psd`: `14`
- `jpeg`: `2`

### 2.3 Largest tracked files (risk hotspots for migration regressions)

- `project/falseawakening/5.3_Group13_Duo.pdf` (`40,122,615` bytes)
- `project/pbc/snap.gif` (`24,657,314` bytes)
- `project/pbc/eyecandies/shadow.gif` (`22,109,344` bytes)
- `project/pbc/eyecandies/hue_medium.gif` (`20,995,556` bytes)
- `project/pbc/snap_crop.gif` (`20,940,850` bytes)

## 3. SEO/Meta Baseline

Current baseline findings:

- `<meta name="description">` is present across key pages but uses generic duplicated content (`"Jason Tse's personal website"`).
- Open Graph and Twitter tags exist on core pages (`index.html`, `about.html`, `projects.html`, `contact.html`, `work.html`) but values are empty.
- No canonical link tags found on root-level pages.
- `sitemap.xml` is stale (26 lines) and points to 2017 paths including old `assets/download/...` URLs.

Known integrity issue:

- `work.html` references missing `favicon.ico`.

## 4. Interaction Behavior Checklist

Behavior must remain functionally equivalent after migration unless explicitly approved as a deliberate change.

- [ ] Side-nav shell and off-canvas toggle behavior remain intact (`#jason-aside`, `.js-jason-nav-toggle`, `js/main.js`).
- [ ] Mobile outside-click and scroll-close logic for off-canvas nav still works (`js/main.js`).
- [ ] Waypoint-triggered animation classes still apply on scroll (`animate.css` + `jquery.waypoints` + `js/main.js`).
- [ ] Owl carousel behavior remains intact where used (`owl-carousel-side`, `owl-carousel-fullwidth`).
- [ ] Home typing loop still runs in `index.html` via `js/typing_carousel.js` (`#output` target).
- [ ] Cocoen before/after compare remains operational on pages that include `.cocoen` (`optimice.html`, `pbc.html`, `js/main.js` initialization loop).
- [ ] Contact page map experience is unchanged relative to baseline (embedded iframe plus legacy Google Maps script path behavior).
- [ ] Generated `/binwatch.html` project behavior and retained `portfolio.html` redirect semantics remain correct.
- [ ] Shared Astro shell output avoids accidental duplicate Font Awesome includes on generated core pages.

## 5. Parity Acceptance Criteria (Migration Gate)

Route and content parity:

- [ ] Every route in Sections 1.1-1.4 resolves with equivalent intent (render page, redirect, or serve demo/tool page).
- [ ] Core navigation links among `/`, `/projects.html`, `/about.html`, and `/contact.html` remain valid.
- [ ] Project detail pages preserve text, media, and outbound links without missing assets.

Style and behavior parity:

- [ ] Layout shell (sidebar, typography hierarchy, spacing, color treatment) is materially unchanged on desktop and mobile.
- [ ] Section 4 interaction checklist is fully verified on canonical pages and at least one representative project page.

SEO and metadata parity:

- [ ] Canonical metadata strategy is explicitly defined and implemented (or deferred with issue linkage).
- [ ] OG/Twitter metadata fields are intentionally populated for canonical pages.
- [ ] `sitemap.xml` is regenerated from canonical, current routes and validated.

Link and asset integrity parity:

- [ ] No new broken local page or asset links are introduced.
- [ ] Existing known breakage (`work.html` -> `favicon.ico`) is either fixed or documented as explicitly accepted legacy behavior.
- [ ] Large binary assets in Section 2.3 remain present and correctly referenced unless intentionally replaced.

Operational parity:

- [ ] Static output remains GitHub Pages compatible.
- [ ] This document remains the acceptance contract for closing `JCR-39`.
