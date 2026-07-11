const geoApiUrl = "https://geocoding-api.open-meteo.com/v1/search";
const weatherApiUrl = "https://api.open-meteo.com/v1/forecast";

const locationInput = document.getElementById("locationInput");
const search = document.getElementById("searchButton");

const temperature = document.getElementById("temperature");
const temperatureMin = document.getElementById("temperature-min");
const temperatureMax = document.getElementById("temperature-max");
const temperatureIcon = document.getElementById("temperature-icon");
const container = document.getElementById("forecast-container");
const bgColor = document.querySelector(".icon-flex");
const cityNameDisplay = document.getElementById("result-city");
const resultsCard = document.getElementById("resultsCard");
const loadingSpinner = document.getElementById("loading");
const descriptionDisplay = document.getElementById("result-description");

window.addEventListener("DOMContentLoaded", () => {
  const savedLastLocation = sessionStorage.getItem("lastWeatherLocation");
  
  if (savedLastLocation) {
    searchLocation(savedLastLocation);
  } else {
    searchLocation("Mumbai");
  }
});


function searchLocation(forcedLocationName = null) {
  const location = forcedLocationName || (locationInput.value ? locationInput.value.trim() : "");

  if (location) {
    sessionStorage.setItem("lastWeatherLocation", location);
    const cacheKey = location.toLowerCase();
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const savedResult = JSON.parse(cachedData);
      const currentTime = Date.now();
      
      
      const timeDifference = (currentTime - savedResult.timestamp) / (1000 * 60);

      if (timeDifference < 60) {
        renderWeatherData(savedResult.weatherData, savedResult.cityName || location);
      } else {
        sessionStorage.removeItem(cacheKey);
        startLoadingState();
        fetchCoords(location);
      }
    } else {
      console.log(`No cache found. Fetching fresh data for ${location}.`);
      startLoadingState();
      fetchCoords(location);
    }
  } else {
    console.log("Please enter valid Location");
  }
}

function startLoadingState() {
  if (loadingSpinner) loadingSpinner.style.display = "flex";
  if (resultsCard) resultsCard.style.display = "none";
  if (container) container.innerHTML = "";
}

// Fetching Latitude and Longitude using API
function fetchCoords(location) {
  const url = `${geoApiUrl}?name=${encodeURIComponent(location)}&count=1`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {

      if (data.results && data.results.length > 0) {
        const firstMatch = data.results[0]; 
        const latitude = firstMatch.latitude;
        const longitude = firstMatch.longitude;
        const cityName = firstMatch.name;

        fetchTemperature(latitude, longitude, location, cityName);
      } else {
        console.log("No locations found with that name.");
        if (temperatureIcon) temperatureIcon.src = "weather_icons/sorry.png";
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (resultsCard) resultsCard.style.display = "none";
        if (container) {
          container.innerHTML = `
            <div class="error">
              <img src="weather_icons/sorry.png" alt="Sorry" class="error-image" />
              <p class="error-text">No location found</p>
            </div>
          `;
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching coordinates:", error);
      if (temperatureIcon) temperatureIcon.src = "weather_icons/sorry.png";
      if (loadingSpinner) loadingSpinner.style.display = "none";
      if (resultsCard) resultsCard.style.display = "none";
        if (container) {
          container.innerHTML = `
            <div class="error">
              <img src="weather_icons/sorry.png" alt="Sorry" class="error-image" />
              <p class="error-text">No location found</p>
            </div>
          `;
        }
    });
}

// Fetching temperature using API
function fetchTemperature(latitude, longitude, originalLocationName, cityName) {
  const weatherUrl = `${weatherApiUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,weather_code&timezone=auto&forecast_days=7&current_units=temperature_2m`;

  fetch(weatherUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const cacheKey = originalLocationName.toLowerCase();
      

      const sessionData = {
        weatherData: data,
        timestamp: Date.now(),
        cityName: cityName,
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(sessionData));

      renderWeatherData(data, cityName);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      if (temperatureIcon) temperatureIcon.src = "weather_icons/sorry.png";
      if (loadingSpinner) loadingSpinner.style.display = "none";
      if (resultsCard) resultsCard.style.display = "none";
      if (container) {
        container.innerHTML = `
          <div class="error">
            <img src="weather_icons/sorry.png" alt="Sorry" class="error-image" />
            <p class="error-text">No location found</p>
          </div>
        `;
      }
    });
}


function renderWeatherData(data, cityName) {

  if (loadingSpinner) loadingSpinner.style.display = "none";
  if(resultsCard) resultsCard.style.display = "block";
  
  const currentTemp = data.current.temperature_2m;
  const minTemp = data.daily.temperature_2m_min[0]; 
  const maxTemp = data.daily.temperature_2m_max[0];
  const currentCode = data.current.weather_code;
  
  const unit = data.current_units ? data.current_units.temperature_2m : "°C";

  if (temperature) temperature.textContent = `${currentTemp} ${unit}`;
  if (temperatureMin) temperatureMin.textContent = `Min: ${minTemp} ${unit}`;
  if (temperatureMax) temperatureMax.textContent = `Max: ${maxTemp} ${unit}`;
  cityNameDisplay.textContent = cityName;

function getWeatherStyle(code) {
    const codeMap = {
      0: { text: "Clear sky", color: '#E5EFF2', icon: "weather_icons/warm.png" },
      1: { text: "Partly cloudy", color: '#C7E5ED', icon: "weather_icons/wind.png" },
      2: { text: "Partly cloudy", color: '#C7E5ED', icon: "weather_icons/wind.png" },
      3: { text: "Partly cloudy", color: '#C7E5ED', icon: "weather_icons/wind.png" },
      4: { text: "Overcast", color: '#9DB4C0', icon: "weather_icons/cold.png" },
      45: { text: "Foggy", color: '#9DB4C0', icon: "weather_icons/cold.png" },
      48: { text: "Foggy", color: '#9DB4C0', icon: "weather_icons/cold.png" },
      51: { text: "Drizzle", color: '#F5ECD7', icon: "weather_icons/snow.png" },
      53: { text: "Drizzle", color: '#F5ECD7', icon: "weather_icons/snow.png" },
      55: { text: "Drizzle", color: '#F5ECD7', icon: "weather_icons/snow.png" },
      61: { text: "Rain", color: '#F9D8AD', icon: "weather_icons/hot.png" },
      63: { text: "Rain", color: '#F9D8AD', icon: "weather_icons/hot.png" },
      65: { text: "Rain", color: '#F9D8AD', icon: "weather_icons/hot.png" },
      71: { text: "Snow", color: '#E5EFF2', icon: "weather_icons/blazing.png" },
      73: { text: "Snow", color: '#E5EFF2', icon: "weather_icons/blazing.png" },
      75: { text: "Snow", color: '#E5EFF2', icon: "weather_icons/blazing.png" },
      80: { text: "Rain showers", color: '#FFB86F', icon: "weather_icons/very-hot.png" },
      81: { text: "Rain showers", color: '#FFB86F', icon: "weather_icons/very-hot.png" },
      82: { text: "Rain showers", color: '#FFB86F', icon: "weather_icons/very-hot.png" },
      95: { text: "Thunderstorm", color: '#FF8C42', icon: "weather_icons/scorching-sun.png" }
    };

    const defaultStyle = { text: "Unknown weather", color: '#FF3C38', icon: "weather_icons/sorry.png" };
    return codeMap[code] || defaultStyle;
  }

  const mainStyle = getWeatherStyle(currentCode);

  if (descriptionDisplay) {
    descriptionDisplay.textContent = mainStyle.text;
  }

  if (bgColor && temperatureIcon) {
    bgColor.style.backgroundColor = mainStyle.color;
    temperatureIcon.src = mainStyle.icon;
  }

  if (container) {
    container.innerHTML = "";
    let allCardsHtml = "";

    data.daily.time.forEach((date, index) => {
      const dayMax = data.daily.temperature_2m_max[index];
      const dayMin = data.daily.temperature_2m_min[index];
      const dayAvg = data.daily.temperature_2m_mean[index];
      const dayCode = data.daily.weather_code[index];

      const dateObject = new Date(date);
      const dayName = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(dateObject);

      const dayStyle = getWeatherStyle(dayCode);

      allCardsHtml += `
          <div class="weather-card" style="background-color: ${dayStyle.color};">
              <h3>${dayName}</h3>
              <div class="card-icon-flex">
                  <div>${dayAvg} ${unit}</div>
                  <p>${dayStyle.text}</p> 
                  <img src="${dayStyle.icon}" alt="weather icon" class="forecast-icon" />
              </div>
              <div>
                  <span>H: ${dayMax}°</span> | <span>L: ${dayMin}°</span>
              </div>
          </div>
      `;
    });

    container.innerHTML = allCardsHtml;
  }
}
