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
            const query ="SELECT * FROM vehicles vc join transaction_history th on vc._ID=th.vehicle_id WHERE (th.rentee_id=? AND vc.renter_id=?) OR (th.rentee_id=? AND vc.renter_id=?);"
            connection.query(query, [user_id,data["rating_for"],data["rating_for"],user_id],(err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback();
                }
                if (results.length==0){
                    return callback("Cannot review this user as no transaction in database", null);
                }
                else{
                    const sql="INSERT INTO user_reviews(`stars`,`description`,`rating_for`,`rating_by`) VALUES (?,?,?,?);"
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

    static async getReviewById(user_id, callback) {
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
            const query = "SELECT * FROM user_reviews WHERE rating_for=? OR rating_by=?";
            connection.query(query,[user_id, user_id], async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                console.log(results)
                if(results.length==0){
                    return callback(null, "No Reviews Found");
                }
                else{
                    const reviews = results.map(review => {
                        return {
                            id: review._ID,
                            stars: review.stars,
                            description: review.description,
                            ratedBy: review.rating_by,
                            ratedFor: review.rating_for,
                            userID: user_id
                        };
                    });
                    console.log(reviews);
                    connection.end(); // Close the connection
                    return callback(null, reviews);
                }
            });
        });
    }

    static async filterReview(filterCriteria, callback) {
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
            let query = "SELECT * FROM user_reviews"; 
            let conditions = [];
            let values = [];
    
            if (filterCriteria.rating_for) { 
                conditions.push("rating_for = ?");
                values.push(filterCriteria.rating_for);
            }
            if (filterCriteria.stars) {
                conditions.push("stars = ?");
                values.push(filterCriteria.stars);
            }
            if (filterCriteria.keyword) {
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
module.exports = review_Model;

