// authService.js

const ReviewModel = require('../models/reviewsModel'); 

// Function to check if the user is authorized to delete a review
const checkReviewAuthorization = async (userId, reviewId) => {
  try {
    // Fetch the review from the database to get the user ID associated with the review
    const review = await ReviewModel.getReviewById(reviewId);

    // Check if the user attempting to delete the review is the owner
    if (review.userId === userId) {
      return true; // Authorized to delete the review
    } else {
      return false; // Unauthorized to delete the review
    }
  } catch (error) {
    console.error('Error checking review authorization:', error);
    return false; 
  }
};

module.exports = {
  checkReviewAuthorization,
};
