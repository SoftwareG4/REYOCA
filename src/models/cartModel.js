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
        console.log(cartData);
  
        const query = 'INSERT INTO cart (rentee_id, vehicle_id, extras, quantity, total_cost, to_date, from_date) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(
          query,
          [cartData.renteeId, cartData.vehicleId, cartData.extras, cartData.quantity, cartData.total, cartData.to_date, cartData.from_date],
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


  static checkCart(renteeId, callback) {
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
  
        // Check if there are any entries in the cart for the given renteeId
        const isEmpty = results.length === 0;
  
        return callback(null, isEmpty);
      });
    });
  }
  
  
  static async view_cart(id, callback) {
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
      connection.query(
        'SELECT * FROM cart as c inner join vehicles as v WHERE rentee_id = ? and c.vehicle_id = v._ID',
        [id],
        (error, results) => {
          if (error) {
            callback(err, null);
          } else if (results.length === 0) {
            return callback(null, "No items in this users cart");
          } else {
            return callback(null, results);
          }
        }
      );
    });
  }

  static async delete_car(ids, callback) {
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
      const rentee_id = ids['rentee_id'];
      const vehicle_id = ids['vehicle_id'];
      if (rentee_id && vehicle_id) {
        connection.query(
          'DELETE FROM cart WHERE rentee_id = ? and vehicle_id = ?',
          [rentee_id, vehicle_id],
          (error, results) => {
            if (error) {
                callback(err, null);
            } else if (results.affectedRows === 0) {
                return callback(null, "Empty cart or not a valid user");
            } else {
                return callback(null, "Car deleted successfully!!");
            }
          }
        );
      }
    });
  }
}

module.exports = CartModel;
