# ai-technical-solutions-research
A lightweight public portal for AI white papers published by the AI Technical Solutions team, AI Adoption Branch, CSBC Ministry.

## Build and page structure

This site uses a lightweight static build flow for multi-page publishing:

- `docs/_partials/` shared layout pieces (`header.html`, `footer.html`)
- `docs/_pages/` page source files with metadata comments
- `docs/styles.css`, `docs/app.js`, `docs/assets/` static source files
- `docs/build.sh` compiles and writes full HTML pages into `build/`

### Build command

```bash
bash build.sh
```

### Page metadata

At the top of each `docs/_pages/*.html` file:

```html
<!-- TITLE: Page Title -->
<!-- DESCRIPTION: Meta description -->
<!-- NAV: index|compute|publications -->
```

## GitHub Pages deployment

This repo includes a GitHub Actions workflow at `.github/workflows/pages.yml` that:

1. runs `bash build.sh`
2. uploads the generated `build/` folder
3. deploys to GitHub Pages

Repository setting to enable:

- `Settings` -> `Pages` -> `Source` -> select `GitHub Actions`

## Commit Message Enforcement (Git Hook)

This repo uses a local Git `commit-msg` hook to enforce:

- `type(scope): summary` title format
- required body fields: `What:`, `Scope:`, `Why:`
- required classification: `Change-Type: white-paper|doc-update|site-update|build-update`

Install once per clone:

```bash
bash scripts/setup-git-hooks.sh
```
