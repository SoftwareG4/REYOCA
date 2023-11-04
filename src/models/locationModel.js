// locationModel.js
const db = require('../../dbcon');

class LocationModel {
  static getAllLocations(callback) {
    const query = 'SELECT * FROM location';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }

  static getLocationById(locationId, callback) {
    const query = 'SELECT * FROM location WHERE _ID = ?';
    db.query(query, [locationId], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback({ message: 'Location not found' }, null);
      }
      return callback(null, results[0]);
    });
}

}

module.exports = LocationModel;
