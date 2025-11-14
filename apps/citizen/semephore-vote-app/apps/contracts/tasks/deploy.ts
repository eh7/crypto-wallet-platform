import { task, types } from "hardhat/config"

task("deploy", "Deploy a Vote contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = await semaphore.getAddress()
        }

        const VoteFactory = await ethers.getContractFactory("Vote")

        const voteContract = await VoteFactory.deploy(semaphoreAddress, 2000000)

        if (logs) {
            console.info(`Vote contract has been deployed to: ${await voteContract.getAddress()}`)
        }

        return voteContract
    })
