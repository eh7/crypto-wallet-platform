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

      console.log('testing 123 :: ', eventBlockTimestamp)

    })
  })

  /*
  describe("# joinGroup", () => {
    it("Should allow users to join the group", async () => {
      const { semaphore } = await run("deploy:semaphore", {
        logs: false
      })

      const semaphoreAddress = await semaphore.getAddress()

      const PollFactory = await ethers.getContractFactory("Poll")
      const pollContract = await PollFactory.deploy(semaphoreAddress)

      //console.info(`Poll contract has been deployed to: ${await pollContract.getAddress()}`)

      const groupId = await pollContract.groupId()

      const users = [new Identity(), new Identity()]

      const group = new Group()

      for (const [i, user] of users.entries()) {
        const transaction = await pollContract.joinGroup(user.commitment)
        group.addMember(user.commitment)

        await expect(transaction)
           .to.emit(semaphore, "MemberAdded")
           .withArgs(groupId, i, user.commitment, group.root)
      }
    })
  });

  describe("# createBallot", () => {
    it("Should allow users to createBallot if owner", async () => {
      const { semaphore } = await run("deploy:semaphore", {
        logs: false
      })
      const semaphoreAddress = await semaphore.getAddress()
      const PollFactory = await ethers.getContractFactory("Poll")
      const pollContract = await PollFactory.deploy(semaphoreAddress)
      const groupId = await pollContract.groupId()

      const users = [new Identity(), new Identity()]
      const group = new Group()

      for (const user of users) {
        await pollContract.joinGroup(user.commitment)
        group.addMember(user.commitment)
      }

      const signers = await ethers.getSigners();
      const owner = await pollContract.owner();
      expect(owner).to.equal(signers[0].address);

      const questionString = "Should Scotland be an independant country?";
      const responsesStringArray = ["yes", "no"];
      const question = ethers.toUtf8Bytes(questionString);
      const responses = [
        ethers.toUtf8Bytes(responsesStringArray[0]),
        ethers.toUtf8Bytes(responsesStringArray[1]),
      ];

      const ballot = await pollContract.createBallot(
        question,
        responses,
      );

      const eventBallot = (
	(
          await getEvent(
            pollContract,
            ballot,
            "Ballot",
	  )
        )
      )
      const eventQuestion = ethers.toUtf8String(eventBallot.args[0]);
      const evenResponses = await eventBallot.args[1].map((item) => {
        return ethers.toUtf8String(item)
      });
      expect(eventQuestion).to.equal(questionString);
      expect(evenResponses[0]).to.equal(responsesStringArray[0]);
      expect(evenResponses[1]).to.equal(responsesStringArray[1]);

      // should revert
      const ballot2 = pollContract.createBallot(
        question,
        responses,
      )
      await expect(ballot2).to.be.reverted
    })
  });
 
  describe("# castVote", () => {
    it("Should allow users to send voteContract anonymously", async () => {
      //const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)
      const { semaphore } = await run("deploy:semaphore", {
        logs: false
      })
      const semaphoreAddress = await semaphore.getAddress()
      const PollFactory = await ethers.getContractFactory("Poll")
      const pollContract = await PollFactory.deploy(semaphoreAddress)
      const groupId = await pollContract.groupId()

      const users = [new Identity(), new Identity()]
      const group = new Group()

      // console.log(users)

      for (const user of users) {
        await pollContract.joinGroup(user.commitment)
        group.addMember(user.commitment)
      }

      //const voteContract = encodeBytes32String("Hello World")
      const types = ['string', 'string'];
      const values = ["best colour", "green"];
      const vote = ethers.keccak256(
        ethers.solidityPacked(types, values)
      )
      //console.log('hashed vote:', vote);
      const hashPollContract = await pollContract.hashVote(
        "best colour",
        "green",
      );
      //console.log('hashed vote:', hashPollContract);
      expect(vote).to.equal(hashPollContract);

      const scope = 0;
      const proof = await generateProof(users[1], group, vote, scope)

      //const transaction = await voteContract.connect(accounts[0]).castVote(
      const transaction = await pollContract.castVote(
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.nullifier,
        vote,
        scope,
        proof.points
      )

      // wait for 5 seconds example - commented out not needed
      //await new Promise(res => setTimeout(() => res(null), 5000));

      const eventVoted = (
	(
          await getEvent(
            pollContract,
            transaction,
            "Voted",
	  )
        ).args[0]
      )

      expect(
        vote
      ).to.equal(
        ethers.toBeHex(eventVoted)
      )

      expect(transaction)
        .to.emit(semaphore, "Voted")
        .withArgs(
          vote, 
        )

      
      expect(transaction)
        .to.emit(semaphore, "ProofValidated")
        .withArgs(
          groupId,
          proof.merkleTreeDepth,
          proof.merkleTreeRoot,
          proof.nullifier,
          proof.message,
          groupId,
          proof.points
        )

      //
      // make sure it will not take another vote with same nullifier
      // this should revert
      //
      await expect(pollContract.castVote(
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.nullifier,
        vote,
        scope,
        proof.points
      )).to.be.reverted

      const scope2 = 1;
      const types2 = ['string', 'string'];
      const values2 = ["best colour", "red"];
      const vote2 = ethers.keccak256(
        ethers.solidityPacked(types2, values2)
      )
      const proof2 = await generateProof(users[1], group, vote2, scope2)
      const transaction1 = await pollContract.castVote(
        proof2.merkleTreeDepth,
        proof2.merkleTreeRoot,
        proof2.nullifier,
        vote2,
        scope2,
        proof2.points
      )

      const eventVoted1 = (
	(
          await getEvent(
            pollContract,
            transaction1,
            "Voted",
	  )
        ).args[0]
      )

      await expect(pollContract.castVote(
        proof2.merkleTreeDepth,
        proof2.merkleTreeRoot,
        proof2.nullifier,
        vote2,
        scope2,
        proof2.points
      )
      ).to.be.reverted

    })
  })

  describe("# castVote from keystore", () => {
    it("Should allow users to send voteContract anonymously", async () => {
      const fileKeystoreData = readFileSync(
        process.env.KEYSTORE_PATH
      )

      const keystoreData = fileKeystoreData.toString()

      const keystore = decryptKeystoreJsonSync(
        keystoreData,
        'password',
      )

      // const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)
      const { semaphore } = await run("deploy:semaphore", {
        logs: false
      })
      const semaphoreAddress = await semaphore.getAddress()
      const PollFactory = await ethers.getContractFactory("Poll")
      const pollContract = await PollFactory.deploy(semaphoreAddress)
      const groupId = await pollContract.groupId()

      const questionString = "Should Scotland be an independant country?";
      const responsesStringArray = ["yes", "no"];
      const question = ethers.toUtf8Bytes(questionString);
      const responses = [
        ethers.toUtf8Bytes(responsesStringArray[0]),
        ethers.toUtf8Bytes(responsesStringArray[1]),
      ];
      const ballot = await pollContract.createBallot(
        question,
        responses,
      );
      const resultBallot = (
        await getEvent(
          pollContract,
          ballot,
          "Ballot",
        )
      )
//      console.log(ethers.toUtf8String(resultBallot.args[0]))
//      console.log(ethers.toUtf8String(resultBallot.args[1][0]))
//      console.log(ethers.toUtf8String(resultBallot.args[1][1]))
//      console.log(resultBallot.args)

      const users = [new Identity(keystore.privateKey), new Identity()]
      const group = new Group()

      //console.log(users)

      for (const user of users) {
        await pollContract.joinGroup(user.commitment)
        group.addMember(user.commitment)
      }

      const types = ['string', 'string'];
      const values = [questionString, responsesStringArray[0]];
      const vote = ethers.keccak256(
        ethers.solidityPacked(types, values)
      )
      const hashVoteContract = await pollContract.hashVote(
        questionString,
        responsesStringArray[0],
      );
      expect(vote).to.equal(hashVoteContract);
//console.log(vote, hashVoteContract)

      const scope = 0;
      const proof = await generateProof(users[1], group, vote, scope)

      //const transaction = await pollContract.connect(accounts[0]).castVote(
      const transaction = await pollContract.castVote(
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.nullifier,
        vote,
        scope,
        proof.points
      )

      const eventVoted = (
	(
          await getEvent(
            pollContract,
            transaction,
            "Voted",
	  )
        ).args[0]
      )

      expect(
        vote
      ).to.equal(
        ethers.toBeHex(eventVoted)
      )

      expect(transaction)
        .to.emit(semaphore, "Voted")
        .withArgs(
          vote, 
        )

      expect(transaction)
        .to.emit(semaphore, "ProofValidated")
        .withArgs(
          groupId,
          proof.merkleTreeDepth,
          proof.merkleTreeRoot,
          proof.nullifier,
          proof.message,
          groupId,
          proof.points
        )

      //
      // make sure it will not take another vote with same nullifier
      // this should revert
      //
      await expect(pollContract.castVote(
        proof.merkleTreeDepth,
        proof.merkleTreeRoot,
        proof.nullifier,
        vote,
        scope,
        proof.points
      )).to.be.reverted


      const result = (
          await getEvent(
            pollContract,
            transaction,
            "Voted",
	  )
        ).args[0]
//      console.log(typeof result)
//      console.log(ethers.toBeHex(result))


      const vote0 = ethers.keccak256(
        ethers.solidityPacked(
          ['string', 'string'],
          [questionString, responsesStringArray[0]],
        )
      )
//      console.log(vote0)

      const vote1 = ethers.keccak256(
        ethers.solidityPacked(
          ['string', 'string'],
          [questionString, responsesStringArray[1]],
        )
      )
//      console.log(vote1)

    })
  })
  */
});
