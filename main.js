'use strict';

//importing packages
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');
const d2d = require('./deg2dirc');
const utc = require('./utc');

//Access keys
const APIAI_ACCESS_KEY = '9a0f24e13b6b497093ab421b8ac66c3e';
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
    if (req.body.result.action === 'wind-speed'){
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
    if (req.body.result.action === 'wind-direction'){
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let winddeg = json.wind.deg;
                let direction =d2d(winddeg);
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

    //request for sunrise time
    if (req.body.result.action === 'sunrise+'){
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;

        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let UNIX_time = json.sys.sunrise;
                let sunrise =utc(UNIX_time);
                let msg = let msg ='The the sun will rise at '+sunrise+ 'am in '+city
                return res.json({
                    speech: msg,
                    displayText: msg,
                    source: 'weather'
                });
            } else {
                let errorMessage = 'Cannot get the data for sunrise';
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
