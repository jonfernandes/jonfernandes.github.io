import fs from "node:fs/promises";
import path from "node:path";
import { google } from "googleapis";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parseMaxEvents() {
  const max = Number(process.env.CALENDAR_MAX_EVENTS || "20");
  if (Number.isNaN(max) || max < 1) return 20;
  return Math.min(max, 100);
}

function authClient() {
  return new google.auth.JWT({
    email: required("GOOGLE_CLIENT_EMAIL"),
    key: required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
}

async function run() {
  const calendarApi = google.calendar({ version: "v3", auth: authClient() });
  const now = new Date().toISOString();

  const response = await calendarApi.events.list({
    calendarId: required("GOOGLE_CALENDAR_ID"),
    timeMin: now,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: parseMaxEvents(),
  });

  const events = (response.data.items || []).map((item) => ({
    id: item.id,
    summary: item.summary || "(No title)",
    start: item.start?.dateTime || item.start?.date || "",
    end: item.end?.dateTime || item.end?.date || "",
    location: item.location || "",
    updated: item.updated || "",
  }));

  const payload = {
    updatedAt: new Date().toISOString(),
    source: "google-calendar-private-sync",
    events,
  };

  const outputPath = path.resolve(process.cwd(), "events.json");
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${events.length} events to ${outputPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
