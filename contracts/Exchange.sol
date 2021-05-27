pragma solidity ^0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./ERC20.sol";

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
    
    function getContractOwner() external view returns (address owner) {
        returns owner;
    }

    //getTotalAmtEther.
    //getTotalAmtERC20.  frontend show this value
    //getBalanceERC20. on frontend
    function getCommissionFeeEarned() external view returns (uint256 balanceAmount) {   //better to have a separate var called commissionFee
        // assumes that all ERC20 coins sent here are commission fees.       
        returns erc20Contract.balanceOf(address(this)); 
    }

    function addLiquidityEther(uint256 value) {    //user.transfer() ether value. payable
        amtEtherTotal = add(amtEtherTotal, value);
    }

    function addLiquidityERC20(uint256 value) { //mint the amount of erc20 in frontend
        amtErc20Total = add(amtErc20Total, value);
    }

    /**
     * TODO: Not very sure whether this should burn totalSupply, or take in ether / ERC type and burn only that particular token
     */
    function _burn(address from, uint256 value) internal {
        balanceOf[from] = sub(balanceOf[from], value);
        totalSupply = sub(totalSupply, value);
    }

    function getCurrentPrice() public view returns (uint256) {   //lets just use manual exchange rate first
        return amtEtherTotal / amtErc20Total;
    }

    function setExchangeRate(uint256 newExchangeRate) {
        exchangeRateEtherToErc = newExchangeRate;
    }

    event Sent(address from, address to, uint256 amount);

    function send(address receiver, uint256 amount) public {   //@rachel what is this function for ah?
        require(amount <= balances[owner], "Insufficient balance.");
        balances[owner] -= amount;
        balances[receiver] += amount;
        emit Sent(owner, receiver, amount);
    }

    function exchangeErc20ToEther(uint256 amtErc20In) {
        erc20Contract.approve(msg.sender, amtErc20In);      //approve(this.address, amt), this step might need to be frontend now i think about it
        erc20Contract.transferFrom(msg.sender, owner, amtErc20In);
        uint256 amtEtherOut = exchangeRateEtherToErc * amtErc20In * 0.997;
        owner.send(msg.sender, amtEtherOut);
        // add commission fee (amtEtherOut * 0.003)  //yes add the commission fee to a var
        //decrease total ERC20/ether
        uint256 currentPrice = getCurrentPrice(); //lets just use manual exchange rate first
        setExchangeRate(currentPrice);    
    }

    function exchangeEtherToErc20(uint256 amtEtherIn) {
        uint256 amtEtherInAfterFees = amtEtherIn * 0.997;
        // add commission fee (amtEtherIn * 0.003)   //yes add the commision fee to a var
        user.send(owner, amtEtherInAfterFees);
        erc20Contract.approve(owner, amtEtherInAfterFees);
        erc20Contract.transferFrom(owner, user, amtEtherInAfterFees);
        //decrease total ERC20/ether

        uint256 currentPrice = getCurrentPrice();  //lets just use manual exchange rate first
        setExchangeRate(currentPrice);
    }
}
