//jshint esversion:6

const express = require("express");
const request = require ("request");
const bodyParser = require("body-parser");
const https = require("https");

const { Logging } = require('@google-cloud/logging');

const logging = new Logging();
const log = logging.log('logger');

// This metadata is attached to each log entry. This specifies a fake
// Cloud Function called 'Custom Metrics' in order to make your custom
// log entries appear in the Cloud Functions logs viewer.
const METADATA = {
  resource: {
    type: 'cloud_function',
    labels: {
      function_name: 'CustomMetrics',
      region: 'us-central1'
    }
  }
};

// ...

// Data to write to the log. This can be a JSON object with any properties
// of the event you want to record.
let dataLogger = {
  event: 'event!',
  value: 'mailchimp'
};

const app = express();

app.use(express.static("../public"));
app.use(bodyParser.urlencoded({extended: true}));

// these three get methods aren't working
app.get("/", function(req, res){
  res.sendFile(__dirname + "../signup.html");
});
app.get("/success", function(req, res){
  res.sendFile(__dirname + "../success.html");
});
app.get("/failure", function(req, res){
  res.sendFile(__dirname + "../failure.html");
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
      res.send({redirect:'/success'});
    } else {
      res.send({redirect:'/failure'});
    }
    response.on("data", function(data){
      dataLogger.message = JSON.parse(data);
      // Write to the log. The log.write() call returns a Promise if you want to
      // make sure that the log was written successfully.
      let entry = log.entry(METADATA, dataLogger);
      log.write(entry);
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen("3000", function(){
  console.log("Listening in on port 3000...");
});
