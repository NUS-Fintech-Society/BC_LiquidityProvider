pragma solidity ^0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract exchange {
  enum TransactionTypes { EtherToErc, ErcToEther }

  // Make use of SafeMath to do calculation that will not be result in overflow / incorrectness
  using SafeMath for uint;

  uint256 amtEtherTotal = 0 ether;
  uint256 amtErc20Total = 0 ether;
  // TODO: Change this arbitrary value to something that makes more sense 
  uint256 exchangeRateEtherToErc = 0.5 ether;

  struct Transaction {
    address user;
    TransactionType transactionType;
    uint256 transactionRate;
    uint256 amtEther;
    uint256 amtErc;
    uint256 date;
  }
}