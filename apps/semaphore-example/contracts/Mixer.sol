// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Mixer {
    ISemaphore public semaphore;

    uint256 public groupId;

    uint256 public constant TX_AMOUNT = 0.01 ether;

    mapping(bytes32 => bool) deposited;

    event Deposit (address);

    constructor(address semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);

        //groupId = _groupId;

        //semaphore.createGroup(groupId, address(this));

        groupId = semaphore.createGroup(address(this));
    }

    /*
    deposit(uint256 _identityCommitment)
    depositERC20(uint256 _identityCommitment)
    mix(DepositProof _proof, address payable _relayerAddress)
    mixERC20(DepositProof _proof, address payable _relayerAddress)
    */
    
    function deposit () external payable {
    //function deposit (bytes32 _paymentHash) external payable {
      require(msg.value == TX_AMOUNT);
      //deposited[_paymentHash] = true;
      //emit Deposit(msg.sender);
    }

    function verify(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 paymentHash,
        uint256 scope,
        uint256[8] calldata points
    ) external view returns (bool) {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            paymentHash,
            //groupId,
            scope,
            points
        );
        return semaphore.verifyProof(groupId, proof);
    }

    function validate(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 paymentHash,
        uint256 scope,
        uint256[8] calldata points
    ) external returns (bool) {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            paymentHash,
            //groupId,
            scope,
            points
        );
        semaphore.validateProof(groupId, proof);
        return true;
    }

    function withdraw(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 paymentHash,
        uint256[8] calldata points
    ) external returns (address) {

        //require(
        //  deposited[paymentHash]
        //);

        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            paymentHash,
            groupId,
            points
        );

        semaphore.validateProof(groupId, proof);

        require(
          address(this).balance >= TX_AMOUNT,
          "withdraw amount greater than contract balance"
        );
        (bool success,) = msg.sender.call{value: TX_AMOUNT}("");
        require(success, "Failed to send Ether");
    }


    function joinGroup(uint256 identityCommitment) external {
    //function joinGroup(uint256 identityCommitment) external payable {
      //require(msg.value == TX_AMOUNT);
      semaphore.addMember(groupId, identityCommitment);
    }

    /*
    function sendFeedback(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 paymentHash,
        uint256[8] calldata points
    ) external {
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
            merkleTreeDepth,
            merkleTreeRoot,
            nullifier,
            paymentHash,
            groupId,
            points
        );

        semaphore.validateProof(groupId, proof);
    }
    */
}
