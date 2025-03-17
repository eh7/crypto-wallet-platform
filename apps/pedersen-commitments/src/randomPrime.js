const crypto = require('crypto');

let prime1 = crypto.generatePrimeSync(32, {bigint: true});
let prime2 = crypto.generatePrimeSync(32, {bigint: true});

console.log(prime1.toString())
console.log(prime2.toString())
console.log((prime2 * prime2).toString())

//const randomPrime = require('random-prime');
//const randomPrime = require('random-prime').randomPrime


// Generate a random prime number
//const primeNumber = randomPrime();
//console.log(primeNumber);
