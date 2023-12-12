// 1. Delete a car from a particular logged in users cart.
// 1. View cart for a particular user.

const CartModel = require('../models/M_cart');
const dotenv = require('dotenv');
dotenv.config();
const cookie = require('cookie');

function delete_car(req, res) {
    const chunks = [];
    let id;
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    if (req.method === 'DELETE') {
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
            const rentee_id = cookie.parse(req.headers.cookie)['id'];
            const vehicle_id = requestData['vehicle_id'];
            requestData['rentee_id'] = cookie.parse(req.headers.cookie)['id'];
            if (rentee_id && vehicle_id) {
                CartModel.delete_car(requestData, (err, result) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: err }));
                    } else if (typeof(result)=="string") {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: result }));
                    }
                });
            }
            else{
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'rentee_id and vehicle_id both need to be passed' }));
            }
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}

module.exports = {delete_car};