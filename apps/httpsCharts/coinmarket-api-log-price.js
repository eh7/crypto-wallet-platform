//require('dotenv').config()
import dotenv  from "dotenv"
dotenv.config()

//const CoinMarketCap = require('coinmarketcap-api')
import CoinMarketCap from 'coinmarketcap-api'

import JSONdb from 'simple-json-db'
 
const client = new CoinMarketCap(process.env.APIKEY)

//const date = new Date();
const date = Date.now();

if (process.argv[2]) {
  const TYPE = process.argv[2]

  const db = new JSONdb('./logs/' + TYPE + '.json');

  client.getQuotes({
    symbol: [TYPE],
    //convert: 'USD,EUR'
  }).then((data) => {
    //console.log(TYPE)
    //console.log(date)
    //console.log(data.data[TYPE].quote)
    const value = {
     symbol: TYPE,
     timestamp: date,
     quote: data.data[TYPE].quote,
    }
    db.set(date, value)
  }).catch(console.error)
} else {
  client.getQuotes({
    symbol: ['ETH'],
    //convert: 'USD,EUR'
  }).then((data) => {
    console.log(data.data.ETH.quote)
  }).catch(console.error)
}

//process.exit();

//client.getQuotes({symbol: ['BTC', 'ETH', 'SOL','FIL','ETC']}).then(console.log).catch(console.error)

//client.getTickers({
//  limit:10,
//}).then(console.log).catch(console.error)
//client.getTickers().then(console.log).catch(console.error)
//client.getGlobal().then(console.log).catch(console.error)
