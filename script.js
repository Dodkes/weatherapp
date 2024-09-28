const selectChart = document.getElementById("chart-select-element");
const celsiusButton = document.getElementById("celsius-button");
const fahrenheitButton = document.getElementById("fahrenheit-button");
const temperatureInput = document.getElementById("temp-input");
const humidityInput = document.getElementById("humidity-input");

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
  const promise_1 = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${"Kosice"},SK&appid=${API_KEY}&units=metric`
  );
  const promise_2 = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${"Bratislava"},SK&appid=${API_KEY}&units=metric`
  );

  const promise_3 = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${"Michalovce"},SK&appid=${API_KEY}&units=metric`
  );

  const promise_4 = fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${"Modra"},SK&appid=${API_KEY}&units=metric`
  );

  const [response_1, response_2, response_3, response_4] = await Promise.all([
    promise_1,
    promise_2,
    promise_3,
    promise_4,
  ]);

  data = [
    await response_1.json(),
    await response_2.json(),
    await response_3.json(),
    await response_4.json(),
  ];
  tableData(data);
  // renderChart(data);
}

getAPI();

const historyArray = localStorage.getItem("history")
  ? JSON.parse(localStorage.getItem("history"))
  : [];

function active(id) {
  if (id == "table-tab") {
    $("#chart-tab").removeClass("active");
    $("#table-tab").addClass("active");
    $("#calculator-tab").removeClass("active");
    conatinersReveal(id);
  } else if (id == "chart-tab") {
    $("#chart-tab").addClass("active");
    $("#table-tab").removeClass("active");
    $("#calculator-tab").removeClass("active");
    conatinersReveal(id);
  } else if (id == "calculator-tab") {
    $("#chart-tab").removeClass("active");
    $("#table-tab").removeClass("active");
    $("#calculator-tab").addClass("active");
    conatinersReveal(id);
  }
}

function conatinersReveal(id) {
  if (id == "table-tab") {
    $(".table-container").css("display", "block");
    $(".chart-container").css("display", "none");
    $(".calculator-container").css("display", "none");
  } else if (id == "chart-tab") {
    $(".table-container").css("display", "none");
    $(".chart-container").css("display", "block");
    $(".calculator-container").css("display", "none");
  } else if (id == "calculator-tab") {
    $(".table-container").css("display", "none");
    $(".chart-container").css("display", "none");
    $(".calculator-container").css("display", "block");
  }
}

function validate() {
  const temperature = temperatureInput.value;
  const humidity = humidityInput.value;

  if (!units) {
    showErrorContainer("Select units");
  } else if (units == "celsius" && temperature < 26.7) {
    return showErrorContainer(
      "Index can not be calculated for temperature less than 26.7 °C"
    );
  } else if (units == "fahrenheit" && temperature < 80) {
    return showErrorContainer(
      "Index can not be calculated for temperature less than 80 °F"
    );
  } else if (humidity < 0 || humidity > 100) {
    showErrorContainer(
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

  document.getElementById(
    "index-result"
  ).textContent = `Heat Index is ${heatIndex}`;

  //local storage
  if (historyArray.length === 5) {
    historyArray.shift();
    historyArray.push(heatIndex);
  } else if (historyArray.length < 5) {
    historyArray.push(heatIndex);
  }
  localStorage.setItem("history", JSON.stringify(historyArray));
  updateHistory();
  hideErrorContainer();
}

function tableData(data) {
  const tableId = document.getElementById("inputData");

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
      renderChart(data.map((item) => item.main.temp));
      break;
    case "humidity":
      renderChart(data.map((item) => item.main.humidity));
      break;
    case "wind-speed":
      renderChart(data.map((item) => item.wind.speed));
      break;
    default:
  }
});

function renderChart(yValues) {
  const xValues = data.map((item) => item.name);
  const minScale = Math.min(...yValues) - 5;
  const maxScale = Math.max(...yValues) + 5;

  myChart && myChart.destroy();

  myChart = new Chart("weatherChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          pointRadius: 4,
          fill: true,
          backgroundColor: "rgba(0, 0, 255, 0.2)",
          borderColor: "rgba(0, 0, 255, 1)",
          data: yValues,
        },
      ],
    },
    options: {
      legend: { display: false },
      scales: {
        yAxes: [{ ticks: { min: minScale, max: maxScale } }],
      },
    },
  });
}

updateHistory();
function updateHistory() {
  const reversedHistory = historyArray.slice().reverse();

  reversedHistory.forEach((item, index) => {
    $(`#${index + 1}`).text(item);
  });
}

function showErrorContainer(message) {
  $(".alert").css("display", "block");
  $("#error").text(message);
}

function hideErrorContainer() {
  $(".alert").css("display", "none");
}
