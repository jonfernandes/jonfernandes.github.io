const EVENTS_JSON_URL = "./events.json";

const statusEl = document.getElementById("status");
const eventsEl = document.getElementById("events");
const refreshBtn = document.getElementById("refresh-btn");

function parseEventDate(value) {
  if (!value) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }

  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
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
    title.textContent = event.summary || "(No title)";

    const time = document.createElement("div");
    time.className = "event-time";
    const start = parseEventDate(event.start);
    const end = parseEventDate(event.end);
    time.textContent =
      start && end ? formatDateRange(start, end) : "Time unavailable";

    li.append(title, time);
    eventsEl.appendChild(li);
  }
}

async function loadEvents() {
  statusEl.textContent = "Loading calendar events...";
  eventsEl.innerHTML = "";

  try {
    const response = await fetch(EVENTS_JSON_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const data = await response.json();
    const events = Array.isArray(data.events) ? data.events : [];
    renderEvents(events);
  } catch (err) {
    statusEl.textContent = "Could not load events.";
    const help = document.createElement("li");
    help.className = "event";
    help.textContent = "Check that events.json exists and is valid JSON.";
    eventsEl.appendChild(help);
    console.error(err);
  }
}

refreshBtn.addEventListener("click", loadEvents);
loadEvents();
