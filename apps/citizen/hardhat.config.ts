import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

//import dotenv from 'dotenv';
//dotenv.config(); //
//dotenv.config({ path: __dirname+'/.env' });
//dotenv.config({ path: './.env' });


//const INFURA_API_KEY = process.env.INFURA_API_KEY;
//const PRIVATE_KEY_DEV_EVM = process.env.PRIVATE_KEY_DEV_EVM;

//console.log(PRIVATE_KEY_DEV_EVM)
console.log(configVariable("TEST_SECRET"))
//console.log(configVariable("PRIVATE_KEY_DEV_EVM"))

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    devEvmNode:{
      type: "http",
      url: 'http://127.0.0.1:8545/',
      accounts: [configVariable("PRIVATE_KEY_DEV_EVM")],
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
});
