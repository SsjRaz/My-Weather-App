let weather = {
    "apiKey": "API_KEY_HOLDER",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q="
             + city
             + "&units=imperial&appid="
             + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => {
                this.displayWeather(data);
                this.fetchHourlyForecast(city);
            });
    },
    fetchHourlyForecast: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q="
            + city
            + "&units=imperial&appid="
            + this.apiKey
        )
            .then((response) => response.json())
            .then((data) => this.displayHourlyForecast(data));
    },



    displayWeather: function(data){
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp.toFixed(0) + "°F";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " mph";
        document.querySelector(".weather").classList.remove("loading");
    },

    displayHourlyForecast: function (data) {
        const hourlyContainer = document.getElementById("hourly-forecast-container");
        hourlyContainer.innerHTML = ""; // Clear any existing content

        const cityTimeOffset = data.city.timezone; // Timezone offset in seconds

        for (let i = 0; i < 12; i++) {
            const hourData = data.list[i];
            const utcTime = new Date(hourData.dt * 1000);
            const localTime = new Date(utcTime.getTime() + cityTimeOffset * 1000);
            const hours = localTime.getUTCHours();
            const timeString = hours < 10 ? '0' + hours + ':00' : hours + ':00';

            const icon = hourData.weather[0].icon;
            const temp = hourData.main.temp.toFixed(0);

            const hourlyItem = document.createElement("div");
            hourlyItem.className = "hourly-item";
            hourlyItem.innerHTML = `
                <div>${timeString}</div>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
                <div>${temp}°F</div>
            `;
            hourlyContainer.appendChild(hourlyItem);
        }
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

weather.fetchWeather("Columbus");