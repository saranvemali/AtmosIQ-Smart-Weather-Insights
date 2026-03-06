const apiKey = "f643a36c49410897b36a917e092d05a3";

const cityInput = document.getElementById("cityInput");

cityInput.addEventListener("keypress",function(e){
if(e.key==="Enter"){
getWeather();
}
});

function getWeather(){

const cityName = cityInput.value.trim();

if(!cityName){
alert("Enter a city name");
return;
}

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`)
.then(res=>res.json())
.then(data=>{

if(data.cod!==200){
alert(data.message);
return;
}

updateUI(data);
updateMap(data.name);
setTempGlow(data.main.temp);

});
}

function updateUI(d){

city.innerText=d.name;
temp.innerText=Math.round(d.main.temp)+"°C";
condition.innerText=d.weather[0].description;

feels.innerText="Feels like "+Math.round(d.main.feels_like)+"°C";

humidity.innerText=d.main.humidity+"%";
pressure.innerText="Pressure "+d.main.pressure+" hPa";

wind.innerText=Math.round(d.wind.speed*3.6)+" km/h";
windDir.innerText="Direction "+d.wind.deg+"°";

analysisText.innerText=
`Temperature ranges between ${Math.round(d.main.temp_min)}°C and ${Math.round(d.main.temp_max)}°C with humidity ${d.main.humidity}% and pressure ${d.main.pressure} hPa.`

if(d.weather[0].main.includes("Rain")){
predictionText.innerText="Rain expected. Carry an umbrella.";
}
else if(d.main.temp>35){
predictionText.innerText="Very hot weather. Stay hydrated.";
}
else if(d.main.temp<10){
predictionText.innerText="Cold weather expected.";
}
else{
predictionText.innerText="Weather conditions are stable.";
}

}

function updateMap(city){
mapFrame.src=`https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed`;
}

function setTempGlow(t){

const card=document.querySelector(".temp-card");

if(t<15){
card.style.boxShadow="0 0 40px rgba(100,180,255,.8)";
}
else if(t<=30){
card.style.boxShadow="0 0 40px rgba(180,120,255,.8)";
}
else{
card.style.boxShadow="0 0 40px rgba(255,120,80,.9)";
}

}

function downloadReport(){

const { jsPDF } = window.jspdf;

const pdf=new jsPDF();

pdf.setFontSize(18);
pdf.text("AtmosIQ Weather Report",20,20);

let y=40;

[
["City",city.innerText],
["Temperature",temp.innerText],
["Feels Like",feels.innerText],
["Humidity",humidity.innerText],
["Pressure",pressure.innerText],
["Wind",wind.innerText],
["Condition",condition.innerText]

].forEach(r=>{

pdf.text(`${r[0]} : ${r[1]}`,20,y);
y+=10;

});

pdf.save("AtmosIQ_Report.pdf");

reportStatus.innerText="✔ Report downloaded";

}