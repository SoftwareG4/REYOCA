// favouritesModel.js
const db = require('../../dbcon');

class FavouritesModel {
  static addToFavourites(userId, vehicleId, callback) {
    try {
      const connection = db();

      const query = 'INSERT INTO favourites (user_id, vehicle_id) VALUES (?, ?)';
      connection.query(query, [userId, vehicleId], (err, result) => {
        connection.end();

        if (err) {
          console.error('Error executing the query:', err);
          return callback(err, null);
        }

        return callback(null, result);
      });
    } catch (error) {
      console.error('Error:', error);
      return callback(error, null);
    }
  }
}

module.exports = FavouritesModel;
