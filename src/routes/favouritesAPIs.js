// favouritesApi.js
const url = require('url');
const FavouritesModel = require('../models/favouritesModel');

function favouritesApi(req, res) {
  if (req.method === 'POST' && req.url === '/favourites/add-to-favourites') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      const postBody = JSON.parse(body);
      const userId = postBody.userId;
      const vehicleId = postBody.vehicleId;

      FavouritesModel.addToFavourites(userId, vehicleId, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Added to favourites successfully' }));
        }
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

module.exports = favouritesApi;
