const mysql = require('mysql2');
const db = require('../../dbcon');
const dotenv = require('dotenv');
dotenv.config();


class CheckoutModel {
    static async validate_coupon(requestData, callback) {
    
        let code = requestData['code']
        if (code) {
            if (code.toLowerCase() == "reyoca10" || code.toLowerCase() == "new10" || code.toLowerCase() == "super25") {
              let percentage = (code.toLowerCase() == "reyoca10" || code.toLowerCase() == "new10") ? 0.1 : 0.25
              return callback(null, {"disc" : percentage});
            } else {
              return callback(null, 'Sorry! Coupon not valid. ');
            } 
          } else {
            return callback(null, 'Coupon code cannot be empty');
          }
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

