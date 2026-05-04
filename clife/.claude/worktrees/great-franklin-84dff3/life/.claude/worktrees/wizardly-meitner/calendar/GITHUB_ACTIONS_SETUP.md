# GitHub Pages Private Calendar Setup

This setup keeps your Google Calendar private while showing events on `jonfernandes.github.io/calendar`.

## 1. Google Cloud

1. Open Google Cloud Console and create/select a project.
2. Enable `Google Calendar API`.
3. Create a service account.
4. Create and download a JSON key for that service account.

## 2. Share private calendar with service account

1. In Google Calendar, open calendar settings for the calendar you want to display.
2. Under `Share with specific people or groups`, add the service account email (`...iam.gserviceaccount.com`).
3. Grant `See all event details`.

## 3. Add GitHub repository secrets

In GitHub repo -> `Settings` -> `Secrets and variables` -> `Actions`, add:

- `GOOGLE_CLIENT_EMAIL`: `client_email` from service account JSON
- `GOOGLE_PRIVATE_KEY`: `private_key` from service account JSON (keep literal `\\n` newlines)
- `GOOGLE_CALENDAR_ID`: your calendar ID from Google Calendar settings
- `CALENDAR_MAX_EVENTS`: optional, e.g. `20`

## 4. Run workflow

1. Go to `Actions` tab.
2. Open `Sync Private Calendar` workflow.
3. Click `Run workflow` once.
4. Confirm `events.json` gets updated.

After this, it auto-syncs every 30 minutes.
