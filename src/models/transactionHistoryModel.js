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


//===================================================================NEW FUNCTIONS TEST THESE ==========================================================================
    static cancelBooking(transactionId, callback) {
      try {
        const connection = db(); // Get a connection
  
        connection.connect((err) => {
          if (err) {
            console.error('Error connecting to the database:', err);
            return callback(err, null);
          }
  
          const query = 'DELETE FROM transactions WHERE transaction_id = ?';
          connection.query(query, [transactionId], (err, result) => {
            connection.end(); // Close the connection
  
            if (err) {
              console.error('Error executing the query:', err);
              return callback(err, null);
            }
  
            return callback(null, result);
          });
        });
      } catch (error) {
        console.error('Error:', error);
        return callback(error, null);
      }
    }



    static updateBooking(transactionId, updatedData, callback) {
      try {
        const connection = db(); // Get a connection
  
        connection.connect((err) => {
          if (err) {
            console.error('Error connecting to the database:', err);
            return callback(err, null);
          }
  
          const query = 'UPDATE transactions SET ? WHERE transaction_id = ?';
          connection.query(query, [updatedData, transactionId], (err, result) => {
            connection.end(); // Close the connection
  
            if (err) {
              console.error('Error executing the query:', err);
              return callback(err, null);
            }
  
            return callback(null, result);
          });
        });
      } catch (error) {
        console.error('Error:', error);
        return callback(error, null);
      }
    }



  }

module.exports = TransactionHistoryModel;
