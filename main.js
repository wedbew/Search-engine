//  Global variables
let alert, limit;
// Set limit variables to the default vaule of 10
// This variable is corresponding to number of articles/images from Reddit API
limit = 10;
// Assign to variable alert the alert DOM element
alert = document.getElementById('alert');
// Hide alert element by default
alert.style.display = "none";

// Add submit event listener to form with get API as an callback
document.getElementById('form').addEventListener('submit', getAPI);

// Imidietly invoked functione expression
(function() {
    // Call getLocalization function
    getLocalization()
})()

// Fetch data about current place from IP address
function getLocalization() {
    // Variables 
    let city, country, countryCode, currency, lat, lon;
    // IPAPI
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            // Assigning fetched data to declare variables
            city = data.city;
            country = data.country_name;
            countryCode = data.country;
            currency = data.currency;
            lat = data.latitude;
            lon = data.longitude;
            // Call getCountryInfo this function calls also getCurrency, getWheather and addMap (via getWheather)
            getCountryInfo(country, city);
            // Call getReddit
            getReddit(city, country);
            // Call getPixaBay
            getPixaBay(city, country);
            // Call WikiCity
            getWikiCity(city);
            // Call getWikiCountry
            getWikiCountry(country);
        })
        .catch(err => catchError(err, 'IPAPI error'));
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
    // Call getCountryInfo this function calls also getCurrency, getWheather and addMap (via getWheather)
    getCountryInfo(country, city);
    // Call getReddit
    getReddit(city, country);
    // Call getPixaBay
    getPixaBay(city, country);
    // Call WikiCity
    getWikiCity(city);
    // Call getWikiCountry
    getWikiCountry(country);
}

// Fetch data about current wheather from open wheather
function getWheather(city, countryCode) {
    // Base of API
    const api = 'https://api.openweathermap.org/data/2.5/find?q=';
    // Change units of data 
    const units = '&units=metric';
    // API key
    const apiKey = '&appid=d0fd632de5a6a004c911c07e43f9fc2a';
    // concat link
    let link = api + city + ',' + countryCode + units + apiKey;
    // Variables
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
            // console.log(temp, pressure, humidity, wind, clouds, lat, lon);
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
            // Display element as an block - unhide it
            document.getElementById('wheather').style.display = 'block';
            // Add HTML element to site
            document.getElementById('wheather').innerHTML = list;
            addMap(lon, lat);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'OpenWheather API error', 'wheather'));
}

// Fetch information about country from rest countries
function getCountryInfo(country, city) {
    // Base of API
    const api = 'https://restcountries.eu/rest/v2/name/';
    // Concat link
    let link = api + country;
    // Variables
    let countryCode, capital, subregion, population, area, currencie, flag, card, language;
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
                // Create HTML element
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
            // Display element as an block - unhide it
            document.getElementById('country').style.display = 'block';
            // Add HTML element to site
            document.getElementById('country').innerHTML = card;
            // console.log(countryCode, capital, subregion, population, area, currencie, language, flag);
            getCurrency(currencie);
            // getNews(countryCode);
            getWheather(city, countryCode);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'REST Country error', 'country'));
}

// Fetch data about current currency exchange rates from exchange rates API
function getCurrency(currency) {
    // Base of API
    const api = 'https://api.exchangeratesapi.io/latest?base='
        // Concat link
    let link = api + currency;
    // Variables
    let date, eur, usd, gbp, pln, exchange;
    //console.log(link);
    fetch(link)
        .then(res => res.json())
        .then(data => {
            date = data.date;
            eur = data.rates.EUR;
            usd = data.rates.USD;
            gbp = data.rates.GBP;
            pln = data.rates.PLN;
            // Create HTML element
            exchange = `
            <table class="table table-hover">
                <thead>
                <tr>
                    <th scope="col">${currency}</th>
                    <th scope="col">USD</th>
                    <th scope="col">GBP</th>
                    <th scope="col">PLN</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>1</th>
                    <td>${usd.toFixed(4)}</td>
                    <td>${gbp.toFixed(4)}</td>
                    <td>${pln.toFixed(4)}</td>
                </tr>
                </tbody>
            </table>
            `;
            // Display element as an block - unhide it
            document.getElementById('exchange').style.display = 'block';
            // Add HTML element to site
            document.getElementById('exchange').innerHTML = exchange;
            // console.log(date, eur, usd, gbp, pln);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'Currency Exchange API error', 'exchange'));
}

// Fetch current news from News API
function getNews(country) {
    // Base of API
    const api = 'https://newsapi.org/v2/top-headlines?country='
        // API key
    const apiKey = '&apiKey=d96898cafee9454194a3f05681c1d972'
        // Concat link
    let link = api + country + apiKey;
    // Variables
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
            // Create HTML elemnt
            card = `
            <div class="card" style="width: 23rem;">
                <img src="${image}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${date}</h6>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                    <a href="${url}" class="btn btn-primary" target="_blank">Learn more</a>
                </div>
            </div>
            <div class="card" style="width: 23rem;">
                <img src="${image2}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${date2}</h6>
                    <h5 class="card-title">${title2}</h5>
                    <p class="card-text">${description2}</p>
                    <a href="${url2}" class="btn btn-primary" target="_blank">Learn more</a>
                </div>
            </div>
            <div class="card" style="width: 23rem;">
                <img src="${image3}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title">${date3}</h6>
                    <h5 class="card-title">${title3}</h5>
                    <p class="card-text">${description3}</p>
                    <a href="${url3}" class="btn btn-primary" target="_blank">Learn more</a>
                </div>
            </div>
            `;
            // Display element as an block - unhide it
            document.getElementById('news').style.display = 'block';
            // Add HTML element to site
            document.getElementById('news').innerHTML = card;
            // console.log(author, title, description, url, image, date);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'News API error', 'news'));
}

// Fetch images of the searching city
function getPixaBay(city, country) {
    // Base of API
    const api = 'https://pixabay.com/api/?key=11388283-2e82ba6cedc0667a0429e6e25&q=';
    // Type of searching files
    const type = '&image_type=photo';
    // Concat link
    let link = api + city + '+' + country + type;
    let imageURL, image;
    fetch(link)
        .then(res => res.json())
        .then(data => {
            imageURL = data.hits[0].largeImageURL;
            image = `
            <img src="${imageURL}" class="img-fluid rounded">
            `;
            let carousel = `
            <div id="carouselIndicators" class="carousel slide rounded-corners" data-interval="5000" data-ride="carousel">
            <ol class="carousel-indicators">
                <li data-target="#carouselIndicators" data-slide-to="0" class="active"></li>
                <li data-target="#carouselIndicators" data-slide-to="1"></li>
                <li data-target="#carouselIndicators" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
                <div class="carousel-item active">
                <img class="d-block w-100 carousel-image" src="${data.hits[0].largeImageURL}" alt="Image of ${city}, ${country}">
                </div>
                <div class="carousel-item">
                <img class="d-block w-100 carousel-image" src="${data.hits[1].largeImageURL}" alt="Image of ${city}, ${country}">
                </div>
                <div class="carousel-item">
                <img class="d-block w-100 carousel-image" src="${data.hits[2].largeImageURL}" alt="Image of ${city}, ${country}">
                </div>
            </div>
            </div>
            `
                // Display element as an block - unhide it
            document.getElementById('image').style.display = 'block';
            // Add HTML element to site
            document.getElementById('image').innerHTML = carousel;
            // console.log(imageURL);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'PixaBay API error', 'image'));
}

// Fetch first paragraph from wikipedia about searching city
function getWikiCity(city) {
    // Base of API
    const api = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
        // Concat link
    let link = api + city;
    let info, url, cityInfo;
    fetchJsonp(link)
        .then(res => res.json())
        .then(data => {
            info = data[2][0];
            url = data[3][0];
            // Create HTML element
            cityInfo = `
            <ul class="list-group">
                <li class="list-group-item active" aria-active="true"><strong>Information about ${city} from Wikipedia</strong></li>
                <li class="list-group-item"><h3>${info}</h3></li>
            </ul>
            <a href="${url}" class="btn btn-primary mt-3" target="_blank">Learn more</a>
            `;
            // Display element as an block - unhide it
            document.getElementById('wikiCity').style.display = 'block';
            // Add HTML element to site
            document.getElementById('wikiCity').innerHTML = cityInfo;
            // console.log(info, url);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'Wikipedia (citi) API error', 'wikiCity'));
}

// Fetch first paragraph from wikipedia about searching country
function getWikiCountry(country) {
    // Base of API
    const api = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='
        // Concat link
    let link = api + country;
    let info, url, countryInfo;
    fetchJsonp(link)
        .then(res => res.json())
        .then(data => {
            info = data[2][0];
            url = data[3][0];
            // Create HTML element
            countryInfo = `
            <ul class="list-group">
                <li class="list-group-item active" aria-active="true"><strong>Information about ${country} from Wikipedia</strong></li>
                <li class="list-group-item"><h3>${info}</h3></li>
            </ul>
            <a href="${url}" class="btn btn-primary mt-3" target="_blank">Learn more</a>
            `;
            // Display element as an block - unhide it
            document.getElementById('wikiCountry').style.display = 'block';
            // Add HTML element to site
            document.getElementById('wikiCountry').innerHTML = countryInfo;
            // console.log(info, url);
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'Wikipedia (country) API error', 'wikiCountry'));
}

// Mapbox centered by the longitude and latitude of searching city
function addMap(longitude, latitude) {
    mapboxgl.accessToken = 'pk.eyJ1IjoieGxvd2FiIiwiYSI6ImNqcjY4dXQ2cTEweWwzeXBuNnU0Nmkyc3YifQ.cWEZSHM6B2axtpkwg--Psw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        // Centering map by longitude and latitude
        center: [longitude, latitude],
        zoom: 10
    });
    map.addControl(new mapboxgl.NavigationControl());
}

// Fetch data from reddit API
function getReddit(city, country) {
    // Variables 
    let api, sortBy, link;
    // Base of API 
    api = 'https://www.reddit.com/search.json?q=';
    // Sort articles from reddit by relevence
    sortBy = '&sort=relevance';
    // Limit number of array's element
    limitBy = '&limit=' + limit;
    // Concat link 
    link = api + city + '%02' + country + sortBy + limitBy;
    // console.log(link);
    fetch(link)
        .then(res => res.json())
        .then(data => {
            const reddit = data.data.children;
            // console.table(reddit);
            // Creating HTML element with data from API 
            let output = '<div class="card-columns">';
            reddit.forEach(post => {
                // Check for image
                // console.log(post.data.preview);
                let image = post.data.preview ? post.data.preview.images[0].source.url : '/img/reddit.png';
                output += `
                    <div class="card mb-2">
                    <img class="card-img-top reddit-image" src="${image}" alt="Card image cap">
                    <div class="card-body">
                    <h5 class="card-title">${post.data.title}</h5>
                    <p class="card-text">${truncate(post.data.selftext, 100)}</p>
                    <a href="${post.data.url}" target="_blank
                    " class="btn btn-primary">See More</a>
                    <hr>
                    <span class="badge badge-secondary">Subreddit: ${post.data.subreddit}</span> 
                    <span class="badge badge-dark">Score: ${post.data.score}</span>
                    </div>
                    </div>
                `;
            });
            output += '</div>';
            // Display element as an block - unhide it
            document.getElementById('reddit').style.display = 'block';
            // Add html element to site
            document.getElementById('reddit').innerHTML = output;
        })
        // After catching error call function catchError - to read more find 'catchError'
        .catch(err => catchError(err, 'Reddit API error', 'reddit'));
}

// Catch all errors, function takes three arguments error, info - information about which API catch error, and element which corresponds to DOM element which should be hide if some error occur
const catchError = (error, info, element) => {
    // Remove class from alert element
    alert.classList.remove('hideAlert');
    // Display alert element as an block
    alert.style.display = "block";
    // Add information to alert
    alert.textContent += `${info}:`;
    alert.textContent += error;
    // After 4s add class hideAlert to hide alert
    setTimeout(() => alert.classList.add('hideAlert'), 4000);
    // After 5s completly hide alert element
    setTimeout(() => alert.style.display = "none", 5000);
    // Hide DOM element which catched errors
    document.getElementById(`${element}`).style.display = 'none';
}

// Limit number of words
function truncate(string, limit) {
    const short = string.indexOf(' ', limit);
    if (short == -1) return string;
    return string.substring(0, short);
}



console.log('%c Welcome to find info about cites and country app', 'color: crimson; font-weight:bold; font-size: 14px; font-family: Helvetica, Arial, sans-serif');
console.log('This app send requests to 8 different API, on the beging app send data to ipapi to figured out the current place of being. Next it sends data to wheather, mapbox, pixabay, wikipedia, exchange rates, rest countries and reddit to show you some basic information about your current location. Each time you put some new information in the form website will again send requests to APIs to give you back information you want too. If something go wrong, elemt wich catched error will be hide to prevent from giving you wrong information. I hope that everthing work just fine and I would like to wish you a nice day!')
console.log('%c If you want to change numbers of articles form reddit just write limit = to number of articles that you wanted to see (ex. limit = 3) and press enter', 'color: crimson');