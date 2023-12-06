// loyaltyService.js

const db = require('../../dbcon');

async function calculateLoyaltyPoints(userId) {
  try {
    const connection = db();

    // Fetch total number of transactions for the user
    const transactionQuery = 'SELECT COUNT(*) FROM transaction_history WHERE rentee_id = ?';
    const [transactionResults] = await connection.promise().query(transactionQuery, [userId]);
    // console.log(transactionResults);
    const totalTransactions = transactionResults[0]['COUNT(*)'];

    // Fetch user details to check for birthday
    // const userQuery = 'SELECT * FROM user WHERE _id = ?';
    // const [userResults] = await connection.promise().query(userQuery, [userId]);
    // const user = userResults[0];

    // Assume birthday points as 300
    // const birthdayPoints = isBirthday(user.birthdate) ? 200 : 0;

    // Fetch the number of reviews posted by the user
    const reviewQuery = 'SELECT COUNT(*) AS reviews FROM vehicle_reviews WHERE rating_by = ?';
    const [reviewResults] = await connection.promise().query(reviewQuery, [userId]);
    // console.log(reviewResults);
    const totalReviews = reviewResults[0].reviews;

    // Assume review points as 100 
    const reviewPoints = totalReviews * 100;

    connection.end();

    const basePointsPerTransaction = 50;
    const totalPoints = totalTransactions * basePointsPerTransaction + reviewPoints;

    return totalPoints;
  } catch (error) {
    console.error('Error calculating loyalty points:', error);
    throw error;
  }
}

function isBirthday(birthdate) {
  const today = new Date();
  const userBirthday = new Date(birthdate);
  return today.getMonth() === userBirthday.getMonth() && today.getDate() === userBirthday.getDate();
}

module.exports = {
  calculateLoyaltyPoints,
};
