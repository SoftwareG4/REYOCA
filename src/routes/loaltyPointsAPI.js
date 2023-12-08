// loyaltyPointsAPI.js
const url = require('url');
const LoyaltyService = require('../services/loyaltyService');

function loyaltyPointsApi(req, res) {
  // Set CORS headers to allow requests from any origin and allow "Content-Type" header
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

  // Check if the request method is POST
  if (req.method === 'POST' && req.url === '/loyalty/calculate-points') {
    // Parse the request body
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const postBody = JSON.parse(body);
        // Assuming userId is provided in the request body
        const userId = postBody.user_id;

        // Call the LoyaltyService function to calculate loyalty points
        const loyaltyPoints = await LoyaltyService.calculateLoyaltyPoints(userId);
        // Return the calculated loyalty points in the response
        res.writeHead(200, { 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify({ loyaltyPoints: loyaltyPoints }));
      } catch (error) {
        // Handle invalid request body
        console.error('Error parsing request body:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  } else {
    // If the request method is not POST, return a 404 error
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// Export the loyaltyPointsApi function
module.exports = loyaltyPointsApi;
