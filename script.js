let localData = document.getElementById('local_data');
let temperaturaData = document.getElementById('temperatura_data');
var map;
 
 
function success(pos){
    console.log(pos.coords.latitude, pos.coords.longitude);
    localData.textContent = `Latitude:${pos.coords.latitude}, Longitude:${pos.coords.longitude}`;
    getClima(pos.coords.latitude, pos.coords.longitude)
        .then(clima => {temperaturaData.textContent = `Clima: ${clima}°`});
 
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
 
function getClima(lat, longi) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${longi}&units=metric&appid=e0bf80a120d5e637f433c49847feacdf`;
    const firstRetVal = fetch(url)
                        .then(resp => resp.json())
                        .then(jsonBody => jsonBody.list)
                        .then(items => {
                            return items[0].main.temp; 
                        });
    return firstRetVal;
}
 
 
var watchID = navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 5000
});
