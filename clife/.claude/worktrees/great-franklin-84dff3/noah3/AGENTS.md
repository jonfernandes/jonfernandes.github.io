# Repository Guidelines

## Project Structure & Module Organization
This project is a small static web app under `noah3/`.
- `index.html`: page structure and UI screens.
- `styles.css`: layout, theme, responsive behavior.
- `app.js`: quiz logic, scoring, and learning-mode flow.
- `JF-color-icon.jpg`, `JF-bw-square.png`: image assets used by the UI.

Keep new code in these files unless a feature clearly needs a new module (for example, `question-bank.js`). Place additional images in `noah3/` and reference them with relative paths.

## Build, Test, and Development Commands
No build pipeline is required; this is plain HTML/CSS/JS.
- `python3 -m http.server 8000` (from `noah3/`): run locally at `http://localhost:8000`.
- `node --check app.js`: quick JavaScript syntax validation.
- `git -C .. status --short noah3`: inspect changes limited to this app folder.

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML/CSS/JS to match existing files.
- Prefer descriptive camelCase for JavaScript variables/functions (for example, `startLearningMode`).
- Use kebab-case for CSS classes and IDs only when already established (for example, `screen-summary`, `quit-btn`).
- Keep UI text child-friendly and concise.
- Avoid adding dependencies unless there is a clear need.

## Testing Guidelines
There is no automated test suite yet.
- Run `node --check app.js` before each commit.
- Manually verify key flows in browser:
  1. 10-question assessment runs end-to-end.
  2. Weak-topic summary appears.
  3. Learning mode caps at 10 questions.
  4. `Quit` returns to home from any active screen.

## Commit & Pull Request Guidelines
Recent history uses short, imperative commit messages (for example, `Add quit button across quiz flow`). Follow that pattern.

For pull requests:
- Summarize user-visible changes.
- List files touched (for example, `noah3/app.js`, `noah3/styles.css`).
- Include screenshots/GIFs for UI updates.
- Note manual test steps performed.

## Security & Configuration Tips
Do not commit secrets or API keys. Keep the app fully client-side unless backend work is explicitly planned.
