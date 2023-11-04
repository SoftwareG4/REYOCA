const url = require('url');
const ReviewsModel = require('../models/reviewsModel');
const authService = require('../services/authService');

function reviewsApi(req, res) {
  try {
    //========================================== GET Specific REVIEWS =====================================================
    if (req.method === 'GET') {
      if (req.url.startsWith('/reviews/')) {
        const params = url.parse(req.url, true);
        const vehicleId = parseInt(params.pathname.split('/').pop());
        ReviewsModel.getReviewsByVehicleId(vehicleId, (err, reviews) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(reviews));
          }
        });
      }

      //========================================== GET ALL REVIEWS =====================================================
      else if (req.url === '/reviews') {
        ReviewsModel.getAllReviews((err, reviews) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(reviews));
          }
        });
      }
    } 
    //========================================== POST A REVIEWS =====================================================
    else if (req.method === 'POST') {
      if (req.url.startsWith('/reviews/')) {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          const postBody = JSON.parse(body);
          ReviewsModel.addReview(postBody, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'Review added successfully' }));
            }
          });
        });
      }
    } 
    //========================================== DELETE GIVEN REVIEWS BY SAME USER =====================================================
    else if (req.method === 'DELETE') {
      if (req.url.startsWith('/reviews/')) {
        const params = url.parse(req.url, true);
        const reviewId = parseInt(params.pathname.split('/').pop());

        const isAuthorizedToDelete = authService.checkReviewAuthorization(reviewId, userId);

        if (isAuthorizedToDelete) {
          // Call the ReviewsModel function to delete the review
          ReviewsModel.deleteReview(reviewId, (err, result) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
              res.writeHead(204); 
              res.end();
            }
          });
        } else {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized to delete this review' }));
        }
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    // Handle any uncaught exceptions gracefully
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}

module.exports = reviewsApi;
