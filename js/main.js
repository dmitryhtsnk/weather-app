const API_KEY = '7fd6bc8fe89578e5e4ab71f76368c7f4';
const form = document.querySelector('#form');
const input = document.querySelector('.form__input');

form.onsubmit = submitHendler;

async function submitHendler (e) {
    e.preventDefault();

    if(!input.value.trim()){
        console.log("Input city name");
        return
    }
     
    const cityName = input.value.trim();
    input.value = '';
    const cityInfo = await getGeo(cityName);

    if(!cityInfo.length) return;

    const cityWeather = await getWeather(cityInfo[0]['lat'], cityInfo[0]['lon']);
    

    const weatherData = {
        name: cityWeather.name,
        temp: cityWeather.main.temp,
        humidity: cityWeather.main.humidity,
        speed: cityWeather.wind.speed,
        main: cityWeather.weather[0]['main']
    };

    renderWeatherData(weatherData);
}

 async function getGeo (name){
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_KEY}`;
    const response = await fetch(geoUrl);
    const data = await response.json();
    return data;
}

async function getWeather (lat, lon){
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    return data;
}

function renderWeatherData (data){
    // Display blocks with information
    document.querySelector('.weather__info').classList.remove('none');
    document.querySelector('.weather__details   ').classList.remove('none');

    // Displaying weather data
    const temp = document.querySelector('.weather__temp');
    const name = document.querySelector('.weather__city');
    const img = document.querySelector('.weather__img');
    const humidity = document.querySelector('#humidity');
    const speed = document.querySelector('#speed');

    temp.innerText = Math.round(data.temp) + '°c';
    name.innerText = data.name;
    humidity.innerText = data.humidity + ' %';
    speed.innerText = data.speed + ' km/h';

    const fileNames = {
        'Clouds': 'clouds',
        'Clear': 'clear',
        'Rain': 'rain',
        'Mist': 'mist',
        'Drizzle': 'drizzle',
        'Snow': 'snow'
    }

    if(fileNames[data.main]){
        img.src = `./img/weather/${fileNames[data.main]}.png`;
    }
}