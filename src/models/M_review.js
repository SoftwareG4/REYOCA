const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");


class review_Model {
    static async post_review(user_id,data,callback) {
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
            const query ="SELECT * FROM vehicle_catalog vc join transaction_history th on vc._ID=th.vehicle_id WHERE (th.rentee_id=? AND vc.renter_id=?) OR (th.rentee_id=? AND vc.renter_id=?);"
            connection.query(query, [user_id,data["rating_for"],data["rating_for"],user_id],(err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback();
                }
                if (results.length==0){
                    return callback("Cannot review this user as no transaction in database", null);
                }
                else{
                    const sql="INSERT INTO reviews(`stars`,`description`,`rating_for`,`rating_by`) VALUES (?,?,?,?);"
                    connection.query(query, [data["star"],data["description"],data["rating_for"],user_id],(err, result) => {
                        connection.end(); // Close the connection
                        if (err) {
                        return callback(err, null);
                        }
                        return callback(null, "Review Added Successfully");
                    });
                }
            });
        });
    }
}
module.exports = review_Model;

