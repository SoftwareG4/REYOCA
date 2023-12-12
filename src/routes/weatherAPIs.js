const http = require('http');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const url = require('url');

async function weatherAPI(req, res) {

  try {
    if (req.method === 'POST' && req.url.startsWith('/weather/')) {
      const params = url.parse(req.url, true);
      const endpoint = params.pathname.split('/').pop();

      switch (endpoint) {
        case 'city-coordinates':
          await handleCityCoordinates(req, res);
          break;
        case 'weather-details':
          await handleWeatherDetails(req, res);
          break;
        case 'user-coordinates':
          await handleUserCoordinates(req, res);
          break;
        default:
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    // Handle any uncaught exceptions gracefully
    console.error('Error handling weather API:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
 
async function handleCityCoordinates(req, res) {
  try {
    const body = await parseRequestBody(req);
    const { cityName } = JSON.parse(body);
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    const response = await fetch(geoApiUrl);
    const data = await response.json();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data[0]));
  } catch (error) {
    console.error('Error handling city coordinates:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

async function handleWeatherDetails(req, res) {
  try {
    const body = await parseRequestBody(req);
    const { latitude, longitude } = JSON.parse(body);
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    const response = await fetch(weatherApiUrl);
    const data = await response.json();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } catch (error) {
    console.error('Error handling weather details:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

async function handleUserCoordinates(req, res) {
  try {
    // Simulate user coordinates for demonstration purposes
    const userCoordinates = { latitude: 37.7749, longitude: -122.4194 };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userCoordinates));
  } catch (error) {
    console.error('Error handling user coordinates:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (error) => {
      reject(error);
    });
  });
}

}


module.exports = weatherAPI;



