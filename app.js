const http = require('http');
const db = require('./dbcon');
const ReviewsModel = require('./src/models/reviewsModel');
const CartModel = require('./src/models/cartModel');
const TransactionHistoryModel = require('./src/models/transactionHistoryModel');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');


const pricingService = require('./src/services/pricingService')

const server = http.createServer(async (req, res) => {

//==================================================== GET Specific Reviews, CHAITANYA ===============================================================
  if (req.url.startsWith('/reviews/') && req.method === 'GET') {
    try {
      const params = url.parse(req.url, true);
      const vehicleId = parseInt(params.pathname.split('/').pop());
      ReviewsModel.getReviewsByVehicleId(vehicleId, (err, reviews) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          console.log(err);
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(reviews));
        }
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      console.log(error);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  } 

  //=================================================== GET ALL REVIEWS, LOKESH =========================================================

  else if (req.url === '/reviews' && req.method === 'GET') {
    try {
      ReviewsModel.getAllReviews((err, reviews) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          console.log(err);
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(reviews));
        }
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      console.log(error);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
  
//==================================================== POST Reviews, LOKESH ===============================================================

  else if (req.url.startsWith('/reviews/') && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const postBody = JSON.parse(body);
        ReviewsModel.addReview(postBody, (err, result) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Review added successfully' }));
          }
        });
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }  


  //===================================================== DELETE REVIEW, DEEVESH =========================================================

  // DELETE Review API
else if (req.url.startsWith('/reviews/') && req.method === 'DELETE') {
    try {
      const params = url.parse(req.url, true);
      const reviewId = parseInt(params.pathname.split('/').pop());
  
      // Implement a function to check if the review exists and is associated with the current user
      const isAuthorizedToDelete = checkReviewAuthorization(reviewId, userId);
  
      if (isAuthorizedToDelete) {
        // Call the ReviewsModel function to delete the review
        ReviewsModel.deleteReview(reviewId, (err, result) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(204); // Successful deletion has no content in the response
            res.end();
          }
        });
      } else {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized to delete this review' }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
  


  //===================================================== ADD INTO CART, CHAITANYA ============================================================

else if (req.url.startsWith('/cart/') && req.method === 'POST') {
    try {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const postBody = JSON.parse(body);
          const renteeId = parseInt(postBody.renteeId);
          const vehicleId = parseInt(postBody.vehicleId);
          const extras = postBody.extras;
          const quantity = parseInt(postBody.quantity);
          const totalCost = parseFloat(postBody.totalCost);

          const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
          });

          connection.connect((err) => {
            if (err) {
              console.error('Error connecting to the database:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
              const sql = 'INSERT INTO cart (rentee_id, vehicle_id, extras, quantity, total_cost) VALUES (?, ?, ?, ?, ?)';
              connection.query(sql, [renteeId, vehicleId, extras, quantity, totalCost], (err, result) => {
                connection.end();

                if (err) {
                  console.error('Error executing the query:', err);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Internal Server Error' }));
                } else {
                  res.writeHead(201, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ message: 'Added to cart successfully' }));
                }
              });
            }
          });
        } catch (error) {
          console.error('Error parsing request body:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid request body' }));
        }
      });
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      console.log(error);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}



//=============================================================== CHECK AVAILABILITY, DEEVESH =================================================

else if (req.url.startsWith('/availability/') && req.method === 'POST') {
    try {
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
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      console.log(error);
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
  


  //==================================================== PRICE CALCULATION, DEEVESH ===========================================

  else if (req.url.startsWith('/calculate-price/') && req.method === 'POST') {
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


else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
