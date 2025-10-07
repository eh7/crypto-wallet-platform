import { expect } from "chai";
import { ethers, BigNumber } from "hardhat";

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

describe("Vote Semaphore test contract", function () {

  let accounts: any;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
  })

  async function deployContractFixture() {
    const { semaphore } = await run("deploy:semaphore", {
      logs: false
    })

    const semaphoreContract: ISemaphore = semaphore

    const baseContract = "Vote";

    const voteContract: Feedback = await run("deploy", {
      logs: false,
      semaphore: await semaphoreContract.getAddress(),
      baseContract,
    })

    const groupId = await voteContract.groupId()

    /*
    console.log(
      //voteContract.getGroupAdmin,
      //await voteContract.getGroupAdmin(groupId)
      //voteContract.getGroupAdmin()
      "WIP: updates in ",
      "WIP: node_modules/@semaphore-protocol/contracts/Semaphore.sol ",
      "WIP: node_modules/@semaphore-protocol/contracts/interfaces/ISemaphore.sol",
      "WIP: intergrate into Vote Contract with inheritance and remove groupAdmin fucntion in Semaphore function and ISemaphore Interface???",
      await voteContract.groupAdmin(groupId),
      groupId
    );
    */

    return { semaphoreContract, voteContract, groupId }
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

  describe("# joinGroup", () => {
    it("Should allow users to join the group", async () => {
      const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)

      const users = [new Identity(), new Identity()]

      const group = new Group()

      for (const [i, user] of users.entries()) {
        const transaction = await voteContract.joinGroup(user.commitment)
        group.addMember(user.commitment)

        await expect(transaction)
           .to.emit(semaphoreContract, "MemberAdded")
           .withArgs(groupId, i, user.commitment, group.root)
      }
    })
  });

  describe("# createBallot", () => {
    it("Should allow users to createBallot if owner", async () => {
      const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)

      const users = [new Identity(), new Identity()]
      const group = new Group()

      for (const user of users) {
        await voteContract.joinGroup(user.commitment)
        group.addMember(user.commitment)
      }

      const signers = await ethers.getSigners();
      const owner = await voteContract.owner();
      expect(owner).to.equal(signers[0].address);

      const questionString = "Should Scotland be an independant country?";
      const responsesStringArray = ["yes", "no"];
      const question = ethers.toUtf8Bytes(questionString);
      const responses = [
        ethers.toUtf8Bytes(responsesStringArray[0]),
        ethers.toUtf8Bytes(responsesStringArray[1]),
      ];
console.log(
        question,
        responses,
);
      const ballot = await voteContract.createBallot(
        question,
        responses,
      );

      const eventBallot = (
	(
          await getEvent(
            voteContract,
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
      /*
      console.log(
        eventQuestion,
        evenResponses[0],
        evenResponses[1],
      );
      */
    })
  });
 
  describe("# castVote", () => {
    it("Should allow users to send voteContract anonymously", async () => {
      const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)

      const users = [new Identity(), new Identity()]
      const group = new Group()

      for (const user of users) {
        await voteContract.joinGroup(user.commitment)
        group.addMember(user.commitment)
      }

      //const voteContract = encodeBytes32String("Hello World")
      const types = ['string', 'string'];
      const values = ["best colour", "green"];
      const vote = ethers.keccak256(
        ethers.solidityPacked(types, values)
      )
      //console.log('hashed vote:', vote);
      const hashVoteContract = await voteContract.hashVote(
        "best colour",
        "green",
      );
      //console.log('hashed vote:', hashVoteContract);
      expect(vote).to.equal(hashVoteContract);

      const scope = 0;
      const proof = await generateProof(users[1], group, vote, scope)

      //const transaction = await voteContract.connect(accounts[0]).castVote(
      const transaction = await voteContract.castVote(
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
            voteContract,
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
        .to.emit(semaphoreContract, "Voted")
        .withArgs(
          vote, 
        )

      
      expect(transaction)
        .to.emit(semaphoreContract, "ProofValidated")
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
      await expect(voteContract.castVote(
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
      const transaction1 = await voteContract.castVote(
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
            voteContract,
            transaction1,
            "Voted",
	  )
        ).args[0]
      )

      await expect(voteContract.castVote(
        proof2.merkleTreeDepth,
        proof2.merkleTreeRoot,
        proof2.nullifier,
        vote2,
        scope2,
        proof2.points
      )
      ).to.be.reverted
/*
*/

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

      const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)

      const users = [new Identity(keystore.privateKey), new Identity()]
      const group = new Group()

      //console.log(users)

      for (const user of users) {
        await voteContract.joinGroup(user.commitment)
        group.addMember(user.commitment)
      }

      const types = ['string', 'string'];
      const values = ["best colour", "green"];
      const vote = ethers.keccak256(
        ethers.solidityPacked(types, values)
      )
      const hashVoteContract = await voteContract.hashVote(
        "best colour",
        "green",
      );
      expect(vote).to.equal(hashVoteContract);

      const scope = 0;
      const proof = await generateProof(users[1], group, vote, scope)

      //const transaction = await voteContract.connect(accounts[0]).castVote(
      const transaction = await voteContract.castVote(
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
            voteContract,
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
        .to.emit(semaphoreContract, "Voted")
        .withArgs(
          vote, 
        )

      expect(transaction)
        .to.emit(semaphoreContract, "ProofValidated")
        .withArgs(
          groupId,
          proof.merkleTreeDepth,
          proof.merkleTreeRoot,
          proof.nullifier,
          proof.message,
          groupId,
          proof.points
        )


    })
  })

});
