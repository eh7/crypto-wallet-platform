import { ethers } from 'ethers'

import 'dotenv/config'

import { createRequire } from "module"

const require = createRequire(import.meta.url)

const endPoint = process.env.RPC_URL_SEPOLIA
//const address = "0x7574b8D4C0C2566b671C530d710821EB6694bE0C"
const address = "0xd03b9c07703bc73ccd1586e202c9ddf5af45e81c"

console.log(ethers.JsonRpcProvider)
const provider = new ethers.JsonRpcProvider(endPoint);

const getBalance = async (address) => {
//  const balance = ethers.utils.formatEther(
  const balance = ethers.formatEther(
    (await provider.getBalance(
      address,
    )).toString()
  );
  console.log('balance (', address, ')', balance);
}


const run = async () => {
  getBalance(address);
}

run();
