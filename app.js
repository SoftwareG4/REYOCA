const http = require('http');
const db = require('./dbcon');
const url = require('url');
const qs = require('querystring');
const mysql = require('mysql2');
const fs = require('fs');

// Import Apis
const searchApi = require('./src/routes/searchAPI');
const messageApi = require('./src/routes/messageAPI');

// Resource path
const noPath = '/';
const searchPath = '/search';
const recommendationPath = '/recommendations';
const messagePath = "/message";

const server = http.createServer(async (req, res) => {

  if (req.url.startsWith(searchPath) || req.url.startsWith(recommendationPath)) {
    searchApi(req, res);
  }

  else if (req.url.startsWith(messagePath)) {
    messageApi(req, res);
  }

  else if (req.url.startsWith(noPath)) {
    fs.readFile('./public/index.html', function (err, html) {

      if (err) {
        console.log(err);
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end();
    });
  }

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }


});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
