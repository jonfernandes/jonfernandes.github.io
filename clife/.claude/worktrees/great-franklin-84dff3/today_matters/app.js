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

function activityDate(activity) {
  // Prefer UTC source timestamp from Strava, then render in IST.
  return parseDateInput(activity.start_date) || parseDateInput(activity.start_date_local) || parseDateInput(activity.date);
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

function formatWeekLabel(startKey, endKey) {
  const opts = { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" };
  return `${keyToUtcDate(startKey).toLocaleDateString([], opts)} - ${keyToUtcDate(endKey).toLocaleDateString([], opts)} (IST)`;
}

function buildCalendarDayEmbedUrl(dayKey) {
  const nextDayKey = addDaysKey(dayKey, 1);
  const params = new URLSearchParams({
    src: CALENDAR_ID,
    ctz: IST_TIMEZONE,
    mode: "AGENDA",
    showTitle: "0",
    showPrint: "0",
    showCalendars: "0",
    showTabs: "0",
    showNav: "0",
    dates: `${toGoogleDate(dayKey)}/${toGoogleDate(nextDayKey)}`,
  });
  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
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
    } finally {
      clearTimeout(timeoutId);
    }
  }
  return [];
}

function stravaForDay(dayKey) {
  return state.stravaActivities
    .filter((activity) => {
      const dt = activityDate(activity);
      return dt && istDateKey(dt) === dayKey;
    })
    .sort((a, b) => {
      const aTime = activityDate(a)?.getTime() || 0;
      const bTime = activityDate(b)?.getTime() || 0;
      return aTime - bTime;
    });
}

function renderWeek() {
  const startKey = startOfWeekKey(state.weekStartKey);
  const endKey = addDaysKey(startKey, 6);
  elements.weekLabel.textContent = formatWeekLabel(startKey, endKey);

  const todayKey = istDateKey(new Date());
  const frag = document.createDocumentFragment();

  for (let i = 0; i < 7; i += 1) {
    const dayKey = addDaysKey(startKey, i);
    const dayDate = keyToUtcDate(dayKey);

    const row = document.createElement("article");
    row.className = "day-row";

    const dayCell = document.createElement("div");
    dayCell.className = "day-cell";
    if (dayKey === todayKey) dayCell.classList.add("today");
    dayCell.innerHTML = `
      <div class="day-name">${dayDate.toLocaleDateString([], { weekday: "short", timeZone: "UTC" })}</div>
      <div class="day-date">${dayDate.toLocaleDateString([], { month: "short", day: "numeric", timeZone: "UTC" })}</div>
    `;

    const calCell = document.createElement("div");
    calCell.className = "cal-cell";
    const frame = document.createElement("iframe");
    frame.className = "cal-frame";
    frame.loading = "lazy";
    frame.title = `Google Calendar ${dayKey}`;
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.src = buildCalendarDayEmbedUrl(dayKey);
    calCell.appendChild(frame);

    const stravaCell = document.createElement("div");
    stravaCell.className = "strava-cell";
    const list = document.createElement("div");
    list.className = "list";

    const items = stravaForDay(dayKey);
    if (!items.length) {
      list.innerHTML = '<div class="empty">No completed activities</div>';
    } else {
      items.forEach((activity) => {
        const start = activityDate(activity);
        const name = activity.name || "Untitled";
        const type = activity.type || activity.sport_type || "Workout";
        const distance = Number(activity.distance || 0);
        const moving = Number(activity.moving_time || 0);

        const item = document.createElement("div");
        item.className = "item";
        item.innerHTML = `
          <p class="item-title">${escapeHtml(name)} (${escapeHtml(type)})</p>
          <div class="item-meta">${formatTimeIst(start)} IST | ${formatDistanceKm(distance)} | ${formatDuration(moving)}</div>
        `;
        list.appendChild(item);
      });
    }

    stravaCell.appendChild(list);
    row.append(dayCell, calCell, stravaCell);
    frag.appendChild(row);
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
    renderWeek();
  });

  elements.nextWeek.addEventListener("click", () => {
    state.weekStartKey = addDaysKey(state.weekStartKey, 7);
    renderWeek();
  });

  elements.thisWeek.addEventListener("click", () => {
    state.weekStartKey = startOfWeekKey(istDateKey(new Date()));
    renderWeek();
  });
}

async function init() {
  bindControls();
  state.stravaActivities = await fetchStrava();
  elements.status.textContent = `Strava loaded: ${state.stravaActivities.length} activities`; 
  renderWeek();
}

init();
