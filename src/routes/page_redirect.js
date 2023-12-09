const {createTokens, validateToken}= require('../services/JWTauth');
const cookie = require('cookie');
const fs = require('fs');
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config();
const profileModel = require('../models/M_update_profile.js');
const OrderModel = require('../models/M_order.js');
require('../../global.js');

// const invalidatedTokens = new Set();

function redirect_login(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    fs.readFile('./src/views/login.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Sample data to pass to the EJS template
          const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };
  
          // Render the EJS template with data
          const renderedHtml = ejs.render(data, dataToRender);
  
          // Set the response header and send the rendered HTML
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
}

function redirect_passreset(req, res) {
  if(req.method!="GET"){
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
  }
  fs.readFile('./src/views/passwordreset.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}


function red_reg_rentee(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    fs.readFile('./src/views/register_rentee.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Sample data to pass to the EJS template
          const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };
  
          // Render the EJS template with data
          const renderedHtml = ejs.render(data, dataToRender);
  
          // Set the response header and send the rendered HTML
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
}


function red_reg_renter(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    fs.readFile('./src/views/register_renter.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Sample data to pass to the EJS template
          const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };
  
          // Render the EJS template with data
          const renderedHtml = ejs.render(data, dataToRender);
  
          // Set the response header and send the rendered HTML
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
}

function redirect_admin(req, res) {
  fs.readFile('./src/views/admin_page.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}





async function red_reg_profilepage(req, res) {
  try {
    if (req.method !== "GET") {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    // Assuming validateToken gets the user_id from the request
    const user_id=validateToken(req.headers.cookie); // This should be retrieved from a function or middleware
    if (!user_id) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
      return;
    }

    // Fetch profile and rating data
    const profileData = await new Promise((resolve, reject) => {
      profileModel.prof_view(user_id, (err, result) => {
        if (err) reject(err);
        else resolve(result[0]); 
      });
    });

    const ratingData = await new Promise((resolve, reject) => {
      profileModel.getRatingById(user_id, (err, result) => {
        if (err) reject(err);
        else resolve(result); 
      });
    });

    // Combine profile and rating data
    const dataToRender = {
      title: 'User Profile',
      profile: profileData,
      rating: ratingData
    };

    // Read and render the EJS file with user profile and rating data
    fs.readFile('./src/views/profile_page.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const renderedHtml = ejs.render(data, dataToRender);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });

  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
  }
}


function red_reg_orderhist(req, res){
  if (req.method !== "GET") {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  const user_id=validateToken(req.headers.cookie); // This should be retrieved from a function or middleware
    if (!user_id) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
      return;
    }
  // Assuming validateToken gets the user_id from the request

  OrderModel.getOrderById(user_id, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err }));
    } else {
      // Read and render the EJS file with user profile data
      fs.readFile('./src/views/order_history.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          const dataToRender = { title: 'Order History', order: result }; // Assuming result[0] is the user profile object
          const renderedHtml = ejs.render(data, dataToRender);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
    }
  });
}



function redirect_route(req, res){
    path=req.url
    if(path[path.length-1]=='/'){
        path=path.substring(0,path.length-1)
    }
    switch(path){
        case "/dev_page_route/loginpage":
            redirect_login(req, res);
        break
        case "/dev_page_route/passreset":
            redirect_passreset(req, res);
        break
        case "/dev_page_route/registerrentee":
            red_reg_rentee(req, res);
        break
        case "/dev_page_route/registerrenter":
            red_reg_renter(req, res);
        break
        case "/dev_page_route/profilepage":
          red_reg_profilepage(req, res);
        break
        case "/dev_page_route/profilepage/order_history":
          red_reg_orderhist(req, res);
        break
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
    }
}




module.exports = {redirect_route,redirect_admin};