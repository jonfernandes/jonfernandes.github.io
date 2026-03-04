# Private Google Calendar Backend

This backend lets your static site (`jonfernandes.github.io/calendar`) display events from a **private** Google Calendar.

## 1. Create Google Cloud credentials

1. Open Google Cloud Console.
2. Create/select a project.
3. Enable `Google Calendar API`.
4. Go to `IAM & Admin` -> `Service Accounts` -> create a service account.
5. Create a JSON key for that service account and download it.

## 2. Share your calendar with the service account

1. Open Google Calendar settings for your private calendar.
2. Under `Share with specific people or groups`, add the service account email (looks like `name@project.iam.gserviceaccount.com`).
3. Give `See all event details` permission.

## 3. Deploy this backend

You can deploy on Render, Railway, Fly.io, or any Node host.

Environment variables required:

- `GOOGLE_CLIENT_EMAIL`: service account `client_email`
- `GOOGLE_PRIVATE_KEY`: service account `private_key` (keep line breaks as `\\n`)
- `GOOGLE_CALENDAR_ID`: your calendar ID from Google Calendar settings
- `ALLOWED_ORIGIN`: `https://jonfernandes.github.io`
- `PORT`: optional (platform usually sets this)

## 4. Local test

From `backend/`:

```bash
npm install
npm start
```

Then test:

- `http://localhost:8080/health`
- `http://localhost:8080/events`

## 5. Connect frontend

In `/calendar/app.js`, set:

```js
const BACKEND_EVENTS_URL = "https://your-backend-domain/events";
```

Then publish your GitHub Pages changes.
