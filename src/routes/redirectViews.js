const querystring = require('querystring');
const ejs = require('ejs');
const util = require('util')

function redirectView(req, res) {
    console.log("redirectView");
    try {
        let targetURL = req.url;
        console.log(targetURL);

        switch (targetURL) {
            case "/views/search":
                console.log("vdsdfsdfs");
                ejs.renderFile('./src/views/carList.ejs', null, null, (err, htmlStr) => {
                    console.log("Error: ", err);
                    if(err) {
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({"error": "Internal Server Error."}));
                    } else {
                        console.log("htmlStr: ", htmlStr);
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(htmlStr);
                    }
                })
                break;
            
            case "/views/message":
                console.log("Message");
                data = {"receiver_id": 1};
                ejs.renderFile('./src/views/message.ejs', data, null, (err, htmlStr) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({"error": "Internal Server Error."}));
                    } else {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(htmlStr);
                    }
                });
                break;
        }
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"error": 'Internal Server Error'}));
    }
}

module.exports = {redirectView};