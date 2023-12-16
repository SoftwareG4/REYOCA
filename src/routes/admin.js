const AdminModel = require('../models/M_admin');
const {validateToken}= require('../services/JWTauth');
const {verify_foul}= require('../services/verify_profanity');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();




function delete_review(req, res) {
  if(req.method!="DELETE"){
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
      return;
  }
  let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        let requestData;
        if (body){
            requestData = JSON.parse(body);
        }else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
        }

      AdminModel.review_delete(user_id,requestData, (err, result) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: result }));
          }
        });
  });
}

function resolve_report(req, res) {
  if(req.method!="POST"){
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
      return;
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
    requestData = Object.keys(requestData)[0];
    requestData = JSON.parse(requestData);
    AdminModel.report_resolve(user_id,requestData, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
        }
      });
  });
}

function delete_user(req, res) {
  if(req.method!="DELETE"){
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
      return;
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
    if (Object.keys(requestData).length!=0){
    requestData = Object.keys(requestData)[0];
    requestData = JSON.parse(requestData);
    console.log(requestData);
    }
    AdminModel.user_delete(user_id,requestData, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
        }
      });
  });
}

function delete_listing(req, res) {
  if(req.method!="DELETE"){
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
    const user_id=validateToken(req.headers.cookie)
    if (user_id==false){
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
        return;
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
      requestData = Object.keys(requestData)[0];
      requestData = JSON.parse(requestData);
      AdminModel.listing_delete(user_id,requestData, (err, result) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: result }));
          }
        });
    });
}

function admin_route(req, res){
  path=req.url
  if(path[path.length-1]=='/'){
      path=path.substring(0,path.length-1)
  }
  switch(path){
      case "/admin/deletereview":
          delete_review(req, res);
          break
      case "/admin/resolvereport":
          resolve_report(req, res);
          break
      case "/admin/deleteuser":
          console.log("path")
          delete_user(req, res);
          break
      case "/admin/deletelisting":
          delete_listing(req, res);
          break
    default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
  }
}



module.exports = { admin_route };



