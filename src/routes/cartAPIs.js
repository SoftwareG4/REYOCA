const url = require('url');
const CartModel = require('../models/cartModel');
const ejs = require('ejs');
const fs = require('fs');
const {validateToken}= require('../services/JWTauth');
const cookie = require('cookie');

function cartApi(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add this line
  
    // Check if the request method is OPTIONS (preflight request)
    if (req.method === 'OPTIONS') {
      // Respond to the preflight request
      res.writeHead(200);
      res.end();
      return;
    }
    //========================================== ADD TO CART =====================================================
    if (req.method === 'POST') {
      if (req.url === '/cart/add-to-cart') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const postBody = JSON.parse(body);
            CartModel.addToCart(postBody, (err, result) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              } else {
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Added to cart successfully' }));
              }
            });
          } catch (error) {
            console.error('Error parsing request body:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request body' }));
          }
        });
      }

      else if (req.url === '/cart/check-cart'){
        
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
          
        });
        

        req.on('end', async () => {
          try {
            const postBody = JSON.parse(body);
            // console.log(postBody, "body");
            // console.log("line54");
            CartModel.checkCart(postBody.userId, (err, result) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              } else {
                // console.log(result,"line59");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result }));
              }
            });
          } catch (error) {
            console.error('Error parsing request body:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid request body' }));
          }
        });
      }

    } else if (req.method === 'GET') {
      const chunks = [];
      let id;
      // const user_id = validateToken(req.headers.cookie)
      // if (user_id==false){
      //     res.writeHead(401, { 'Content-Type': 'application/json' });
      //     res.end(JSON.stringify({ error: "User not Authenticated" }));
      //     return;
      // }
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });
      if (req.method === 'GET') {
        req.on('end', () => { 
          let requestData = {};
          try {
            id = cookie.parse(req.headers.cookie)['id'];
            // id = user_id;
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid formatting of the request' }));
            return;
          }
          CartModel.view_cart(id, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else if (typeof(result)=="string") {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: result }));
            } else {
              fs.readFile('./src/views/cart_page.ejs', 'utf8', (err, data) => {
                if (err) {
                  console.error(err);
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Internal Server Error');
                } else {
                  const dataToRender = { title: 'Cart Page', cars: result }; // Assuming result is the list of cars
                  const renderedHtml = ejs.render(data, dataToRender);
                  res.writeHead(200, { 'Content-Type': 'text/html' });
                  res.end(renderedHtml);
                }
              });
            }
          });
        });
      } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    // Handle any uncaught exceptions gracefully
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

module.exports = cartApi;
