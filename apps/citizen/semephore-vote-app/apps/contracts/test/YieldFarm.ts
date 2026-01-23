// https://blockchain.oodles.io/dev-blog/create-a-yield-farming-contract/

import { expect } from "chai";
//const { expect } = require("chai");

describe("YieldFarm", function () {
  let stakingToken, rewardToken, yieldFarm;
  let ownerAddress, user1, user2;

  beforeEach(async function () {
    [ownerAddress, user1, user2, _] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    stakingToken = await Token.deploy("Staking Token", "STK", 1000000);
    rewardToken = await Token.deploy("Reward Token", "RWD", 1000000);

    const YieldFarm = await ethers.getContractFactory("YieldFarm");
    yieldFarm = await YieldFarm.deploy(stakingToken.address, rewardToken.address, 1);

    await stakingToken.transfer(user1.address, 1000);
    await stakingToken.transfer(user2.address, 1000);
    await rewardToken.transfer(yieldFarm.address, 1000);
  });

  it("Stake and earn", async function () {
    await stakingToken.connect(user1).approve(yieldFarm.address, 100);
    await yieldFarm.connect(user1).stake(100);
    expect(await stakingToken.balanceOf(user1.address)).to.equal(900);
    expect(await stakingToken.balanceOf(yieldFarm.address)).to.equal(100);

    await yieldFarm.connect(user1).claimRewards();
    expect(await rewardToken.balanceOf(user1.address)).to.equal(100);
  });

  it("Should allow users to unstake tokens", async function () {
    await stakingToken.connect(user1).approve(yieldFarm.address, 100);
    await yieldFarm.connect(user1).stake(100);

    await yieldFarm.connect(user1).unstake(100);
    expect(await stakingToken.balanceOf(user1.address)).to.equal(1000);
  });
});

