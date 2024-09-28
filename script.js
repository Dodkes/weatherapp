const selectChart = document.getElementById("chart-select-element");
const celsiusButton = document.getElementById("celsius-button");
const fahrenheitButton = document.getElementById("fahrenheit-button");
const temperatureInput = document.getElementById("temp-input");
const humidityInput = document.getElementById("humidity-input");
const messageBlock = document.getElementById("message");

const API_KEY = "6d8196f13596e796cae0b37daa47d6d5";
let units;
let data;
let myChart;

celsiusButton.addEventListener("click", () => {
  units = "celsius";
  temperatureInput.placeholder = "Enter ℃";
});

fahrenheitButton.addEventListener("click", () => {
  units = "fahrenheit";
  temperatureInput.placeholder = "Enter ℉";
});

async function getAPI() {
  const promise_kosice = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Kosice,SK&appid=${API_KEY}&units=metric`
  );
  const promise_bratislava = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Bratislava,SK&appid=${API_KEY}&units=metric`
  );

  const promise_michalovce = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Michalovce,SK&appid=${API_KEY}&units=metric`
  );

  const promise_modra = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Modra,SK&appid=${API_KEY}&units=metric`
  );

  const promise_vinne = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Vinne,SK&appid=${API_KEY}&units=metric`
  );

  const promise_rome = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Rome,IT&appid=${API_KEY}&units=metric`
  );

  const promise_leeds = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Leeds,UK&appid=${API_KEY}&units=metric`
  );

  const promise_brisbane = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Brisbane,AU&appid=${API_KEY}&units=metric`
  );

  const [
    response_kosice,
    response_bratislava,
    response_michalovce,
    response_modra,
    response_vinne,
    response_rome,
    response_leeds,
    response_brisbane,
  ] = await Promise.all([
    promise_kosice,
    promise_bratislava,
    promise_michalovce,
    promise_modra,
    promise_vinne,
    promise_rome,
    promise_leeds,
    promise_brisbane,
  ]);

  data = [
    await response_kosice.json(),
    await response_bratislava.json(),
    await response_modra.json(),
    await response_vinne.json(),
    await response_michalovce.json(),
    await response_rome.json(),
    await response_leeds.json(),
    await response_brisbane.json(),
  ];
  tableData(data);
  renderChart(
    data.map((item) => item.main.temp),
    "255, 0, 0",
    "°C"
  );
}

getAPI();

const historyArray = localStorage.getItem("history")
  ? JSON.parse(localStorage.getItem("history"))
  : [];

function validate() {
  const temperature = temperatureInput.value;
  const humidity = humidityInput.value;

  if (!units) {
    userMessage("Select units");
  } else if (units == "celsius" && temperature < 26.7) {
    return userMessage(
      "Index can not be calculated for temperature less than 26.7 °C"
    );
  } else if (units == "fahrenheit" && temperature < 80) {
    return userMessage(
      "Index can not be calculated for temperature less than 80 °F"
    );
  } else if (humidity < 0 || humidity > 100) {
    userMessage(
      "Humidity is a percentage value. Please enter value between 100 - 0"
    );
  } else if (units == "celsius") {
    var T = (9 / 5) * temperature + 32;
    indexCalculation(T);
  } else {
    T = temperature;
    indexCalculation(T);
  }
}

function indexCalculation(T) {
  const humidity = document.getElementById("humidity-input").value;
  const heatIndex =
    -42.379 +
    2.04901523 * T +
    10.14333127 * humidity -
    0.22475541 * T * humidity -
    6.83783 * 10 ** -3 * T ** 2 -
    5.481717 * 10 ** -2 * humidity ** 2 +
    1.22874 * 10 ** -3 * T ** 2 * humidity +
    8.5282 * 10 ** -4 * T * humidity ** 2 -
    1.99 * 10 ** -6 * T ** 2 * humidity ** 2;

  document.getElementById("message").textContent = `Heat Index is ${heatIndex}`;

  //local storage
  if (historyArray.length === 5) {
    historyArray.shift();
    historyArray.push(heatIndex);
  } else if (historyArray.length < 5) {
    historyArray.push(heatIndex);
  }
  localStorage.setItem("history", JSON.stringify(historyArray));
  updateHistory();
}

function tableData(data) {
  const tableId = document.getElementById("input-data");

  for (var i = 0; i < data.length; i++) {
    var row =
      "<tr>" +
      "<td>" +
      data[i].name +
      "</td>" +
      "<td>" +
      data[i].main.temp +
      "°C" +
      "</td>" +
      "<td>" +
      data[i].weather[0].description +
      "</td>" +
      "<td>" +
      data[i].wind.speed +
      "m/s" +
      "</td>" +
      "<td>" +
      data[i].main.humidity +
      "%";
    "</td>" + "</tr>";
    tableId.innerHTML += row;
  }
}

selectChart.addEventListener("change", function () {
  switch (selectChart.value) {
    case "temperature":
      renderChart(
        data.map((item) => item.main.temp),
        "255, 0, 0",
        "°C"
      );
      break;
    case "humidity":
      renderChart(
        data.map((item) => item.main.humidity),
        "0, 0, 255",
        "%"
      );
      break;
    case "wind-speed":
      renderChart(
        data.map((item) => item.wind.speed),
        "0, 0, 0",
        "m/s"
      );
      break;
    default:
  }
});

function renderChart(yValues, rgb, unit) {
  const xValues = data.map((item) => item.name);
  let [minScale, maxScale] = [
    Math.floor(Math.min(...yValues) - 5),
    Math.floor(Math.max(...yValues) + 5),
  ];

  unit === "%" && ([minScale, maxScale] = [0, 100]);
  unit === "m/s" && (minScale = 0);

  myChart && myChart.destroy();

  myChart = new Chart("weatherChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          pointRadius: 4,
          fill: true,
          backgroundColor: `rgba(${rgb}, 0.4)`,
          borderColor: `rgba(${rgb}, 1)`,
          data: yValues,
        },
      ],
    },
    options: {
      tooltips: {
        callbacks: {
          label: (value) => {
            return `${value.yLabel} ${unit}`;
          },
        },
      },
      legend: { display: false },
      scales: {
        yAxes: [
          {
            ticks: {
              min: minScale,
              max: maxScale,
              callback: (value) => {
                return `${value} ${unit}`;
              },
            },
          },
        ],
      },
    },
  });
}

function updateHistory() {
  const reversedHistory = historyArray.slice().reverse();

  reversedHistory.forEach((item, index) => {
    document.getElementById(`${index + 1}`).textContent = item;
  });
}
updateHistory();

function userMessage(message) {
  messageBlock.innerText = message;
}
