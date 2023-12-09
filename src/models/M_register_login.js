const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");
const sendEmail = require("../services/emailService");


function gen_password(){
    let password=""
    let alphabets="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('')
    const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'.split('')
    let i = Math.floor(Math.random() * alphabets.length);
    password+=alphabets[i]
    i = Math.floor(Math.random() * alphabets.length);
    password+=alphabets[i].toLowerCase()
    i = Math.floor(Math.random() * alphabets.length);
    password+=alphabets[i].toLowerCase()
    i = Math.floor(Math.random() * alphabets.length);
    password+=alphabets[i].toLowerCase()
    i = Math.floor(Math.random() * specialChars.length);
    password+=specialChars[i]
    i = Math.floor(Math.random() * alphabets.length);
    password+=i.toString()
    i = Math.floor(Math.random() * alphabets.length);
    password+=i.toString()
    i = Math.floor(Math.random() * alphabets.length);
    password+=i.toString()
    i = Math.floor(Math.random() * alphabets.length);
    password+=i.toString()
    return password
}


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
            const query ="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`,`gender`) VALUES ('"+requestData["firstname"]+"', '"+requestData["lastname"]+"', '"+requestData["email"]+"', '"+encrypt_password+"', '"+requestData["phone"]+"', 'rentee','"+requestData["gov_id"]+"','"+requestData["gender"]+"');";
            connection.query(query, (err, results) => {
                connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                return callback(null, results);
            });
        });
    }

    static async googleregisterrentee(profile,callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });
        const encrypt_password = await encrypt("pikachu");
        connection.connect((err) => {
            if (err) {
              return callback(err, null);
            }
            // console.log(profile.email)
            let query = "SELECT * FROM user WHERE email=?";
            connection.query(query,[profile.email], async (err, results) => {
                // connection.end(); // Close the connection
                if (err) {
                return callback(err, null);
                }
                if(results.length==0){
                    query ="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`,`gender`,`img_url`) VALUES ('"+profile.given_name+"', '"+profile.family_name+"', '"+profile.email+"', '"+encrypt_password+"', NULL, 'rentee',NULL,'NA','"+profile.picture+"');";
                    connection.query(query,[profile.email], async (err, results) => {
                        if (err) {
                            console.log(err)
                            return callback(err, null);
                        }
                        query = "SELECT * FROM user WHERE email=?";
                        connection.query(query,[profile.email], async (err, results) => {
                            // console.log(results)
                            return callback(null, results[0]["_ID"]);
                        });
                    });
                } else{
                    // console.log(results)
                    return callback(null, results[0]["_ID"]);
                }
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

            const query ="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`,`gender`) VALUES ('"+requestData["firstname"]+"', '"+requestData["lastname"]+"', '"+requestData["email"]+"', '"+encrypt_password+"', '"+requestData["phone"]+"', 'renter','"+requestData["gov_id"]+"','"+requestData["gender"]+"');";
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

    static pass_update(requestData,callback) {
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
            console.log(requestData)
            const query = "SELECT * FROM user WHERE email=?";
            connection.query(query,[requestData["email"]], async (err, results) => {
                // Close the connection
                if (err) {
                return callback(err, null);
                }
                // console.log(results)
                if(results.length==0){
                    return callback(null, "Email Not Registered");
                }
                else{
                    const pass=gen_password()
                    const encrypted =await encrypt(pass);
                    console.log(encrypted)
                    const query ="UPDATE user SET password=? WHERE email=?"
                    connection.query(query,[encrypted,requestData["email"]] ,(err, results) => {
                        connection.end(); // Close the connection
                        if (err) {
                            console.log(err)
                            return callback(err, null);
                        }
                        // console.log(results)
                        sendEmail(requestData["email"],"REYOCA - Password Change Request","Dear User, Please the given password to login to your account: "+pass)
                        return callback(null, "Password Updated Successfully");
                    });
                    
                }
            });
        });
    }
}




module.exports = UserModel;