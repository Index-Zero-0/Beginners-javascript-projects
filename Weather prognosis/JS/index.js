const API_KEY = '';
const API_URL = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}`;
const Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const searchForm = document.querySelector('.searchBox');
const currentCity_Weather = document.querySelector('.section-1');


const getAndShow = async function (city) {
	let response = await fetch(`${API_URL}&q=${city}&aqi=no`);
	const jsonResponse = await response.json();
	const date = new Date(jsonResponse.location.localtime);
	const city_weather = {
		name: jsonResponse.location.name,
		weather: jsonResponse.current.condition.text,
		icon: jsonResponse.current.condition.icon,
		temperature: jsonResponse.current.temp_c,
		today: Days[date.getDay()],
		time: date.toLocaleTimeString(),
		wind_speed: jsonResponse.current.wind_mph / 2.237
	};
	render(city_weather);
}


const render = function (city) {
	currentCity_Weather.innerHTML = `
		<h1 class="cityName">${city.name}</h1>
			<div class="weather-symbol">
				<img src="https:${city.icon}" alt="weathers symbol">
				<div>
					<h6>${city.weather}</h6>
					<h4 class="Temperature">${city.temperature}<span>&#8451;</span> </h4>
				</div>
			</div>
			<ul class="weatherInfo">
				<li>
					<p class="time"><span class="day">${city.today}</span> ${city.time}</p>
				</li>
				<li>
					<p>Wind speed: <span>${city.wind_speed.toFixed(1)} m/s</span></p>
				</li>
			</ul>
	`;
}


const init = function () {
	searchForm.addEventListener('submit', async e => {
		e.preventDefault();
		const query = searchForm.querySelector('input').value;
		await getAndShow(query);
	});
	getAndShow('London');
}

init();