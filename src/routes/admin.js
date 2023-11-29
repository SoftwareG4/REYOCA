const AdminModel = require('../models/M_admin');
const {validateToken}= require('../services/JWTauth');
const {verify_foul}= require('../services/verify_profanity');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();




function delete_review(req, res) {
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
      const foul_words=await verify_foul(requestData["description"])
      if (foul_words.length>0){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ found_bad_words : foul_words }));
      }

      AdminModel.review_delete(requestData, (err, result) => {
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

function delete_report(req, res) {
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
    
    AdminModel.report_delete(requestData, (err, result) => {
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

function delete_user(req, res) {
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
    
    AdminModel.user_delete(requestData, (err, result) => {
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

function delete_listing(req, res) {
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
      
      AdminModel.listing_delete(requestData, (err, result) => {
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

module.exports = { delete_review, delete_report, delete_user, delete_listing };



