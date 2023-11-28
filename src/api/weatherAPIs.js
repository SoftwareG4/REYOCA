const axios = require('axios');

const OPENWEATHERMAP_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

async function getWeatherForecast(city, startDate, endDate) {
  try {
    // Use the OpenWeatherMap API to get the weather forecast
    const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q: city,
        appid: OPENWEATHERMAP_API_KEY,
      },
    });

    // Extract relevant data from the API response
    const forecastData = response.data.list;

    // Filter the forecast for the specified date range
    const filteredForecast = forecastData.filter(entry => {
      const entryDate = new Date(entry.dt * 1000); // Convert timestamp to Date object
      return entryDate >= startDate && entryDate <= endDate;
    });

    // Extract specific weather details for each date in the range
    const weatherDetails = filteredForecast.map(entry => ({
      date: new Date(entry.dt * 1000),
      temperature: entry.main.temp,
      weather: entry.weather[0].description,
    }));

    return weatherDetails;
  } catch (error) {
    console.error('Error fetching weather forecast:', error.message);
    throw error;
  }
}

// Example usage:
const city = 'New York'; // Replace with the user-selected city
const startDate = new Date('2023-11-01'); // Replace with the user-selected start date
const endDate = new Date('2023-11-07'); // Replace with the user-selected end date

getWeatherForecast(city, startDate, endDate)
  .then(weatherDetails => {
    console.log('Weather Forecast:', weatherDetails);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
