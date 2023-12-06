const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');
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

const server = http.createServer(async (req, res) => {
  // Get the Content-Type header and method from the request
  const contentType = req.headers['content-type'];
  const method = req.method;
  let path =  req.url;
  console.log(contentType,method,path)
  if (path.startsWith("/login")){
    register_login_route(req,res)
  }
  else if (path.startsWith("/profile")){
    update_profile_route(req,res)
  }
  else if (path.startsWith("/review")){
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
    redirect_route(req,res)
  }
  else{
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
  }
});

const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
