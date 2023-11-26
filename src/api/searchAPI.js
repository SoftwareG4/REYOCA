
// Import Model
const SearchModel = require('../models/SearchModel');

function searchApi(req, res) {
    let priceColName = "price";
    let ratingColName = "rating";

    try {
        let apiCall = req.url;
        if (apiCall.endsWith('/')) {
            apiCall = apiCall.substring(0, apiCall.length-1);
        }
        
        switch (apiCall) {
            case "/search":
                if (req.method == 'GET') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        console.log("body: ", body, " end");
                        if (body) {
                            SearchModel.setSearchParam (
                                jsonData.userLocation,
                                jsonData.startDate,
                                jsonData.endDate,
                                null,
                                null,
                                false
                            );
                            SearchModel.searchAvailableVehicles(callback);
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: "Bad request."}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: "Method not allowed."}));
                }
                break;


            case "/search/filter":
                if (req.method == 'GET') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            SearchModel.setSearchParam (
                                jsonData.userLocation,
                                jsonData.startDate,
                                jsonData.endDate,
                                jsonData.filterColumns,
                                null,
                                false
                            );
                            SearchModel.searchAvailableVehicles(callback);
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: "Bad request."}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: "Method not allowed."}));
                }
                break;

            
            case "/search/filter/price":
                if (req.method == 'GET') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            SearchModel.setSearchParam (
                                jsonData.userLocation,
                                jsonData.startDate,
                                jsonData.endDate,
                                jsonData.filterColumns,
                                priceColName,
                                false
                            );
                            SearchModel.searchAvailableVehicles(callback);
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: "Bad request."}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: "Method not allowed."}));
                }
                break;
            case "/search/filter/rating":
                if (req.method == 'GET') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            SearchModel.setSearchParam (
                                jsonData.userLocation,
                                jsonData.startDate,
                                jsonData.endDate,
                                jsonData.filterColumns,
                                ratingColName,
                                false
                            );
                            SearchModel.searchAvailableVehicles(callback);
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: "Bad request."}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: "Method not allowed."}));
                }
                break;
            case "/search/filter/price/desc":
                if (req.method == 'GET') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            SearchModel.setSearchParam (
                                jsonData.userLocation,
                                jsonData.startDate,
                                jsonData.endDate,
                                jsonData.filterColumns,
                                priceColName,
                                true
                            );
                            SearchModel.searchAvailableVehicles(callback);
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: "Bad request."}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: "Method not allowed."}));
                }
                break;
            case "/search/filter/rating/desc":
                if (req.method == 'GET') {
                    let body = '';
                    req.on('data', (chunk) => {
                        body += chunk;
                    });

                    req.on('end', async () => {
                        if (body) {
                            const jsonData = JSON.parse(body);

                            SearchModel.setSearchParam (
                                jsonData.userLocation,
                                jsonData.startDate,
                                jsonData.endDate,
                                jsonData.filterColumns,
                                ratingColName,
                                true
                            );
                            SearchModel.searchAvailableVehicles(callback);
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({error: "Bad request."}));
                        }
                    });
                } else {
                    res.writeHead(405, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({error: "Method not allowed."}));
                }
                break;
            default:
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: "Requested URL not found."}));
                break;
        }
    } catch (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Internal Server Error'}));
    }

    function callback (err, result) {
        console.log("result: ", result);
        vehicleList = JSON.parse(result).response;
        console.log("vehicleList: ", vehicleList);
        if (err) {
            console.log("ERROR: ", err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({"error": "Internal Server Error"}));
        } else if (vehicleList && vehicleList.length) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(result));
        } else {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({error: "No entries with these filters exist."}));
        }
    }
}

module.exports = searchApi;