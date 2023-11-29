const OrderModel = require('../models/M_order');
const {validateToken}= require('../services/JWTauth');
const {verify_foul}= require('../services/verify_profanity');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

function order_get(req, res) {
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
  }
  const chunks = [];
  req.on("data", (chunk) => {
      chunks.push(chunk);
  });
  req.on('end',async () => {
    let requestData = {};
    try {
        const data = Buffer.concat(chunks);
        const stringData = data.toString();
        const parsedData = new URLSearchParams(stringData);
        for (var pair of parsedData.entries()) {
            requestData[pair[0]] = pair[1];
        }
        console.log("DataObj: ", requestData);

    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
        return;
    }
    
    OrderModel.getOrderById(user_id, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
        }
      });
  });
}

function order_filter(req, res) {
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
  }
  const chunks = [];
  req.on("data", (chunk) => {
      chunks.push(chunk);
  });
  req.on('end',async () => {
    let requestData = {};
    try {
        const data = Buffer.concat(chunks);
        const stringData = data.toString();
        const parsedData = new URLSearchParams(stringData);
        for (var pair of parsedData.entries()) {
            requestData[pair[0]] = pair[1];
        }
        console.log("DataObj: ", requestData);

    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
        return;
    }
    
    OrderModel.filterOrder(requestData, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
        }
      });
  });
}

module.exports = { order_get, order_filter };
