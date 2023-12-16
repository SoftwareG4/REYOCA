const {createTokens, validateToken}= require('../services/JWTauth');
const cookie = require('cookie');
const fs = require('fs');
const fs_promise = require('fs').promises;
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config();
const profileModel = require('../models/M_update_profile.js');
const OrderModel = require('../models/M_order.js');
const ReportModel = require('../models/M_report.js');
const review_Model = require('../models/M_review.js');
const UserModel = require('../models/M_register_login.js');
const Profile_Model = require('../models/M_update_profile.js');
require('../../global.js');

// const invalidatedTokens = new Set();

function redirect_login(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    fs.readFile('./src/views/login.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Sample data to pass to the EJS template
          const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };
  
          // Render the EJS template with data
          const renderedHtml = ejs.render(data, dataToRender);
  
          // Set the response header and send the rendered HTML
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
}

function redirect_passreset(req, res) {
  if(req.method!="GET"){
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
  }
  fs.readFile('./src/views/passwordreset.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}


function red_reg_rentee(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    fs.readFile('./src/views/register_rentee.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Sample data to pass to the EJS template
          const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };
  
          // Render the EJS template with data
          const renderedHtml = ejs.render(data, dataToRender);
  
          // Set the response header and send the rendered HTML
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
}


function red_reg_renter(req, res) {
    if(req.method!="GET"){
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        return;
    }
    fs.readFile('./src/views/register_renter.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Sample data to pass to the EJS template
          const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };
  
          // Render the EJS template with data
          const renderedHtml = ejs.render(data, dataToRender);
  
          // Set the response header and send the rendered HTML
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
}

// function redirect_admin(req, res) {
//   fs.readFile('./src/views/admin_page.ejs', 'utf8', (err, data) => {
//       if (err) {
//         console.error(err);
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Internal Server Error');
//       } else {
//         // Sample data to pass to the EJS template
//         const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

//         // Render the EJS template with data
//         const renderedHtml = ejs.render(data, dataToRender);

//         // Set the response header and send the rendered HTML
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(renderedHtml);
//       }
//     });
// }

async function redirect_admin(req, res, data) {
  try {
      const user_id = validateToken(req.headers.cookie); // Validate token
      if (!user_id) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
        return;
      }
      
    var filterCriteria = {};
    if (req.method === 'POST') {
        filterCriteria = {
          reported_id: data.reported_id || '',
          reported_by: data.reported_by || '',
          report_type: data.report_type || '',
          keyword: data.keyword || '',
        };
    }

      const reportData = await new Promise((resolve, reject) => {
          ReportModel.getReport(user_id, (err, result) => {
              if (err) reject(err);
              else resolve(result);
          });
      });

      // Read the EJS template file
      const template = await fs_promise.readFile('./src/views/admin_page.ejs', 'utf8');

      // Render the template with your data
      const renderedHtml = ejs.render(template, {
          title: 'admin_page',
          reportData: reportData,
      });

      // Send the rendered HTML as a response
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(renderedHtml);
  } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
  }
}



async function red_reg_profilepage(req, res) {
  try {
    if (req.method !== "GET") {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    // Assuming validateToken gets the user_id from the request
    const user_id=validateToken(req.headers.cookie); // This should be retrieved from a function or middleware
    if (!user_id) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
      return;
    }

    // Fetch profile and rating data
    const profileData = await new Promise((resolve, reject) => {
      profileModel.prof_view(user_id, (err, result) => {
        if (err) reject(err);
        else resolve(result[0]); 
      });
    });

    const ratingData = await new Promise((resolve, reject) => {
      profileModel.getRatingById(user_id, (err, result) => {
        if (err) reject(err);
        else resolve(result); 
      });
    });

    // Combine profile and rating data
    const dataToRender = {
      title: 'User Profile',
      profile: profileData,
      rating: ratingData
    };

    // Read and render the EJS file with user profile and rating data
    fs.readFile('./src/views/profile_page.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const renderedHtml = ejs.render(data, dataToRender);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });

  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
  }
}


function red_reg_orderhist(req, res){
  if (req.method !== "GET") {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  const user_id=validateToken(req.headers.cookie); // This should be retrieved from a function or middleware
  if (!user_id) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "User not Authenticated" }));
    return;
  }

  OrderModel.getOrderById(user_id, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err }));
    } else {
      // Read and render the EJS file with user profile data
      fs.readFile('./src/views/order_history.ejs', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          const dataToRender = { title: 'Order History', order: result }; // Assuming result[0] is the user profile object
          const renderedHtml = ejs.render(data, dataToRender);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
    }
  });
}

function red_reg_get_reviews(req, res){
  if (req.method !== "GET") {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }
  const user_id=validateToken(req.headers.cookie); // This should be retrieved from a function or middleware
  if (!user_id) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "User not Authenticated" }));
    return;
  }

  review_Model.getReviewById(user_id, (err, result) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err }));
    } else {
      fs.readFile('./src/views/reviews.ejs', 'utf8', (err, data) => {
        if (err) {
          // ... error handling
        } else {
          const dataToRender = {
            title: 'Reviews',
            review: result // Assuming result is an array of review objects
          };
          // console.log(result);
          const renderedHtml = ejs.render(data, dataToRender);
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(renderedHtml);
        }
      });
    }
  });
}


function red_reg_update_pass(req, res) {
  if(req.method!="GET"){
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
  }
  fs.readFile('./src/views/update_password.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}


// function red_reg_update_pass(req, res) {
//   if (req.method === 'GET') {
//       // Read the EJS file
//       fs.readFile('./src/views/admin_page.ejs', 'utf8', (err, data) => {
//           if (err) {
//               console.error(err);
//               res.writeHead(500, { 'Content-Type': 'text/plain' });
//               res.end('Internal Server Error');
//               return;
//           }

//       });
//   } else if (req.method === 'POST') {
//     let body = '';

//     // Collect data chunks
//     req.on('data', chunk => {
//         body += chunk.toString(); // Convert Buffer to string
//     });

//     req.on('end', () => {
//         // Parse the POST data
//         const parsedBody = new URLSearchParams(body);

//         // Extracting the data
//         const curr_pass = parsedBody.get('curr_pass');
//         const new_pass = parsedBody.get('new_pass');
//         // const email = parseBody.get('email');

//         const userId = req.session.userId; // Assuming user ID is stored in session
//         const requestData = { curr_pass, new_pass };
//         console.log(requestData);

//         // Now use your update_pass function with this data
//         Profile_Model.update_pass(userId, requestData, (err, result) => {
//             if (err) {
//                 // Send error response
//                 res.writeHead(500, { 'Content-Type': 'text/plain' });
//                 res.end('Error updating password');
//             } else {
//                 // Send success response
//                 res.writeHead(200, { 'Content-Type': 'text/plain' });
//                 res.end('Password updated successfully');
//                 res.redirect('./src/views/profile_page.ejs'); 
//             }
//         });
//     });
//   }
// }



// function red_reg_update_pass(req, res) {
//   // Collect data from the POST request
//   let body = '';
//   req.on('data', chunk => {
//       body += chunk.toString();
//   });
//   req.on('end', () => {
//       const requestData = new URLSearchParams(body);
//       const userEmail = requestData.get('email');
//       const currentPassword = requestData.get('currentPassword');
//       const newPassword = requestData.get('newPassword');
//       const confirmPassword = requestData.get('confirmPassword');

//       // Verify the current password
//       UserModel.login_verify({ email: userEmail, password: currentPassword }, (err, result) => {
//           if (err) {
//               res.writeHead(500, { 'Content-Type': 'application/json' });
//               res.end(JSON.stringify({ error: err }));
//               return;
//           }
//           if (result === "Invalid Password") {
//               // Handle invalid current password
//               res.writeHead(401, { 'Content-Type': 'application/json' });
//               res.end(JSON.stringify({ error: "Invalid current password" }));
//               return;
//           }

//           // Check if new password and confirm password match
//           if (newPassword !== confirmPassword) {
//               res.writeHead(400, { 'Content-Type': 'application/json' });
//               res.end(JSON.stringify({ error: "New passwords do not match" }));
//               return;
//           }

//           // Update the password
//           Profile_Model.update_pass({ email: userEmail, new_pass: newPassword }, (err, updateResult) => {
//               if (err) {
//                   res.writeHead(500, { 'Content-Type': 'application/json' });
//                   res.end(JSON.stringify({ error: err }));
//                   return;
//               }
//               // Handle successful password update
//               res.writeHead(200, { 'Content-Type': 'application/json' });
//               res.end(JSON.stringify({ message: "Password updated successfully" }));
//           });
//       });
//   });
// }


function red_reg_adminpage(req, res) {
  fs.readFile('./src/views/admin_main.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}

function red_reg_postreview(req, res) {
  console.log("in")
  fs.readFile('./src/views/postreview.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}

function red_reg_postreport(req, res) {
  console.log("in")
  fs.readFile('./src/views/postreport.ejs', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        // Sample data to pass to the EJS template
        const dataToRender = { title: 'EJS Example', message: 'Hello, EJS!' };

        // Render the EJS template with data
        const renderedHtml = ejs.render(data, dataToRender);

        // Set the response header and send the rendered HTML
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedHtml);
      }
    });
}



function redirect_route(req, res){
    path=req.url
    if(path[path.length-1]=='/'){
        path=path.substring(0,path.length-1)
    }
    console.log(path)
    switch(path){
        case "/dev_page_route/loginpage":
            redirect_login(req, res);
        break
        case "/dev_page_route/passreset":
            redirect_passreset(req, res);
        break
        case "/dev_page_route/registerrentee":
            red_reg_rentee(req, res);
        break
        case "/dev_page_route/registerrenter":
            red_reg_renter(req, res);
        break
        case "/dev_page_route/profilepage":
          red_reg_profilepage(req, res);
        break
        case "/dev_page_route/profilepage/orderhistory":
          red_reg_orderhist(req, res);
        break
        case "/dev_page_route/profilepage/updatepassword":
          console.log("in")
          red_reg_update_pass(req, res);
        break
        case "/dev_page_route/profilepage/reviews":
          red_reg_get_reviews(req, res);
        break
        case "/dev_page_route/profilepage/adminpage":
          redirect_admin(req, res);
        break
        case "/dev_page_route/profilepage/postreview":
          console.log("path")
          red_reg_postreview(req, res);
        break
        case "/dev_page_route/profilepage/postreport":
          red_reg_postreport(req, res);
        break
        case "/dev_page_route/admin_page_middleware":
          red_reg_adminpage(req, res);
        break

        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Page Not Found');
    }
}




module.exports = {redirect_route};