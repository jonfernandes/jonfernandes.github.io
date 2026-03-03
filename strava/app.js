const state = {
  activities: [],
  unit: localStorage.getItem("strava-unit") || "mi",
};

const elements = {
  grid: document.getElementById("activityGrid"),
  summary: document.getElementById("summary"),
  empty: document.getElementById("emptyState"),
  totalDistance: document.getElementById("totalDistance"),
  totalTime: document.getElementById("totalTime"),
  totalElevation: document.getElementById("totalElevation"),
  totalActivities: document.getElementById("totalActivities"),
  search: document.getElementById("search"),
  typeFilter: document.getElementById("typeFilter"),
  yearFilter: document.getElementById("yearFilter"),
  sort: document.getElementById("sort"),
  unitToggle: document.getElementById("unitToggle"),
  refresh: document.getElementById("refresh"),
  lastUpdated: document.getElementById("lastUpdated"),
};

const format = {
  distance(meters) {
    if (!Number.isFinite(meters)) return "—";
    if (state.unit === "mi") {
      const miles = meters / 1609.344;
      return `${miles.toFixed(miles >= 10 ? 1 : 2)} mi`;
    }
    const km = meters / 1000;
    return `${km.toFixed(km >= 10 ? 1 : 2)} km`;
  },
  elevation(meters) {
    if (!Number.isFinite(meters)) return "—";
    if (state.unit === "mi") {
      const feet = meters * 3.28084;
      return `${Math.round(feet)} ft`;
    }
    return `${Math.round(meters)} m`;
  },
  time(seconds) {
    if (!Number.isFinite(seconds)) return "—";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  },
  date(value) {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },
  pace(secondsPerMeter) {
    if (!Number.isFinite(secondsPerMeter)) return "—";
    const secondsPerUnit = state.unit === "mi" ? secondsPerMeter * 1609.344 : secondsPerMeter * 1000;
    const mins = Math.floor(secondsPerUnit / 60);
    const secs = Math.round(secondsPerUnit % 60);
    return `${mins}:${secs.toString().padStart(2, "0")} / ${state.unit}`;
  },
  speed(metersPerSecond) {
    if (!Number.isFinite(metersPerSecond)) return "—";
    if (state.unit === "mi") {
      return `${(metersPerSecond * 2.23694).toFixed(1)} mph`;
    }
    return `${(metersPerSecond * 3.6).toFixed(1)} km/h`;
  },
};

function normalizeActivity(activity) {
  const distance = Number(activity.distance || activity.distance_m || activity.distance_meters || 0);
  const moving = Number(activity.moving_time || activity.movingTime || activity.moving_seconds || 0);
  const elapsed = Number(activity.elapsed_time || activity.elapsedTime || moving);
  const elevation = Number(
    activity.total_elevation_gain || activity.elevation_gain || activity.elevation || 0
  );
  const avgSpeed = Number(activity.average_speed || activity.avg_speed || 0);
  const maxSpeed = Number(activity.max_speed || 0);
  const avgHr = Number(activity.average_heartrate || activity.avg_hr || 0);
  const startDate = activity.start_date_local || activity.start_date || activity.date;
  const location = [activity.location_city, activity.location_state, activity.location_country]
    .filter(Boolean)
    .join(", ");

  return {
    id: activity.id || `${activity.name}-${startDate}`,
    name: activity.name || "Untitled activity",
    type: activity.type || activity.sport_type || "Workout",
    distance,
    moving,
    elapsed,
    elevation,
    avgSpeed,
    maxSpeed,
    avgHr,
    startDate,
    location,
  };
}

function setSummary(activities) {
  const distance = activities.reduce((sum, item) => sum + item.distance, 0);
  const elevation = activities.reduce((sum, item) => sum + item.elevation, 0);
  const time = activities.reduce((sum, item) => sum + item.moving, 0);

  elements.totalDistance.textContent = format.distance(distance);
  elements.totalTime.textContent = format.time(time);
  elements.totalElevation.textContent = format.elevation(elevation);
  elements.totalActivities.textContent = activities.length.toString();

  const longest = activities.reduce((acc, item) => (item.distance > acc.distance ? item : acc), activities[0] || {});
  const fastest = activities.reduce((acc, item) => (item.avgSpeed > acc.avgSpeed ? item : acc), activities[0] || {});
  const climbing = activities.reduce((acc, item) => (item.elevation > acc.elevation ? item : acc), activities[0] || {});
  const activeDays = new Set(activities.map((item) => format.date(item.startDate))).size;

  elements.summary.innerHTML = "";
  elements.summary.append(
    createSummaryCard("Longest Activity", longest.name || "—", format.distance(longest.distance)),
    createSummaryCard("Fastest Avg Speed", fastest.name || "—", format.speed(fastest.avgSpeed)),
    createSummaryCard("Biggest Climb", climbing.name || "—", format.elevation(climbing.elevation)),
    createSummaryCard("Active Days", `${activeDays} days`, "")
  );
}

function createSummaryCard(title, value, meta) {
  const card = document.createElement("div");
  card.className = "summary-card";
  const metaLine = meta ? `<p>${meta}</p>` : "";
  card.innerHTML = `<h3>${title}</h3><p>${value}</p>${metaLine}`;
  return card;
}

function renderActivities(activities) {
  elements.grid.innerHTML = "";
  if (!activities.length) {
    elements.empty.hidden = false;
    return;
  }

  elements.empty.hidden = true;
  const fragment = document.createDocumentFragment();
  activities.forEach((activity) => fragment.appendChild(createCard(activity)));
  elements.grid.appendChild(fragment);
}

function createCard(activity) {
  const card = document.createElement("article");
  card.className = "card";
  const pace = activity.avgSpeed > 0 ? format.pace(1 / activity.avgSpeed) : "—";

  card.innerHTML = `
    <div class="card__header">
      <div>
        <div class="card__type">${activity.type}</div>
        <div class="card__title">${activity.name}</div>
      </div>
      <span class="card__badge">${format.date(activity.startDate)}</span>
    </div>
    <div class="card__meta">${activity.location || "Location hidden"}</div>
    <div class="card__stats">
      <span><strong>Distance</strong><span>${format.distance(activity.distance)}</span></span>
      <span><strong>Moving</strong><span>${format.time(activity.moving)}</span></span>
      <span><strong>Elevation</strong><span>${format.elevation(activity.elevation)}</span></span>
      <span><strong>Avg speed</strong><span>${format.speed(activity.avgSpeed)}</span></span>
      <span><strong>Pace</strong><span>${pace}</span></span>
      <span><strong>Avg HR</strong><span>${activity.avgHr ? `${Math.round(activity.avgHr)} bpm` : "—"}</span></span>
    </div>
  `;

  return card;
}

function buildFilters(activities) {
  const types = new Set();
  const years = new Set();
  activities.forEach((activity) => {
    types.add(activity.type);
    if (activity.startDate) {
      years.add(new Date(activity.startDate).getFullYear());
    }
  });

  elements.typeFilter.innerHTML = '<option value="all">All types</option>';
  [...types].sort().forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    elements.typeFilter.appendChild(option);
  });

  elements.yearFilter.innerHTML = '<option value="all">All years</option>';
  [...years].sort((a, b) => b - a).forEach((year) => {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    elements.yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const query = elements.search.value.trim().toLowerCase();
  const type = elements.typeFilter.value;
  const year = elements.yearFilter.value;
  const sort = elements.sort.value;

  let list = [...state.activities];

  if (query) {
    list = list.filter((activity) => {
      const haystack = `${activity.name} ${activity.type} ${activity.location}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (type !== "all") {
    list = list.filter((activity) => activity.type === type);
  }

  if (year !== "all") {
    list = list.filter((activity) => activity.startDate && new Date(activity.startDate).getFullYear().toString() === year);
  }

  list.sort((a, b) => sortActivities(a, b, sort));

  setSummary(list);
  renderActivities(list);
}

function sortActivities(a, b, sort) {
  switch (sort) {
    case "date-asc":
      return new Date(a.startDate) - new Date(b.startDate);
    case "distance-desc":
      return b.distance - a.distance;
    case "distance-asc":
      return a.distance - b.distance;
    case "elevation-desc":
      return b.elevation - a.elevation;
    case "time-desc":
      return b.moving - a.moving;
    case "date-desc":
    default:
      return new Date(b.startDate) - new Date(a.startDate);
  }
}

function bindControls() {
  [elements.search, elements.typeFilter, elements.yearFilter, elements.sort].forEach((control) => {
    control.addEventListener("input", applyFilters);
    control.addEventListener("change", applyFilters);
  });

  elements.unitToggle.addEventListener("click", () => {
    state.unit = state.unit === "mi" ? "km" : "mi";
    localStorage.setItem("strava-unit", state.unit);
    updateUnitToggle();
    applyFilters();
  });

  elements.refresh.addEventListener("click", () => {
    loadActivities();
  });
}

function updateUnitToggle() {
  elements.unitToggle.textContent = state.unit === "mi" ? "Miles" : "Kilometers";
}

async function loadActivities() {
  try {
    const response = await fetch("activities.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Missing activities.json");
    }
    const raw = await response.json();
    const list = Array.isArray(raw) ? raw : raw.activities || [];
    state.activities = list.map(normalizeActivity);
    if (elements.lastUpdated) {
      const timestamp = raw.generated_at || raw.generatedAt;
      elements.lastUpdated.textContent = timestamp
        ? ` Last sync: ${format.date(timestamp)}`
        : "";
    }

    if (!state.activities.length) {
      elements.empty.hidden = false;
      elements.grid.innerHTML = "";
      return;
    }

    buildFilters(state.activities);
    applyFilters();
  } catch (error) {
    elements.empty.hidden = false;
    elements.grid.innerHTML = "";
    elements.summary.innerHTML = "";
    elements.totalDistance.textContent = "—";
    elements.totalTime.textContent = "—";
    elements.totalElevation.textContent = "—";
    elements.totalActivities.textContent = "—";
  }
}

updateUnitToggle();
bindControls();
loadActivities();
