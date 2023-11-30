// 1. check coupon
// 2. complete checkout
// 1. View cart for a particular user.

const CheckoutModel = require('../models/M_checkout');
const jwt = require('jsonwebtoken')
const cookie = require('cookie');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_PVT_KEY);

dotenv.config();

function validate_coupon(req, res) {
    const chunks = [];
    let code;
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    if (req.method === 'GET') {
        req.on('end', () => {
            let requestData = {};
            try {
                const data = Buffer.concat(chunks);
                const stringData = data.toString();
                const parsedData = new URLSearchParams(stringData);
                for (var pair of parsedData.entries()) {
                    requestData[pair[0]] = pair[1];
                }
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
                } else if (typeof(result)=="string") {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: result }));
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
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    if (req.method === 'POST') {
        req.on('end', async () => {
            try {
                let cart_info = JSON.parse(chunks);
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
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ url: session.url }));
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

module.exports = {validate_coupon, checkout};