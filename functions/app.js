//jshint esversion:6
const functions = require('firebase-functions');
const express = require("express");
const request = require ("request");
const bodyParser = require("body-parser");
const https = require("https");


const app = express();

//app.use(express.static("../public"));
app.use(bodyParser.urlencoded({extended: true}));

// these three get methods aren't working
app.get("/", function(req, res){
  // res.sendFile(__dirname + "../signup.html");
  // res.sendFile("signup.html");
  res.sendFile(__dirname +"/index.html");
});
app.get("/signup", function(req, res){
  // res.sendFile(__dirname + "../signup.html");
  // res.sendFile("signup.html");
  res.sendFile(__dirname +"/signup.html");
});
app.get("/success", function(req, res){
  // res.sendFile(__dirname + "../success.html");
  res.sendFile(__dirname +"/success.html");
});
app.get("/failure", function(req, res){
  res.sendFile(__dirname +"/failure.html");
});


app.post("/signup", function(req, res){
  let firstName = req.body.fName;
  let lastName = req.body.lName;
  let email = req.body.email;
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const url = "https://us3.api.mailchimp.com/3.0/lists/1334f4a7c3";
  const options = {
    method: "POST",
    auth: "tariq:d9a77d86a307640dd68ae5f7c737ec00-us3"
  };

  const jsonData = JSON.stringify(data);
  const request = https.request(url, options, function(response){
    console.log(response);
    if(response.statusCode === 200){
      res.redirect(303,'/success');
    } else {
      res.redirect(303,'/failure');
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
      // Write to the log. The log.write() call returns a Promise if you want to
      // make sure that the log was written successfully.
    });
  });

  request.write(jsonData);
  request.end();
});

// research this
exports.app = functions.https.onRequest(app);
