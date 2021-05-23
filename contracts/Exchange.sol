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

  // TODO: This variable might not be needed depending on the behaviour of _burn() function
  uint public totalSupply;
  mapping(address => unit) public balanceOf;

  struct Transaction {
    address user;
    TransactionType transactionType;
    uint256 transactionRate;
    uint256 amtEther;
    uint256 amtErc;
    uint256 date;
  }

  function addLiquidityEther(uint value) {
    amtEtherTotal = add(amtEtherTotal, value);
  }

  function addLiquidityERC20(uint value) {
    amtErc20Total = add(amtErc20Total, value);
  }


  /**
   * TODO: Not very sure whether this should burn totalSupply, or take in ether / ERC type and burn only that particular token
   */
  function _burn(address from, uint value) internal {
    balanceOf[from] = sub(balanceOf[from], value);
    totalSupply = sub(totalSupply, value);
  }
}