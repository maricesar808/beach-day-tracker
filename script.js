const beaches = [
  {
    name: "Waikiki Beach",
    latitude: 21.2767,
    longitude: -157.8266,
  },
  {
    name: "Kailua Beach",
    latitude: 21.3971,
    longitude: -157.7264,
  },
  {
    name: "North Shore",
    latitude: 21.6652,
    longitude: -158.0513,
  },
  {
    name: "Kahala Beach",
    latitude: 21.2697,
    longitude: -157.7736,
  },
  {
    name: "Pipeline",
    latitude: 21.6654,
    longitude: -158.0522,
  },
  {
    name: "Lanikai Beach",
    latitude: 21.3931,
    longitude: -157.7146,
  },
  {
    name: "Makapuu Beach",
    latitude: 21.3103,
    longitude: -157.6616,
  },
];

const searchInput = document.querySelector("#beach-search");
const beachList = document.querySelector("#beach-list");
const selectedBeach = document.querySelector("#selected-beach");
const refreshButton = document.querySelector("#refresh-button");
const statusMessage = document.querySelector("#status-message");
const weatherContent = document.querySelector("#weather-content");
const ratingCard = document.querySelector("#rating-card");
const ratingTitle = document.querySelector("#rating-title");
const ratingMessage = document.querySelector("#rating-message");
const ratingReasons = document.querySelector("#rating-reasons");
const temperature = document.querySelector("#temperature");
const feelsLike = document.querySelector("#feels-like");
const rainChance = document.querySelector("#rain-chance");
const windSpeed = document.querySelector("#wind-speed");
const uvIndex = document.querySelector("#uv-index");
const uvWarning = document.querySelector("#uv-warning");

let currentBeach = beaches[0];

function renderBeachList() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  beachList.innerHTML = "";

  const filteredBeaches = beaches.filter((beach) =>
    beach.name.toLowerCase().includes(searchTerm)
  );

  if (filteredBeaches.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-list";
    emptyMessage.textContent = "No saved beaches found.";
    beachList.append(emptyMessage);
    return;
  }

  filteredBeaches.forEach((beach) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "beach-button";
    button.textContent = beach.name;

    if (beach.name === currentBeach.name) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      currentBeach = beach;
      searchInput.value = "";
      renderBeachList();
      fetchWeather();
    });

    beachList.append(button);
  });
}

function getCurrentHourIndex(currentTime, times) {
  const currentHour = currentTime.slice(0, 13);
  const exactIndex = times.findIndex((time) => time.startsWith(currentHour));

  if (exactIndex >= 0) {
    return exactIndex;
  }

  return 0;
}

function getRating(weather) {
  const reasons = [];

  if (weather.temperature < 75) {
    reasons.push("too cold");
  }

  if (weather.rainChance > 30) {
    reasons.push("too rainy");
  }

  if (weather.windSpeed > 20) {
    reasons.push("too windy");
  }

  if (reasons.length > 0) {
    return {
      title: "Not ideal",
      message: "Maybe wait for better weather.",
      reasons,
      className: "not-ideal",
    };
  }

  if (weather.temperature < 78 || weather.rainChance > 20 || weather.windSpeed > 15) {
    return {
      title: "Okay",
      message: "Still possible, but check the details before you go.",
      reasons: ["conditions are close, but not perfect"],
      className: "okay",
    };
  }

  return {
    title: "Great",
    message: "Looks like a strong beach day. Pack sunscreen.",
    reasons: [],
    className: "great",
  };
}

function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.classList.toggle("error", isError);
  statusMessage.hidden = false;
}

function showWeather(data) {
  const current = data.current;
  const hourIndex = getCurrentHourIndex(current.time, data.hourly.time);
  const weather = {
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    rainChance: data.hourly.precipitation_probability[hourIndex],
    windSpeed: current.wind_speed_10m,
    uvIndex: data.hourly.uv_index[hourIndex],
  };
  const rating = getRating(weather);

  selectedBeach.textContent = currentBeach.name;
  temperature.textContent = `${Math.round(weather.temperature)}F`;
  feelsLike.textContent = `${Math.round(weather.apparentTemperature)}F`;
  rainChance.textContent = `${weather.rainChance}%`;
  windSpeed.textContent = `${Math.round(weather.windSpeed)} mph`;
  uvIndex.textContent = weather.uvIndex.toFixed(1);

  ratingCard.className = `rating-card ${rating.className}`;
  ratingTitle.textContent = rating.title;
  ratingMessage.textContent = rating.message;
  ratingReasons.innerHTML = "";

  rating.reasons.forEach((reason) => {
    const item = document.createElement("li");
    item.textContent = reason;
    ratingReasons.append(item);
  });

  uvWarning.hidden = weather.uvIndex < 8;
  statusMessage.hidden = true;
  weatherContent.hidden = false;
}

async function fetchWeather() {
  selectedBeach.textContent = currentBeach.name;
  weatherContent.hidden = true;
  showStatus("Loading weather...");

  const params = new URLSearchParams({
    latitude: currentBeach.latitude,
    longitude: currentBeach.longitude,
    current: "temperature_2m,apparent_temperature,wind_speed_10m,weather_code",
    hourly: "precipitation_probability,uv_index",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "Pacific/Honolulu",
    forecast_days: "1",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather request failed.");
    }

    const data = await response.json();
    showWeather(data);
  } catch (error) {
    showStatus("Could not load weather. Check your internet connection and try again.", true);
  }
}

searchInput.addEventListener("input", renderBeachList);
refreshButton.addEventListener("click", fetchWeather);

renderBeachList();
fetchWeather();
