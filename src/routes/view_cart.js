// 1. View cart for a particular user.

const CartModel = require('../models/M_cart');
const dotenv = require('dotenv');
dotenv.config();

let current_user_cart = new Map();

function view_cart(req, res) {
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
            CartModel.view_cart(id, (err, result) => {
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
module.exports = {view_cart};