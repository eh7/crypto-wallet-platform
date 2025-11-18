import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@semaphore-protocol/hardhat"

import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";

import "./tasks/hello"
import "./tasks/others"
import "./tasks/deploy"

require('dotenv').config({ path: __dirname+'/.env' });

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_META = process.env.PRIVATE_KEY_META;
const PRIVATE_KEY_DEV_EVM = process.env.PRIVATE_KEY_DEV_EVM;
const PRIVATE_KEY_DEV_EVM_HH = process.env.PRIVATE_KEY_DEV_EVM_HH;
const PRIVATE_KEY_DEV_EVM_ROCK_KEYLIB = process.env.PRIVATE_KEY_DEV_EVM_ROCK_KEYLIB;

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  mocha: {
    timeout: 100000000,
  },
  //defaultNetwork: "yourtestnetname",
  networks: {
  //  hardhat:{},
    devEvmNode:{
      url: 'http://127.0.0.1:8545/',
      accounts: [`0x${PRIVATE_KEY_DEV_EVM_HH}`],
      //accounts: [`0x${PRIVATE_KEY_DEV_EVM_ROCK_KEYLIB}`]
    },
    goerli:{
      url: 'https://goerli.infura.io/v3/' + INFURA_API_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    sepolia:{
      chainID: 3,
      url: 'https://sepolia.infura.io/v3/' + INFURA_API_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
      //accounts: [`0x${PRIVATE_KEY_META}`]
    },
    op_sepolia:{
      url: 'https://optimism-sepolia.infura.io/v3/' + INFURA_API_KEY,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    zksync_testnet:{
      url: "https://sepolia.era.zksync.dev",
      accounts: [`0x${PRIVATE_KEY}`]
    },
  },
  sourcify: {
    enabled: false
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      op_mainnet: process.env.ETHERSCAN_OP_API_KEY, 
      op_goerli: process.env.ETHERSCAN_OP_API_KEY, 
      op_sepolia: process.env.ETHERSCAN_OP_API_KEY, 
    },
    customChains: [
      {
        network: "op_sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimistic.etherscan.io"
        }
      }
    ]
  },
};

subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(async (_, __, runSuper) => {
  let paths = await runSuper();

  //console.log("zzzzzzzzzzzzzzzzzzzzzzzz", paths.filter(
  //  (p: any) => !p.includes("TransientStore")
  //));

  paths = paths.filter(
    (p: any) => !p.includes("TransientTest")
  );
  paths = paths.filter(
    (p: any) => !p.includes("TransientStore")
  );
  paths = paths.filter(
    (p: any) => !p.includes("MyToken")
  );
  paths = paths.filter(
    (p: any) => !p.includes("VoteAs")
  );
  paths = paths.filter(
    (p: any) => !p.includes("YourContractV12")
  );
  return paths;

  //console.log(paths);

  //return paths.filter(
  //  (p: any) => !p.includes("TransientStore")
  //);

  //return paths.filter((p: any) => !p.includes("TransientTest"));
});

export default config;

