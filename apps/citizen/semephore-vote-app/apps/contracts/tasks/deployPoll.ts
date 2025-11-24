import { task, types } from "hardhat/config"

let semaphoreAddress = null

task("deploy", "Deploy a Poll contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
	// https://docs.semaphore.pse.dev/deployed-contracts
        // semaphoreAddress = '0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D'

        if (process.env.NETWORK === 'sepolia') {
          semaphoreAddress = '0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D'
          console.log(semaphoreAddress)
        }

        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = await semaphore.getAddress()
        }

	console.log('semaphoreAddress: ', semaphoreAddress)


        const PollFactory = await ethers.getContractFactory("Poll")

        //const pollContract = await PollFactory.deploy(semaphoreAddress, 2000000)
        const pollContract = await PollFactory.deploy(semaphoreAddress)

        if (logs) {
            console.info(`Poll contract has been deployed to: ${await pollContract.getAddress()}`)
        }

        return pollContract
    })
