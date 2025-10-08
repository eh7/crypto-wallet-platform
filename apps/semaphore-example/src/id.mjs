import { Identity } from "@semaphore-protocol/identity"

//const { privateKey, publicKey, commitment } = new Identity()

//const identity1 = new Identity(privateKey)
// or
//const identity2 = new Identity("secret-value")

const identity = new Identity("this is a secret string that means nothing or doesIt?")

//console.log({ privateKey, publicKey, commitment } );
//console.log(identity);
console.log(identity._secretScalar);

const identity1 = new Identity("this is a secret string that means nothing or doesIt?" + String(1))
//console.log(identity1);
console.log(identity1._secretScalar);
console.log(identity1);

process.exit()

const message = "Hello World"

const signature = identity.signMessage(message)

console.log(
  message, 
  signature,
);

// Static method.
console.log(
  Identity.verifySignature(message, signature, identity.publicKey)
);
