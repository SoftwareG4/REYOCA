// 1. check coupon
// 2. complete checkout
// 1. View cart for a particular user.
const querystring = require('querystring');
const url = require('url');

const CheckoutModel = require('../models/M_checkout');
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
                } 
                // else if (typeof(result)=="string") {
                //     res.writeHead(400, { 'Content-Type': 'application/json' });
                //     res.end(JSON.stringify({ message: result }));
                // } 
                else {
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
                    success_url: `http://localhost:3000/store_transaction?data=${chunks}`,
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

function store_transaction(req,res){
        
    // Assuming req is your HTTP request object
    const urlParts = url.parse(req.url);
    const query = querystring.parse(urlParts.query);
    let data = query.data;
    // console.log('Transaction ID:', transactionId);
    

    // // let data = '';
    // req.on('data', (chunk) => {
    //   data += chunk;
    // });
    console.log("STORING",data,"YES");
    const requestData = JSON.parse(data);
    console.log(requestData);
    req.on('end', async () => {
      try {
        
        console.log("req",requestData);
        
        const {  vehicle_id, amount } = requestData;
        let user_id =1;
        let payment_id = 1010101;
        // Store transaction details in the database
        const transactionQuery = `
          INSERT INTO transaction_history (payment_id, rentee_id, vehicle_id, amount, start_ts, booking_start, booking_end)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
        // Replace the placeholder values (1, new Date(), new Date(), new Date()) with your actual values
        connection.query(
          transactionQuery,
          [payment_id, user_id, vehicle_id, amount, new Date(), new Date(), new Date()],
          (error, results) => {
            console.log("Its happening");
            if (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: error.message }));
              console.log(error);
            } else {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
              console.log(results);
            }
          }
        );
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
}

module.exports = {validate_coupon, checkout, store_transaction};