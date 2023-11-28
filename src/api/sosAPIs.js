const nodemailer = require('nodemailer');

function sendSOSAlert() {
  // Create a nodemailer transporter using your email provider's SMTP settings
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',
    subject: 'SOS Alert!',
    text: 'This is an SOS alert. Please take immediate action!',
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending SOS email:', error);
    } else {
      console.log('SOS email sent:', info.response);
    }
  });
}

// API function to trigger the SOS alert
function sosApi(req, res) {
  // Check if the request method is POST
  if (req.method === 'POST' && req.url === '/sos') {
    // Call the function to send the SOS alert email
    sendSOSAlert();

    // Respond with a success message
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'SOS alert sent successfully' }));
  } else {
    // If the request method is not POST or the URL is incorrect, return a 404 error
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

module.exports = sosApi;
