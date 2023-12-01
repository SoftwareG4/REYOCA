
const url = require('url');
const TransactionHistoryModel = require('../models/transactionHistoryModel');

//========================================================================== NEW ONE ==========================================================================
function transactionApi(req,res){

    try{

  if (req.method === 'DELETE') {
    // Extract the transaction ID from the request URL
    const params = url.parse(req.url, true);
    const transactionId = parseInt(params.pathname.split('/').pop());

    // Call the TransactionHistoryModel function to cancel the booking
    TransactionHistoryModel.cancelBooking(transactionId, (err, result) => {
      if (err) {
        // Handle internal server error
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      } else if (result.affectedRows === 0) {
        // If no rows were affected, the booking was not found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Booking not found' }));
      } else {
        // Booking canceled successfully
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Booking canceled successfully' }));
      }
    });
  } 
  
  //========================================================================== NEW ONE ==========================================================================
  else if (req.method === 'PUT' && req.url.startsWith('/transaction/update')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
  
    req.on('end', async () => {
      try {
        const updateData = JSON.parse(body);
        const { transactionId } = updateData;
  
        // Call the TransactionHistoryModel function to update the booking
        TransactionHistoryModel.updateBooking(updateData, (err, result) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Booking updated successfully' }));
          }
        });
      } catch (error) {
        console.error('Error parsing request body:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }
  
  
  else {
    // If the request method is not DELETE, return a 404 error
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }



}catch (error) {
    // Handle any uncaught exceptions gracefully
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }



}


module.exports = transactionApi;