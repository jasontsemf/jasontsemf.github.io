# Portfolio project information architecture

- Status: Accepted for implementation
- Decision: JCR-119
- Consumers: JCR-113 (mockups), JCR-114 (implementation)
- Last updated: 2026-08-30

## Decision summary

The portfolio uses one canonical project collection and two presentation tiers:

1. **Featured Work**: a deliberately small set of career-facing, first-party case studies.
2. **Project Archive**: concise entries grouped into **Professional Work**, **Earlier Work**, and **Side Projects**.

Tier and group are independent editorial fields. They must be exposed in text, headings, navigation, and accessible metadata rather than inferred from card size, position, imagery, or route type. A project has one canonical record, one canonical destination, and may appear as a reference in multiple views without duplicating its authored content.

This decision separates prominence from chronology. Hapiko/Stickerbox is the latest role and leads Featured Work once its approved case study exists. Cat.AI remains a featured technical case study. Neuma is a former role and receives only the public treatment cleared by JCR-106. Smaller client projects and older personal projects remain discoverable without competing with the featured case studies.

## Goals and non-goals

### Goals

- Make Jason's current professional narrative legible to hiring managers in the first scan.
- Scale beyond the original project grid without implying equal depth or career relevance.
- Preserve useful historical and personal work.
- Support first-party case studies and authoritative external project pages.
- Preserve every existing public project route.
- Give JCR-113 and JCR-114 deterministic labels, placement rules, and behavior.

### Non-goals

- Homepage or About copy (JCR-98).
- Archive visual design or mockups (JCR-113).
- Production archive implementation (JCR-114).
- Writing Hapiko/Stickerbox, Neuma, Tomorrow Lab, or other project entries.
- Deciding whether unlicensed or unsupported Neuma material can be published (JCR-106).

## Public vocabulary

Use these labels exactly unless usability testing in JCR-113 identifies a material accessibility or comprehension problem:

| Concept | Public label | Purpose |
| --- | --- | --- |
| Primary destination | **Projects** | Stable global-navigation label and `/projects.html` page title. |
| Tier 1 | **Featured Work** | Selected, career-facing first-party case studies. |
| Tier 2 destination | **Project Archive** | Concise work that remains worth discovering. |
| Archive group | **Professional Work** | Client, employer, studio, or commissioned work that is not a featured case study. |
| Archive group | **Earlier Work** | Older school, studio, and exploratory work retained for historical context. |
| Archive group | **Side Projects** | Self-directed builds and experiments not presented as employer/client work. |

Do not use “Other,” “Miscellaneous,” or “Past Work.” “Past Work” is too easily read as former employment, while “Earlier Work” describes chronology without making an employment claim.

## Taxonomy

### Presentation tier

#### `featured`

Use only when all of the following are true:

- The project materially supports the current career narrative.
- There is enough cleared evidence and media for a substantive first-party case study.
- Jason's contribution can be stated precisely.
- The content meets the higher editorial and maintenance burden of a case study.

Featured Work is curated, not automatically generated from recency. Target 2–4 visible items; five is a hard maximum before an explicit architecture review. Ordering is editorial, with current career relevance first and chronology only as a tie-breaker.

#### `archive`

Use for worthwhile work that should remain discoverable but does not need a full case study. An archive entry is a concise record, not a lesser-looking duplicate of a case study. It may link to an authoritative external page or to a retained first-party legacy detail route.

### Archive group

`archiveGroup` is required when `tier` is `archive` and absent when `tier` is `featured`.

#### `professional`

Employer, client, studio, or commissioned work. Use this group based on project context, not perceived prestige. A concise Tomorrow Lab client project belongs here.

#### `earlier`

Older educational, studio, and exploratory work whose main value is historical breadth. Age alone does not force a move here; a still-relevant technical project may remain featured or be a side project.

#### `side`

Self-directed projects, experiments, tools, and builds created outside employer/client delivery. Current 3D-printing projects belong here unless they become part of paid professional work.

### Context metadata

The UI may show context such as employer/client, contribution, year, and technologies, but these values do not create additional top-level categories. Avoid category proliferation such as separate “AI,” “Hardware,” and “Creative Technology” sections. Technologies remain tags or filters.

## Placement rules

Apply the following order of decisions to every addition or migration:

1. **Publication safety**: if claims or media are not cleared, do not publish the entry. A link to an authoritative source does not license copying its content.
2. **Canonical owner**: decide whether this site or an external publisher owns the authoritative project narrative.
3. **Case-study threshold**: if the site owns the narrative and the featured criteria are met, use `featured`; otherwise use `archive`.
4. **Archive group**: classify the work by its creation context (`professional`, `earlier`, or `side`), not by visual quality.
5. **Ordering**: use explicit editorial order for Featured Work and deterministic year/title sorting for archive groups.

### Named work

| Project/work family | Placement | Canonical destination | Notes |
| --- | --- | --- | --- |
| Hapiko/Stickerbox | Featured Work; first item when published | First-party case study from JCR-97 | Latest role. Identify Jason as first hire and sole firmware engineer, never founder. Do not publish a placeholder card that leads nowhere. |
| Cat.AI | Featured Work | Existing `/cat-ai.html` case study | Featured embedded-AI anchor. Its placement is configuration, never a route-specific layout conditional. |
| Neuma | Provisionally Featured Work only if JCR-106 clears a substantive public case study; otherwise Project Archive → Professional Work, or omitted | Delivery path approved by JCR-106 | Always describe as a former role. Do not publish restricted media or imply it is Jason's current/latest employment. A text-led first-party vignette may be featured only if it meets the case-study threshold. |
| Tomorrow Lab client projects, including future Mint, Salt Stone, and MedLocker entries | Project Archive → Professional Work | Authoritative external project page when one exists; otherwise a concise first-party archive entry | Keep discoverable and concise. Do not create bespoke case-study pages merely to keep links internal. |
| OptiMice | Project Archive → Earlier Work | Preserve `/optimice.html` | Existing detail page remains canonical; archive card references it. |
| BankHeist | Project Archive → Earlier Work | Preserve `/bankheist.html` | Existing detail page remains canonical. |
| BinWatch | Project Archive → Side Projects | Preserve `/binwatch.html` | Self-directed hardware build; current age does not make it professional work. |
| Printed Business Card | Project Archive → Side Projects | Preserve `/pbc.html` | Self-directed build. |
| Tagit | Project Archive → Earlier Work | Preserve `/tagit.html` | Retained historical work. |
| False Awakening | Project Archive → Earlier Work | Preserve `/falseawakening.html` | Retained historical work. |
| Run! Vendor | Project Archive → Earlier Work | Preserve `/runvendor.html` | Retained historical work. |
| Future personal or 3D-printing builds | Project Archive → Side Projects | Concise first-party entry or an authoritative external URL | Promote to Featured Work only through an explicit editorial review against the featured criteria. |

If new evidence changes the context of an existing project, update its canonical record. Never encode exceptions in page templates.

## Navigation and entry points

### Global navigation

Keep the existing global label **Projects** and canonical route `/projects.html`. Do not add Project Archive as a peer global-navigation item; it is subordinate to Projects.

### Homepage

The homepage may expose a compact **Featured Work** preview containing 2–3 featured projects plus one text link: **View all projects** → `/projects.html`.

Requirements for JCR-98 or later homepage implementation:

- Hapiko/Stickerbox leads once its approved case study is publishable.
- Do not surface archive cards on the homepage by default.
- Do not publish empty or “coming soon” project destinations.
- Homepage cards reference canonical project records; they do not own duplicate title, summary, or link data.

### Projects experience

`/projects.html` is the complete project gateway, in this semantic order:

1. Page heading: **Projects**.
2. A labelled **Featured Work** section with substantive case-study cards.
3. A labelled **Project Archive** section or entry point with a one-sentence explanation.
4. Archive groups in this order: **Professional Work**, **Earlier Work**, **Side Projects**.

For the initial implementation, the archive may be an anchored section on `/projects.html`. A separate route may be introduced later only if the content volume or JCR-113 usability findings justify it. If a separate route is approved, use `/project-archive.html`, keep the Projects page as the primary gateway, and retain the same labels and canonical records.

Use stable fragment IDs if sections are on one page:

- `#featured-work`
- `#project-archive`
- `#professional-work`
- `#earlier-work`
- `#side-projects`

Filters are optional enhancement, not the only way to reach a group. Every group must remain linkable and understandable without JavaScript.

## Card and entry contracts

### Featured case-study card

Required:

- title
- short outcome/context summary
- Jason's role or contribution summary
- year or year range
- accessible image when licensed
- text label such as **Case study**
- internal canonical link

### Concise archive entry

Required:

- title
- one-sentence context
- one-sentence or compact contribution summary
- year or year range
- archive group
- destination type

Optional:

- licensed thumbnail and alt text
- employer/client/studio name
- technology tags

Link text must distinguish destinations:

- First-party detail: **View project**
- First-party featured detail: **Read case study**
- External authority: **View on [publisher] ↗** with an accessible external-link indication

A thumbnail must never be required for discoverability. Entries without cleared media use a text-first treatment rather than copied or synthetic imagery.

## Canonical linking behavior

Every project record has exactly one `destination`:

- `internal`: this repository owns the canonical narrative; `route` is required.
- `external`: another publisher owns the canonical narrative; `externalUrl` and `externalPublisher` are required.
- `none`: the item is intentionally non-clickable while still useful as a concise record; use sparingly and never for Featured Work.

Rules:

1. Featured Work always uses an internal first-party case-study route.
2. Internal links use the stable canonical HTML route (for example `/cat-ai.html`).
3. External cards link directly to the authoritative HTTPS page. Do not create a thin local page solely to bounce visitors externally.
4. External links display publisher context and an external-link cue; opening a new tab is optional, but if used it must include `rel="noopener noreferrer"`.
5. If a legacy first-party detail page remains the best available narrative, its existing route stays canonical even after the item moves to the archive tier.
6. Do not copy external prose or media into the canonical record. Store only original concise metadata and attribution needed to render the archive entry.
7. A project may be referenced on the homepage, Projects page, and detail navigation, but all references are projections from the same content record.

## Content model contract for JCR-114

Extend the existing `projects` collection rather than create competing featured/archive collections. The final names may follow repository conventions, but they must preserve this contract:

```ts
type ProjectTier = "featured" | "archive";
type ArchiveGroup = "professional" | "earlier" | "side";
type DestinationType = "internal" | "external" | "none";

interface ProjectPresentation {
    tier: ProjectTier;
    archiveGroup?: ArchiveGroup;       // required only for archive
    featuredOrder?: number;            // required only for featured
    archiveOrder?: number;             // optional editorial override
    contribution: string;              // public, evidence-backed summary
    year: number;                       // or an explicit yearRange if needed
    destination: DestinationType;
    externalUrl?: string;               // required for external
    externalPublisher?: string;         // required for external
    listingImage?: string;              // licensed/cleared only
    listingImageAlt?: string;
}
```

Validation invariants:

- `featured` requires `featuredOrder`, `destination: internal`, a route, contribution, year, summary, and an eligible first-party case study.
- `featured` forbids `archiveGroup`.
- `archive` requires `archiveGroup`, contribution, year, and destination.
- `external` requires an absolute HTTPS `externalUrl` and `externalPublisher`; it must not require a first-party detail route.
- `internal` requires a unique stable route.
- `none` is forbidden for Featured Work.
- Image alt text is required when an image is present; an image remains optional for archive entries.
- Route and destination uniqueness are checked across the complete collection.
- Presentation order is deterministic and duplicate explicit order values fail validation within their scope.

Replace the overloaded legacy `featured`, `listingOrder`, and `listingHref` behavior through a documented migration. Do not leave two active fields that can disagree about tier or destination. Compatibility fields may exist temporarily during one migration PR, but rendering must read from only one normalized model.

### Sorting

- Featured Work: ascending `featuredOrder`, then route key as a stability fallback.
- Archive groups: group order `professional`, `earlier`, `side`; within each group, explicit `archiveOrder` when present, then year descending, then title ascending.
- Filters change visibility only; they never change canonical order.

## Legacy routes and sources of truth

The canonical source for project metadata and authored project content remains `src/content/projects/*`. Page templates and homepage previews query that collection. Do not create a second JSON/TypeScript list or repeat project copy in Astro pages.

Preserve these existing public routes irrespective of tier changes:

- `/cat-ai.html`
- `/optimice.html`
- `/bankheist.html`
- `/binwatch.html`
- `/pbc.html`
- `/tagit.html`
- `/falseawakening.html`
- `/runvendor.html`

A presentation-tier change must not rename or redirect an existing detail route. If a future route genuinely changes, retain the old path as a static redirect and test both the redirect and canonical metadata. `/projects.html` remains canonical; existing `/portfolio.html` and `/work.html` compatibility behavior remains untouched unless a dedicated migration ticket changes it.

## Responsive and accessible hierarchy

The information hierarchy is semantic before it is visual:

- Use one page-level `h1` and ordered `h2` section headings for Featured Work and Project Archive; archive groups use `h3` when nested.
- Include the tier or group as visible text on cards/entries where context could be lost.
- Preserve the same section order and labels at desktop and mobile widths.
- On mobile, stack content without interleaving archive cards into Featured Work.
- Do not use image size, color, animation, hover, column position, or carousel order as the only category signal.
- Keep all project destinations keyboard reachable with visible focus states.
- External links and case-study links must have distinguishable accessible names.
- Filters, if implemented, use real controls, expose state, and provide a no-JavaScript path to every group.
- Avoid horizontal card carousels as the sole access path; they obscure total count and keyboard/mobile discovery.

## Implementation handoff

### JCR-113 mockup must demonstrate

- Desktop and mobile Projects gateway with explicit Featured Work and Project Archive labels.
- Hapiko/Stickerbox leading Featured Work when publishable and Cat.AI as the second featured anchor.
- Archive group headings in the approved order.
- One concise Professional Work item linking to an authoritative external publisher.
- One text-first entry without a thumbnail.
- Internal versus external link cues.
- The optional archive anchor/separate-route decision without changing the taxonomy.

JCR-113 may refine microcopy and visual treatment. Any proposed change to the labels, tiers, group semantics, canonical ownership rules, or placement matrix requires an explicit amendment to this decision rather than being buried in a mockup.

### JCR-114 implementation must deliver

- Typed tier, group, contribution, year, and destination metadata with the validation invariants above.
- A one-time migration of existing records according to the placement matrix.
- Data-driven Featured Work and archive rendering without route-name conditionals.
- Deterministic grouping/sorting and graceful text-first entries.
- Preservation tests for all legacy routes and compatibility pages.
- Schema tests covering invalid tier/group/destination combinations.
- Rendering/link checks for internal and external destinations.
- Desktop and mobile QA confirming semantic order, visible labels, keyboard access, and no horizontal overflow.
- `npm run verify:ci` passing.

## Editorial review triggers

Review this architecture when any of the following occurs:

- More than five projects qualify for Featured Work.
- An archive group exceeds roughly twelve entries and scanability degrades.
- A project needs both a first-party case study and an authoritative external destination.
- A new work context does not honestly fit professional, earlier, or side.
- User testing shows the approved public labels are misunderstood.

Until one of those triggers is documented, additions follow this decision rather than adding one-off sections or templates.
