// const historyLine = document.querySelectorAll("#historyList li");
let units;

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

$("#celsius-button").click(function () {
  $("#temp-input").attr("placeholder", "Enter ℃");
});

$("#fahrenheit-button").click(function () {
  $("#temp-input").attr("placeholder", "Enter °F");
});

document
  .getElementById("celsius-button")
  .addEventListener("click", function () {
    units = "celsius";
  });

document
  .getElementById("fahrenheit-button")
  .addEventListener("click", function () {
    units = "fahrenheit";
  });

function validate() {
  const temperature = document.getElementById("temp-input").value;
  const humidity = document.getElementById("humidity-input").value;

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

tableData(arrayData);

function tableData(data) {
  var tableId = document.getElementById("inputData");

  for (var i = 0; i < data.length; i++) {
    var row =
      "<tr>" +
      "<td>" +
      data[i].applicable_date +
      "</td>" +
      "<td>" +
      data[i].weather_state_name +
      "</td>" +
      "<td>" +
      data[i].the_temp +
      "</td>" +
      "<td>" +
      data[i].air_pressure +
      "</td>" +
      "<td>" +
      data[i].humidity +
      "</td>" +
      "</tr>";
    tableId.innerHTML += row;
  }
}

// CHART
var xValues = [
  arrayData[0].applicable_date,
  arrayData[1].applicable_date,
  arrayData[2].applicable_date,
  arrayData[3].applicable_date,
  arrayData[4].applicable_date,
];

var yValues = [
  arrayData[0].the_temp,
  arrayData[1].the_temp,
  arrayData[2].the_temp,
  arrayData[3].the_temp,
  arrayData[4].the_temp,
];

var myChart = new Chart("weatherChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [
      {
        pointRadius: 4,
        fill: true,
        backgroundColor: "rgba(0,0,255,0.2)",
        borderColor: "rgba(0,0,255,0.6)",
        data: yValues,
      },
    ],
  },
  options: {
    legend: { display: false },
    scales: {
      yAxes: [{ ticks: { min: 7, max: 14 } }],
    },
  },
});

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
