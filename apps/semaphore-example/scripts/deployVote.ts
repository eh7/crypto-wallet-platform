import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"

async function deployContractFixture() {
  try {
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
  } catch (e) { console.log("ERROR :: ", e.message) }
}

async function main() {
  const { semaphoreContract, voteContract, groupId } = await loadFixture(deployContractFixture)

  console.log(
    `semaphoreContract deployed to ${semaphoreContract.target}`,
    `vote Contract deployed to ${voteContract.target}`,
    groupId,
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
