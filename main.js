//  Global variables
var language;
var alert = document.getElementById('alert');
alert.style.display = "none";

// Imidietly invoked functione expression
(function() {
    getLocalization()
})()

// Init ip API
function getLocalization() {
    let city, country, countryCode, currency, lat, lon;
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            city = data.city;
            country = data.country_name;
            countryCode = data.country;
            currency = data.currency;
            lat = data.latitude;
            lon = data.longitude;
            console.log(city, country, countryCode, currency, lat, lon);
            getCountryInfo(country, city);
            // getWheather(city, countryCode);
            // getCurrency(currency);
            // getNews(countryCode);
            getPixaBay(city, country);
            getWikiCity(city);
            getWikiCountry(country);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "IPAPI error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

// Add submit event listiner to form
document.getElementById('form').addEventListener('submit', getAPI);

function getAPI(e) {
    // Prevent of default beahaviour
    e.preventDefault();
    // Get city name 
    const city = document.getElementById('search-city').value;
    // Get country name
    const country = document.getElementById('search-country').value;
    // Init open wheather API
    // getWheather(city, country)
    // Iniit mabox API
    // getMap(lon, lat)
    // Init rest countries API
    getCountryInfo(country, city)
        // Init news API
        // getNews(countryCode)
        // Init wikipedia API
        // getWiki(city)
        // Init reddit API
        // getReddit(country)
        // Init PixaBay API
    getPixaBay(city, country)
        // Init exchange currency API
        // getCurrency(currency)
    getWikiCity(city);
    getWikiCountry(country);
}

function getWheather(city, countryCode) {
    const api = 'https://api.openweathermap.org/data/2.5/find?q=';
    const units = '&units=metric';
    const apiKey = '&appid=d0fd632de5a6a004c911c07e43f9fc2a';
    let link = api + city + ',' + countryCode + units + apiKey;
    let temp, weather, pressure, humidity, wind, clouds, lat, lon, list;
    fetch(link)
        .then(res => res.json())
        .then(data => {
            temp = data.list[0].main.temp;
            weather = data.list[0].weather[0].description;
            country = data.list[0].main.country;
            pressure = data.list[0].main.pressure;
            humidity = data.list[0].main.humidity;
            wind = data.list[0].wind.speed;
            clouds = data.list[0].clouds.all;
            lat = data.list[0].coord.lat;
            lon = data.list[0].coord.lon;
            console.log(temp, pressure, humidity, wind, clouds, lat, lon);
            list = `
            <ul class="list-group">
                <li class="list-group-item active" aria-active="true">City: <strong>${city}</strong></li>
                <li class="list-group-item">Temperature: <strong>${temp}°C</strong></li>
                <li class="list-group-item">Whetaher: <strong>${weather}</strong></li>
                <li class="list-group-item">Pressure: <strong>${pressure}hPa</strong></li>
                <li class="list-group-item">Humidity: <strong>${humidity}%</strong></li>
                <li class="list-group-item">Wind speed: <strong>${wind}m/s</strong></li>
                <li class="list-group-item">Clouds: <strong>${clouds}%</strong></li>
                <li class="list-group-item">Longitude: <strong>${lon}</strong></li>
                <li class="list-group-item">Latitude: <strong>${lat}</strong></li>
            </ul>
            `;
            document.getElementById('wheather').innerHTML = list;
            addMap(lon, lat);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "OpenWheather API error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function getCountryInfo(country, city) {
    const api = 'https://restcountries.eu/rest/v2/name/';
    let link = api + country;
    let countryCode, capital, subregion, population, area, currencie, flag, card;
    fetch(link)
        .then(res => res.json())
        .then(data => {
            countryCode = data[0].alpha2Code;
            capital = data[0].capital;
            subregion = data[0].subregion;
            population = data[0].population;
            area = data[0].area;
            currencie = data[0].currencies[0].code;
            language = data[0].languages[0].name;
            flag = data[0].flag
            card = `
            <ul class="list-group">
                <li class="list-group-item active" aria-active="true">Country: <strong>${country}</strong></li>
                <li class="list-group-item">Flag: <img src="${flag}" id="flag" class="img-fluid"></li>
                <li class="list-group-item">Capital: <strong>${capital}</strong></li>
                <li class="list-group-item">Subregion: <strong>${subregion}</strong></li>
                <li class="list-group-item">Population: <strong>${population}</strong></li>
                <li class="list-group-item">Area: <strong>${area}</strong></li>
                <li class="list-group-item">Currencie: <strong>${currencie}</strong></li>
                <li class="list-group-item">Language: <strong>${language}</strong></li>
            </ul>
            `;
            document.getElementById('country').innerHTML = card;
            console.log(countryCode, capital, subregion, population, area, currencie, language, flag);
            getCurrency(currencie);
            getNews(countryCode);
            getWheather(city, countryCode);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "REST Country error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function getCurrency(currency) {
    const api = 'https://api.exchangeratesapi.io/latest?base='
    let link = api + currency;
    let date, eur, usd, gbp, pln, exchange;
    fetch(link)
        .then(res => res.json())
        .then(data => {
            date = data.date;
            eur = data.rates.EUR;
            usd = data.rates.USD;
            gbp = data.rates.GBP;
            pln = data.rates.PLN;
            exchange = `
            <table class="table table-hover">
                <thead>
                <tr>
                    <th scope="col">EUR</th>
                    <th scope="col">USD</th>
                    <th scope="col">GBP</th>
                    <th scope="col">PLN</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>${eur}</th>
                    <td>${usd}</td>
                    <td>${gbp}</td>
                    <td>${pln}</td>
                </tr>
                </tbody>
            </table>
            `;
            document.getElementById('exchange').innerHTML = exchange;
            console.log(date, eur, usd, gbp, pln);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "Currency Exchange API error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function getNews(country) {
    const api = 'https://newsapi.org/v2/top-headlines?country='
    const apiKey = '&apiKey=d96898cafee9454194a3f05681c1d972'
    let link = api + country + apiKey;
    let author, title, description, url, image, date, title2, description2, url2, image2, date2, title3, description3, url3, image3, date3, card;
    fetch(link)
        .then(res => res.json())
        .then(data => {
            // author = data.articles[0].author;
            title = data.articles[0].title;
            description = data.articles[0].description;
            url = data.articles[0].url;
            image = data.articles[0].urlToImage;
            date = data.articles[0].publishedAt;
            title2 = data.articles[1].title;
            description2 = data.articles[1].description;
            url2 = data.articles[1].url;
            image2 = data.articles[1].urlToImage;
            date2 = data.articles[1].publishedAt;
            title3 = data.articles[2].title;
            description3 = data.articles[2].description;
            url3 = data.articles[2].url;
            image3 = data.articles[2].urlToImage;
            date3 = data.articles[2].publishedAt;
            card = `
            <div class="card" style="width: 23rem;">
                <img src="${image}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${date}</h6>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <a href="${url}" class="btn btn-primary" target="_blank">Lern more</a>
                </div>
            </div>
            <div class="card" style="width: 23rem;">
                <img src="${image2}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${date2}</h6>
                    <h5 class="card-title">${title2}</h5>
                    <p class="card-text">${description2}</p>
                    <a href="${url2}" class="btn btn-primary" target="_blank">Lern more</a>
                </div>
            </div>
            <div class="card" style="width: 23rem;">
                <img src="${image3}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${date3}</h6>
                    <h5 class="card-title">${title3}</h5>
                    <p class="card-text">${description3}</p>
                    <a href="${url3}" class="btn btn-primary" target="_blank">Lern more</a>
                </div>
            </div>
            `
            console.log(card);
            document.getElementById('news').innerHTML = card;
            console.log(author, title, description, url, image, date);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "News API error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function getPixaBay(city, country) {
    const api = 'https://pixabay.com/api/?key=11388283-2e82ba6cedc0667a0429e6e25&q=';
    const type = '&image_type=photo';
    let link = api + city + '+' + country + type;
    let imageURL, image;
    fetch(link)
        .then(res => res.json())
        .then(data => {
            imageURL = data.hits[0].largeImageURL;
            image = `
            <img src="${imageURL}" class="img-fluid rounded">
            `;
            document.getElementById('image').innerHTML = image;
            console.log(imageURL);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "PixaBay API error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function getWikiCity(city) {
    const api = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
    let link = api + city;
    let info, url, cityInfo;
    fetchJsonp(link)
        .then(res => res.json())
        .then(data => {
            info = data[2][0];
            url = data[3][0];
            cityInfo = `
            <ul class="list-group">
                <li class="list-group-item active" aria-active="true"><strong>Information about ${city} from Wikipedia</strong></li>
                <li class="list-group-item"><h3>${info}</h3></li>
            </ul>
            <a href="${url}" class="btn btn-primary mt-3" target="_blank">Lern more</a>
            `;
            document.getElementById('wikiCity').innerHTML = cityInfo;
            console.log(info, url);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "Wikipedia (citi) API error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function getWikiCountry(country) {
    const api = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
    let link = api + country;
    let info, url, countryInfo;
    fetchJsonp(link)
        .then(res => res.json())
        .then(data => {
            info = data[2][0];
            url = data[3][0];
            countryInfo = `
            <ul class="list-group">
                <li class="list-group-item active" aria-active="true"><strong>Information about ${country} from Wikipedia</strong></li>
                <li class="list-group-item"><h3>${info}</h3></li>
            </ul>
            <a href="${url}" class="btn btn-primary mt-3" target="_blank">Lern more</a>
            `;
            document.getElementById('wikiCountry').innerHTML = countryInfo;
            console.log(info, url);
        })
        .catch(err => {
            alert.classList.remove('hideAlert');
            alert.style.display = "block";
            alert.textContent += "Wikipedia (country) API error:";
            alert.textContent += err;
            setTimeout(() => alert.classList.add('hideAlert'), 3000);
            setTimeout(() => alert.style.display = "none", 4000);
        });
}

function addMap(longitude, latitude) {
    mapboxgl.accessToken = 'pk.eyJ1IjoieGxvd2FiIiwiYSI6ImNqcjY4dXQ2cTEweWwzeXBuNnU0Nmkyc3YifQ.cWEZSHM6B2axtpkwg--Psw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 10
    });
    map.addControl(new mapboxgl.NavigationControl());
}