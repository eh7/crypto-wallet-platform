#!/usr/bin/env node
var fs = require('fs');
var outfile = "primes.txt";

var count = 0;
var maxCount = 100;
var primes = [];

var i = 2;

while(count<maxCount) {
    if( isPrime(i) ) {
        primes.push(i);
        count++;
    }
    i++;
}

function isPrime (n)
{
    if ( n%1 || n<2 ) return false;

    var q = Math.sqrt(n);

    for (var i = 2; i <= q; i++)
    {
        if (n % i === 0)
        {
            return false;
        }
    }
    return true;
}

var result = primes.toString();

var out = result;
fs.writeFileSync(outfile, out);
