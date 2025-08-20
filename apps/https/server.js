import express from 'express'
import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'node:path'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import {
  ma, dma, ema, sma, wma
} from 'moving-averages'

//import routes from "./routes/routes.js";

// This line is from the Node.js HTTPS documentation.
var options = {
//  key: fs.readFileSync('./key.pem'),
//  cert: fs.readFileSync('./cert.pem')
};

const dataFilePath = 'logs/ETH.json'
//const dataFilePath = 'logs/ETH.rock.json'
const data = JSON.parse(fs.readFileSync(dataFilePath))
const range = 5
const smaFinal = []
const emaFinal = []
const dataFinal = Object.keys(data).map(function(timestamp, i) {
  data[timestamp].quote['USD'].smaPrice = []
  data[timestamp].quote['USD'].emaPrice = [] 
  return data[timestamp].quote['USD']
  //return data[timestamp].quote['USD'].volume_24h
})
/*
const dataFinal = data.map((record) => {
  // WIP adding moving averages for the data set
  return dataFinal.push(record) 
})
*/
//const dataFinal = dataFinaliize(data)
console.log(dataFinal)

// Create a service (the app object is just a callback).
var app = express();

// Create an HTTP service.
//http.createServer(app).listen(8088);
const server = http.createServer(app)
// Create an HTTPS service identical to the HTTP service.
//https.createServer(options, app).listen(1443);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//app.get("/", routes)
app.get("/", (req, res) => {
  const now = new Date()
  res.status(200).render('example', {
    data: data,
    msg: 'Some Message Goes Here',
    now,
  })
})

server.listen(8088, () => {
  console.log("Server listening on port 8088");
  console.log("http://localhost:8088 STARTED")
});
   
