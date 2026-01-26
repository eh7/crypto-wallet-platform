// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://blockchain.oodles.io/dev-blog/create-a-yield-farming-contract/

interface IERC20 {
    function transferFrom(address senderAddress, address recipientAddress, uint256 value) external returns (bool);
    function transfer(address recipientAddress, uint256 value) external returns (bool);
}

contract YieldFarm {
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    uint256 public totalStaked;
    uint256 public rewardRate;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingTokenAddress, IERC20 _rewardTokenAddress, uint256 _rewardRateValue) {
        stakingToken = _stakingTokenAddress;
        rewardToken = _rewardTokenAddress;
        rewardRate = _rewardRateValue;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Amount can not be zero");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        totalStaked += amount;
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        stakingToken.transfer(msg.sender, amount);
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external {
        uint256 reward = calculateRewardTokens(msg.sender);
        rewards[msg.sender] = 0;
        rewardToken.transfer(msg.sender, reward);
        emit RewardClaimed(msg.sender, reward);
    }

    function calculateRewardTokens(address userAddress) public view returns (uint256) {
        return stakedBalance[user] * rewardRate;
    }
}

