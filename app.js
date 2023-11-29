const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');






// Import Routes
const {register_rentee,register_renter,login_user,logout_user} = require('./src/routes/register_login');
const {update_pic,update_password, update_prof, update_payment, rating_get} = require('./src/routes/update_profile');
const {add_review, review_get, review_filter} = require('./src/routes/review');
const {add_report, report_get, report_filter} = require('./src/routes/report');
const {order_get, order_filter} = require('./src/routes/order'); 
const {delete_review, delete_report, delete_user, delete_listing} = require('./src/routes/admin');
// Import Services



const server = http.createServer(async (req, res) => {
  // Get the Content-Type header and method from the request
  const contentType = req.headers['content-type'];
  const method = req.method;
  let path =  req.url;
  if(path[path.length-1]=='/'){
    path=path.substring(0,path.length-1)
  }
  console.log(contentType,method,path)

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
    case "/updateprofile":
        update_prof(req, res);
      break
    case "/getuserrating":
        rating_get(req, res);
      break
    case "/updatepayment":
        update_payment(req, res);
      break
    case "/postreview":
        add_review(req, res);
      break
    case "/getreview":
        review_get(req, res);
      break
    case "/filterreview":
        review_filter(req, res);
      break
    case "/postreport":
        add_report(req, res);
      break
    case "/getreport":
        report_get(req, res);
      break
    case "/filterreport":
        report_filter(req, res);
      break
    case "/getorder":
        order_get(req, res);
      break
    case "/filterorder":
        order_filter(req, res);
      break
    case "/deletereview":
        delete_review(req, res);
      break
    case "/deletereport":
        delete_report(req, res);
      break
    case "/deleteuser":
        delete_user(req, res);
      break
    case "/deletelisting":
        delete_listing(req, res);
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
