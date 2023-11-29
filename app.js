const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');

// Import Routes
const {register_rentee,register_renter,login_user,logout_user} = require('./src/routes/register_login');
const {update_pic,update_password} = require('./src/routes/update_profile');
const {add_review} = require('./src/routes/review');
const {view_cart} = require('./src/routes/view_cart');
const {delete_car} = require('./src/routes/delete_car');
const {validate_coupon, checkout} = require('./src/routes/checkout');
const {view_pay_method} = require('./src/routes/view_payment_method');

// Import Services

// Run server and pass path to appropriate route
const server = http.createServer(async (req, res) => {
  // Get the Content-Type header and method from the request
  const contentType = req.headers['content-type'];
  const method = req.method;
  let path =  req.url;
  if(path[path.length-1]=='/'){
    path=path.substring(0,path.length-1)
  }

  switch(path){
    case "/login/create-rentee":
      register_rentee(req, res);
      break
    case "/login/create-renter":
      register_renter(req, res);
      break
    case "/login":
      login_user(req, res);
      break
    case "/logout":
      logout_user(req, res);
      break
    case "/updatepic":
      update_pic(req, res);
      break
    case "/updatepassword":
      update_password(req, res);
      break
    case "/postreview":
      add_review(req, res);
      break
    case "/deletecar":
      delete_car(req, res);
      break
    case "/validatecoupon":
      validate_coupon(req, res);
      break
    case "/checkout":
      checkout(req, res);
      break
    case "/cart":
      view_cart(req, res);
      break
    case "/viewpaymethods":
      view_pay_method(req, res);
      break
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Page Not Found');
  }

});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


