const { sign, verify } = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const cookie = require('cookie');


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


module.exports = { createTokens, validateToken };