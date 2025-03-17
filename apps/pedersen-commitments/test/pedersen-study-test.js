var assert = require('assert');

var pedersen = require('../src/pedersen.js');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var BN = require('bn.js')

var rData = ["2654fca4b9563dc76b0cfc39a089c33248f8c2a0c58728e5ac5b94f6c47456c","329f0b7fb87388ad5049707cf3f2f1b5f507e115065aee3e0c41b5f6d9541c53","828eb0c89dd56f234f4342f819e5bea6124dafb68db8e43f70c50c1eeaa9de64","cc5b582a22b242083d1d5786846f2dbbc396f9ba7fb6de562ab0f94c189c9841","49fca2e6714cefd0c9a924950af23f12c622369ba82bb54eacb438156be11ea3","5ce6baa99a8090e2e8e65394d9a2f2cd446e367f3882b10a5063afc2b711a626","c98ad522acffa304c848d0a5f71fc841ea1f9031b26d61fd1cc689e63677ad72","3e7bb266821c3b30a4cb622e056970e2f2ce9700561aabb05c3d95b348749051","f29967732280737d9222f91a6fb46850a721c8fb13af686557a9ab1b83099f0","83c775b387b23ad20ec174e0380f95cceb49c66ccaf448ad34685c576557131a"]

// pre-generate a bunch of blinding factors
//var r = Array(10).fill().map((x, i) => i).map(i => pedersen.generateRandom());
var r = rData.map((x, i) => {
  return new BN(x.toString('hex'), 16)
})

// this is another point of the curve that will be used
//   as the generate points for the hidden values
var H = pedersen.generateH();

describe('pedersen study testing', () => {

  it('testing', () => {
    var tC = pedersen.commitTo(H, r[1], 5);
    var aC1 = pedersen.commitTo(H, r[2], 10);
    var aC2 = pedersen.sub(aC1, tC);
    var bC1 = pedersen.commitTo(H, r[4], 7);
    var bC2 = pedersen.add(bC1, tC);
//    console.log("H ffffffffffffffffffffff", H)
//    console.log("bC2 ffffffffffffffffffffff", bC2)
//    console.log("r[4]  fffff fffffffffffffffff", r[4])
//    console.log("r[1]  fffff fffffffffffffffff", r[1])
//    console.log("7 + 5  fffff fffffffffffffffff", 7 + 5)

//    assert(pedersen.verify(H, aC2, r[1].sub(r[2]), 10 - 5));
    assert(pedersen.verify(H, bC2, r[4].add(r[1]), 7 + 5));
//        var checkAC2 = pedersen.subPrivately(H, r[2], r[1], 10, 5);
//    assert(pedersen.verify(H, aC2, r[1].sub(r[2]), 10 - 5));
//console.log(H, bC2)
//console.log(r[4].toString('hex'), r[1].toString('hex'))
//console.log(r[4].sub(r[1]).toString('hex'))
    console.log(pedersen.verifySub(H, aC2, r[1].sub(r[2]), 10 - 5))
  })

  it.skip('should commit to a sum of two values', () => {

    //transfer amount - we want to transfer 5 tokens
    var tC = pedersen.commitTo(H, r[1], 5);

    // Alice 10 - 5 = 5
    var aC1 = pedersen.commitTo(H, r[2], 10);
    var aC2 = pedersen.sub(aC1, tC);

    // bob 7 + 5 (aC2) = 12
    var bC1 = pedersen.commitTo(H, r[4], 7);
    var bC2 = pedersen.add(bC1, tC);

    // alice's balance to go down by 5
    // aC1 - tC = aC2
    var checkAC2 = pedersen.subPrivately(H, r[2], r[1], 10, 5);
    assert(aC2.eq(checkAC2));

    // bob's balance to go up by 5
    // bC1 + tC = bC2 
    var checkBC2 = pedersen.addPrivately(H, r[4], r[1], 7, 5);
    assert(bC2.eq(checkBC2));
    
    // verify the commitment
    assert(pedersen.verify(H, bC2, r[4].add(r[1]), 7 + 5));
  });

  it.skip('should fail if not using the correct blinding factors', () => {
    //transfer amount - we want to transfer 5 tokens
    var tC = pedersen.commitTo(H, r[1], 5);

    // Alice 10 - 5 = 5
    var aC1 = pedersen.commitTo(H, r[2], 10);
    var aC2 = pedersen.sub(aC1, tC);

    // bob 7 + 5 (aC2) = 12
    var bC1 = pedersen.commitTo(H, r[4], 7);
    var bC2 = pedersen.add(bC1, tC);

    // now to check
    // r[0] -> is not the correct blinding factor
    var checkAC2 = pedersen.subPrivately(H, r[0], r[1], 10, 5);

    assert(aC2.eq(checkAC2) == false);
    
    // now to check
    // r[0] -> is not the correct blinding factor
    var checkBC2 = pedersen.addPrivately(H, r[0], r[1], 7, 5);

    assert(bC2.eq(checkBC2) == false);
  })
});
