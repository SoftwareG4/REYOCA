const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");

class AdminModel{
    static async review_delete(user_id,data,callback) {
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
            const query ="DELETE FROM reviews WHERE _ID = ?";
            connection.query(query, data[_ID], (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, "Review Deleted Successfully");
            });
        });
    }

    static async report_delete(user_id,data,callback) {
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
            const query ="DELETE FROM report WHERE _ID = ?";
            connection.query(query, data[_ID], (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, "Report Resolved");
            });
        });
    }

    static async user_delete(user_id,data,callback) {
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
            let userID = user_id
            if(user_id === 1){
                userID = data[_ID];
            }
            const query ="DELETE FROM user WHERE _ID = ?";
            connection.query(query, userID, (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, "User Deleted Successfully");
            });
        });
    }

    static async listing_delete(user_id,data,callback) {
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
            const query ="DELETE FROM vehicles WHERE _ID = ?";
            connection.query(query, data["_ID"], (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, "Car Listing Deleted Successfully");
            });
        });
    }
}

module.exports = AdminModel;
