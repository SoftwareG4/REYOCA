const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.EMAIL_CLIENT_ID, process.env.EMAIL_CLIENT_SECRET);
OAuth2_client.setCredentials( { refresh_token : process.env.EMAIL_REFRESH_TOKEN} );

/**
* Function to send email to the receipient
* 
* @param {string} receiverEmailID email id of the receiver
* @param {string} subject subject of the email being sent
* @param {string} body body of the email being sent
*/
function sendEmail(receiverEmailID, subject, body) {
    const accessToken = OAuth2_client.getAccessToken();

    const transport = nodemailer.createTransport({
         service : 'gmail',
         auth : {
            type : 'OAUTH2',
            user : process.env.EMAIL_ID,
            clientId : process.env.EMAIL_CLIENT_ID,
            clientSecret : process.env.EMAIL_CLIENT_SECRET,
            refreshToken : process.env.EMAIL_REFRESH_TOKEN,
            accessToken : accessToken 
         }
    })

    const mailOptions = {
        from : `Reyoca Customer Care <${process.env.EMAIL_ID}>`,
        to : receiverEmailID,
        subject : subject,
        html : createHTMLMessage(body),
        // attachments: [{
        //     filename: 'sample.pdf',
        //     path: 'https://www.africau.edu/images/default/sample.pdf',
        //     contentType: "application/pdf"
        // }]
    }

    transport.sendMail(mailOptions, function(error, result) {
        if(error) {
            console.log('Error: ', error);
        }
        else {
            console.log('Success: ', result);
        }
        transport.close();
    })
}

function createHTMLMessage(body) {
    return `<span>  ${body}  </span>`
}

module.exports = sendEmail;
