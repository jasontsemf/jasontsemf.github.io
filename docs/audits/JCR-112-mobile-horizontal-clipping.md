# JCR-112 mobile horizontal clipping verification

## Root cause

The responsive width rules were correct after layout settled, but the shared `fadeInLeft` entrance animation translated full-width Bootstrap rows and columns 50px to the left. Mobile screenshots could therefore capture project summaries and the OptiMice hero while they were outside the viewport.

The fix keeps the existing opacity transition on viewports up to 768px while removing horizontal motion. Desktop retains the original `fadeInLeft` animation.

## Measurements

All coordinates are CSS pixels measured in headless Chrome.

| Route and sample | Before | After |
| --- | --- | --- |
| `/projects.html`, 390px viewport, 650ms | Project grid `x=-18.27–337.73`; card summaries `x=-3.27–322.73`; clipped | Project grid `x=17–373`; card summaries `x=32–358`; contained |
| `/optimice.html`, 390px viewport, 250ms | Hero video `x=-10.47–315.53`; clipped | Hero video `x=32–358`; contained |
| Both routes, settled 390px layout | Document `clientWidth=390`, `scrollWidth=390` | Document `clientWidth=390`, `scrollWidth=390`; affected content `x=32–358` |
| Both routes, settled 1440px layout | Document `clientWidth=1440`, `scrollWidth=1440` | Document `clientWidth=1440`, `scrollWidth=1440`; desktop geometry unchanged |

The OptiMice Owl carousels intentionally position inactive slides outside their carousel viewport. They do not increase document or body scroll width and are unrelated to JCR-112.

## Screenshots

### Mobile, 390×844

![Projects mobile](jcr-112-mobile-horizontal-clipping/projects-mobile-390x844.png)

![OptiMice mobile](jcr-112-mobile-horizontal-clipping/optimice-mobile-390x844.png)

### Desktop, 1440×1000

![Projects desktop](jcr-112-mobile-horizontal-clipping/projects-desktop-1440x1000.png)

![OptiMice desktop](jcr-112-mobile-horizontal-clipping/optimice-desktop-1440x1000.png)

## Verification

- `npm run verify:ci`
  - Built 12 pages.
  - Passed canonical-source, static-inventory, parity, project-content, structured-detail, and internal-link checks.
  - Verified 502 internal references across 23 generated HTML files.
- Focused animation checks at 250ms and 650ms passed at 390px.
- Settled geometry checks passed at 390px and 1440px with zero document-level horizontal overflow.
- Representative screenshots were inspected for clipping, alignment, and desktop regression.
