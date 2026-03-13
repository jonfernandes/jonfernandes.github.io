const origins = ["BLR", "COK"];
const destinations = ["LHR", "LGW"];
const departureDates = ["2026-06-22", "2026-06-23"];
const returnDates = ["2026-08-06", "2026-08-07", "2026-08-08"];
const storageKey = "flights-price-tracker-v1";

const state = {
  prices: loadPrices(),
  filters: {
    origin: "ALL",
    destination: "ALL",
    departure: "ALL",
    returning: "ALL"
  },
  sortByCheapest: false
};

const elements = {
  routeCount: document.querySelector("#route-count"),
  dateCount: document.querySelector("#date-count"),
  cheapestFlight: document.querySelector("#cheapest-flight"),
  resultsMeta: document.querySelector("#results-meta"),
  results: document.querySelector("#results"),
  template: document.querySelector("#result-card-template"),
  originFilter: document.querySelector("#origin-filter"),
  destinationFilter: document.querySelector("#destination-filter"),
  departureFilter: document.querySelector("#departure-filter"),
  returnFilter: document.querySelector("#return-filter"),
  sortCheapest: document.querySelector("#sort-cheapest"),
  clearPrices: document.querySelector("#clear-prices")
};

const combinations = buildCombinations();

init();

function init() {
  populateSelect(elements.originFilter, origins);
  populateSelect(elements.destinationFilter, destinations);
  populateSelect(elements.departureFilter, departureDates, formatDate);
  populateSelect(elements.returnFilter, returnDates, formatDate);

  elements.routeCount.textContent = String(origins.length * destinations.length);
  elements.dateCount.textContent = String(departureDates.length * returnDates.length);

  elements.originFilter.addEventListener("change", handleFilterChange);
  elements.destinationFilter.addEventListener("change", handleFilterChange);
  elements.departureFilter.addEventListener("change", handleFilterChange);
  elements.returnFilter.addEventListener("change", handleFilterChange);
  elements.sortCheapest.addEventListener("click", () => {
    state.sortByCheapest = true;
    render();
  });
  elements.clearPrices.addEventListener("click", clearPrices);

  render();
}

function buildCombinations() {
  const entries = [];

  origins.forEach((origin) => {
    destinations.forEach((destination) => {
      departureDates.forEach((departure) => {
        returnDates.forEach((returning) => {
          const id = [origin, destination, departure, returning].join("-");
          entries.push({
            id,
            origin,
            destination,
            departure,
            returning,
            searchUrl: buildGoogleFlightsUrl(origin, destination, departure, returning)
          });
        });
      });
    });
  });

  return entries;
}

function buildGoogleFlightsUrl(origin, destination, departure, returning) {
  const query = encodeURIComponent(
    `Flights from ${origin} to ${destination} on ${departure} returning ${returning} round trip for 3 adults and 2 children`
  );
  return `https://www.google.com/travel/flights?q=${query}`;
}

function populateSelect(select, values, formatter = (value) => value) {
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = formatter(value);
    select.appendChild(option);
  });
}

function handleFilterChange() {
  state.filters.origin = elements.originFilter.value;
  state.filters.destination = elements.destinationFilter.value;
  state.filters.departure = elements.departureFilter.value;
  state.filters.returning = elements.returnFilter.value;
  render();
}

function render() {
  const filtered = getFilteredCombinations();
  const cheapestId = getCheapestId(filtered);

  elements.results.replaceChildren(...filtered.map((entry, index) => renderCard(entry, cheapestId, index)));
  elements.resultsMeta.textContent = `${filtered.length} option${filtered.length === 1 ? "" : "s"} shown`;
  elements.cheapestFlight.textContent = cheapestId ? describeCheapest(cheapestId) : "Add prices to compare";
}

function getFilteredCombinations() {
  const filtered = combinations.filter((entry) => {
    return matchesFilter(entry.origin, state.filters.origin)
      && matchesFilter(entry.destination, state.filters.destination)
      && matchesFilter(entry.departure, state.filters.departure)
      && matchesFilter(entry.returning, state.filters.returning);
  });

  if (!state.sortByCheapest) {
    return filtered;
  }

  return filtered.slice().sort((left, right) => {
    const leftPrice = state.prices[left.id] ?? Number.POSITIVE_INFINITY;
    const rightPrice = state.prices[right.id] ?? Number.POSITIVE_INFINITY;
    return leftPrice - rightPrice;
  });
}

function renderCard(entry, cheapestId, index) {
  const fragment = elements.template.content.cloneNode(true);
  const card = fragment.querySelector(".result-card");
  const routeAirports = fragment.querySelector(".route-airports");
  const routeDates = fragment.querySelector(".route-dates");
  const priceInput = fragment.querySelector(".price-input");
  const searchLink = fragment.querySelector(".search-link");

  routeAirports.textContent = `${entry.origin} → ${entry.destination}`;
  routeDates.textContent = `${formatDate(entry.departure)} to ${formatDate(entry.returning)}`;
  priceInput.value = state.prices[entry.id] ?? "";
  priceInput.setAttribute("aria-label", `Price for ${entry.origin} to ${entry.destination} ${entry.departure} to ${entry.returning}`);
  priceInput.addEventListener("input", (event) => updatePrice(entry.id, event.target.value));
  searchLink.href = entry.searchUrl;

  if (entry.id === cheapestId) {
    card.classList.add("is-cheapest");
  }

  card.style.animationDelay = `${Math.min(index * 35, 280)}ms`;
  return fragment;
}

function updatePrice(id, value) {
  const price = Number.parseInt(value, 10);

  if (Number.isNaN(price)) {
    delete state.prices[id];
  } else {
    state.prices[id] = price;
  }

  savePrices();
  render();
}

function clearPrices() {
  state.prices = {};
  savePrices();
  render();
}

function getCheapestId(entries) {
  let cheapestId = null;
  let cheapestPrice = Number.POSITIVE_INFINITY;

  entries.forEach((entry) => {
    const price = state.prices[entry.id];
    if (typeof price === "number" && price < cheapestPrice) {
      cheapestPrice = price;
      cheapestId = entry.id;
    }
  });

  return cheapestId;
}

function describeCheapest(id) {
  const entry = combinations.find((item) => item.id === id);
  const price = state.prices[id];

  if (!entry || typeof price !== "number") {
    return "Add prices to compare";
  }

  return `${entry.origin} to ${entry.destination} for ₹${price.toLocaleString("en-IN")}`;
}

function matchesFilter(value, filterValue) {
  return filterValue === "ALL" || value === filterValue;
}

function loadPrices() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function savePrices() {
  window.localStorage.setItem(storageKey, JSON.stringify(state.prices));
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
