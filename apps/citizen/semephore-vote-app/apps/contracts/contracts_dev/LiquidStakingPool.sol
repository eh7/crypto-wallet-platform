// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// https://blockchain.oodles.io/dev-blog/create-a-liquid-staking-pool/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiquidStakingPool is ERC20, Ownable {
    ERC20 public stakedToken;
    uint256 public totalStaked;

    constructor(address _stakedToken) ERC20("Staked Token", "sTOKEN") {
        stakedToken = ERC20(_stakedToken);
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0 tokens");

        stakedToken.transferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
        totalStaked += _amount;
    }

    function unstake(uint256 _amount) external {
        require(_amount > 0, "Cannot unstake 0 tokens");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        _burn(msg.sender, _amount);
        stakedToken.transfer(msg.sender, _amount);
        totalStaked -= _amount;
    }
}
