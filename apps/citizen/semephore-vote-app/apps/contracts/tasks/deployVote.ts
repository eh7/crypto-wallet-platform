import { task, types } from "hardhat/config"

task("deploy", "Deploy a Vote contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
	// https://docs.semaphore.pse.dev/deployed-contracts
        semaphoreAddress = '0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D'

        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = await semaphore.getAddress()
        }

        const VoteFactory = await ethers.getContractFactory("Vote")

        //const voteContract = await VoteFactory.deploy(semaphoreAddress, 2000000)
        const voteContract = await VoteFactory.deploy(semaphoreAddress)

        console.info(`Vote contract has been deployed to: ${await voteContract.getAddress()}`)

        if (logs) {
            console.info(`Vote contract has been deployed to: ${await voteContract.getAddress()}`)
        }

        return voteContract
    })
