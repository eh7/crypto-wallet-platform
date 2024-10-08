// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.23;

//import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

import {ISemaphore} from "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import {ISemaphoreVerifier} from "@semaphore-protocol/contracts/interfaces/ISemaphoreVerifier.sol";
import {SemaphoreGroups} from "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

contract VoteAs is ISemaphore, SemaphoreGroups {
//contract VoteAs {
    ISemaphore public semaphore;

    uint256 public groupId;

    //event Deposit (address);
    event Voted(uint256 vote);
    event Log(uint256 nullifier);

    constructor(address _semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(_semaphoreAddress);
        groupId = _groupId;

        semaphore.createGroup(groupId, address(this));
    }

    /*
    deposit(uint256 _identityCommitment)
    depositERC20(uint256 _identityCommitment)
    mix(DepositProof _proof, address payable _relayerAddress)
    mixERC20(DepositProof _proof, address payable _relayerAddress)
    */
    
    /*
    function deposit (uint256 _identityCommitment) external payable {
      require(msg.value == 0.01 ether);
      emit Deposit(msg.sender);
      //address(this).balance += 0.01 ether;
      //insert(leaf);
      //roots[padZero(getRoot())] = true;
    }

    function withdraw(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 vote,
        uint256[8] calldata points
    ) external returns (address) {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            vote,
            groupId,
            points
        );

        semaphore.validateProof(groupId, proof);
    }
    */

    function registerBallot(
      bytes32 question, 
      bytes32[] memory answers
    //) external ExistingGroup(groupId) onlyGroupAdmin(groupId) {
    ) external {
    }

    event Log(uint256 group, address admin);

    function joinGroup(uint256 identityCommitment) external {
        semaphore.addMember(groupId, identityCommitment);
    }

    function castVote(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 vote,
        uint256[8] calldata points
    ) external {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            vote,
            groupId,
            points
        );

        emit Log(nullifier);

        semaphore.validateProof(groupId, proof);

        emit Voted(vote);
    }

    function hashVote (
      string memory ballot,
      string memory vote
    ) external pure returns (bytes32 hash) {
      return keccak256(
        abi.encodePacked(
          ballot,
          vote
        )
      );
    }

    function groupAdmin(uint256 _groupId) external view returns (address admin) {
        admin = semaphore.groupAdmin(_groupId);
    }

}
