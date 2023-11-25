const { sign, verify } = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const cookie = require('cookie');

const {invalidatedTokens} = require('../routes/register_login');

const createTokens = (user) => {
  const accessToken = sign(
    { id: user._ID },process.env.ACCESS_TOKEN_SECRET
  );

  return accessToken;
};


function validateToken(cookieHeader){
  if (!cookieHeader || invalidatedTokens.has(token)) {
    return false
  }
  try{
    const cookies = cookie.parse(cookieHeader);
    const accessToken = cookies.access_token;
    // console.log('Value of access_token:', accessToken);
    const users=verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    const id=users.id
    return id
  }catch{
    return false
  }
  
// }
}


module.exports = { createTokens, validateToken };