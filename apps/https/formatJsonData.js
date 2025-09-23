import fs from "fs"

//import logs from "./logs/ETH.json"
import * as logs from "./logs/ETH.json" with { type: 'json' }

const length = Object.keys(logs.default).length

//console.log(Object.keys(logs.default))
let count = 0
let output = {}
Object.keys(logs.default).map((item, i) => {
  const row = logs.default[item]
  if (i >= length - (24 * 8)) {
    output[item] = row
    console.log(
      count,
      i,
      length,
      item,
      row.quote.USD.price,
    )
    count++
  }
})
console.log(output)
fs.writeFileSync(
  "./logs/ETH.working.json",
  JSON.stringify(output, null, 2),
)

//for(var key in logs.jsonData) {
//  console.log(key)
//}

/*
fs.writeFile(
    "./logs/ETH.working.json",
    JSON.stringify(logs),
    err => {
        // Checking for errors 
        if (err) throw err;

        // Success 
        console.log("Done writing");
    }); 
*/
