const fs = require('fs');
const mysql = require('mysql2');
const db = require('../../dbcon');
const dotenv = require('dotenv');
dotenv.config();

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

function populate_words(){
    console.log("here")
    const table_data=readcsv("bag.csv").split("\r\n")
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });
    connection.connect((err) => {
        if (err) {
          return err;
        }
        const query ="INSERT INTO `profanity_check` (`word`) VALUES (?)";
        console.log(query)
        for (let i=0;i<table_data.length;i++){
            connection.query(query,[table_data[i]], (err, results) => {
                if (err) {
                    return err;
                }
            });
        }
        connection.end();
    });
}
// console.log(populate_words())



async function verify_foul(description){
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });
    let foul = new Set();
    try {
        await connection.connect();

        const query = "SELECT LOWER(word) as word FROM profanity_check";
        const result = await new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const words = result.map(row => row.word);
        const input = description.split(/[\s.!]+/);

        for (let i = 0; i < input.length; i++) {
            if (words.includes(input[i].toLowerCase())) {
                foul.add(input[i]);
            }
        }

        return [...foul];
    } catch (error) {
        console.error("Error:", error);
        return [];
    } finally {
        connection.end();
    }
}
// (async () => {
//     console.log("Foul words:", await verify_foul("your ass. is very nice"));
// })();


module.exports={verify_foul}
