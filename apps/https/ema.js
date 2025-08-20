function EMACalc(mArray,mRange) {
  var k = 2/(mRange + 1);
  // first item is just the same as the first item in the input
  emaArray = [mArray[0]];
  // for the rest of the items, they are computed with the previous one
  for (var i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
}

//data = [1,2,2,3,4,3,4,4,3,2,4]
data = [1, 2, 3, 2, 1]
range = 2

console.log(
  EMACalc(data, range)
)
