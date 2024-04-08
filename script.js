const apiKey = "ad64fcb011674f4d8c964121240804";
let city = "Bangalore";
const btn = document.querySelector("#search");
const temp = document.querySelector(".temp");
const weather = document.querySelector(".weather");
const symbol = document.querySelector(".weatherSymbol");
const cityname = document.querySelector(".cityName");
const date = document.querySelector(".thedate");
const wind = document.querySelector(".wind");
const sunrise = document.querySelector(".sunrise");
const pressure = document.querySelector(".pressure");
const humidity = document.querySelector(".humidity");
const visibility = document.querySelector(".visibility");
const sunset = document.querySelector(".sunset");
let weatherData;

fetch("./weather.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((jsonData) => {
    weatherData = jsonData;
    getWeather(city); // Call getWeather with default city
  })
  .catch((error) => {
    console.error("There was a problem fetching the data:", error);
  });

function findcode(code) {
  return weatherData.find((weather) => weather.code === code);
}

function getDate() {
  let currentDate = new Date();
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = currentDate.getDate().toString().padStart(2, "0");
  let month = monthNames[currentDate.getMonth()];
  let dayOfWeek = dayNames[currentDate.getDay()];
  let formattedDate = `${day} ${month} ${dayOfWeek}`;

  return formattedDate;
}

async function getWeather(city) {
  await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=yes`,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let code = response.current.condition.code;
      temp.textContent = response.current.temp_c + "°C";
      let currentWeather = findcode(code);
      let src = "./final/day/" + currentWeather.icon + ".svg";
      symbol.innerHTML = `<img src="${src}" alt="Weather Icon" id="symbol"></img>`;
      weather.textContent = response.current.condition.text;
      console.log(response);
      wind.textContent = response.current.wind_kph + " km/h";
      humidity.textContent = response.current.humidity + "%";
      pressure.textContent = response.current.pressure_mb + " hPa";
      visibility.textContent = response.current.vis_km + " km";
      sunrise.textContent = response.forecast.forecastday[0].astro.sunrise;
      sunset.textContent = response.forecast.forecastday[0].astro.sunset;
      cityname.textContent = response.location.name;
      date.textContent = getDate();
    });
}

btn.addEventListener("click", () => {
  city = document.querySelector("#city").value;
  getWeather(city);
});
