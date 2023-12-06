// vehicleDetailsModel.js
const db = require('../../dbcon');

class VehicleDetailsModel {
  static getAllVehicleDetails(callback) {
    const query = 'SELECT * FROM vehicles';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }

static getVehicleDetailsById(vehicleId, callback) {
  try {
    const connection = db(); // Get a connection

    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        return callback(err, null);
      }

      const query = 'SELECT * FROM vehicles WHERE _ID = ?';
      connection.query(query, [vehicleId], (err, results) => {
        connection.end(); // Close the connection

        if (err) {
          console.error('Error executing the query:', err);
          return callback(err, null);
        }

        if (results.length === 0) {
          console.log("4");
          return callback({ message: 'Vehicle details not found' }, null);
        }


        return callback(null, results[0]);
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return callback(error, null);
  }
}







}

module.exports = VehicleDetailsModel;
