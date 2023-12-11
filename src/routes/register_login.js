const UserModel = require('../models/M_register_login');
const {createTokens, validateToken}= require('../services/JWTauth');
const jwt = require('jsonwebtoken')
const cookie = require('cookie');
const dotenv = require('dotenv');
// const {redirect_admin, red_reg_adminpage}=require("./page_redirect")
dotenv.config();

require('../../global.js');

// const invalidatedTokens = new Set();

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



function register_rentee(req, res) {
    if(req.method!="POST"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
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
        // console.log(requestData)
        if(isPasswordValid(requestData["password"])==false){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Password requirement not met' }));
        }
        if(!['male','female'].includes(requestData["gender"])){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'gender invalid' }));
        }
        UserModel.registerrentee(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'User Registered Successfully' }));
            }
          });
    });
}

function register_renter(req, res) {
    if(req.method!="POST"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
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
        // console.log(requestData)
        if(isPasswordValid(requestData["password"])==false){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Password requirement not met' }));
        }
        if(!['male','female'].includes(requestData["gender"])){
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'gender invalid' }));
        }
        UserModel.registerrenter(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'User Registered Successfully' }));
            }
          });
    });
}

function login_user(req, res) {
    if(req.method!="POST"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
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
        // console.log(requestData)
        UserModel.login_verify(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else if (typeof(result)=="string") {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ "invalid": result }));
            } else{
                console.log(result);
                const accessToken=createTokens(result[0]);
                res.setHeader('Set-Cookie', `access_token=${accessToken};Max-Age=604800;httpOnly=true`);
                if (result[0].role=="admin"){
                    console.log("inside admin");
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Login Success admin"}));
                    // red_reg_adminpage(req,res,requestData);
                }
                else{
                    console.log("inside user")
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Login Success", role:result[0].role }));
                }
            }
          });
    });
}

function logout_user(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    const user_id=validateToken(req.headers.cookie)
    if (user_id!=false){
        const cookies = cookie.parse(req.headers.cookie);
        const accessToken = cookies.access_token;
        invalidatedTokens.add(accessToken);
        res.setHeader('Set-Cookie', `access_token=NulL;Max-Age=1;httpOnly=true`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Logged Out Success" }));
    }
    else{
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
        return;
    }
}

function forgot_password(req, res) {
    if(req.method!="POST"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
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
        // console.log(requestData)
        UserModel.pass_update(requestData, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err }));
            } else if (typeof(result)=="string") {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: result }));
            } 
          });
    });
}





function register_login_route(req, res){
    path=req.url
    if(path[path.length-1]=='/'){
        path=path.substring(0,path.length-1)
    }

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
        case "/login/logout":
            logout_user(req, res);
            break
        case "/login/forgot-password":
            forgot_password(req, res);
        break
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
    }
}




module.exports = {register_login_route};