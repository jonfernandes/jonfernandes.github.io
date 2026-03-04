const CALENDAR_ID = "jonfernandes@gmail.com";
const MAX_EVENTS = 20;

const statusEl = document.getElementById("status");
const eventsEl = document.getElementById("events");
const refreshBtn = document.getElementById("refresh-btn");

function calendarIcsUrl(calendarId) {
  const encoded = encodeURIComponent(calendarId);
  return `https://calendar.google.com/calendar/ical/${encoded}/public/basic.ics`;
}

function formatDateRange(start, end) {
  const dateFmt = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateFmt.format(start)} to ${dateFmt.format(end)}`;
}

function parseIcsDate(raw) {
  const value = raw.replace(/^DTSTART[^:]*:/, "").replace(/^DTEND[^:]*:/, "").trim();

  if (/^\d{8}T\d{6}Z$/.test(value)) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    const h = value.slice(9, 11);
    const min = value.slice(11, 13);
    const s = value.slice(13, 15);
    return new Date(`${y}-${m}-${d}T${h}:${min}:${s}Z`);
  }

  if (/^\d{8}$/.test(value)) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return new Date(`${y}-${m}-${d}T00:00:00`);
  }

  return null;
}

function parseIcsEvents(icsText) {
  const lines = icsText.replace(/\r/g, "").split("\n");
  const events = [];
  let current = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = { summary: "(No title)", start: null, end: null };
      continue;
    }

    if (line === "END:VEVENT" && current) {
      if (current.start && current.end) {
        events.push(current);
      }
      current = null;
      continue;
    }

    if (!current) continue;

    if (line.startsWith("SUMMARY:")) {
      current.summary = line.slice(8).trim() || "(No title)";
    } else if (line.startsWith("DTSTART")) {
      current.start = parseIcsDate(line);
    } else if (line.startsWith("DTEND")) {
      current.end = parseIcsDate(line);
    }
  }

  const now = new Date();
  return events
    .filter((event) => event.end >= now)
    .sort((a, b) => a.start - b.start)
    .slice(0, MAX_EVENTS);
}

function renderEvents(events) {
  eventsEl.innerHTML = "";

  if (!events.length) {
    statusEl.textContent = "No upcoming events found.";
    return;
  }

  statusEl.textContent = `${events.length} upcoming event${events.length === 1 ? "" : "s"}.`;

  for (const event of events) {
    const li = document.createElement("li");
    li.className = "event";

    const title = document.createElement("div");
    title.className = "event-title";
    title.textContent = event.summary;

    const time = document.createElement("div");
    time.className = "event-time";
    time.textContent = formatDateRange(event.start, event.end);

    li.append(title, time);
    eventsEl.appendChild(li);
  }
}

async function fetchIcsWithFallback(icsUrl) {
  const rawProxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(icsUrl)}`;
  const jsonProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(icsUrl)}`;
  const corsProxy = `https://cors.isomorphic-git.org/${icsUrl}`;

  const attempts = [
    {
      name: "allorigins-raw",
      run: async () => {
        const response = await fetch(rawProxy, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      },
    },
    {
      name: "allorigins-get",
      run: async () => {
        const response = await fetch(jsonProxy, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        return payload.contents || "";
      },
    },
    {
      name: "cors-isomorphic-git",
      run: async () => {
        const response = await fetch(corsProxy, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      },
    },
  ];

  const errors = [];

  for (const attempt of attempts) {
    try {
      const text = await attempt.run();
      if (text.includes("BEGIN:VCALENDAR")) return text;
      errors.push(`${attempt.name}: invalid feed response`);
    } catch (err) {
      errors.push(`${attempt.name}: ${err.message}`);
    }
  }

  throw new Error(errors.join(" | "));
}

async function loadEvents() {
  statusEl.textContent = "Loading calendar events...";
  eventsEl.innerHTML = "";

  try {
    const icsText = await fetchIcsWithFallback(calendarIcsUrl(CALENDAR_ID));
    const events = parseIcsEvents(icsText);
    renderEvents(events);
  } catch (err) {
    statusEl.textContent = "Could not load Google Calendar feed.";
    const help = document.createElement("li");
    help.className = "event";
    help.innerHTML =
      'Confirm calendar is public in Google Calendar settings. Current ID: <code>' +
      CALENDAR_ID +
      "</code>.";
    eventsEl.appendChild(help);
    console.error("Calendar fetch failed:", err);
  }
}

refreshBtn.addEventListener("click", loadEvents);
loadEvents();
