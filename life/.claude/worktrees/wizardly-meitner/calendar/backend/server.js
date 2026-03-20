import express from "express";
import cors from "cors";
import { google } from "googleapis";

const app = express();
const port = process.env.PORT || 8080;

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(
  cors({
    origin: allowedOrigin === "*" ? true : allowedOrigin,
  })
);

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function privateKeyFromEnv() {
  return required("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
}

function authClient() {
  return new google.auth.JWT({
    email: required("GOOGLE_CLIENT_EMAIL"),
    key: privateKeyFromEnv(),
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "calendar-private-backend" });
});

app.get("/events", async (req, res) => {
  try {
    const maxResults = Math.min(Number(req.query.max || 20), 50);
    const calendar = google.calendar({ version: "v3", auth: authClient() });

    const response = await calendar.events.list({
      calendarId: required("GOOGLE_CALENDAR_ID"),
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults,
    });

    const events = (response.data.items || []).map((item) => ({
      id: item.id,
      summary: item.summary || "(No title)",
      start: item.start?.dateTime || item.start?.date,
      end: item.end?.dateTime || item.end?.date,
      location: item.location || "",
    }));

    res.json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to read calendar events.",
      detail: error?.message || "Unknown error",
    });
  }
});

app.listen(port, () => {
  console.log(`Calendar backend listening on port ${port}`);
});
