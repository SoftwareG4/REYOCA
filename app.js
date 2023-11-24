const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');



// Import Models
const ReviewsModel = require('./src/models/reviewsModel');
const CartModel = require('./src/models/cartModel');
const TransactionHistoryModel = require('./src/models/transactionHistoryModel');


// Import Apis
const reviewsApi = require('./src/api/reviewsAPIs');
const cartApi = require('./src/api/cartAPIs');
const locationApi = require('./src/api/locationAPIs');
const transactionApi = require('./src/api/transactionAPIs');
const userApi = require('./src/api/userAPIs');
const vehicleApi = require('./src/api/vehicleAPIs');
const searchApi = require('./src/api/searchAPI');


// Import Services
const pricingService = require('./src/services/pricingService')
const authService = require('./src/services/authService');

// Resource path
const userPath = '/user';
const vehiclePath = '/vehicle';
const searchPath = '/search';
const locationPath = '/location';
const cartPath = '/cart';
const transactionPath = '/transaction';
const reviewsPath = '/reviews';

const server = http.createServer(async (req, res) => {


  if (req.url.startsWith(userPath)) {
    userApi(req, res);
  }

  else if (req.url.startsWith(vehiclePath)) {
    vehicleApi(req, res);
  }

  else if (req.url.startsWith(searchPath)) {
    searchApi(req, res);
  }

  else if (req.url.startsWith(locationPath)) {
    locationApi(req, res);
  }

  else if (req.url.startsWith(cartPath)) {
    cartApi(req, res);
  }

  else if (req.url.startsWith(transactionPath)) {
    transactionApi(req, res);
  }

  else if (req.url.startsWith(reviewsPath)) {
    reviewsApi(req, res);
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
