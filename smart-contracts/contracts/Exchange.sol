pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ERC20Improved.sol";

contract Exchange {
    using SafeMath for uint256;

    address payable owner = payable(msg.sender);
    ERC20Improved erc20Contract;
    enum TransactionTypes {EtherToErc, ErcToEther}

    // Make use of SafeMath to do calculation that will not be result in overflow / incorrectness
    using SafeMath for uint256;

    uint256 amtEtherTotal = 0 ether;
    uint256 amtErc20Total = 0 ether;
    // TODO: Change this arbitrary value to something that makes more sense
    uint256 exchangeRateEtherToErc = 0.5 ether;

    // TODO: This variable might not be needed depending on the behaviour of _burn() function
    uint256 public totalSupply;
    mapping(address => uint) public balanceOf;
    uint256 commissionFee = 0 ether;

    constructor(
        ERC20Improved erc20Improved
    ) {
        erc20Contract = erc20Improved;
    }

    struct Transaction {
        address user;
        TransactionTypes transactionType;
        uint256 transactionRate;
        uint256 amtEther;
        uint256 amtErc;
        uint256 date;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function getContractOwner() external view returns (address) {
        return owner;
    }

    function getTotalAmtEther() external view returns (uint256 balanceAmt) {
        return amtEtherTotal;
    }

    function getTotalAmtERC20() external view returns (uint256 balanceAmt) {
        return amtErc20Total;
    }
    
    function checkERC20Balance(address addr) external view returns (uint256 balanceERC20) {
        return erc20Contract.balanceOf(addr);
    }
    
    function getExchangeRate() external view returns (uint256 exchangeRate) {
        return exchangeRateEtherToErc;
    }

    function getCommissionFeeEarned()
        external
        view
        returns (uint256 balanceAmount)
    {
        return commissionFee;
    }

    //transferCommisionFee()   @bharath    
    function transferCommisionFeeEarned() external onlyOwner {
        owner.transfer(commissionFee);
    }

    function addLiquidityEther(uint256 value) external payable {
        //user.transfer() ether value. payable
        owner.transfer(value);
        amtEtherTotal = amtEtherTotal.add(value);
    }

    function addLiquidityERC20(uint256 value) external payable {
        //mint the amount of erc20 in frontend
        amtErc20Total = amtErc20Total.add(value);
    }

    // Only ERC20 contract owner can burn
    function burn(uint256 amount) public payable {
        // Call the ERC20 _burn() contract too
        balanceOf[owner] = balanceOf[owner].sub(amount);
        totalSupply = totalSupply.sub(amount);
        erc20Contract.burn(owner, amount); // ERC20 standard may not support burning tho?
    }

    /*function getCurrentPrice() public view returns (uint256) {   //lets just use manual exchange rate first
        return amtEtherTotal / amtErc20Total;
    }*/

    function setExchangeRate(uint256 newExchangeRate) public onlyOwner {
        exchangeRateEtherToErc = newExchangeRate;
    }

    function exchangeErc20ToEther(uint256 amtErc20In) public payable {
        //erc20Contract.approve(msg.sender, amtErc20In);      //approve(this.address, amt), this step might need to be frontend now i think about it
        erc20Contract.transferFrom(msg.sender, owner, amtErc20In);
        uint256 amtEtherOut = SafeMath.mul(exchangeRateEtherToErc * amtErc20In, SafeMath.div(997, 1000));
        payable(msg.sender).transfer(amtEtherOut);
        amtEtherTotal = amtEtherTotal - amtEtherOut;
        amtErc20Total = amtErc20Total + amtErc20In;
        commissionFee =
            commissionFee +
            SafeMath.mul(exchangeRateEtherToErc * amtErc20In, SafeMath.div(3, 1000));
    }

    function exchangeEtherToErc20(uint256 amtEtherIn) public payable {
        require(msg.value == amtEtherIn);
        uint256 amtEtherInAfterFees = SafeMath.mul(amtEtherIn, SafeMath.div(997, 1000));
        owner.transfer(amtEtherInAfterFees);
        erc20Contract.transfer(
            msg.sender,
            amtEtherInAfterFees / exchangeRateEtherToErc
        );
        amtEtherTotal = amtEtherTotal + amtEtherInAfterFees;
        amtErc20Total =
            amtErc20Total -
            amtEtherInAfterFees /
            exchangeRateEtherToErc;
        commissionFee = commissionFee + SafeMath.mul(amtEtherIn, SafeMath.div(3, 1000));
    }
}
