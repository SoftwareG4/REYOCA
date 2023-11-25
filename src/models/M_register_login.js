const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");

dotenv.config(); // Load environment variables from .env file

async function encrypt(password) {
    return await bcrypt.hash(password.toString(), 10)
}

async function compare_encrypt(password,encrypt_password) {
    return await bcrypt.compare(password, encrypt_password)

}


class UserModel {
    static async registerrentee(requestData,callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        const encrypt_password = await encrypt(requestData["password"]);
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }

            const query ="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`) VALUES ('"+requestData["firstname"]+"', '"+requestData["lastname"]+"', '"+requestData["email"]+"', '"+encrypt_password+"', '"+requestData["phone"]+"', 'rentee','"+requestData["gov_id"]+"');";
            connection.query(query, (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, results);
            });
        });
    }

    static async registerrenter(requestData,callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        const encrypt_password = await encrypt(requestData["password"]);
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }

            const query ="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`) VALUES ('"+requestData["firstname"]+"', '"+requestData["lastname"]+"', '"+requestData["email"]+"', '"+encrypt_password+"', '"+requestData["phone"]+"', 'renter','"+requestData["gov_id"]+"');";
            connection.query(query, (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, results);
            });
        });
    }

    static login_verify(requestData,callback) {
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

            const query = "SELECT * FROM user WHERE email=?";
            connection.query(query,[requestData["email"]], async (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "Email Not Registered");
                }
                else{
                    if (await compare_encrypt(requestData["password"],results[0]["password"])){
                        return callback(null, results);
                    }
                    else{
                        return callback(null, "Invalid Password");
                    }
                }
            });
        });
    }
}




module.exports = UserModel;