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
    getWeather(city);
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

function getTimeOfDay(localTime) {
  const [date, time] = localTime.split(" ");
  const [hours] = time.split(":").map(Number);
  const isDay = hours >= 6 && hours < 18;

  return isDay ? "Day" : "Night";
}
const timeOfDay = getTimeOfDay("2024-04-09 0:46");
console.log(timeOfDay);

function getDayFromDate(dateTimeString) {
  const dateParts = dateTimeString.split(" ")[0].split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed in JavaScript
  const day = parseInt(dateParts[2]);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const date = new Date(year, month, day);
  const dayIndex = date.getDay();

  return dayNames[dayIndex];
}

async function getWeather(city) {
  await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=no&alerts=yes`,
    { mode: "cors" }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      let code = response.current.condition.code;
      temp.textContent = response.current.temp_c + "°C";
      let currentWeather = findcode(code);
      let timeOfDay = "day";
      if (getTimeOfDay(response.location.localtime) === "Night") {
        timeOfDay = "night";
      }
      let src = `./final/${timeOfDay}/${currentWeather.icon}.svg`;
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

      for (let i = 0; i < 5; i++) {
        const dailySymbol = document.querySelector(`#day${i}`);
        const dayName = document.querySelector(`#dayname${i}`);
        let dayCode = response.forecast.forecastday[i].day.condition.code;
        let dailyWeather = findcode(dayCode);
        let timeOfDay = "day";
        if (getTimeOfDay(response.location.localtime) === "Night") {
          timeOfDay = "night";
        }
        let src = `./final/${timeOfDay}/${currentWeather.icon}.svg`;
        dailySymbol.src = src;
        const dailyTemp = document.querySelector(`.temp${i}`);
        dayName.textContent = getDayFromDate(
          response.forecast.forecastday[i].date
        );
        dailyTemp.textContent =
          response.forecast.forecastday[i].day.avgtemp_c + "°C";
      }
    });
}

btn.addEventListener("click", () => {
  city = document.querySelector("#city").value;
  getWeather(city);
});

const gitBtn = document.querySelector("#github");

gitBtn.addEventListener("click", () => {
  window.open("https://github.com/anish797/odin-weather-app", "_blank");
});
