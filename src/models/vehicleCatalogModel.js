// vehicleCatalogModel.js
const db = require('../../dbcon');

class VehicleCatalogModel {
  static getAllVehicles(callback) {
    const query = 'SELECT * FROM vehicle_catalog';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }

  static getVehicleById(vehicleId, callback) {
    const query = 'SELECT * FROM vehicle_catalog WHERE _ID = ?';
    db.query(query, [vehicleId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback({ message: 'Vehicle not found' }, null);
      }
      return callback(null, results[0]);
    });
}

}

module.exports = VehicleCatalogModel;
