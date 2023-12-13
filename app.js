const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');
const fs = require('fs');
const ejs = require('ejs');
const {redirectView} = require('./src/routes/redirectViews');
const {validateToken, getRole} = require('./src/services/JWTauth');
const passport = require('passport');
require('./googleauth');

// Import Routes
const {register_login_route} = require('./src/routes/register_login');
const {update_profile_route} = require('./src/routes/update_profile');
const {review_route} = require('./src/routes/review');
const {report_route} = require('./src/routes/report');
const {transaction_route} = require('./src/routes/order'); 
const {admin_route} = require('./src/routes/admin');
const {redirect_route} = require('./src/routes/page_redirect');

const searchApi = require('./src/routes/searchAPI');
const messageApi = require('./src/routes/messageAPI');

const ReviewsApi = require('./src/routes/reviewsAPIs');
const cartApi = require('./src/routes/cartAPIs');
const transactionApi = require('./src/routes/transactionAPIs');
const vehicleApi = require('./src/routes/vehicleAPIs');
const favouritesApi = require('./src/routes/favouritesAPIs');
const loyaltyApi = require('./src/routes/loaltyPointsAPI');
const userAPI = require('./src/routes/getUserAPI');
// const weatherAPI = require('./src/routes/weatherAPIs');
const customizeAPI = require('./src/routes/customizeAPI');

const {view_cart} = require('./src/routes/view_cart');
const {delete_car} = require('./src/routes/delete_car');
const {validate_coupon, checkout} = require('./src/routes/checkout');
const {view_pay_method} = require('./src/routes/view_payment_method');

const viewcart = '/cart';
const deletecar = '/deletecar';
const validatecoupon = '/validatecoupon';
const checkoutcart = '/checkout';
const paymentmethods = '/viewpaymethods';

const noPath = '/';
const searchPath = '/search';
const recommendationPath = '/recommendations';
const messagePath = "/message";

const server = http.createServer(async (req, res) => {
  // Get the Content-Type header and method from the request
  const contentType = req.headers['content-type'];
  const method = req.method;
  let path =  req.url;
  
  console.log(method,path)
  console.log(req.url);
  if(path.startsWith("/views/")) {
    redirectView(req, res);
  }
  else if (path.startsWith("/login")){
    register_login_route(req,res)
  }
  else if (path.startsWith("/profile")){
    update_profile_route(req,res)
  }
  else if (path.startsWith("/review") && !path.startsWith("/reviews")){
    review_route(req,res)
  }
  else if (path.startsWith("/report")){
    report_route(req,res)
  }
  else if (path.startsWith("/transaction")){
    transaction_route(req,res)
  }
  else if (path.startsWith("/admin")){
    admin_route(req,res)
  }
  else if (path.startsWith("/dev_page_route")){
    console.log("app")
    redirect_route(req,res)
  }

  else if (req.url.startsWith(searchPath) || req.url.startsWith(recommendationPath)) {
    searchApi(req, res);
  }
  else if (req.url.startsWith(messagePath)) {
    messageApi(req, res);
  }

  else if (req.url.startsWith('/cart')) {
    cartApi(req, res);
  }
  else if (path.startsWith('/reviews')) {
    console.log("Path should reach here");
    ReviewsApi(req, res);
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
  else if (req.url.startsWith('/user')) {
    userAPI(req, res);
  }
  else if (req.url.startsWith('/weather') && req.method === 'POST') {
    weatherAPI(req, res);
  }
  else if (req.url.startsWith(deletecar)) {
    delete_car(req, res);
  } else if (req.url.startsWith(validatecoupon)) {
    validate_coupon(req, res);
  } else if (req.url.startsWith(checkoutcart)) {
    checkout(req, res);
  } else if (req.url.startsWith(paymentmethods)) {
    view_pay_method(req, res);
  } else if (req.url.startsWith('/view_cart_route')) {
    fs.readFile('./public/dummybeforecart.html', function (err, html) {
      if (err) {
        console.log(err);
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  } else if (req.url.startsWith('/success')) {
    fs.readFile('./public/success.html', function (err, html) {
      if (err) {
        console.log(err);
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  } else if (req.url.startsWith('/cancel')) {
    fs.readFile('./public/cancel.html', function (err, html) {
      if (err) {
        console.log(err);
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  }

  else if (req.url === noPath) {
    let file_name = './public/index.ejs';
    let user_id = validateToken(req.headers.cookie);
    if (user_id === false) {
      file_name = './public/index.ejs';
    } else {
      let user_role = await getRole(user_id);
      if (user_role === "renter") {
        file_name = './public/index_renter.ejs';
      } else if (user_role === "rentee") {
        file_name = './public/index_rentee.ejs';
      }
    }
    fs.readFile(file_name, 'utf8', (err, html) => {
      if (err) {
        console.log(err);
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  } 

  else if (req.url === '/customize') {
    // Read the EJS template file
    
    fs.readFile('./src/views/vehicleDetails.ejs', 'utf8', (err, data) => {
      if (err) {
        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }

      // Compile the EJS template
      const compiledTemplate = ejs.compile(data);

      // Render the template without any data (you can't pass dynamic data in this example)
      const renderedHtml = compiledTemplate();

      // Set response headers and send the rendered HTML
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderedHtml);
    });
  }

else if (req.url === '/weather') {
  // Read the EJS template file
  fs.readFile('./src/views/weather.ejs', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    // Compile the EJS template
    const compiledTemplate = ejs.compile(data);

    // Render the template without any data (you can't pass dynamic data in this example)
    const renderedHtml = compiledTemplate();

    // Set response headers and send the rendered HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderedHtml);
  });
} 

else if (req.url === '/airbnbs_near_location') {
  // Read the EJS template file
  fs.readFile('./src/views/airbnb.ejs', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    // Compile the EJS template
    const compiledTemplate = ejs.compile(data);

    // Render the template without any data (you can't pass dynamic data in this example)
    const renderedHtml = compiledTemplate();

    // Set response headers and send the rendered HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderedHtml);
  });
} 

else if (req.url === '/attractions') {
  // Read the EJS template file
  fs.readFile('./src/views/attractions.ejs', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    // Compile the EJS template
    const compiledTemplate = ejs.compile(data);

    // Render the template without any data (you can't pass dynamic data in this example)
    const renderedHtml = compiledTemplate();

    // Set response headers and send the rendered HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderedHtml);
  });
} 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
  }
});

const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
