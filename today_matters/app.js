const IST_TIMEZONE = "Asia/Kolkata";
const CALENDAR_ID = "jonfernandes@gmail.com";

const state = {
  weekStartKey: startOfWeekKey(istDateKey(new Date())),
  stravaActivities: [],
};

const elements = {
  weekGrid: document.getElementById("weekGrid"),
  weekLabel: document.getElementById("weekLabel"),
  status: document.getElementById("status"),
  prevWeek: document.getElementById("prevWeek"),
  nextWeek: document.getElementById("nextWeek"),
  thisWeek: document.getElementById("thisWeek"),
  calendarFrame: document.getElementById("calendarFrame"),
  openGoogle: document.getElementById("openGoogle"),
};

function keyToUtcDate(key) {
  return new Date(`${key}T00:00:00Z`);
}

function addDaysKey(key, days) {
  const d = keyToUtcDate(key);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function dayOfWeekFromKey(key) {
  const day = keyToUtcDate(key).getUTCDay();
  return day === 0 ? 7 : day;
}

function startOfWeekKey(key) {
  return addDaysKey(key, 1 - dayOfWeekFromKey(key));
}

function istDateKey(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTimeIst(date) {
  if (!date) return "—";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IST_TIMEZONE,
  });
}

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return hrs ? `${hrs}h ${mins}m` : `${mins}m`;
}

function formatDistanceKm(meters) {
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)} m` : `${km.toFixed(km >= 10 ? 1 : 2)} km`;
}

function toGoogleDate(key) {
  return key.replaceAll("-", "");
}

function formatKeyRange(startKey, endKey) {
  const opts = { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" };
  return `${keyToUtcDate(startKey).toLocaleDateString([], opts)} - ${keyToUtcDate(endKey).toLocaleDateString([], opts)}`;
}

function buildCalendarEmbedUrl(startKey, endKey) {
  const params = new URLSearchParams({
    src: CALENDAR_ID,
    ctz: IST_TIMEZONE,
    mode: "WEEK",
    showTitle: "0",
    showPrint: "0",
    showCalendars: "0",
    showTabs: "0",
    showNav: "1",
    dates: `${toGoogleDate(startKey)}/${toGoogleDate(endKey)}`,
  });
  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

function buildOpenCalendarUrl(startKey, endKey) {
  const params = new URLSearchParams({
    ctz: IST_TIMEZONE,
    mode: "WEEK",
    dates: `${toGoogleDate(startKey)}/${toGoogleDate(endKey)}`,
  });
  return `https://calendar.google.com/calendar/u/0/r?${params.toString()}`;
}

async function fetchStrava() {
  const paths = ["/strava/activities.json", "../strava/activities.json"];
  for (const path of paths) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(path, { cache: "no-store", signal: controller.signal });
      if (!response.ok) continue;
      const data = await response.json();
      return Array.isArray(data?.activities) ? data.activities : [];
    } catch (_e) {
      // try next
    } finally {
      clearTimeout(timeoutId);
    }
  }
  return [];
}

function stravaForDay(dayKey) {
  return state.stravaActivities
    .filter((activity) => {
      const dt = parseDateInput(activity.start_date_local || activity.start_date || activity.date);
      return dt && istDateKey(dt) === dayKey;
    })
    .sort((a, b) => {
      const aTime = parseDateInput(a.start_date_local || a.start_date || a.date)?.getTime() || 0;
      const bTime = parseDateInput(b.start_date_local || b.start_date || b.date)?.getTime() || 0;
      return aTime - bTime;
    });
}

function renderStravaWeek() {
  const startKey = startOfWeekKey(state.weekStartKey);
  const endKey = addDaysKey(startKey, 6);

  elements.weekLabel.textContent = `${formatKeyRange(startKey, endKey)} (IST)`;
  elements.calendarFrame.src = buildCalendarEmbedUrl(startKey, endKey);
  elements.openGoogle.href = buildOpenCalendarUrl(startKey, endKey);

  const frag = document.createDocumentFragment();
  for (let i = 0; i < 7; i += 1) {
    const dayKey = addDaysKey(startKey, i);
    const card = document.createElement("article");
    card.className = "day-card";

    const dayLabel = keyToUtcDate(dayKey).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
    const items = stravaForDay(dayKey);

    const list = document.createElement("div");
    list.className = "list";

    if (!items.length) {
      list.innerHTML = '<div class="empty">No completed activities</div>';
    } else {
      items.forEach((activity) => {
        const row = document.createElement("div");
        row.className = "item";
        const start = parseDateInput(activity.start_date_local || activity.start_date || activity.date);
        const name = activity.name || "Untitled";
        const type = activity.type || activity.sport_type || "Workout";
        const distance = Number(activity.distance || 0);
        const moving = Number(activity.moving_time || 0);

        row.innerHTML = `
          <p class="item-title">${escapeHtml(name)} (${escapeHtml(type)})</p>
          <div class="item-meta">${formatTimeIst(start)} IST | ${formatDistanceKm(distance)} | ${formatDuration(moving)}</div>
        `;
        list.appendChild(row);
      });
    }

    card.innerHTML = `<div class="day-name">${dayLabel}</div>`;
    card.appendChild(list);
    frag.appendChild(card);
  }

  elements.weekGrid.innerHTML = "";
  elements.weekGrid.appendChild(frag);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function bindControls() {
  elements.prevWeek.addEventListener("click", () => {
    state.weekStartKey = addDaysKey(state.weekStartKey, -7);
    renderStravaWeek();
  });

  elements.nextWeek.addEventListener("click", () => {
    state.weekStartKey = addDaysKey(state.weekStartKey, 7);
    renderStravaWeek();
  });

  elements.thisWeek.addEventListener("click", () => {
    state.weekStartKey = startOfWeekKey(istDateKey(new Date()));
    renderStravaWeek();
  });
}

async function init() {
  bindControls();
  elements.status.textContent = "Loading Strava data...";
  state.stravaActivities = await fetchStrava();
  elements.status.textContent = `Strava: ${state.stravaActivities.length} activities loaded`; 
  renderStravaWeek();
}

init();
