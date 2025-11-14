import { ethers } from 'ethers'

import 'dotenv/config'

import { createRequire } from "module"

const require = createRequire(import.meta.url)

const endPoint = process.env.RPC_URL_SEPOLIA
const pkey = process.env.PRIVATE_KEY
//const pkey = process.env.PRIVATE_KEY_META

console.log(ethers.JsonRpcProvider)
const provider = new ethers.JsonRpcProvider(endPoint)

const sendTx = async (_address_to, _txValue) => {
  const privateKeyString = pkey
  const signer = new ethers.Wallet(privateKeyString, provider)
  await getBalance(signer.address)
process.exit()
  const params = {
    from: signer.address,
    to: _address_to,
    value: ethers.parseEther(_txValue),
  };
  console.log(params);
  const transaction = await signer.sendTransaction(params)
  console.log('transaction:', transaction);
  const receipt = await transaction.wait();
  console.log('receipt:', receipt);
}

const getAddress = async () => {
  const privateKeyString = pkey
  const signer = new ethers.Wallet(privateKeyString, provider)
  const address = signer.address
  console.log(address)
  return address
}

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
  //const address = await getAddress()
  //getBalance(address)
  sendTx(
    "0x6b1527f6e2248a862061963b8c1bd013acaca5a6",
    "0.001",
  )

}

run();
