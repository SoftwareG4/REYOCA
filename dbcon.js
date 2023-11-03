const mysql = require('mysql2'); 
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

// Create a function to establish a database connection
const createDBConnection = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });

  return connection;
};

module.exports = createDBConnection;


// const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');

// dotenv.config(); // Load environment variables from .env file

// // Create a function to establish a database connection and return a connection pool
// const createDBConnection = async () => {
//   const pool = await mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     connectionLimit: 10, // You can adjust this limit as needed
//   });

//   return pool;
// };

// module.exports = createDBConnection;
