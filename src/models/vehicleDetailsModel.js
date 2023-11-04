// vehicleDetailsModel.js
const db = require('../../dbcon');

class VehicleDetailsModel {
  static getAllVehicleDetails(callback) {
    const query = 'SELECT * FROM vehicle_details';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }

  static getVehicleDetailsById(vehicleId, callback) {
    const query = 'SELECT * FROM vehicle_details WHERE vehicle_id = ?';
    db.query(query, [vehicleId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback({ message: 'Vehicle details not found' }, null);
      }
      return callback(null, results[0]);
    });
}
}

module.exports = VehicleDetailsModel;
