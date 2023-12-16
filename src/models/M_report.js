const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");


class ReportModel {
    static async post_report(user_id,data,callback) {
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
            const query ="SELECT * FROM vehicles vc join transaction_history th on vc._ID=th.vehicle_id WHERE (th.rentee_id=? AND vc.renter_id=?) OR (th.rentee_id=? AND vc.renter_id=?);"
            connection.query(query, [user_id,data["reported_id"],data["reprted_id"],user_id],(err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback();
                }
                if (results.length==0){
                    return callback("Cannot review this user as no transaction in database", null);
                }
                else{
                    const sql="INSERT INTO report(`report_type`,`description`,`reported_id`,`reported_by`) VALUES (?,?,?,?);"
                    connection.query(query, [data["report_type"],data["description"],data["reported_id"],user_id],(err, result) => {
                        connection.end(); // Close the connection
                        if (err) {
                        return callback(err, null);
                        }
                        return callback(null, "Successfully Reported");
                    });
                }
            });
        });
    }

    static async getReport(reported_id, callback) {
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
            const query = "SELECT * FROM report WHERE status = 'pending'";
            connection.query(query, async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "No Reviews Found");
                }
                else{
                    const reviews = results.map(review => {
                        return {
                            _ID: review._ID,
                            reported_id: review.reported_id,
                            reported_by: review.reported_by,
                            description: review.description,
                            report_type: review.report_type,
                            status: review.status
                        };
                    });
                    connection.end(); // Close the connection
                    return callback(null, reviews);
                }
            });
        });
    }

    static async filterReport(filterCriteria, callback) {
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
            let query = "SELECT * FROM report"; 
            let conditions = [];
            let values = [];
    
            if (filterCriteria.reported_id) { 
                conditions.push("reported_id = ?");
                values.push(filterCriteria.reported_id);
            }

            if (filterCriteria.reported_by) { // Assuming it's 'rating_by' based on your error log
                conditions.push("reported_by = ?");
                values.push(filterCriteria.reported_by);
            }

            if (filterCriteria.report_type) { // Assuming it's 'rating_by' based on your error log
                conditions.push("report_type = ?");
                values.push(filterCriteria.report_type);
            }

            if (filterCriteria.keyword) { // Assuming it's 'rating_by' based on your error log
                conditions.push("description LIKE '%" + filterCriteria.keyword + "%'");
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

module.exports = ReportModel;

