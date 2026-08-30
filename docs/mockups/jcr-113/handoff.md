# JCR-113 Project Archive mockup handoff

## Recommendation

Use a two-tier public information architecture:

1. **Featured Work** on the main Projects page for current, career-facing case studies with enough evidence and narrative depth.
2. **Project Archive** as the secondary destination for concise professional projects, historical work, and self-directed projects.

Approved public labels proposed by this mockup:

- **Featured Work**: the curated primary tier.
- **Project Archive**: the secondary destination and route label.
- **Client Work**: concise professional work whose authoritative story lives elsewhere.
- **Earlier Work**: historical portfolio items. This is clearer and less dismissive than “Old Projects.”
- **Side Projects**: self-directed and experimental work. This is more familiar than “Personal Work,” which can imply private material.

The archive introduction should explain that category and placement indicate narrative depth and career relevance, not project quality.

## Variants and views covered

The responsive prototype in [`index.htm`](index.htm) compares two label and layout directions:

- **A · Project Archive (recommended):** explicit archive naming, grouped sections, and the clearest explanation of why projects sit in the secondary tier.
- **B · More Projects:** a warmer title and denser visual grid. It is easier to browse but less precise, and “Personal” is more ambiguous than “Side Projects.”

Each variant contains three linked views:

1. **Main Projects entry point**: large Featured Work cards followed by a deliberately quieter Project Archive callout.
2. **Archive index**: accessible category filters and compact, scan-friendly entries.
3. **Concise external-project entry**: a short context statement, explicit contribution, metadata, optional licensed image, and prominent outbound source link.

The same semantic structure reflows at desktop and mobile widths. Filters remain buttons with visible focus states and pressed-state semantics. Mobile cards become single-column without horizontal overflow.

## Hierarchy and Cat.AI

- Featured case studies get the largest imagery, full narrative pages, and first position on Projects.
- Concise professional entries live in **Client Work** and state Jason’s contribution explicitly.
- Historical case studies move to **Earlier Work** when they no longer support the lead career narrative.
- Experiments and self-directed work live in **Side Projects**.
- **Cat.AI remains Featured Work in the mockup.** If stronger anchor case studies later displace it, the archive schema can accommodate it as Client Work without requiring that move now or duplicating its narrative across both tiers.

## Minimum concise-entry contract

Every archive record must include:

| Field | Requirement |
| --- | --- |
| Title | Required, public project or product name |
| Short context | Required, one or two sentences; identify the product/client setting without unsupported claims |
| Jason’s contribution | Required, concrete and bounded |
| Year | Required; use a range only when verified |
| Category | Required: Client Work, Earlier Work, or Side Projects |
| Thumbnail | Optional; render only with a verified reuse basis and useful alt text |
| Authoritative external URL | Required for external projects; owner/client source preferred |

A concise entry should not gain bespoke long-form sections, carousels, process chronology, or duplicated client marketing copy. Existing full case-study routes can remain reachable while their archive cards are introduced, preserving legacy links.

## Implementation decisions still needed

1. Confirm the final inventory and category assignment for each existing project.
2. Verify each external URL, public claim, year, and image-reuse basis before publication.
3. Choose the archive route. Recommended canonical route: `/archive.html`; preserve existing project routes and add redirects only when a route is intentionally retired.
4. Decide whether filters update the URL/query string. Recommended: progressive enhancement with all entries present in HTML and optional `?category=` state.
5. Confirm whether concise entries use one shared detail template or outbound-only cards. Recommended: shared concise template when contribution/context needs explanation; direct outbound links only when the external page already credits Jason clearly.
6. Define Cat.AI’s future placement only if it leaves Featured Work; Client Work is the recommended archive category, and no move is required by this design.
7. Replace all illustrative placeholder content before implementation. The mockup must never be published as production content.

## Accessibility and responsive requirements

- Preserve a logical heading order and keyboard-accessible links/filters.
- Never rely on thumbnail color or category alone to communicate hierarchy.
- Keep touch targets at least 42–48 CSS pixels high.
- Omit image containers when no licensed image exists rather than showing a decorative placeholder.
- Announce filter results or retain an `aria-live` results region.
- Test at 390px and 1440px, with reduced motion and 200% browser zoom.
- Keep every legacy project URL valid until an explicit route migration provides a tested redirect.

## Out of scope honored

This artifact does not implement production pages or data models and does not add the three Tomorrow Lab projects. Generic placeholder cards are explicitly illustrative.
