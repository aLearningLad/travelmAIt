import { AI_API_KEY, AI_HOST, API_KEY, HOST } from "./env.js";

const searchBtn = document.getElementById("search");
const cityInput = document.getElementById("cityInput");
let city = "";
let country = "";
let windSpeed = "";
const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const wind = document.getElementById("wind");
const answer = document.getElementById("answer");
let threedays;
const forecast = document.getElementById("forecast");
const activity = document.getElementById("activity");
let chosenValue = "";
const modalBtn = document.getElementById("modalbtn");
const modal = document.getElementById("modal");
let isLoading = false;

modalBtn.addEventListener("click", () => {
  modal.classList.remove("fixed");
  modal.classList.add("hidden");
});

activity.addEventListener("change", () => {
  chosenValue = activity.value;
  console.log(chosenValue);
});

function typing(element, text) {
  let index = 0;
  element.innerHTML = "";

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 50);
}

const findCity = async () => {
  let searchValue = cityInput.value;

  const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${searchValue}&days=3`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": HOST,
    },
  };

  //AI CALL

  const Url = "https://chatgpt-best-price.p.rapidapi.com/v1/chat/completions";
  const Options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": AI_API_KEY,
      "X-RapidAPI-Host": AI_HOST,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Hi there, I wish to engage in ${chosenValue} in ${searchValue}. Give me suggestions and some info on these suggestions, but be concise.`,
        },
      ],
    }),
  };

  if (searchValue && chosenValue) {
    isLoading = true;
    try {
      const response = await fetch(Url, Options);
      const aiAnswer = await response.json();
      const answerText = aiAnswer.choices[0].message.content;
      // answer.innerHTML = aiAnswer.choices[0].message.content;
      typing(answer, answerText);

      console.log(aiAnswer);
    } catch (error) {
      console.error(error);
    }

    //AI CALL

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      threedays = result.forecast.forecastday;
      forecast.innerHTML = threedays.map(
        (item) => `<div class="forecasts-styles">
  
        <p class="dateDisplay">
        ${item.date}
        </p>
  
  <img src=${item.day.condition.icon} class="weatherIcon" />
  
        <h4 class="condition-text">
        ${item.day.condition.text}
        </h4>
        <p class="tempText">
        ${item.day.maxtemp_c}&deg;C
        </p>
      </div>`
      );
      city = result.location.name;
      cityName.innerHTML = `${city},`;
      country = result.location.country;
      countryName.innerHTML = country;
      windSpeed = result.current.gust_kph;
      wind.innerHTML = `Wind speed is roughly ${windSpeed}km/h`;
      console.log(threedays);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  } else {
    modal.classList.add("fixed");
    modal.classList.remove("hidden");
  }
};

searchBtn.addEventListener("click", () => findCity());
