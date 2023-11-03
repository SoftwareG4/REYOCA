// transactionHistoryModel.js
const db = require('../../dbcon');


  class TransactionHistoryModel {
    static checkAvailability(vehicleId, startDate, endDate, callback) {

      try{

        const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }


        const query = `
        SELECT COUNT(*) AS count
        FROM transaction_history
        WHERE vehicle_id = ? AND
          (booking_start BETWEEN ? AND ? OR booking_end BETWEEN ? AND ?);
      `;
      connection.query(
        query,
        [vehicleId, startDate, endDate, startDate, endDate],
        (err, results) => {
          connection.end();
          
          if (err) {
            return callback(err, null);
          }
          // If count is 0, it means no overlapping bookings, and the vehicle is available.
          const isAvailable = results[0].count === 0;
          return callback(null, isAvailable);
        }
      );

      });
     }

      catch (error) {
        console.error('Error:', error);
        return callback(error, null);
      }

      
    }
  }



module.exports = TransactionHistoryModel;
