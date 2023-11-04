// paymentProfileModel.js
const db = require('../../dbcon');

class PaymentProfileModel {
  static getAllPaymentProfiles(callback) {
    const query = 'SELECT * FROM payment_profile';
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }
}

module.exports = PaymentProfileModel;
