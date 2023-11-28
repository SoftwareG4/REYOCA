const fs = require('fs');
const mysql = require('mysql2');
const db = require('../../dbcon');
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config();

async function encrypt(password) {
    return await bcrypt.hash(password.toString(), 10)
}
// Function to read the CSV and return data or throw error.
function readcsv(filepath){
    try {
        data = fs.readFileSync(filepath, 'utf8');
        return(data);
    } 
    catch (err) {
        console.error(err);
    }
}

function populate_users(){
    console.log("here")
    const table_data=readcsv("user.csv").split("\r\n")
    // console.log(table_data)
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });
    connection.connect(async (err) => {
        if (err) {
          console.log(err)
          return err;
        }
        const query ="INSERT INTO `user` (`first_name`, `last_name`, `email`, `password`, `phone`, `role`, `government_id`,`gender`) VALUES (?, ?, ?, ?, NULL, ?,NULL,?);";
        console.log(query)
        for (let i=0;i<table_data.length;i++){
            let row=table_data[i].split(',')
            encrypted= await encrypt(row[4])
            // console.log(encrypted)
            connection.query(query,[row[0],row[1],row[5],encrypted,row[3],row[2]], (err, results) => {
                if (err) {
                    console.log(err)
                    return err;
                }
            });
        }
        connection.end();
    });
}
populate_users()
