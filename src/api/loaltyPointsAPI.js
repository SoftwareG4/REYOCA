// loyaltyPointsAPI.js
const url = require('url');
const LoyaltyService = require('../services/loyaltyService');

function loyaltyPointsApi(req, res) {
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
        const userId = postBody.userId;

        // Call the LoyaltyService function to calculate loyalty points
        const loyaltyPoints = await LoyaltyService.calculateLoyaltyPoints(userId);
        console.log(loyaltyPoints);

        // Return the calculated loyalty points in the response
        res.writeHead(200, { 'Content-Type': 'application/json' });
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
