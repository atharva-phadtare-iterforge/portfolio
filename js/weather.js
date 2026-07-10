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


function searchLocation() {
  const location = locationInput.value ? locationInput.value.trim() : "";
  if (location) {
    const cacheKey = location.toLowerCase();
    const cachedData = sessionStorage.getItem(cacheKey);

    if (cachedData) {
      const savedResult = JSON.parse(cachedData);
      const currentTime = Date.now();
      
      
      const timeDifference = (currentTime - savedResult.timestamp) / (1000 * 60);

      if (timeDifference < 60) {
        renderWeatherData(savedResult.weatherData);
      } else {
        sessionStorage.removeItem(cacheKey);
        fetchCoords(location);
      }
    } else {
      console.log(`No cache found. Fetching fresh data for ${location}.`);
      fetchCoords(location);
    }
  } else {
    console.log("Please enter valid Location");
  }
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

        fetchTemperature(latitude, longitude, location);
      } else {
        console.log("No locations found with that name.");
      }
    })
}

// Fetching temperature using API
function fetchTemperature(latitude, longitude, originalLocationName) {
  const weatherUrl = `${weatherApiUrl}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=auto&forecast_days=7&current_units=temperature_2m`;

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
        timestamp: Date.now()
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(sessionData));

      renderWeatherData(data);
    })
}


function renderWeatherData(data) {
  const currentTemp = data.current.temperature_2m;
  const minTemp = data.daily.temperature_2m_min[0]; 
  const maxTemp = data.daily.temperature_2m_max[0];
  
  const unit = data.current_units ? data.current_units.temperature_2m : "°C";

  if (temperature) temperature.textContent = `${currentTemp} ${unit}`;
  if (temperatureMin) temperatureMin.textContent = `Min: ${minTemp} ${unit}`;
  if (temperatureMax) temperatureMax.textContent = `Max: ${maxTemp} ${unit}`;

  function getWeatherStyle(temp) {
    if (temp < 10) return { color: '#E5EFF2', icon: "weather_icons/cold.png" };
    if (temp >= 10 && temp < 15) return { color: '#9DB4C0', icon: "weather_icons/snow.png" };
    if (temp >= 15 && temp < 20) return { color: '#C7E5ED', icon: "weather_icons/warm.png" };
    if (temp >= 20 && temp < 25) return { color: '#F5ECD7', icon: "weather_icons/wind.png" };
    if (temp >= 25 && temp < 30) return { color: '#F9D8AD', icon: "weather_icons/hot.png" };
    if (temp >= 30 && temp < 35) return { color: '#FFB86F', icon: "weather_icons/very-hot.png" };
    if (temp >= 35 && temp < 40) return { color: '#FF8C42', icon: "weather_icons/scorching-sun.png" };
    return { color: '#FF3C38', icon: "weather_icons/blazing.png" };
  }

  if (bgColor && temperatureIcon) {
    const mainStyle = getWeatherStyle(currentTemp);
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

      const dateObject = new Date(date);
      const dayName = new Intl.DateTimeFormat('en-IN', { weekday: 'long' }).format(dateObject);

      const dayStyle = getWeatherStyle(dayAvg);

      allCardsHtml += `
          <div class="weather-card" style="background-color: ${dayStyle.color};">
              <h3>${dayName}</h3>
              <div class="card-icon-flex">
                  <div>${dayAvg} ${unit}</div>
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
