import fs from "node:fs/promises";

const {
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  STRAVA_REFRESH_TOKEN,
} = process.env;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.error("Missing STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET / STRAVA_REFRESH_TOKEN");
  process.exit(1);
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed ${response.status}: ${body}`);
  }
  return response.json();
}

async function getAccessToken() {
  const payload = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    refresh_token: STRAVA_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const data = await fetchJson("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: payload.toString(),
  });

  if (!data.access_token) {
    throw new Error("No access token returned from Strava");
  }

  return data.access_token;
}

async function fetchAllActivities(accessToken) {
  const activities = [];
  const perPage = 200;
  let page = 1;

  while (true) {
    const url = new URL("https://www.strava.com/api/v3/athlete/activities");
    url.searchParams.set("per_page", perPage.toString());
    url.searchParams.set("page", page.toString());

    const pageData = await fetchJson(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!Array.isArray(pageData) || pageData.length === 0) {
      break;
    }

    activities.push(...pageData);
    page += 1;
  }

  return activities;
}

async function main() {
  const token = await getAccessToken();
  const activities = await fetchAllActivities(token);

  const output = {
    generated_at: new Date().toISOString(),
    activities,
  };

  await fs.writeFile(
    new URL("./activities.json", import.meta.url),
    JSON.stringify(output, null, 2) + "\n",
    "utf8"
  );

  console.log(`Wrote ${activities.length} activities.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
