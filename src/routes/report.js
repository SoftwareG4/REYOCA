const ReportModel = require('../models/M_report');
const {validateToken}= require('../services/JWTauth');
const {verify_foul}= require('../services/verify_profanity');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();




function add_report(req, res) {
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
      const foul_words=await verify_foul(requestData["description"]);
      if (foul_words.length>0){
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ found_bad_words : foul_words }));
      }

      ReportModel.post_report(user_id,requestData, (err, result) => {
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

function report_get(req, res) {
  if(req.method!="GET"){
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
    
    ReportModel.getReport(user_id, (err, result) => {
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

function report_filter(req, res) {
  if(req.method!="GET"){
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
    
    ReportModel.filterReport(requestData, (err, result) => {
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

function report_route(req, res){
  path=req.url
  if(path[path.length-1]=='/'){
      path=path.substring(0,path.length-1)
  }

  switch(path){
    case "/report/postreport":
        add_report(req, res);
        break
    case "/report/getreport":
        report_get(req, res);
        break
    case "/report/filterreport":
        report_filter(req, res);
        break
    default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
  }
}




module.exports = { report_route };



