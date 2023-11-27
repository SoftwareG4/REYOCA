const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");

dotenv.config();
async function encrypt(password) {
    return await bcrypt.hash(password.toString(), 10)
}

async function compare_encrypt(password,encrypt_password) {
    return await bcrypt.compare(password, encrypt_password)
}

class Profile_Model {
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
                    if (await compare_encrypt(requestData["curr_pass"],results[0]["password"])){
                        const encrypt_password = await encrypt(requestData["new_pass"]);
                        connection.query("UPDATE user SET password=? WHERE _ID=?",[encrypt_password,user_id], async (err, results) => {
                            if (err) {
                                return callback(err, null);
                            }
                        });
                        return callback(null, results);
                    }
                    else{
                        return callback(null, "Invalid Password");
                    }
                }
                connection.end(); 
            });
        });
    }
}

module.exports = Profile_Model;

