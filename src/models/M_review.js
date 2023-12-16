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
            // const query ="SELECT * FROM vehicles vc join transaction_history th on vc._ID=th.vehicle_id WHERE (th.rentee_id=? AND vc.renter_id=?) OR (th.rentee_id=? AND vc.renter_id=?);"
            const query="SELECT * FROM vehicles WHERE _ID=?"
            connection.query(query, [data["vehicle_id"]],(err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback();
                }
                // console.log(results)
                if (results.length==0){
                    return callback("Cannot review this user as no transaction in database", null);
                }
                
                else{
                    const sql="INSERT INTO user_reviews(`stars`,`description`,`rating_for`,`rating_by`) VALUES (?,?,?,?);"
                    connection.query(sql, [data["star"],data["description"],results[0].renter_id,user_id],(err, result) => {
                        connection.end(); // Close the connection
                        if (err) {
                        return callback(err, null);
                        }
                        // console.log("final",result)
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
            // const query = "SELECT * FROM user_reviews WHERE rating_for=? OR rating_by=?";
            const query = "SELECT user_reviews._ID as _ID,user_reviews.stars as stars,user_reviews.description as description,user_reviews.rating_for as rating_for,user_reviews.rating_by as rating_by, f.first_name AS username_for, b.first_name AS username_by FROM user_reviews JOIN user AS f ON user_reviews.rating_for=f._ID JOIN user AS b ON user_reviews.rating_by=b._ID WHERE rating_for=? OR rating_by=?;"
            connection.query(query,[user_id, user_id], async (err, results) => {
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
                            id: review._ID,
                            stars: review.stars,
                            description: review.description,
                            ratedBy: review.rating_by,
                            ratedFor: review.rating_for,
                            username_by: review.username_by,
                            username_for: review.username_for,
                            userID: user_id
                        };
                    });
                    // console.log(reviews);
                    connection.end(); // Close the connection
                    return callback(null, reviews);
                }
            });
        });
    }

    static async filterReview(user_id, filterCriteria, callback) {
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

            let query = "SELECT * FROM (SELECT user_reviews._ID as _ID,user_reviews.stars as stars,user_reviews.description as description,user_reviews.rating_for as rating_for,user_reviews.rating_by as rating_by, f.first_name AS username_for, b.first_name AS username_by FROM user_reviews JOIN user AS f ON user_reviews.rating_for=f._ID JOIN user AS b ON user_reviews.rating_by=b._ID WHERE rating_for="+user_id+ " OR rating_by="+user_id+") AS dt";
            let conditions = [];
            let values = [];
    
            if (filterCriteria.stars!='') {
                conditions.push("stars = " + filterCriteria.stars);
            }
            if (filterCriteria.description) {
                conditions.push("description LIKE '%" + filterCriteria.description + "%'");
            }
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }
    
            connection.query(query, (err, results) => {
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

