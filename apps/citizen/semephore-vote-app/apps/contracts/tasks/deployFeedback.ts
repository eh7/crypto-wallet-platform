import { task, types } from "hardhat/config"

task("deploy", "Deploy a Feedback contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress }, { ethers, run }) => {
        //semaphoreAddress = '0x9f91beb6bBF6A10B48f1D4481619d0380bf3b876'
        //semaphoreAddress = '0xfbd35D82f32B2bdeBfC36A4F8FCc6ED846FdbBa1'
        semaphoreAddress = '0x8A1fd199516489B0Fb7153EB5f075cDAC83c693D'
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = await semaphore.getAddress()
        }

        const FeedbackFactory = await ethers.getContractFactory("Feedback")

        const feedbackContract = await FeedbackFactory.deploy(semaphoreAddress)

        if (logs) {
            console.info(`Feedback contract has been deployed to: ${await feedbackContract.getAddress()}`)
        }

        return feedbackContract
    })
