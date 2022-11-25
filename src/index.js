// Yo btw, this is stolen from @jasonlong's Github profile.
// (https://github.com/jasonlong/jasonlong/blob/c9c760318610785772bd0552a9dafc70b64c9e16/build-svg.js)
// I have changed stuff and refactored stuff.

const fs = require('fs');
const fetch = require('node-fetch');
const qty = require('js-quantities')

const WEATHER_API_TOKEN = process.env.WEATHER_API_TOKEN
const WEATHER_DOMAIN = 'http://dataservice.accuweather.com'
const WEATHER_EMOJIS = {
  1: '☀️',
  2: '☀️',
  3: '🌥️',
  4: '🌥️',
  5: '🌥️',
  6: '🌥️',
  7: '☁️',
  8: '☁️',
  11: '😶‍🌫️',
  12: '🌧️',
  13: '🌧️',
  14: '🌧️',
  15: '🌩️',
  16: '🌩️',
  17: '🌧️',
  18: '🌧️',
  19: '🌧️',
  20: '🌧️',
  21: '🌧️',
  22: '❄️',
  23: '❄️',
  24: '🌧️',
  25: '🌧️',
  26: '🌧️',
  29: '🌧️',
  30: '😶‍🌫️',
  31: '🥵',
  32: '🥶',
}

const dayBubbleWidths = {
  Monday: 210,
  Tuesday: 210,
  Wednesday: 240,
  Thursday: 220,
  Friday: 195,
  Saturday: 220,
  Sunday: 205,
}

const locationKey = '202196'

fetch(`${WEATHER_DOMAIN}/forecasts/v1/daily/1day/${locationKey}?apikey=${WEATHER_API_TOKEN}`)
  .then(response => response.json())
  .then(async response => {
    const todayDay = (await (await fetch("https://www.timeapi.io/api/Time/current/zone?timeZone=Asia:Makassar")).json()).dayOfWeek

    console.log('Today is', todayDay)
    console.log(response)
    
    const degF = Math.round(response?.DailyForecasts[0]?.Temperature?.Maximum?.Value ?? 86)
    const degC = Math.round(qty(`${degF} tempF`).to('tempC').scalar)
    const icon = response.DailyForecasts[0]?.Day?.Icon

    fs.readFile(`${__dirname}/messageTemplate.svg`, 'utf8', (error, data) => {
      if (error) {
        console.error(error);
        throw error
      }

      data = data.replace('{degF}', degF)
      data = data.replace('{degC}', degC)
      data = data.replace('{weatherEmoji}', WEATHER_EMOJIS[icon])
      data = data.replace('{todayDay}', todayDay)
      data = data.replace('{dayBubbleWidth}', dayBubbleWidths[todayDay])

      data = fs.writeFile(`${__dirname}/../out/output.svg`, data, (err) => {
        if (err) {
          console.error(err)
          throw err
        }
      })
    })
  })
  .catch(error => console.log(error))