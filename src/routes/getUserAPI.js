const url = require('url');
const UserModel = require('../models/userModel');

function getUserApi(req, res) {
  try {
    if (req.method === 'GET' && req.url.startsWith('/user/get/')) {
      const params = url.parse(req.url, true);
      const userId = parseInt(params.pathname.split('/').pop());

      // Call the UserModel function to get the user
      UserModel.getUserById(userId, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else if (!result || result.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin': '*'});
          res.end(JSON.stringify(result));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    // Handle any uncaught exceptions gracefully
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

module.exports = getUserApi;
