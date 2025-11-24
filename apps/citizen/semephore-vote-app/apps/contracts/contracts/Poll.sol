//SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Poll {
    ISemaphore public semaphore;

    uint256 public groupId;

    mapping(bytes32 => bool) active_ballot;

    //mapping(uint256 => address) owners;
    address public owner;

    event Voted(uint256 vote);

    event Ballot(
      bytes question,
      bytes[] responses,
      address owner,
      uint256 groupId
    );

    /// @dev Checks if the owner
    modifier onlyOwner() {
      if (owner != msg.sender) {
        revert('not vote owner');
      }
      _;
    }

    constructor(address _semaphoreAddress) {
      semaphore = ISemaphore(_semaphoreAddress);
      owner = msg.sender;
      groupId = semaphore.createGroup(address(this));
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

    function registerBallot(
      bytes32 question, 
      bytes32[] memory answers
    //) external ExistingGroup(groupId) onlyGroupAdmin(groupId) {
    ) external {
    }
    */

    function createBallot(
      bytes memory question,
      bytes[] memory responses
    ) external onlyOwner {

      if (active_ballot[keccak256(abi.encodePacked(question))] != true) {
        active_ballot[keccak256(abi.encodePacked(question))] = true;
        //active_ballot[hashVote(question, responses)] = msg.sender;
        //active_ballot[bytes32] = msg.sender;
      } else {
        revert('ballot question already used');
      }

      emit Ballot(
        question,
        responses,
        owner,
        groupId
      );
    }

    function joinGroup(uint256 identityCommitment) external {
      semaphore.addMember(groupId, identityCommitment);
    }

    function castVote(
        uint256 merkleTreeDepth,
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256 vote,
        uint256 scope,
        uint256[8] calldata points
    ) external {
      ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof(
        merkleTreeDepth,
        merkleTreeRoot,
        nullifier,
        vote,
        scope,
        points
      );

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

    /*
    function groupAdmin(uint256 _groupId) external view returns (address admin) {
        admin = semaphore.groupAdmin(_groupId);
    }
    */

}
