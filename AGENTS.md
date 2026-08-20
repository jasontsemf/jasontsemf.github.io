# Repository Guidelines

## Project Structure & Module Organization
This repository is a static portfolio site. Root-level pages (for example `index.html`, `about.html`, `projects.html`) are the main entry points. Shared front-end assets live in `css/`, `js/`, `images/`, `fonts/`, and `download/`.

Project-specific media and documentation are grouped under `project/<project-name>/` (for example `project/optimice/`, `project/tagit/`, `project/runvendor/`). Experimental or standalone mini-sites live in directories like `keyboardranger/`, `ResizeCounter/`, `date/`, and `snap/`.

Treat `backup/` and `ignore/` as archival/reference content unless a task explicitly targets them.

## Build, Test, and Development Commands
No root build pipeline is required for routine edits.

- `python3 -m http.server 8080`
  Starts a local static server from the repo root for manual QA.
- `open http://localhost:8080` (macOS)
  Opens the local site preview.
- `cd cocoen && npm install`
  Installs dependencies for the bundled `cocoen/` library project.
- `cd cocoen && npm run start | npm run build | npm test`
  Runs dev server, production build, or ESLint checks for `cocoen/`.

## Coding Style & Naming Conventions
Match the existing code style in touched files:

- Use 4-space indentation in HTML, CSS, and JavaScript.
- Keep filenames lowercase and descriptive (existing patterns include `snake_case` and kebab-like names).
- Prefer relative asset links so pages work on static hosting.
- Keep page-specific assets close to their project directory when adding new files.

## Testing Guidelines
There is no root automated test suite. Validate changes manually in the browser:

- Confirm layout at desktop and mobile widths.
- Verify navigation links and downloadable files.
- Check browser console for JavaScript errors.

If you modify `cocoen/`, run `cd cocoen && npm test` before submitting.

## Commit & Pull Request Guidelines
Git history favors short, direct commit subjects (for example `reorder side panel items`, `css fix`, `Update style.css`). Follow the same style using imperative phrasing and focused scope.

For pull requests, include:

- What changed and why.
- Affected pages/paths.
- Before/after screenshots or GIFs for visual updates.
- Linked issue/ticket when applicable.

## Agent-Specific Notes
When creating a Linear issue for this repository, assign it to **Jason Tse**.

### Branching and Release Gate
- `main` is production. Do all implementation on `dev` only.
- Do not merge `dev -> main` until the active refactor sequence is complete and verified:
  1. `JCR-44`
  2. `JCR-59`
  3. `JCR-45`
  4. `JCR-58`
- Required release check before any `main` merge: `npm run build:verify` must pass.

### Linear Dependency Hygiene
- Keep Linear `blockedBy` relationships aligned to the intended execution sequence.
- If sequencing intent changes, update blocker links in the same session and note it in comments.

### Linear Communication Expectations
- Keep Linear continuously synced during execution, not only at ticket close.
- Add a Linear progress comment whenever there is:
  - A major implementation milestone is completed.
  - A major bug fix.
  - A discovery that changes scope, ordering, assumptions, or risk.
- Each Linear sync comment must include:
  - What changed.
  - Key files touched.
  - Verification results.
  - Remaining risks/caveats.
- Post a final status sync comment at session end.

### Local Changes Safety
- Never discard unrelated modified or untracked files unless explicitly requested.
- Inspect working tree state before edits and preserve in-progress user work.

### Skill Usage Pragmatism
- Use named skills when explicitly requested or when the task clearly matches the skill scope.
- Do not force heavyweight skill workflows for simple requests.

### Next Session Prompt Template
Use this template for session handoff when continuing the next ticket:

```text
Use the `linear` skill and follow this repo’s `AGENTS.md`.

Context:
- Repo: /Users/jasontse/Documents/GitHub/jasontsemf.github.io
- Branch strategy: `main` is production; do all work on `dev` only.
- Immediate next ticket: <TICKET-ID> (<STATUS>) — <TITLE>
- Do NOT work on <OUT-OF-SCOPE-TICKET> in this session.
- Keep unrelated local changes intact.

Goal (minimal scope/risk):
1) <goal 1>
2) <goal 2>
3) Preserve static output + GitHub Pages compatibility.
4) Keep parity assumptions from prior migration tickets intact.

Execution requirements:
- Inspect current state first, including any partial WIP files.
- Avoid broad refactors; extend schema/types only as needed.
- Run verification: `npm run build:verify`
- Fix any failures.
- Keep Linear continuously synced during execution (not only at ticket close).
- Add Linear sync comments at each major implementation milestone, major bug fix, and discovery that changes scope, ordering, assumptions, or risk.
- Ensure each Linear sync comment includes: what changed, key files touched, verification results, and remaining risks/caveats.
- Post a final status sync comment at session end.
- Return:
  - changed file paths
  - commands run
  - blocker/risk notes
```
