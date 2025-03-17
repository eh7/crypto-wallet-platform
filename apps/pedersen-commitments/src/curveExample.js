var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var HN = require('./hex-number.js');
var crypto = require('crypto');

function generateRandom() {
    var random;
    do {
        random = HN.toBN(HN.fromBuffer(crypto.randomBytes(32)));
    } while (random.gte(ec.n)); // make sure it's in the safe range
    return random;
}

function generateH() {
    return ec.g.mul(generateRandom());
}

const point = generateH()
//console.log(point.curve.n.toString('hex'))
console.log(point.x.toString('hex'))
console.log(point.y.toString('hex'))
