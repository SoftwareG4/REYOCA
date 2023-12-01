// 1. View cart for a particular user.

const PaymentMethodsModel = require('../models/M_payment_methods');
const dotenv = require('dotenv');
dotenv.config();
var ncrypt = require('ncrypt-js');
var { encrypt, decrypt } = new ncrypt(process.env.SECRET);

function view_pay_method(req, res) {
    const chunks = [];
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
            PaymentMethodsModel.view_payment_method(requestData, (err, result) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: err }));
                } else if (typeof(result)=="string") {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: result }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    card = decrypt(result[0]['card_number'])
                    exp_date = decrypt(result[0]['exp_date'])
                    let decrypted_result = {
                        "card_number" : card,
                        "expiry" : exp_date,
                        "user_id" : result[0]['user_id']
                    }
                    res.end(JSON.stringify(decrypted_result));
                    }
            });
        });
    } else {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
}
module.exports = {view_pay_method};