// 1. check coupon
// 2. complete checkout
// 1. View cart for a particular user.
const cookie = require('cookie');
const CheckoutModel = require('../models/M_checkout');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_PVT_KEY);
const {validateToken}= require('../services/JWTauth');

function validate_coupon(req, res) {
    const chunks = [];
    // const user_id=validateToken(req.headers.cookie)
      // if (user_id==false){
      //     res.writeHead(401, { 'Content-Type': 'application/json' });
      //     res.end(JSON.stringify({ error: "User not Authenticated" }));
      //     return;
      // }
    let code;
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    if (req.method === 'GET') {
        req.on('end', () => {
            let requestData = {};
            try {
                const urlParams = new URLSearchParams(req.url.split('?')[1]);
                const code = urlParams.get('code');
                requestData['code'] = code;
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid formatting of the request' }));
                return;
            }
            CheckoutModel.validate_coupon(requestData, (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    
                    res.end(JSON.stringify(result));
                }
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}

function checkout(req, res) {
    const chunks = [];
     // const user_id=validateToken(req.headers.cookie)
      // if (user_id==false){
      //     res.writeHead(401, { 'Content-Type': 'application/json' });
      //     res.end(JSON.stringify({ error: "User not Authenticated" }));
      //     return;
      // }
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    if (req.method === 'POST') {
        req.on('end', async () => {
            try {
                let cart_info = JSON.parse(chunks);
                const rentee_id = cookie.parse(req.headers.cookie)['id'];
                cart_info['rentee_id'] = rentee_id;
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    mode: "payment",
                    line_items: [{
                        price_data: {
                          currency: "usd",
                          product_data: {
                            name: "REYOCA Booking amount",
                          },
                          unit_amount: cart_info['final_amount'] * 100,
                        },
                        quantity: 1,
                    }],
                    success_url: `${process.env.CLIENT_URL}/success.html`,
                    cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
                  });
                  if(store_transaction(cart_info)){
                      res.writeHead(200, { "Content-Type": "application/json" });
                      res.end(JSON.stringify({ url: session.url }), );
                    } else{
                      res.writeHead(500, { "Content-Type": "application/json" });
                      res.end(JSON.stringify({ url: `${process.env.CLIENT_URL}/cancel.html` }));
                    }
                } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid formatting of the request'+error }));
                return;
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}

async function store_transaction(cart_info){
    // Store transaction details in the database
    CheckoutModel.store_transaction(cart_info, (err, result) => {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
}

module.exports = {validate_coupon, checkout};