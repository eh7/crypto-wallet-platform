import { expect } from "chai";
import hre from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";


import { ethers, BigNumber } from "hardhat";
//import { ethers } from "hardhat";

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import { Group, Identity, generateProof } from "@semaphore-protocol/core"

import { encodeBytes32String } from "ethers"

import { run } from "hardhat"

import {
ethers,
isKeystoreJson,
decryptKeystoreJsonSync,
} from "ethers"

import { readFileSync } from 'fs'

describe("PredictionMarket Semaphore test contract", function () {

  let accounts: any;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
  })

  async function deployContractFixture() {
    const baseContract = "PredictionMarket";

    const thisContract: Feedback = await run("deploy", {
      logs: false,
      baseContract,
    })

    return { thisContract }
  }

  async function getEvent(
    contract: Contract,
    tx: TransactionResponse,
    eventName: string,
  ) {
    const receipt = await tx.wait();
    if (receipt?.logs) {
      for (const log of receipt.logs) {
        const event = contract.interface.parseLog(log);
        if (event?.name === eventName) {
          return event;
        }
      }
    }
    return null;
  }

  describe("# createMarket", () => {
    it("Should allow users to cretae prediction market", async () => {
      const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarket")
      const predictionMarketContract = await PredictionMarketFactory.deploy()

      //console.info(`PredictionMarket contract has been deployed to: ${await predictionMarketContract.getAddress()}`)

      const admin = await predictionMarketContract.admin()
      //console.info(`admin :: ${admin}`)

      const marketCount = await predictionMarketContract.marketCount()
      //console.info(`marketCount :: ${marketCount}`)

      let deadline = 0
      //const market = await predictionMarketContract.createMarket(
      const testMarketCreateRevert = predictionMarketContract.createMarket(
        "this is the market description",
	deadline,
      )
      await expect(testMarketCreateRevert).to.be.reverted

      const now = new Date();
      now.setDate(now.getDate() + 1);
//      now.setDate(now.getDate() - 1);
      deadline = now * 1000;
      deadline = Math.round(deadline / 1000000)

      console.log('deadline', deadline)
      const testMarket = await predictionMarketContract.createMarket(
        "this is the market description",
        deadline,
      )

      const eventMarketCreated = (
	(
          await getEvent(
            predictionMarketContract,
            testMarket,
            "MarketCreated",
	  )
        )
      )
      //console.log(eventMarketCreated.args)
      expect(eventMarketCreated.args[0]).to.equal(0)
      expect(eventMarketCreated.args[1]).to.equal(
        "this is the market description",
      )
      expect(eventMarketCreated.args[2]).to.equal(deadline)

      expect(await predictionMarketContract.marketCount()).to.equal(1)

      //
      // enum MarketOutcome { None, Yes, No }
      //
      const None = BigInt("0")
      const Yes = BigInt("1")
      const No = BigInt("2")
      await predictionMarketContract.placeBet(
        0,
	Yes,
	{
	  value: ethers.parseEther("1.5")
	}
      )

      console.log(accounts[0].address)
      console.log(accounts[1].address)
      await predictionMarketContract.connect(accounts[1]).placeBet(
        0,
	No,
	{
          from: accounts[1].address,
	  value: ethers.parseEther("1.5")
	}
      )

      // force the block.timestamp to move 100000 base units forward
      // note: if this is not used you will get a revert error on not
      await time.increase(100000)

      const finalizedMarket = await predictionMarketContract.finalizeMarket(
        0,
	Yes,
      )
//      console.log(await predictionMarketContract.finalizeMarket(
//      console.log(deadline)
//      console.log(eventMarketCreated.args)

      const eventBlockTimestamp = (
	(
          await getEvent(
            predictionMarketContract,
            finalizedMarket,
            "BlockTimestamp",
	  )
        )
      )

      console.log('testing 123 :: ', eventBlockTimestamp.args)

    })
  })

});
