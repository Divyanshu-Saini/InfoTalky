'use strict';

//importing packages
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');
const d2d = require('./deg2dirc');
const utc = require('./utc');

//Access keys
const APIAI_ACCESS_KEY = 'b46d0409224d4b91ab0a658eecac1572';
const WEATHER_API_KEY = 'e45dec4e225f094290d62885fa0c8c6f';

//initializing app
const app = express();
const spiaiApp = apiai(APIAI_ACCESS_KEY);

//Configuring port and other settings
app.set('PORT', (process.env.PORT || 2828));


//Using Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//Webhook for openweather api
app.post('/weather-forcast', (req, res) => {
    console.log(req.body.result);

    //request weather condition with city name
    if (req.body.result.action === 'weather-city') {
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let tempF = ~~(json.main.temp * 9 / 5 - 459.67);
                let tempC = ~~(json.main.temp - 273.15);
                let msg = 'The current condition in ' + json.name + ' is ' + json.weather[0].description + ' and the temperature is ' + tempC + ' ℃ '
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'weather'
                });
            } else {
                let errorMessage = 'I failed to look up the city name.';
                return res.status(400).json({
                    status: {
                        code: 400,
                        errorType: errorMessage
                    }
                });
            }
        })
    }
    //request wind speed
    if (req.body.result.action === 'wind-speed') {
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let windspeed = json.wind.speed
                let msg = 'The current wind speed in ' + json.name + ' is ' + windspeed + 'meter/sec'
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'weather'
                });
            } else {
                let errorMessage = 'I cannot access wind speed for this city.';
                return res.status(400).json({
                    status: {
                        code: 400,
                        errorType: errorMessage
                    }
                });
            }
        })
    }
    //request for wind direction
    if (req.body.result.action === 'wind-direction') {
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let winddeg = json.wind.deg;
                let direction = d2d(winddeg);
                let msg = 'The current wind  is  flowing in ' + direction
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'weather'
                });
            } else {
                let errorMessage = 'Cannot get wind direction at the moment.';
                return res.status(400).json({
                    status: {
                        code: 400,
                        errorType: errorMessage
                    }
                });
            }
        })
    }
    //request for sunrise and sunset
    if (req.body.result.action === 'sun-rise-set') {
        let city = req.body.result.parameters['geo-city'];
        let sunrise = req.body.result.parameters['weather-events'];
        let sunset = req.body.result.parameters['weather-events'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        if (sunrise == 'sunrise' || sunrise == 'sun rise' && sunset == 'sunset' || sunset == 'sun set') {
            request.get(restUrl, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    let json = JSON.parse(body);
                    console.log(json);
                    let unixrisetime = json.sys.sunrise;
                    let unixsettime = json.sys.sunset;
                    let sunrisetime = utc(unixrisetime);
                    let sunsettime = utc(unixsettime);
                    let msg = 'The sunrise occurs at' + sunrisetime + 'am and sunset occurs at ' + sunrisetime + 'pm in ' + city;
                    return res.json({
                        speech: msg,
                        displayText: msg,
                        source: 'weather'
                    });
                } else {
                    let errorMessage = 'Cannot get wind direction at the moment.';
                    return res.status(400).json({
                        status: {
                            code: 400,
                            errorType: errorMessage
                        }
                    });
                }
            })
        }

        else if (sunrise == 'sunrise' || sunrise == 'sun rise' && sunset == undefined || sunset == null) {
            request.get(restUrl, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    let json = JSON.parse(body);
                    console.log(json);
                    let unixtime = json.sys.sunrise;
                    let sunrisetime = utc(unixtime)
                    let msg = 'The sunrise occurs at' + sunrisetime + 'am in ' + city;
                    return res.json({
                        speech: msg,
                        displayText: msg,
                        source: 'weather'
                    });
                } else {
                    let errorMessage = 'Cannot get wind direction at the moment.';
                    return res.status(400).json({
                        status: {
                            code: 400,
                            errorType: errorMessage
                        }
                    });
                }
            })
        }

        else if (sunset == 'sunset' || sunset == 'sun set' && sunrise == undefined || sunrise == null) {
            request.get(restUrl, (err, response, body) => {
                if (!err && response.statusCode == 200) {
                    let json = JSON.parse(body);
                    console.log(json);
                    let unixtime = json.sys.sunset;
                    let sunsettime = utc(unixtime)
                    let msg = 'The sunset occurs at' + sunsettime + 'am in ' + city;
                    return res.json({
                        speech: msg,
                        displayText: msg,
                        source: 'weather'
                    });
                } else {
                    let errorMessage = 'Cannot get wind direction at the moment.';
                    return res.status(400).json({
                        status: {
                            code: 400,
                            errorType: errorMessage
                        }
                    });
                }
            })
        }

    }
    //Weather condition
    if (req.body.result.action === 'weather.weather-contition') {
        let city = req.body.result.parameters['geo-city'];
        let weathercondition = req.body.result.parameters['weather-condition'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let msg = 'As per the weather forcast the current weather condition in ' + json.name + ' is ' + json.weather[0].description;
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'weather'
                });
            } else {
                let errorMessage = 'Cannot get wind direction at the moment.';
                return res.status(400).json({
                    status: {
                        code: 400,
                        errorType: errorMessage
                    }
                });
            }
        })
    }
    //city location in coordinates
    if (req.body.result.action === 'geo-lat-long') {
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;
        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let msg = 'The geographical location for ' + json.name + ' is  in ' + +json.coord.lat + ' latitude  and ' + json.coord.lon + ' longititude'
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'weather'
                });
            } else {
                let errorMessage = 'Cannot get wind direction at the moment.';
                return res.status(400).json({
                    status: {
                        code: 400,
                        errorType: errorMessage
                    }
                });
            }
        })
    }

});


//Starting server
const server = app.listen(app.get('PORT'), function () {
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});
