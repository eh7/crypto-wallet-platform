import "@nomicfoundation/hardhat-toolbox"

import hardhatVerify from "@nomicfoundation/hardhat-verify";

import "@semaphore-protocol/hardhat"
import { getHardhatNetworks } from "@semaphore-protocol/utils"
import { config as dotenvConfig } from "dotenv"
import { HardhatUserConfig } from "hardhat/config"
import { resolve } from "path"
//import "./tasks/deploy"
//import "./tasks/deployLock"
import "./tasks/deployVote"
//import "./tasks/deployFeedback"
//import "./tasks/deployCounterTest"

dotenvConfig({ path: resolve(__dirname, "../../.env") })

const config: HardhatUserConfig = {
    solidity: "0.8.23",
    defaultNetwork: process.env.DEFAULT_NETWORK || "hardhat",
    //plugins: [
    //  hardhatVerify,
    //  // ...other plugins...
    //],
    networks: {
        hardhat: {
            chainId: 1337
        },
        sepolia: {
            chainID: 3,
            url: 'https://sepolia.infura.io/v3/' + process.env.INFURA_API_KEY,
            accounts: [`0x${process.env.ETHEREUM_PRIVATE_KEY_SEPOLIA}`]
	},
//        ...getHardhatNetworks(process.env.ETHEREUM_PRIVATE_KEY)
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY
    },
    typechain: {
        target: "ethers-v6"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    sourcify: {
        enabled: true
    }
}

export default config
