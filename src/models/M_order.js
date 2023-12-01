const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");


class OrderModel {
    static async getOrderById(user_id, callback) {
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
            const query = "SELECT * FROM transaction_history WHERE rentee_id=?";
            connection.query(query,[user_id], async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "No history Found");
                }
                else{
                    const result = results.map(transaction_history => {
                        return {
                            id: transaction_history._ID,
                            payment_id: transaction_history.payment_id,
                            vehicle_id: transaction_history.vehicle_id,
                            amount: transaction_history.amount,
                            start_ts: transaction_history.start_ts,
                            booking_start: transaction_history.booking_start,
                            booking_end: transaction_history.booking_end,
                        };
                    });
                    connection.end(); // Close the connection
                    return callback(null, result);
                }
            });
        });
    }

    static async filterOrder(filterCriteria, callback) {
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
            let query = "SELECT * FROM transaction_history"; // Replace '*' with specific columns if needed
            let conditions = [];
            let values = [];
    
            if (filterCriteria.payment_id) { // Assuming it's 'rating_by' based on your error log
                conditions.push("payment_id = ?");
                values.push(filterCriteria.payment_id);
            }
            if (filterCriteria.vehicle_id) {
                conditions.push("vehicle_id = ?");
                values.push(filterCriteria.vehicle_id);
            }
            if (filterCriteria.amount) {
                conditions.push("amount = ?");
                values.push(filterCriteria.amount);
            }
            if (filterCriteria.start_ts) {
                conditions.push("start_ts = ?");
                values.push(filterCriteria.start_ts);
            }
            if (filterCriteria.booking_start) {
                conditions.push("booking_start = ?");
                values.push(filterCriteria.booking_start);
            }
            if (filterCriteria.booking_end) {
                conditions.push("booking_end = ?");
                values.push(filterCriteria.booking_end);
            }
            if (filterCriteria.rentee_id) {
                conditions.push("rentee_id = ?");
                values.push(filterCriteria.rentee_id);
            }
            
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }
    
            connection.query(query, values, (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                    return callback(err, null);
                }
                return callback(null, results);
            });
        });
    }
}
module.exports = OrderModel;

