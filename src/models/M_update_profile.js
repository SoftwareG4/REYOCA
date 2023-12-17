const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");
var ncrypt = require('ncrypt-js');
var encrypted = new ncrypt(process.env.KEY);


dotenv.config();
async function encrypt(password) {
    return await bcrypt.hash(password.toString(), 10)
}

async function compare_encrypt(password,encrypt_password) {
    return await bcrypt.compare(password, encrypt_password)
}

class Profile_Model {
    static async prof_view(user_id, callback) {
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
            const query = "SELECT * FROM user WHERE _ID=?";
            connection.query(query,[user_id], async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "No Reviews Found");
                }
                else{
                    const user = results.map(user => {
                        if (user.government_id && user.government_id.length != 0) {
                            try {
                                user.government_id = encrypted.decrypt(user.government_id);
                            } catch (error) {
                                user.government_id = null; // Set to null if decryption fails
                            }
                        }
                        
                        return {
                            photo: user.img_url,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            gender: user.gender,
                            phone: user.phone,
                            email: user.email,
                            government_id: user.government_id
                        };
                    });
                    connection.end(); // Close the connection
                    return callback(null, user);
                }
            });
        });
    }

    static async update_picture(data,callback) {
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
            const query ="UPDATE `user` SET img_url='"+data['link']+"' WHERE _ID="+data['id']+";";
            connection.query(query, (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, results);
            });
        });
    }

    static async update_pass(user_id,requestData,callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        // console.log(user_id,requestData)
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }
            const query = "SELECT * FROM user WHERE _ID=?";
            connection.query(query,user_id, async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "Email Not Registered");
                }
                else{
                    if (await compare_encrypt(requestData["curr_pass"],results[0]["password"])){
                        const encrypt_password = await encrypt(requestData["new_pass"]);
                        connection.query("UPDATE user SET password=? WHERE _ID=?",[encrypt_password,user_id], async (err, results) => {
                            if (err) {
                                return callback(err, null);
                            }
                        });
                        return callback(null, "Password updated successfully");
                    }
                    else{
                        return callback(null, "Invalid Password");
                    }
                }
                connection.end(); 
            });
        });
    }

    static async profile_update(user_id,requestData,callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        // console.log(JSON.parse(requestData));
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }
            const query = "SELECT * FROM user WHERE _ID=?";
            connection.query(query,[user_id], async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "Email Not Registered");
                }
                else{
                    let query = "UPDATE user SET "; // Replace '*' with specific columns if needed
                    let conditions = [];
                    let values = [];
                    if (requestData.first_name) { 
                        conditions.push("first_name = ?");
                        values.push(requestData.first_name);
                    }
                    if (requestData.last_name) { 
                        conditions.push("last_name = ?");
                        values.push(requestData.last_name);
                    }
                    if (requestData.email) { 
                        conditions.push("email = ?");
                        values.push(requestData.email);
                    }
                    if (requestData.phone) { 
                        conditions.push("phone = ?");
                        values.push(requestData.phone);
                    }
                    if (requestData.gender) { 
                        conditions.push("gender = ?");
                        values.push(requestData.gender);
                    }
                    if (requestData.government_id) { 
                        conditions.push("government_id = ?");
                        values.push(encrypted.decrypt(requestData.government_id));
                    }

                    if (conditions.length > 0) {
                        query += conditions.join(",") + " WHERE _ID=" + user_id;
                    }
                    console.log(query);
                    connection.query(query, values, (err, results) => {
                        connection.end(); // Close the connection
                        if (err) {
                            return callback(err, null);
                        }
                        return callback(null, "Profile updated");
                    });
                }
                connection.end(); 
            });
        });
    }

    static async payment_create(user_id, requestData, callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
    
        // Check if all mandatory fields are present
        if (!requestData.card_number || !requestData.exp_date || requestData.is_credit === undefined) {
            return callback(new Error("All fields (card_number, exp_date, is_credit) are required"), null);
        }
    
        connection.connect(err => {
            if (err) {
                return callback(err, null);
            }
    
            const userQuery = "SELECT * FROM user WHERE _ID = ?";
            connection.query(userQuery, [user_id], (err, results) => {
                if (err) {
                    connection.end();
                    return callback(err, null);
                }
    
                if (results.length === 0) {
                    connection.end();
                    return callback(null, "User not registered");
                } else {
                    let insertQuery = "INSERT INTO payment_profile (user_id, card_number, exp_date, is_credit) VALUES (?, ?, ?, ?)";
                    let values = [
                        requestData.user_id,
                        encrypted.encrypt(requestData.card_number),
                        encrypted.encrypt(requestData.exp_date),
                        requestData.is_credit
                    ];
    
                    connection.query(insertQuery, values, (err, results) => {
                        connection.end();
                        if (err) {
                            return callback(err, null);
                        }
                        return callback(null, "Payment profile created");
                    });
                }
            });
        });
    }
    
    

    static async payment_update(user_id,requestData,callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        // console.log(user_id,requestData)
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }
            const query = "SELECT * FROM user WHERE _ID=?";
            connection.query(query,[user_id], async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "Email Not Registered");
                }
                else{
                    let query = "UPDATE payment_profile SET ";
                    let conditions = [];
                    let values = [];

                    if (requestData.card_number) { 
                        const encryptedCardNO = encrypted.encrypt(requestData.card_number);
                        conditions.push("card_number = ?");
                        values.push(encryptedCardNO);
                    }
                    if (requestData.exp_date) { 
                        const encryptedExpDate = encrypted.encrypt(requestData.card_number);
                        conditions.push("exp_date = ?");
                        values.push(encryptedExpDate);
                    }
                    if (requestData.is_credit) { 
                        conditions.push("is_credit = ?");
                        values.push(requestData.is_credit);
                    }

                    if (conditions.length > 0) {
                        query += conditions.join(",") + " WHERE user_id=" + user_id;
                    }
                    console.log("query: ", query);
                    connection.query(query, values, (err, results) => {
                        connection.end(); // Close the connection
                        if (err) {
                            return callback(err, null);
                        }
                        return callback(null, "Payment updated");
                    });
                }
                connection.end();  
            });
        });
    }

    static async getRatingById(user_id, callback) {
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
            const query = "SELECT AVG(stars) AS average_rating FROM user_reviews WHERE rating_for=?";
            connection.query(query, [user_id], (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                    return callback(err, null);
                }
                if (results.length == 0 || results[0].average_rating === null) {
                    return callback(null, "No Rating Available");
                } else {
                    // Return the average rating
                    const averageRating = results[0].average_rating;
                    return callback(null, averageRating);
                }
            });
        });
    }
    
}



module.exports = Profile_Model;

