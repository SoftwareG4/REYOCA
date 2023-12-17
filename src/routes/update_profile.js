const profile_Model = require('../models/M_update_profile');
const {validateToken}= require('../services/JWTauth');
const aws_s3=require('@aws-sdk/client-s3')
const formidable = require('formidable');
var ncrypt = require('ncrypt-js');
var { encrypt, decrypt } = new ncrypt(process.env.SECRET);
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const s3=new aws_s3.S3Client({
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY,
    },
    region:process.env.BUCKET_REGION
})

function isPasswordValid(password) {
    const minLength = 8;  // Minimum length
    const containsUppercase = /[A-Z]/.test(password); // At least one uppercase letter
    const containsLowercase = /[a-z]/.test(password); // At least one lowercase letter
    const containsDigit = /\d/.test(password); // At least one digit
    const containsSpecialChar = /[!@#$%^&*()-_+=<>?]/.test(password); // At least one special character
  
    if (password.length >= minLength &&containsUppercase &&containsLowercase &&containsDigit &&containsSpecialChar) {
      return true; 
    }
    return false; 
  }

function view_prof(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }

    const user_id = validateToken(req.headers.cookie);
    if (user_id == false){
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
        return;
    }

    profile_Model.prof_view(user_id, (err, result) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: result }));
        }
    });
}


function update_pic(req, res) {
    if(req.method!="POST"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    const form = new formidable.IncomingForm();
    console.log(req.headers['content-type'])
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return;
      }
      console.log(files,fields)

      const oldPath = files.file[0].filepath;

      const params={
        Bucket:process.env.BUCKET_NAME,
        Key:files.file[0].newFilename,
        Body:fs.readFileSync(oldPath),
        ContentType:files.file[0].mimetype
      }

      const command=new aws_s3.PutObjectCommand(params)
      await s3.send(command)


      const user_id=validateToken(req.headers.cookie)
      if (user_id==false){
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
        return;
        }
      const img_data={
        'id':user_id,
        'link':"https://reyocaprofilepic.s3.amazonaws.com/"+files.file[0].newFilename
      }

      profile_Model.update_picture(img_data, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'File uploaded successfully' }));
        }
      });
    });
  } 

function update_password(req, res) {
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
    // requestData = Object.keys(requestData)[0];
    // requestData = JSON.parse(requestData);
    req.on('end', () => {
        let requestData = {};
        try {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const parsedData = new URLSearchParams(stringData);
            for (var pair of parsedData.entries()) {
                requestData[pair[0]] = pair[1];
            }
            // console.log("DataObj: ", requestData);

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
            return;
        }
        if(isPasswordValid(requestData["new_pass"])==false){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Password requirement not met' }));
        }
        profile_Model.update_pass(user_id,requestData, (err, result) => {
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

function update_prof(req, res) {
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
    // requestData = Object.keys(requestData)[0];
    // requestData = JSON.parse(requestData);
    req.on('end', () => {
        let requestData = {};
        try {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const parsedData = new URLSearchParams(stringData);
            for (var pair of parsedData.entries()) {
                requestData[pair[0]] = pair[1];
            }
            // console.log("DataObj: ", requestData);

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
            return;
        }
        requestData = Object.keys(requestData)[0];
        requestData = JSON.parse(requestData);
      profile_Model.profile_update(user_id,requestData, (err, result) => {
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

function create_payment(req, res) {
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
  req.on('end', () => {
      let requestData = {};
      try {
          const data = Buffer.concat(chunks);
          const stringData = data.toString();
          const parsedData = new URLSearchParams(stringData);
          for (var pair of parsedData.entries()) {
              requestData[pair[0]] = pair[1];
          }
          // console.log("DataObj: ", requestData);

      } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
          return;
      }

      profile_Model.payment_create(user_id,requestData, (err, result) => {
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

function update_payment(req, res) {
  if(req.method!="PATCH"){
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
  req.on('end', () => {
      let requestData = {};
      try {
          const data = Buffer.concat(chunks);
          const stringData = data.toString();
          const parsedData = new URLSearchParams(stringData);
          for (var pair of parsedData.entries()) {
              requestData[pair[0]] = pair[1];
          }
          // console.log("DataObj: ", requestData);

      } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
          return;
      }

      profile_Model.payment_update(user_id,requestData, (err, result) => {
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

function rating_get(req, res) {
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
        // console.log("DataObj: ", requestData);

    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
        return;
    }
    
    profile_Model.getRatingById(user_id, (err, result) => {
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

function update_profile_route(req, res){
    path=req.url
    if(path[path.length-1]=='/'){
        path=path.substring(0,path.length-1)
    }

    switch(path){
        case "/profile/viewprofile":
            view_prof(req, res);
            break
        case "/profile/updatepic":
            update_pic(req, res);
            break
        case "/profile/updatepassword":
            update_password(req, res);
            break
        case "/profile/updateprofile":
            update_prof(req, res);
            break
        case "/profile/getuserrating":
            rating_get(req, res);
            break
        case "/profile/createpayment":
            create_payment(req, res);
          break
        case "/profile/updatepayment":
            update_payment(req, res);
            break
        
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
    }
}





module.exports = {update_profile_route};



