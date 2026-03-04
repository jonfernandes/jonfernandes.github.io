const state = {
  weekStartKey: startOfWeekKey(istDateKey(new Date())),
  calendarEvents: [],
  stravaActivities: [],
};

const IST_TIMEZONE = "Asia/Kolkata";

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
  const day = dayOfWeekFromKey(key);
  return addDaysKey(key, 1 - day);
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

function formatTime(date, fallbackAllDay = false) {
  if (!date) return fallbackAllDay ? "All day" : "—";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: IST_TIMEZONE,
  });
}

function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

function formatDistance(meters) {
  const km = meters / 1000;
  if (km < 1) return `${Math.round(meters)} m`;
  return `${km.toFixed(km >= 10 ? 1 : 2)} km`;
}

function formatKeyRange(startKey, endKey) {
  const startDate = keyToUtcDate(startKey);
  const endDate = keyToUtcDate(endKey);
  const formatOptions = { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" };
  return `${startDate.toLocaleDateString([], formatOptions)} - ${endDate.toLocaleDateString([], formatOptions)}`;
}

function formatWeekdayFromKey(key) {
  return keyToUtcDate(key).toLocaleDateString([], { weekday: "short", timeZone: "UTC" });
}

function formatMonthDayFromKey(key) {
  return keyToUtcDate(key).toLocaleDateString([], { month: "short", day: "numeric", timeZone: "UTC" });
}

function keyFromDateValue(value) {
  if (!value) return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const parsed = parseDateInput(value);
  return parsed ? istDateKey(parsed) : null;
}

async function fetchJsonWithFallback(paths) {
  for (const path of paths) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) continue;
      return await response.json();
    } catch (_error) {
      // Try next path.
    }
  }
  return null;
}

async function loadData() {
  elements.status.textContent = "Loading data...";

  const [calendarData, stravaData] = await Promise.all([
    fetchJsonWithFallback(["/calendar/events.json", "../calendar/events.json"]),
    fetchJsonWithFallback(["/strava/activities.json", "../strava/activities.json"]),
  ]);

  state.calendarEvents = Array.isArray(calendarData?.events) ? calendarData.events : [];
  state.stravaActivities = Array.isArray(stravaData?.activities) ? stravaData.activities : [];

  const bits = [];
  bits.push(`Calendar: ${state.calendarEvents.length} items`);
  bits.push(`Strava: ${state.stravaActivities.length} activities`);
  elements.status.textContent = bits.join(" | ");

  renderWeek();
}

function eventOccursOnDate(event, dayKey) {
  const startKey = keyFromDateValue(event.start);
  if (!startKey) return false;

  let endInclusiveKey = startKey;
  if (event.end) {
    if (typeof event.end === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.end)) {
      endInclusiveKey = addDaysKey(event.end, -1);
    } else {
      const endDate = parseDateInput(event.end);
      endInclusiveKey = endDate ? istDateKey(new Date(endDate.getTime() - 1)) : startKey;
    }
  }

  return dayKey >= startKey && dayKey <= endInclusiveKey;
}

function calendarForDay(dayKey) {
  return state.calendarEvents
    .filter((event) => eventOccursOnDate(event, dayKey))
    .sort((a, b) => {
      const aTime = parseDateInput(a.start)?.getTime() || 0;
      const bTime = parseDateInput(b.start)?.getTime() || 0;
      return aTime - bTime;
    });
}

function stravaForDay(dayKey) {
  return state.stravaActivities
    .filter((activity) => {
      const key = keyFromDateValue(activity.start_date_local || activity.start_date || activity.date);
      return key && key === dayKey;
    })
    .sort((a, b) => {
      const aTime = parseDateInput(a.start_date_local || a.start_date || a.date)?.getTime() || 0;
      const bTime = parseDateInput(b.start_date_local || b.start_date || b.date)?.getTime() || 0;
      return aTime - bTime;
    });
}

function renderWeek() {
  const startKey = startOfWeekKey(state.weekStartKey);
  const endKey = addDaysKey(startKey, 6);

  elements.weekLabel.textContent = `${formatKeyRange(startKey, endKey)} (IST)`;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 7; i += 1) {
    const dayKey = addDaysKey(startKey, i);
    fragment.appendChild(renderDayRow(dayKey));
  }

  elements.weekGrid.innerHTML = "";
  elements.weekGrid.appendChild(fragment);
}

function renderDayRow(dayKey) {
  const row = document.createElement("article");
  row.className = "day-row";

  const dayCell = document.createElement("div");
  dayCell.className = "day-cell";
  const todayKey = istDateKey(new Date());
  if (todayKey === dayKey) {
    dayCell.classList.add("today");
  }

  dayCell.innerHTML = `
    <div class="day-name">${formatWeekdayFromKey(dayKey)}</div>
    <div class="day-date">${formatMonthDayFromKey(dayKey)}</div>
  `;

  const calendarCell = document.createElement("div");
  calendarCell.className = "col-cell";
  calendarCell.appendChild(renderCalendarList(calendarForDay(dayKey)));

  const stravaCell = document.createElement("div");
  stravaCell.className = "col-cell";
  stravaCell.appendChild(renderStravaList(stravaForDay(dayKey)));

  row.append(dayCell, calendarCell, stravaCell);
  return row;
}

function renderCalendarList(events) {
  const list = document.createElement("div");
  list.className = "list";

  if (!events.length) {
    list.innerHTML = '<div class="empty">No planned activities</div>';
    return list;
  }

  events.forEach((event) => {
    const item = document.createElement("div");
    item.className = "item calendar";

    const start = parseDateInput(event.start);
    const end = parseDateInput(event.end);
    const isAllDay = !!event.start && !event.start.includes("T");

    item.innerHTML = `
      <p class="item-title">${escapeHtml(event.summary || "(No title)")}</p>
      <div class="item-meta">${isAllDay ? "All day" : `${formatTime(start)} - ${formatTime(end)}`}${
      event.location ? ` | ${escapeHtml(event.location)}` : ""
    }</div>
    `;

    list.appendChild(item);
  });

  return list;
}

function renderStravaList(activities) {
  const list = document.createElement("div");
  list.className = "list";

  if (!activities.length) {
    list.innerHTML = '<div class="empty">No completed activities</div>';
    return list;
  }

  activities.forEach((activity) => {
    const item = document.createElement("div");
    item.className = "item strava";

    const start = parseDateInput(activity.start_date_local || activity.start_date || activity.date);
    const name = activity.name || "Untitled";
    const type = activity.type || activity.sport_type || "Workout";
    const distance = Number(activity.distance || 0);
    const moving = Number(activity.moving_time || 0);

    item.innerHTML = `
      <p class="item-title">${escapeHtml(name)} <span class="item-type">(${escapeHtml(type)})</span></p>
      <div class="item-meta">${formatTime(start)} | ${formatDistance(distance)} | ${formatDuration(moving)}</div>
    `;

    list.appendChild(item);
  });

  return list;
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

bindControls();
loadData();
