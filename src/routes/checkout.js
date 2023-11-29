// 1. check coupon
// 2. complete checkout
// 1. View cart for a particular user.

const CheckoutModel = require('../models/M_checkout');
const jwt = require('jsonwebtoken')
const cookie = require('cookie');
const dotenv = require('dotenv');
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
    let id;
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
                id = requestData['id'];
            }
            catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid formatting of the request' }));
                return;
            }
            CheckoutModel.view_cart(id, (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err }));
                } else if (typeof(result)=="string") {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: result }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                   
                    result.forEach(item => {
                    const { vehicle_id, quantity, total_cost } = item;
                    if (!current_user_cart.has(vehicle_id)) {
                        current_user_cart.set(vehicle_id, []);
                    }
                    current_user_cart.get(vehicle_id).push([quantity, total_cost]);
                    });
                    res.end(JSON.stringify(result));
                    }
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}

module.exports = {validate_coupon, checkout};