var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');

// This line is from the Node.js HTTPS documentation.
var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

const data = JSON.parse(fs.readFileSync('logs/ETH.json'))

// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
http.createServer(app).listen(8088);
// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(1443);

app.get("/", (req, res) => {
  res.send("testing" + Object.keys(data))
})
   
