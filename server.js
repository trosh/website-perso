require('dotenv').config();
var path = require("path");
var express = require("express");
var fs = require('fs');
var logger = require("morgan");
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var auth = {
  "auth": {
    "api_key": process.env.API_KEY,
    "domain": process.env.DOMAIN
  }
};
const port = process.env.PORT || 8081;

var app = express();
var server = require('http').createServer(app);


//including client side and using bodyParser
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
app.use(logger('dev'));
app.use(logger('combined', { stream: accessLogStream }));

app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname + './index.html'));
});

app.get("/fr", (request, response) => {
  response.sendFile(path.join(__dirname + '/views/indexfr.html'));
});

app.post("/", (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  let isError = false;

  console.log(`\nContact form data: ${name} ${email} ${message}\n`);

  let transporter = nodemailer.createTransport(mg(auth));

// set up email data

  let mailOptions = {
    from: '"Adrien Peynichou" <adrien.peynichou@gmail.com>',
    to: 'adrien.peynichou@gmail.com',
    subject: `website-perso message from ${email}`,
    text: message,
    err: isError
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`\nError: ${error}`);
    } else {
      console.log(`\nResponse sent: success\n`);
    }
  })
});

server.listen(port, () => {
  console.log('Web app started and listening on http://localhost:' + port);
});
