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
                // if (req.method == 'POST') {
                //     let body = '';
                //     req.on('data', (chunk) => {
                //         body += chunk;
                //     });

                //     req.on('end', async () => {
                //         console.log("body: ", body, " end");
                //         let jsonDataString = querystring.unescape(body);
                //         jsonDataString = querystring.parse(jsonDataString).jsonData;
                //         if (jsonDataString) {
                //             const jsonData = JSON.parse(jsonDataString);
                //             console.log("JSON data received: ", jsonData);

                //             fetch("http://localhost:3000/search", {
                //                 method: "POST",
                //                 body: jsonDataString,
                //             })
                //             .then(async (apiResponse) => {
                //                 console.log(util.inspect(apiResponse, {depth: null}));
                //                 return apiResponse.json();
                //             })
                //             .then((apiJsonData) => {
                //                 console.log("FInal:", util.inspect(apiJsonData, {depth: null}));
                //                 // let apiRespData = JSON.parse(apiResponse)["body"];
                //                 ejs.renderFile('./src/views/carList.ejs', {"carList": apiJsonData.response}, null, (err, htmlStr) => {
                //                     console.log("Error: ", err);
                //                     if(err) {
                //                         res.writeHead(500, {'Content-Type': 'application/json'});
                //                         res.end(JSON.stringify({"error": "Internal Server Error."}));
                //                     } else {
                //                         // console.log("htmlStr: ", htmlStr);
                //                         res.writeHead(200, {'Content-Type': 'text/html'});
                //                         res.end(htmlStr);
                //                     }
                //                 })
                //             })
                //             .catch((error) => {
                //                 console.log("error ", error);
                //                 res.writeHead(500, {'Content-Type': 'application/json'});
                //                 res.end(JSON.stringify({"error": "Internal Server Error."}));
                //             });

                //         } 
                //     });
                // } else {
                //     res.writeHead(405, {'Content-Type': 'application/json'});
                //     res.end(JSON.stringify({"error": "Method not allowed."}));
                // }
                // break;
        }
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({"error": 'Internal Server Error'}));
    }
}

module.exports = {redirectView};