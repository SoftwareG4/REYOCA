const profile_Model = require('../models/M_update_profile');
const {validateToken}= require('../services/JWTauth');
const aws_s3=require('@aws-sdk/client-s3')
const formidable = require('formidable');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const s3=new aws_s3.S3Client({
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY,
        secretAccessKey:process.env.AWS_SECRET_KEY,
    },
    region:process.env.BUCKET_REGION
})

function update_pic(req, res) {
    const form = new formidable.IncomingForm();
    console.log(req.headers['content-type'])
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return;
      }
    //   console.log(files,fields)

      const oldPath = files.file[0].filepath;
      // console.log(oldPath)
    //   const newPath = __dirname + '/uploads/' + files.file[0].newFilename+".jpg";

    //   await fs.rename(oldPath, newPath, (err) => {
    //     if (err) {
    //       console.error('Error moving file:', err);
    //       return;
    //     }
    //   });

      const params={
        Bucket:process.env.BUCKET_NAME,
        Key:files.file[0].newFilename,
        Body:fs.readFileSync(oldPath),
        ContentType:files.file[0].mimetype
      }

      const command=new aws_s3.PutObjectCommand(params)
      await s3.send(command)


      const user_id=validateToken(req.headers.cookie)
      if (user_id==false){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
        }
      const img_data={
        'id':user_id,
        'link':"https://reyocaprofilepic.s3.amazonaws.com/"+files.file[0].newFilename
      }

      profile_Model.update_picture(img_data, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'File uploaded successfully' }));
        }
      });
    });
  } 


function update_password(req, res) {
    const user_id=validateToken(req.headers.cookie)
    if (user_id==false){
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "User not Authenticated" }));
    }
    const chunks = [];
    req.on("data", (chunk) => {
        chunks.push(chunk);
    });
    req.on('end', () => {
        let requestData = {};
        try {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const parsedData = new URLSearchParams(stringData);
            for (var pair of parsedData.entries()) {
                requestData[pair[0]] = pair[1];
            }
            // console.log("DataObj: ", requestData);

        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
            return;
        }

        profile_Model.update_pass(user_id,requestData, (err, result) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err }));
        } else {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: result }));
        }
    });
  });
} 

function update_prof(req, res) {
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
  }
  const chunks = [];
  req.on("data", (chunk) => {
      chunks.push(chunk);
  });
  req.on('end', () => {
      let requestData = {};
      try {
          const data = Buffer.concat(chunks);
          const stringData = data.toString();
          const parsedData = new URLSearchParams(stringData);
          for (var pair of parsedData.entries()) {
              requestData[pair[0]] = pair[1];
          }
          // console.log("DataObj: ", requestData);

      } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
          return;
      }

      profile_Model.profile_update(user_id,requestData, (err, result) => {
      if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
      } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
      }
    });
  });
} 

function update_payment(req, res) {
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
  }
  const chunks = [];
  req.on("data", (chunk) => {
      chunks.push(chunk);
  });
  req.on('end', () => {
      let requestData = {};
      try {
          const data = Buffer.concat(chunks);
          const stringData = data.toString();
          const parsedData = new URLSearchParams(stringData);
          for (var pair of parsedData.entries()) {
              requestData[pair[0]] = pair[1];
          }
          // console.log("DataObj: ", requestData);

      } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
          return;
      }

      profile_Model.payment_update(user_id,requestData, (err, result) => {
      if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
      } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
      }
    });
  });
} 

function rating_get(req, res) {
  const user_id=validateToken(req.headers.cookie)
  if (user_id==false){
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: "User not Authenticated" }));
  }
  const chunks = [];
  req.on("data", (chunk) => {
      chunks.push(chunk);
  });
  req.on('end',async () => {
    let requestData = {};
    try {
        const data = Buffer.concat(chunks);
        const stringData = data.toString();
        const parsedData = new URLSearchParams(stringData);
        for (var pair of parsedData.entries()) {
            requestData[pair[0]] = pair[1];
        }
        console.log("DataObj: ", requestData);

    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid Form data in the request body' }));
        return;
    }
    
    profile_Model.getRatingById(user_id, (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: result }));
        }
      });
  });
}


module.exports = {update_pic,update_password,update_prof,update_payment,rating_get};



