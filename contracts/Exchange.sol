pragma solidity ^0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract exchange {
    address owner;
    ERC20 erc20Contract;
    enum TransactionTypes {EtherToErc, ErcToEther}

    // Make use of SafeMath to do calculation that will not be result in overflow / incorrectness
    using SafeMath for uint256;

    uint256 amtEtherTotal = 0 ether;
    uint256 amtErc20Total = 0 ether;
    // TODO: Change this arbitrary value to something that makes more sense
    uint256 exchangeRateEtherToErc = 0.5 ether;

    // TODO: This variable might not be needed depending on the behaviour of _burn() function
    uint256 public totalSupply;
    mapping(address => unit) public balanceOf;

    constructor(
        ERC20 erc20Address,
        uint256 amtErc20,
        address ownerAddress
    ) {
        erc20Contract = erc20Address;
        owner = ownerAddress;
        erc20contract.transfer(owner, amtErc20);
    }

    struct Transaction {
        address user;
        TransactionType transactionType;
        uint256 transactionRate;
        uint256 amtEther;
        uint256 amtErc;
        uint256 date;
    }

    function addLiquidityEther(uint256 value) {
        amtEtherTotal = add(amtEtherTotal, value);
    }

    function addLiquidityERC20(uint256 value) {
        amtErc20Total = add(amtErc20Total, value);
    }

    /**
     * TODO: Not very sure whether this should burn totalSupply, or take in ether / ERC type and burn only that particular token
     */
    function _burn(address from, uint256 value) internal {
        balanceOf[from] = sub(balanceOf[from], value);
        totalSupply = sub(totalSupply, value);
    }

    function getCurrentPrice() public view returns (uint256) {
        return amtEtherTotal / amtErc20Total;
    }

    function setExchangeRate(uint256 newExchangeRate) {
        exchangeRateEtherToErc = newExchangeRate;
    }

    event Sent(address from, address to, uint256 amount);

    function send(address receiver, uint256 amount) public {
        require(amount <= balances[owner], "Insufficient balance.");
        balances[owner] -= amount;
        balances[receiver] += amount;
        emit Sent(owner, receiver, amount);
    }

    function exchangeErc20ToEther(uint256 amtErc20In) {
        erc20Contract.approve(msg.sender, amtErc20In);
        erc20Contract.transferFrom(msg.sender, owner, amtErc20In);
        uint256 amtEtherOut = exchangeRateEtherToErc * amtErc20In * 0.997;
        owner.send(msg.sender, amtEtherOut);
        // add commission fee (amtEtherOut * 0.003)

        uint256 currentPrice = getCurrentPrice();
        setExchangeRate(currentPrice);
    }

    function exchangeEtherToErc20(uint256 amtEtherIn) {
        uint256 amtEtherInAfterFees = amtEtherIn * 0.997;
        // add commission fee (amtEtherIn * 0.003)
        user.send(owner, amtEtherInAfterFees);
        erc20Contract.approve(owner, amtEtherInAfterFees);
        erc20Contract.transferFrom(owner, user, amtEtherInAfterFees);

        uint256 currentPrice = getCurrentPrice();
        setExchangeRate(currentPrice);
    }
}
