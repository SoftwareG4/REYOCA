const mysql = require('mysql2');
const dotenv = require('dotenv');
const db = require('../../dbcon');

dotenv.config(); // Load environment variables from .env file

class CartModel {
  static getAllCartItems(callback) {
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

      const query = 'SELECT * FROM cart';
      connection.query(query, (err, results) => {
        connection.end(); // Close the connection

        if (err) {
          return callback(err, null);
        }

        return callback(null, results);
      });
    });
  }

  static getCartByRenteeId(renteeId, callback) {
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

      const query = 'SELECT * FROM cart WHERE rentee_id = ?';
      connection.query(query, [renteeId], (err, results) => {
        connection.end(); // Close the connection

        if (err) {
          return callback(err, null);
        }
        if (results.length === 0) {
          return callback({ message: 'Cart items not found' }, null);
        }

        return callback(null, results);
      });
    });
  }




  static addToCart(cartData, callback) {
    try {
      const connection = db(); // Get a connection
  
      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return;
        }
  
        const query = 'INSERT INTO cart (rentee_id, vehicle_id, extras, quantity, total_cost) VALUES (?, ?, ?, ?, ?)';
        connection.query(
          query,
          [cartData.renteeId, cartData.vehicleId, cartData.extras, cartData.quantity, cartData.totalCost],
          (err, result) => {
            connection.end(); // Close the connection
  
            if (err) {
              console.error('Error executing the query:', err);
              return;
            }
  
            return callback(null, { message: 'Item added to cart successfully' });
          }
        );
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }
  








}

module.exports = CartModel;
