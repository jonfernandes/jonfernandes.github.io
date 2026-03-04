const CALENDAR_ID = "jonfernandes@gmail.com";

const statusEl = document.getElementById("status");
const frameEl = document.getElementById("calendar-frame");
const openGoogleEl = document.getElementById("open-google");

function buildEmbedUrl(calendarId) {
  const params = new URLSearchParams({
    src: calendarId,
    ctz: "Europe/London",
    mode: "AGENDA",
    showTitle: "0",
    showPrint: "0",
    showCalendars: "0",
    showTabs: "1",
    showNav: "1",
  });

  return `https://calendar.google.com/calendar/embed?${params.toString()}`;
}

function buildOpenUrl(calendarId) {
  const cid = btoa(calendarId).replace(/=+$/g, "");
  return `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(cid)}`;
}

function initCalendarEmbed() {
  const embedUrl = buildEmbedUrl(CALENDAR_ID);
  frameEl.src = embedUrl;
  openGoogleEl.href = buildOpenUrl(CALENDAR_ID);

  frameEl.addEventListener("load", () => {
    statusEl.textContent = "Calendar loaded.";
  });

  frameEl.addEventListener("error", () => {
    statusEl.textContent = "Could not load embedded calendar.";
  });
}

initCalendarEmbed();
