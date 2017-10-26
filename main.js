'use strict';

//importing packages
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

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
    console.log('*** Webhook for api.ai query ***');
    console.log(req.body.result);

    if (req.body.result.action === 'weather') {
        let city = req.body.result.parameters['geo-city'];
        let restUrl = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + WEATHER_API_KEY + '&q=' + city;
  
        request.get(restUrl, (err, response, body) => {
            if (!err && response.statusCode == 200) {
                let json = JSON.parse(body);
                console.log(json);
                let tempC = ~~(json.main.temp - 273.15);
                if(tempc > 30)
                    let msg = 'The current condition in ' + json.name + ' is ' + json.weather[0].description + ' and the temperature is ' + tempC + ' ℃ '
                else if(temp < 30)
                    let msg = 'It is child in '+ json.name + ' is '+ json.weather[0].description
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
});

//Starting server
const server = app.listen(app.get('PORT'), function () {
    console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
});