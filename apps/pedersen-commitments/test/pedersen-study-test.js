var assert = require('assert');

var pedersen = require('../src/pedersen.js');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var BN = require('bn.js')

// pre-generate a bunch of blinding factors
var r = Array(10).fill().map((x, i) => i).map(i => pedersen.generateRandom());
//console.log(r)
//console.log(JSON.stringify(r))
r.map((x) => {
  console.log(new BN(x.toString('hex')))
})
console.log(JSON.stringify(r))
process.exit()
//var rRaw = ["73069d0f91cb16ccf8e03c38c0fdff4c5f743916282b9eb365d1381a7c546269","6f60c5fab58690c31eb4d155ef380ddc28eb078ab88a3393b6b3fbf92687ca43","8da3613eeb64e87d6d14ad336ebeb57b27c93b0f5040fcdff5ef11de4b7624aa","1a581c51a062ac11fe3881ee8ec139687f00bae3f2c8c88d029a0a42eb2e461e","84a33706f055731c19b341650f15b402c0f0d8cbd553406dccac2d87a350e781","c72ec631cf3a14d7fa4d2655e2bc221535dd00ae72456d4d08236071baa48194","5b21b144bcd36e9b42d43bb3778471242d177f45006daa0d063db7c9df222ef9","2c703aaeb0e497120ae0b8f5a9b3d503ea216cfe0ec5a369f35c5cd6feb02d25","aa3d9bd41db71e483208ff2bc75c039087cb8bd8715d190449d5513629c19831","26f239478a786590589f38bcf0cbb32e0adf1390481e280ea143d45e8af98fd8"]
//var r = rRaw.map((x) => {
//  return new BN(x)
//})
//console.log(r)

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
    console.log("H ffffffffffffffffffffff", H)
    console.log("bC2 ffffffffffffffffffffff", bC2)
    console.log("r[4]  fffff fffffffffffffffff", r[4])
    console.log("r[1]  fffff fffffffffffffffff", r[1])
    console.log("7 + 5  fffff fffffffffffffffff", 7 + 5)
//    assert(pedersen.verify(H, aC2, r[1].sub(r[2]), 10 - 5));
    assert(pedersen.verify(H, bC2, r[4].add(r[1]), 7 + 5));
//        var checkAC2 = pedersen.subPrivately(H, r[2], r[1], 10, 5);
//    console.log(r[4].add(r[1]))
console.log(r[0].toString('hex'), r[0])
//    assert(pedersen.verify(H, aC2, r[1].sub(r[2]), 10 - 5));
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
