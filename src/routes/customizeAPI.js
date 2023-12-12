const fs = require('fs');
const ejs = require('ejs');

// const temp = require('../../src/views/');

function customizeAPI(req, res) {
    console.log("entered customize");
    if (req.method === 'GET' && req.url === '/customize') {
    renderTemplate('../../src/views/weather.ejs', res);
  } else if (req.method === 'GET' && req.url === '/customize/weather') {
    renderTemplate('../../src/views/weather.ejs', res);
  } else if (req.method === 'GET' && req.url === '/customize/airbnbs_near_location') {
    renderTemplate('../../src/views/airbnb.ejs', res);
  } else if (req.method === 'GET' && req.url === '/customize/attractions') {
    renderTemplate('../../src/views/attractions.ejs', res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

function renderTemplate(templatePath, res) {
  fs.readFile(templatePath, 'utf8', (err, data) => {
    if (err) {
        console.log(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    const compiledTemplate = ejs.compile(data);
    const renderedHtml = compiledTemplate();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderedHtml);
  });
}

module.exports = customizeAPI;
