const http = require('http');

// Import Routes
const {view_cart} = require('./src/routes/view_cart');
const {delete_car} = require('./src/routes/delete_car');
const {validate_coupon, checkout} = require('./src/routes/checkout');
const {view_pay_method} = require('./src/routes/view_payment_method');

// Resource path
const viewcart = '/cart';
const deletecar = '/deletecar';
const validatecoupon = '/validatecoupon';
const checkoutcart = '/checkout';
const paymentmethods = '/viewpaymethods';

// Run server and pass path to appropriate route
const server = http.createServer(async (req, res) => {

  if (req.url.startsWith(viewcart)) {
    view_cart(req, res);
  } else if (req.url.startsWith(deletecar)) {
    delete_car(req, res);
  } else if (req.url.startsWith(validatecoupon)) {
    validate_coupon(req, res);
  } else if (req.url.startsWith(checkoutcart)) {
    checkout(req, res);
  } else if (req.url.startsWith(paymentmethods)) {
    view_pay_method(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
