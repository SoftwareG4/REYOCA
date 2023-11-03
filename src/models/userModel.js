const db = require('../../dbcon'); // Import your database connection

class UserModel {
  static async getAllUsers(callback) {
    try {
      const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }

        const query = 'SELECT * FROM user';
        connection.query(query, (err, results) => {
          connection.end(); // Close the connection
          
          if (err) {
            console.error('Error executing the query:', err);
            return callback(err, null);
          }

          console.log('Users:', results);
          return callback(null, results);
        });
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }
}

module.exports = UserModel;
