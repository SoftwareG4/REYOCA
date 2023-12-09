const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');

class CheckoutModel {
    static async validate_coupon(requestData, callback) {
    
        let code = requestData['code']
        if (code) {
            if (code.toLowerCase() == "reyoca10" || code.toLowerCase() == "new10" || code.toLowerCase() == "super25") {
              let percentage = (code.toLowerCase() == "reyoca10" || code.toLowerCase() == "new10") ? 0.1 : 0.25
              return callback(null, {"disc" : percentage});
            } else {
              return callback(null, {"message" : 'Sorry! Coupon not valid.'} );
            } 
          } else {
            return callback(null, {"message" : 'Coupon code cannot be empty.'} );
          }
    }

    static async store_transaction(requestData, callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }
            const transactionQuery = `
                    INSERT INTO transaction_history (payment_id, rentee_id, vehicle_id, amount, start_ts, booking_start, booking_end)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const rentee_id = requestData['rentee_id'];
            const vehicle_id = requestData['vehicle_id'];
            const amount = requestData['final_amount'];
            
            let payment_id =  crypto.randomInt(100000, 999999);
            if (rentee_id && vehicle_id) {
                connection.query(
                    transactionQuery,
                    [payment_id, rentee_id, vehicle_id, amount, new Date(), new Date(), new Date()],
                    (error, results) => {
                        if (error) {
                            callback(err, null);
                        } else {
                            return callback(null, "Insert sucessful !!");
                        }
                    }
                );
            }
        });
    }

    static async checkout(ids, callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }
            const rentee_id = ids['rentee_id'];
            const vehicle_id = ids['vehicle_id'];
            if (rentee_id && vehicle_id) {
                connection.query(
                    'DELETE FROM cart WHERE rentee_id = ? and vehicle_id = ?',
                    [rentee_id, vehicle_id],
                    (error, results) => {
                        if (error) {
                            callback(err, null);
                        } else if (results.affectedRows === 0) {
                            return callback(null, "Car not found in cart or not a valid user");
                        } else {
                            return callback(null, "Car deleted successfully!!");
                        }
                    }
                );
            }
        });
    }
}

module.exports = CheckoutModel;

