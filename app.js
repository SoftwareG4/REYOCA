const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');



// Import Models
const ReviewsModel = require('./src/models/reviewsModel');
const CartModel = require('./src/models/cartModel');
const TransactionHistoryModel = require('./src/models/transactionHistoryModel');
const FavouritesModel = require('./src/models/favouritesModel');


// Import Apis
const ReviewsApi = require('./src/api/reviewsAPIs');
const cartApi = require('./src/api/cartAPIs');
const locationApi = require('./src/api/locationAPIs');
const transactionApi = require('./src/api/transactionAPIs');
const userApi = require('./src/api/userAPIs');
const vehicleApi = require('./src/api/vehicleAPIs');
const sosApi = require('./src/api/sosAPIs');
const favouritesApi = require('./src/api/favouritesAPIs');
const loyaltyApi = require('./src/api/loaltyPointsAPI');



// Import Services
const pricingService = require('./src/services/pricingService')
const authService = require('./src/services/authService');


const server = http.createServer(async (req, res) => {


  if (req.url.startsWith('/reviews')) {
    ReviewsApi(req, res);
  }

  else if (req.url.startsWith('/cart')) {
    cartApi(req, res);
  }

  else if (req.url.startsWith('/location')) {
    locationApi(req, res);
  }

  else if (req.url.startsWith('/user')) {
    userApi(req, res);
  }

  else if (req.url.startsWith('/vehicle')) {
    vehicleApi(req, res);
  }

  else if (req.url.startsWith('/transaction')) {
    transactionApi(req, res);
  }

  else if (req.url.startsWith('/sos')) {
    sosApi(req, res);
  }

  else if (req.url.startsWith('/favourites')) {
    favouritesApi(req, res);
  }

  else if (req.url.startsWith('/loyalty')) {
    loyaltyApi(req, res);
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
