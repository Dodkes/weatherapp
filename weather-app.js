var unity;

function active(id){
    if(id == "table-tab"){
        $("#chart-tab").removeClass("active");
        $("#table-tab").addClass("active");
        $("#calculator-tab").removeClass("active");
        conatinersReveal(id);
    }else if(id == "chart-tab"){
        $("#chart-tab").addClass("active");
        $("#table-tab").removeClass("active");
        $("#calculator-tab").removeClass("active");
        conatinersReveal(id);
    }else if(id == "calculator-tab"){
        $("#chart-tab").removeClass("active");
        $("#table-tab").removeClass("active");
        $("#calculator-tab").addClass("active");
        conatinersReveal(id);
    }
}

function conatinersReveal(id){
    if(id == "table-tab"){
        $(".table-container").css("display", "block")
        $(".chart-container").css("display", "none")
        $(".calculator-container").css("display", "none")
    }else if(id == "chart-tab"){
        $(".table-container").css("display", "none")
        $(".chart-container").css("display", "block")
        $(".calculator-container").css("display", "none")
    }else if(id == "calculator-tab"){
        $(".table-container").css("display", "none")
        $(".chart-container").css("display", "none")
        $(".calculator-container").css("display", "block")
    }
}

$("#celsius-button").click(function(){
    $("#temp-input").attr("placeholder", "Enter ℃")
})

$("#fahrenheit-button").click(function(){
    $("#temp-input").attr("placeholder", "Enter °F")
})

document.getElementById("celsius-button").addEventListener('click', function(){
    unity = "celsius";
})

document.getElementById("fahrenheit-button").addEventListener('click', function(){
    unity = "fahrenheit";
})

function calculate(){
    var temp = document.getElementById("temp-input").value;
    var humidity = document.getElementById("humidity-input").value;
    if(unity == undefined){
        alert("Select units")
    }else if(unity =="celsius" && temp < 26.7){
        alert("Index can not be calculated for temperature less than 26.7 °C")
    }else if(unity == "fahrenheit" && temp < 80){
        alert("Index can not be calculated for temperature less than 80 °F")
    }else if(humidity < 0 || humidity >100){
        alert("Humidity is a percentage value. Please enter value between 100 - 0")
    }else if(unity == "celsius"){
        var T = (9/5) * temp + 32;
        indexCalculation(T);
    }else{
        T = temp;
        indexCalculation(T);
    }
}

function indexCalculation(T){
    var humidity = document.getElementById("humidity-input").value;
    var heatIndex = -42.379 + (2.04901523 * T) + (10.14333127 * humidity) 
    - (0.22475541 * T * humidity) - (6.83783 * 10**-3 * T**2)
    - (5.481717 * 10**-2 * humidity**2) + (1.22874 * 10**-3 * T**2 * humidity) 
    + (8.5282 * 10**-4* T * humidity**2) - (1.99 * 10**-6 * T**2 * humidity**2);
    document.getElementById("index-result").textContent = "Heat Index is " + heatIndex;
}