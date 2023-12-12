const url = require('url');

// Import Models
const TransactionHistoryModel = require('../models/transactionHistoryModel');
const VehicleDetailsModel = require('../models/vehicleDetailsModel');
const VehicleModel = require('../models/VehicleModel');

// Import Services
const pricingService = require('../services/pricingService');
const {validateToken} = require('../services/JWTauth');
const { is } = require('express/lib/request');

function vehicleApi(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add this line
  
    // Check if the request method is OPTIONS (preflight request)
    if (req.method === 'OPTIONS') {
      // Respond to the preflight request
      res.writeHead(200);
      res.end();
      return;
    }
  
    let apiCall = req.url;
    if (apiCall.endsWith('/')) {
      apiCall = apiCall.subsstring(0, apiCall.length-1);
    }

    if (req.url === '/vehicle/new') {
      if (req.method == 'POST') {
        let body = '';
        req.on ('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          if (body) {
            const jsonData = JSON.parse(body);

            const renter_id = validateToken(req.headers.cookie);
            if (renter_id == false) {
                res.writeHead(401, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({"error": "User not authenticated"}));
                return;
            }

            let isValid = await VehicleModel.setInsertParam (
              jsonData.make,
              jsonData.model,
              jsonData.type,
              renter_id,
              jsonData.price,
              jsonData.latitude,
              jsonData.longitude,
              jsonData.state,
              jsonData.city,
              jsonData.fuel_type,
              jsonData.year,
              jsonData.address
            );
            console.log("isValid: ", isValid);

            if (!isValid) {
              res.writeHead(400, {'Content-Type': 'application/json'});
              res.end(JSON.stringify({"error": "Bad request."}));
            } else {
              VehicleModel.insertVehicle( (err, result) => {
                console.log(result);
                if (!err && result) {
                  res.writeHead(201, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({"message": "Insert Success"}));
                } else if (err) {
                  res.writeHead(500, {'Content-Type': 'application/json'});
                  res.end(JSON.stringify({"error": "Internal Server Error"}));
                }
              });
            }
          } else {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"error": "Bad request."}));
          }
        });
      }
    }
    //============================================ To check vehicle availability before adding to cart ================================================
    else if (req.method === 'POST' && req.url === '/vehicle/check-availability') {
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
        const { basePrice, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns } = postBody;

        // Calculate the price using the pricing service
        const price = pricingService.calculatePrice(basePrice, startDate, endDate, additionalDrivers, childSeats, insurance, otherAddOns);

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
          res.writeHead(200, { 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin': '*'});
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
