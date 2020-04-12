//jshint esversion:6

const express = require("express");
const request = require ("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("../public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "../signup.html");
});


app.post("/", function(req, res){
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
    if(response.statusCode === 200){
      res.sendFile(__dirname + "../success.html");
    } else {
      res.sendFile(__dirname + "../failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});


app.listen("3000", function(){
  console.log("Listening in on port 3000...");
});
