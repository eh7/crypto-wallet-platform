// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PredictionMarket {
  enum MarketOutcome { None, Yes, No }
  
  struct Market {
    string description;
    uint256 deadline;
    MarketOutcome outcome;
    bool finalized;
    uint256 totalYesBets;
    uint256 totalNoBets;
    mapping(address => uint256) yesBets;
    mapping(address => uint256) noBets;
  }
  
  mapping(uint256 => Market) public markets;
  uint256 public marketCount;
  address public admin;

  event MarketCreated(uint256 marketId, string description, uint256 deadline);
  event BetPlaced(uint256 marketId, address indexed user, MarketOutcome outcome, uint256 amount);
  event MarketFinalized(uint256 marketId, MarketOutcome outcome);

  event BlockTimestamp(uint256 blockTimestamp, uint256 deadline, bool test);

  modifier onlyAdmin() {
    require(msg.sender == admin, 'Only admin can execute');
    _;
  }

  constructor() {
    admin = msg.sender;
  }

  // Create a new market
  function createMarket(string memory _description, uint256 _deadline) public onlyAdmin {
    require(_deadline > block.timestamp, 'Deadline must be in the future');

    Market storage market = markets[marketCount++];
    market.description = _description;
    market.deadline = _deadline;

    emit MarketCreated(marketCount - 1, _description, _deadline);
  }

  // Place a bet
  function placeBet(uint256 _marketId, MarketOutcome _outcome) public payable {
    Market storage market = markets[_marketId];
    require(block.timestamp < market.deadline, 'Betting period is over');
    require(_outcome == MarketOutcome.Yes || _outcome == MarketOutcome.No, 'Invalid outcome');
    require(msg.value > 0, 'Bet amount must be greater than zero');

    if (_outcome == MarketOutcome.Yes) {
      market.yesBets[msg.sender] += msg.value;
      market.totalYesBets += msg.value;
    } else {
      market.noBets[msg.sender] += msg.value;
      market.totalNoBets += msg.value;
    }

    emit BetPlaced(_marketId, msg.sender, _outcome, msg.value);
  }

  // Finalize the market with the actual outcome
  function finalizeMarket(uint256 _marketId, MarketOutcome _outcome) public onlyAdmin {
    Market storage market = markets[_marketId];
    emit BlockTimestamp(
      block.timestamp,
      market.deadline,
      block.timestamp >= market.deadline
    );
    require(block.timestamp >= market.deadline, 'Market cannot be finalized before deadline');
    require(!market.finalized, 'Market already finalized');

    market.outcome = _outcome;
    market.finalized = true;

    emit MarketFinalized(_marketId, _outcome);
  }

  // Claim winnings
  function claimWinnings(uint256 _marketId) public {
    Market storage market = markets[_marketId];
    require(market.finalized, 'Market not finalized yet');

    uint256 payout;

    if (market.outcome == MarketOutcome.Yes) {
      uint256 userBet = market.yesBets[msg.sender];
      payout = userBet + (userBet * market.totalNoBets / market.totalYesBets);
      market.yesBets[msg.sender] = 0;
    } else if (market.outcome == MarketOutcome.No) {
      uint256 userBet = market.noBets[msg.sender];
      payout = userBet + (userBet * market.totalYesBets / market.totalNoBets);
      market.noBets[msg.sender] = 0;
    }

    require(payout > 0, 'No winnings to claim');
    payable(msg.sender).transfer(payout);
  }
}
