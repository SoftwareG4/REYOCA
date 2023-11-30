const url = require('url');

// Import Models
const TransactionHistoryModel = require('../models/transactionHistoryModel');
const VehicleDetailsModel = require('../models/vehicleDetailsModel');

// Import Services
const pricingService = require('../services/pricingService');

function vehicleApi(req, res) {
  try {
    //============================================ To check vehicle availability before adding to cart ================================================
    if (req.method === 'POST' && req.url === '/vehicle/check-availability') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const postBody = JSON.parse(body);
        const vehicleId = parseInt(postBody.vehicleId);
        const startDate = postBody.startDate;
        const endDate = postBody.endDate;

        // Check for availability using the Transaction Model
        TransactionHistoryModel.checkAvailability(vehicleId, startDate, endDate, (err, available) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else if (available) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Yes' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'No' }));
          }
        });
      });
    }

    //============================================================ To Calculate Price ======================================================
    else if (req.method === 'POST' && req.url === '/vehicle/calculate-price') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const postBody = JSON.parse(body);

        // Extract parameters from postBody
        const { vehicleId, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns } = postBody;

        // Calculate the price using the pricing service
        const price = pricingService.calculatePrice(vehicleId, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns);

        // Return the price in the response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ price: price }));
      });
    }

    // ======================================================== To get vehicle details =======================================================
    else if (req.method === 'GET' && req.url.startsWith('/vehicle/details/')) {
      const params = url.parse(req.url, true);
      const vehicleId = parseInt(params.pathname.split('/').pop());

      VehicleDetailsModel.getVehicleDetailsById(vehicleId, (err, details) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(details));
        }
      });
    }

    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    // Handle any uncaught exceptions gracefully
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

module.exports = vehicleApi;
