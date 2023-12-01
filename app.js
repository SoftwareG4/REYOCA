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
const ReviewsApi = require('./src/routes/reviewsAPIs');
const cartApi = require('./src/routes/cartAPIs');
// const locationApi = require('./src/routes/locationAPIs');
const transactionApi = require('./src/routes/transactionAPIs');
// const userApi = require('./src/routes/userAPIs');
const vehicleApi = require('./src/routes/vehicleAPIs');
// const sosApi = require('./src/routes/sosAPIs');
const favouritesApi = require('./src/routes/favouritesAPIs');
const loyaltyApi = require('./src/routes/loaltyPointsAPI');



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

  else if (req.url.startsWith('/vehicle')) {
    vehicleApi(req, res);
  }

  else if (req.url.startsWith('/transaction')) {
    transactionApi(req, res);
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
