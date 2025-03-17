//import EthjsWallet, { hdkey as etherHDkey } from 'ethereumjs-wallet';

import pkg from 'ethereumjs-wallet';
const { hdkey: etherHDkey } = pkg;

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import 'dotenv/config';

const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption

//import seedHex from `/tmp/tmp.json` assert { type: `json` };
const data = require("/tmp/tmp.json");

const decrypt = (_data, _key) => {
  let iv = Buffer.from(_data.iv, 'hex');
  let encryptedText = Buffer.from(_data.encryptedData, 'hex');
  let key = Buffer.from(_key, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
}

const seedHex = decrypt(data, process.env.KEY);

const HDwallet = etherHDkey.fromMasterSeed(seedHex);
const zeroWallet = HDwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
console.log(
  zeroWallet.getPrivateKeyString()
);
console.log(
  zeroWallet.getChecksumAddressString()
);
/*
*/
