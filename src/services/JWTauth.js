const { sign, verify } = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const cookie = require('cookie');
const db = require('../../dbcon');
const res = require("express/lib/response.js");


require('../../global.js');

const createTokens = (user) => {
  const accessToken = sign(
    { id: user._ID },process.env.ACCESS_TOKEN_SECRET
  );

  return accessToken;
};


function validateToken(cookieHeader){
  if (!cookieHeader) {
    return false
  }
  try{
    const cookies = cookie.parse(cookieHeader);
    const accessToken = cookies.access_token;
    if(invalidatedTokens.has(accessToken)){
      return false
    }
    const users=verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    const id=users.id
    return id
  }catch{
    return false
  }
}

function getRole (user_id) {
  return new Promise((resolve) => {
    if (user_id) {
      const dbCon = db();
      dbCon.connect ((err) => {
        if (err) {
          resolve(false);
        }
        const query = `SELECT role FROM user WHERE _ID=?`;
        console.log(query);
  
        dbCon.query(query, [user_id], (err, result) => {
          if (err) {
            console.log(err);
            resolve(false);
          }
  
          console.log("Role: ", result[0].role);
          resolve(result[0].role);
        });
        console.log("query over");
      });
    } else {
      resolve(false);
    }
  });
}


module.exports = { createTokens, validateToken, getRole };