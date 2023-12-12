const url = require('url');
const ReviewsModel = require('../models/reviewsModel');
const authService = require('../services/authService');

function reviewsApi(req, res) {
  // console.log("reaced API wrapper");
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Add this line
  
    // Check if the request method is OPTIONS (preflight request)
    if (req.method === 'OPTIONS') {
      // Respond to the preflight request
      res.writeHead(200);
      res.end();
      return;
    }
    //========================================== GET Specific REVIEWS =====================================================
    if (req.method === 'GET') {
      // console.log("reaced inside API code");
      if (req.url.startsWith('/reviews/')) {
        const params = url.parse(req.url, true);
        const vehicleId = parseInt(params.pathname.split('/').pop());
        ReviewsModel.getReviewsByVehicleId(vehicleId, (err, reviews) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' ,'Access-Control-Allow-Origin': '*'});
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
        let body = '';
    
        req.on('data', (chunk) => {
          body += chunk;
        });
    
        req.on('end', () => {
          try {
            const requestBody = JSON.parse(body);
            const reviewId = requestBody.reviewId;
    
            // Check if reviewId is a valid integer
            if (!parseInt(reviewId, 10)) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid reviewId' }));
              return;
            }
    
            // Call the ReviewsModel function to delete the review
            ReviewsModel.deleteReview(reviewId, (err, result) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              } else {
                if (result.affectedRows === 0) {
                  // No review with the specified reviewId was found
                  res.writeHead(404, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Review not found' }));
                } else {
                  // Review deleted successfully
                  res.writeHead(204);
                  res.end();
                }
              }
            });
          } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON format in request body' }));
          }
        });
      }
    }
    
    
    else if (req.method === 'PUT') {
      if (req.url.startsWith('/reviews/')) {
        const params = url.parse(req.url, true);
        const reviewId = parseInt(params.pathname.split('/').pop());
  
        // Check if the user is authorized to edit this review
        const isAuthorizedToEdit = authService.checkReviewAuthorization(reviewId, userId);
  
        if (isAuthorizedToEdit) {
          // Read the request body to get the updated review data
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
  
          req.on('end', async () => {
            const updatedReviewData = JSON.parse(body);
  
            // Call the ReviewsModel function to edit/update the review
            ReviewsModel.editReview(reviewId, updatedReviewData, (err, result) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Review updated successfully' }));
              }
            });
          });
        } else {
          // User is not authorized to edit this review
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Unauthorized to edit this review' }));
        }
      }
    }
    
    else {
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
