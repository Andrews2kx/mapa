let localData = document.getElementById('local_data');
let cidadeData = document.getElementById('cidade_data');
let tempData = document.getElementById('temp_data');
let minTempData = document.getElementById('min_temp_data');
let maxTempData = document.getElementById('max_temp_data');
let sensTermData = document.getElementById('sensacao_term_data');
let umidadeData = document.getElementById('umidade_term_data');
let velocidadeVentoData = document.getElementById('velocidade_vento_data');
var map;
 
 
function success(pos){
    console.log(pos.coords.latitude, pos.coords.longitude);
    localData.textContent = `Latitude:${pos.coords.latitude}, Longitude:${pos.coords.longitude}`;
    getClima(pos.coords.latitude, pos.coords.longitude)
        .then(clima => {
        	cidadeData.textContent = `${clima.cidade}, ${clima.pais}`;
			tempData.textContent = `Temperatura: ${clima.temp}°`;
			minTempData.textContent = `Mínimo: ${clima.minTemp}°`;
			maxTempData.textContent = `Máximo: ${clima.maxTemp}°`;
			sensTermData.textContent = `Sensação Térmica: ${clima.sensTerm}°`;
			umidadeData.textContent = `Umidade: ${clima.umidade}%`;
            velocidadeVentoData.textContent = `Velocidade do vento: ${clima.velocidadeVento} km/h`;
        });
 
    if (map === undefined) {
        map = L.map('mapid').setView([pos.coords.latitude, pos.coords.longitude], 17);
    } else {
        map.remove();
        map = L.map('mapid').setView([pos.coords.latitude, pos.coords.longitude], 17);
    }
 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
 
    L.marker([pos.coords.latitude, pos.coords.longitude]).addTo(map)
        .bindPopup('Eu estou aqui!')
        .openPopup();
}
 
function error(err){
    console.log(err);
}
 
async function getClima(lat, longi) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${longi}&units=metric&appid=e0bf80a120d5e637f433c49847feacdf`;
    const firstRetVal = fetch(url)
                        .then(resp => resp.json())
                        .then(jsonBody => jsonBody)
                        .then(body => {
                            return {
                                pais: body.city.country,
                                cidade: body.city.name,
                                temp: body.list[0].main.temp,
                                minTemp: body.list[0].main.temp_min,
                                maxTemp: body.list[0].main.temp_max,
                                sensTerm: body.list[0].main.feels_like,
                                umidade: body.list[0].main.humidity,
                                velocidadeVento: body.list[0].wind.speed
                            }
                        });
    return firstRetVal;
}
 
 
var watchID = navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 5000
});
