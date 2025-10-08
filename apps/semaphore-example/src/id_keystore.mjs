import { Identity } from "@semaphore-protocol/identity"

import {
ethers,
isKeystoreJson,
decryptKeystoreJsonSync,
} from "ethers"

import { readFileSync } from 'fs'

import prompt from 'prompt'

var schema = {
  properties: {
    password: {
      hidden: true
    },
  }
}

if(!process.argv[2])
{
  console.log("USAGE: node src/id_keystore.mjs <keystore_file_path>");
  process.exit();
}

const fileKeystoreData = readFileSync(process.argv[2])

const keystoreData = fileKeystoreData.toString()

prompt.start();
prompt.get(schema, async function(err,res){
  try {
    const keystore = decryptKeystoreJsonSync(
      keystoreData,
      res.password,
    )
    console.log(keystore)
    const identity = new Identity(keystore.privateKey)
    console.log(Object.keys(identity));
    console.log(identity._secretScalar);
    console.log(identity);
  } catch (e) {
    console.log('ERROR :: prompt.get :: ', e.shortMessage)
  }
})

/*
const identity = new Identity("this is a secret string that means nothing or doesIt?")

console.log(identity._secretScalar);

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
*/
