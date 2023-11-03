const path = require('path');
const ejs = require('ejs');
const VehicleModel = require('../models/vehicleDetailsModel');

const handleGetVehicleDetailsRoute = (req, res) => {
  // Fetch vehicle details, reviews, and location using VehicleModel
  VehicleModel.getVehicleDetails((err, vehicleDetails) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    } else {
      // Render the vehicle details using a dedicated EJS template
      const vehicleDetailsTemplatePath = path.join(__dirname, '../views', 'vehicle-details.ejs');
      fs.readFile(vehicleDetailsTemplatePath, 'utf8', (err, template) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          const renderedHtml = ejs.render(template, { vehicleDetails });
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
    }
  });
};

module.exports = handleGetVehicleDetailsRoute;
