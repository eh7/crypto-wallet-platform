
//let prime = 17
//let primative = 5
let prime = (process.argv[2]) ? process.argv[2] : 17
let primative = (process.argv[3]) ? process.argv[3] : 5

const checkPrimePrimatives = (prime, primative) => {
  const answers = []

//  console.log('prime =', prime)
//  console.log('primative =', primative)

  for(let i=1; i<prime; i++) {
    const answer = (primative ** i) % prime
    answers.push(answer)
    //console.log(i, answer)
  }
//  console.log(answers.sort())

  var answersSorted = answers.sort((x, y) => x - y);
//  console.log(answersSorted)

  function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
  }
  var unique = answersSorted.filter(onlyUnique);
  let state = false
  if (answersSorted.length === unique.length) state = true 
  console.log("check if '" + primative + "' is a unique primative: ", (answersSorted.length === unique.length) ? true : false)
  if (answersSorted.length === unique.length) return state
}

//checkPrimePrimatives(prime, primative)

for(let i=1; i<prime*100; i++) {
  if (checkPrimePrimatives(prime, i)) process.exit()
}

//let i = 1
//let state = false
//while() {
//  state = checkPrimePrimatives(prime, i)
//  i++
//}
