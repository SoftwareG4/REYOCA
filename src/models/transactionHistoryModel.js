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
  
          const query = 'DELETE FROM transaction_history WHERE _ID = ?';
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



    static updateBooking(transactionData, callback) {
      try {
        const connection = db();
        // console.log(transactionData);
    
        // Validate required fields
        const { renteeId, vehicleId, startDate, endDate, amount, transactionId } = transactionData;
        console.log(renteeId, vehicleId, startDate, endDate, amount, transactionId);
        if (!renteeId || !vehicleId || !startDate || !endDate || !amount || !transactionId) {
          const error = new Error('Invalid or missing fields in the request body');
          // console.log("1");
          // console.log(transactionData);
          // console.log(error);
          return callback(error, null);
        }
    
        // Validate data types
        if (typeof renteeId !== 'number' || typeof vehicleId !== 'number' || typeof startDate !== 'string' || typeof endDate !== 'string' || typeof transactionId !== 'number') {
          const error = new Error('Invalid data types in the request body');
          // console.log("20");
          // console.log(error);
          return callback(error, null);
        }
    
        connection.connect((err) => {
          if (err) {
            // console.error('Error connecting to the database:', err);
            // console.log("3");
            // console.log(error);
            return callback(err, null);
          }
    
          const query = `
            UPDATE transaction_history
            SET 
              rentee_id = ?,
              vehicle_id = ?,
              booking_start = ?,
              booking_end = ?,
              amount = ?
            WHERE _id = ?;
          `;
    
          connection.query(
            query,
            [renteeId, vehicleId, startDate, endDate, amount, transactionId],
            (err, result) => {
              connection.end(); // Close the connection
    
              if (err) {
                console.error('Error executing the query:', err);
                return callback(err, null);
              }
    
              return callback(null, result);
            }
          );
        });
      } catch (error) {
        console.error('Error:', error);
        return callback(error, null);
      }
    }
    
    



  }

module.exports = TransactionHistoryModel;
