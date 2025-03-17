const { randomBytes } = await import('node:crypto')
const { BigInteger } = await import('big-integer')

const bits = 256
const randomBytesData = randomBytes(Math.ceil(bits / 8))
const randomBytesData1 = randomBytes(Math.ceil(bits / 8))
console.log(randomBytesData.toString('hex'))
console.log(randomBytesData1.toString('hex'))
console.log(randomBytesData, randomBytesData1)
//let randomNumber = BigInteger(randomBytesData.toString('hex'), 16)

/*
generateSecureRandomPrime(256).then(prime => {
  console.log(`Generated prime number: ${prime.toString()}`)
});
*/

const p = 7
const a = 5
const b = 3
const c = 3
const d = 5
let result = (a + b) % p
console.log(a, b, p, result)

console.log((a + b) % p)
console.log((c + d) % p)
