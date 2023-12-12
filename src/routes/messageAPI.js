
const MessageModel = require('../models/messageModel');
const {validateToken}= require('../services/JWTauth');
function messageApi (req, res) {

    try {
        let apiCall = req.url;
        if (apiCall.endsWith('/')) {
            apiCall = apiCall.substring(0, apiCall.length-1);
        }

        switch (apiCall) {
            case "/message":
                if (req.method == 'POST') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', () => {
                        console.log("body: ", body);
                        if (body) {
                            const jsonData = JSON.parse(body);

                            const sender_id=validateToken(req.headers.cookie);
                            if (!sender_id) {
                                res.writeHead(401, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ "error": "User not Authenticated" }));
                                return;
                            }
                            // const sender_id = 1;
                            const receiver_id = parseInt(jsonData.receiver);
                            const messageBody = jsonData.message;
                            isValid = MessageModel.setParams(sender_id, receiver_id, messageBody);
                            if (!isValid) {
                                res.writeHead(400, {'Content-Type': 'application/json'});
                                res.end(JSON.stringify({"error": "Bad Request."}));
                            }

                            MessageModel.sendMessage( (err, response) => {
                                if (err) {
                                    console.log("ERROR: ", err);
                                    res.writeHead(500, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify({"error": "Internal Server Error"}));
                                } else if (response) {
                                    res.writeHead(201, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify({'response': "Message sent."}));
                                } else {
                                    res.writeHead();
                                    res.end();
                                }
                            });
                        }
                    });
                }
                break;
            case "/message/get-names":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            const sender_id=validateToken(req.headers.cookie);
                            if (!sender_id) {
                                res.writeHead(401, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ "error": "User not Authenticated" }));
                                return;
                            }
                            const receiver_id = parseInt(jsonData.receiver);
                            await MessageModel.getNames(sender_id, receiver_id, (err, response) => {
                                if (err) {
                                    console.log("ERROR: ", err);
                                    res.writeHead(500, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify({"error": "Internal Server Error"}));
                                } else if (response) {
                                    console.log(response);
                                    if (response) {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.end(JSON.stringify(response));
                                    }
                                } else {
                                    res.writeHead();
                                    res.end();
                                }
                            });
                        }
                    });
                }
                break;
            case "/message/get-messages":
                if (req.method === "POST") {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            const sender_id=validateToken(req.headers.cookie);
                            if (!sender_id) {
                                res.writeHead(401, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ "error": "User not Authenticated" }));
                                return;
                            }
                            const receiver_id = parseInt(jsonData.receiver);
                            await MessageModel.getMessages(sender_id, receiver_id, (err, response) => {
                                if (err) {
                                    console.log("ERROR: ", err);
                                    res.writeHead(500, {'Content-Type': 'application/json'});
                                    res.end(JSON.stringify({"error": "Internal Server Error"}));
                                } else if (response) {
                                    console.log(response);
                                    if (response) {
                                        res.writeHead(200, {'Content-Type': 'application/json'});
                                        res.end(response);
                                    }
                                } else {
                                    res.writeHead();
                                    res.end();
                                }
                            });
                        }
                    });
                }
                break;
        }
    } catch (err) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"error": "Internal Server Error"}));
    }
}

module.exports = messageApi;