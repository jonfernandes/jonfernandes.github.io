# Repository Guidelines

## Project Structure & Module Organization
This repository hosts a static GitHub Pages site with multiple independent subprojects. Keep edits scoped to the relevant folder.
- Root: standalone HTML pages and shared entry files.
- `dot/`, `test-dot/`, `life/`: interactive static apps (`index.html`, `styles.css`, optional `app.py` for local preview).
- `noah/`, `noah3/`, `noah4/`, `noah-v2/`: variant site/app implementations.
- `images/`, `files/`: shared assets and downloadable documents.
- `eurostar/`, `html/`: larger static content collections.

## Build, Test, and Development Commands
Most sections are static and require no build step.
- `python3 -m http.server 8000` (repo root): serve the full site locally.
- `python3 dot/app.py`: run the `dot/` preview server on port 5000.
- `python3 test-dot/app.py`: run the `test-dot/` preview server on port 5000.
- `git status` / `git diff`: review pending changes before commits.
- `cd noah-v2 && npm install && npm test`: install dependencies and run tests for the Node-based subproject.

## Coding Style & Naming Conventions
Use repository conventions to keep pages consistent.
- Indentation: 2 spaces for HTML/CSS/JS, 4 spaces for Python.
- Prefer semantic HTML and small, readable JavaScript functions.
- Use lowercase, kebab-case filenames (for example, `knowledge-base.html`).
- Reuse existing CSS tokens in `:root` before adding new variables.
- Avoid introducing runtime server dependencies for deploy targets.

## Testing Guidelines
There is no global automated suite for most static folders.
- Manually test pages in a local browser on desktop and mobile breakpoints.
- Check developer console for JavaScript errors.
- Verify links, media loading, and interactive behavior after changes.
- If changes touch `noah-v2/`, run its automated tests with `npm test`.

## Commit & Pull Request Guidelines
Use short, imperative commit messages aligned with project history (for example, `Revamp test-dot static page for GitHub Pages path`).
PRs should include:
- A concise summary of changed directories/files.
- The reason for the change.
- Before/after screenshots for UI updates.
- Local verification steps performed.
