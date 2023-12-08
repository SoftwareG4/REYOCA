const db = require('../../dbcon');

class ReviewsModel {
  
  
  static getAllReviews(callback) {
    try {
      const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }

        const query = 'SELECT * FROM vehicle_reviews';
        connection.query(query, (err, results) => {
          connection.end(); // Close the connection

          if (err) {
            console.error('Error executing the query:', err);
            return callback(err, null);
          }

          return callback(null, results);
        });
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }

  static getReviewsByVehicleId(vehicleId, callback) {
    console.log("reaced final function in model");
    try {
      const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }

        const query = 'SELECT * FROM vehicle_reviews WHERE rating_for = ?';
        connection.query(query, [vehicleId], (err, results) => {
          connection.end(); // Close the connection

          if (err) {
            console.error('Error executing the query:', err);
            return callback(err, null);
          }

          return callback(null, results);
        });
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }

  static addReview(reviewData, callback) {
    try {
      const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }

        const query = 'INSERT INTO vehicle_reviews (stars, description, rating_for, rating_by) VALUES (?, ?, ?, ?)';
        connection.query(
          query,
          [reviewData.stars, reviewData.description, reviewData.rating_for, reviewData.rating_by],
          (err, result) => {
            connection.end(); // Close the connection

            if (err) {
              console.error('Error executing the query:', err);
              return callback(err, null);
            }

            return callback(null, result);
          }
        );
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }

  static deleteReview(reviewId, callback) {
    try {
      const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }

        const query = 'DELETE FROM vehicle_reviews WHERE _ID = ?';
        connection.query(query, [reviewId], (err, result) => {
          connection.end(); // Close the connection

          if (err) {
            console.error('Error executing the query:', err);
            return callback(err, null);
          }

          return callback(null, result);
        });
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }


  static editReview(reviewId, updatedReviewData, callback) {
    try {
      const connection = db(); // Get a connection

      connection.connect((err) => {
        if (err) {
          console.error('Error connecting to the database:', err);
          return callback(err, null);
        }

        const query = 'UPDATE vehicle_reviews SET stars = ?, description = ? WHERE _id = ?';
        connection.query(
          query,
          [updatedReviewData.stars, updatedReviewData.description, reviewId],
          (err, result) => {
            connection.end(); // Close the connection

            if (err) {
              console.error('Error executing the query:', err);
              return callback(err, null);
            }

            return callback(null, result);
          }
        );
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }



}

module.exports = ReviewsModel;
