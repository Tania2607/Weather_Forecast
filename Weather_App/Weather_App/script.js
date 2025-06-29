const apiKey = 'bca01fdca3be65ddd362dca65a160df0';

function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultDiv = document.getElementById("weatherResult");
  const forecastContainer = document.getElementById("forecastContainer");

  if (city === "") {
    resultDiv.innerHTML = "Please enter a city name.";
    return;
  }

  // Get current weather
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  // Get 3-day forecast
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  // Fetch current weather
  fetch(currentWeatherUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found.");
      }
      return response.json();
    })
    .then(data => {
      const weather = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
      `;
      resultDiv.innerHTML = weather;

      // Fetch forecast
      return fetch(forecastUrl);
    })
    .then(response => response.json())
    .then(forecastData => {
      // Get forecast for next 4 days
      const forecast = forecastData.list
        .filter((item, index) => index % 8 === 0) // Get every 8th item (3-hour intervals)
        .slice(0, 4); // Get next 4 days

      // Create forecast cards
      const forecastHtml = forecast.map(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(item.main.temp);
        const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

        return `
          <div class="forecast-card">
            <h3>${day}</h3>
            <div class="date">${date.toLocaleDateString()}</div>
            <div class="weather-info">
              <img src="${icon}" alt="${item.weather[0].description}" class="weather-icon">
              <p><strong>Temp:</strong> ${temp}°C</p>
              <p><strong>Condition:</strong> ${item.weather[0].description}</p>
              <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
            </div>
          </div>
        `;
      }).join('');

      forecastContainer.innerHTML = forecastHtml;
    })
    .catch(error => {
      resultDiv.innerHTML = error.message;
      forecastContainer.innerHTML = '';
    });
}
