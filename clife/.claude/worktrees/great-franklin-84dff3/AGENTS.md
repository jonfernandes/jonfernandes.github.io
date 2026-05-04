# Repository Guidelines

## Project Structure & Module Organization
This repository is a static GitHub Pages site with multiple subprojects.
- Root: standalone HTML pages and media files (for direct publishing).
- `dot/`, `test-dot/`, `life/`: interactive static apps (`index.html`, `styles.css`, optional `app.py` for local preview only).
- `noah/`, `noah3/`, `noah4/`, `noah-v2/`: additional site/app variants.
- `images/`, `files/`: shared assets and documents.
- `eurostar/`, `html/`: large static content collections.

Keep changes scoped to the target folder; avoid broad edits across unrelated site areas.

## Build, Test, and Development Commands
No global build pipeline is required for static pages.
- `python3 -m http.server 8000` (run from repo root): serves the site locally.
- `python3 dot/app.py`: serves the `dot/` project on port 5000.
- `python3 test-dot/app.py`: serves the `test-dot/` project on port 5000.
- `git status` / `git diff`: review local changes before commit.

If working in `noah-v2/` (Node-based), run commands from that directory:
- `npm install`
- `npm test`

## Coding Style & Naming Conventions
- Use 2 spaces in HTML/CSS/JS; 4 spaces in Python.
- Prefer semantic HTML and small, readable JS functions.
- Use kebab-case for filenames (e.g., `knowledge-base.html`) and lowercase asset paths.
- Keep CSS variables in `:root` and reuse existing color/token patterns before adding new ones.
- Do not introduce Flask/runtime dependencies for Pages deploy targets.

## Testing Guidelines
There is no unified test suite for most static sections.
- Manually verify pages in browser at local URLs.
- Check console for JS errors and confirm responsive behavior (mobile + desktop).
- For `noah-v2/`, use its automated tests (`npm test`) when files in that project change.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit messages, e.g.:
- `Convert /dot from Flask to static HTML/CSS/JS UI`
- `Revamp test-dot static page for GitHub Pages path`

PRs should include:
- Clear summary of changed directories/files.
- Why the change was needed.
- Before/after screenshots for UI updates.
- Any local verification steps performed.
