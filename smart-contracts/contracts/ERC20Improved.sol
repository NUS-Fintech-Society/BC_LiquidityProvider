
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Improved is ERC20 {
  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

  function burn(address account, uint256 amount) public virtual {
    _burn(account, amount);
  }

  function mint(address account, uint256 amount) public virtual {
    _mint(account, amount);
  }
}