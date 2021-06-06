pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./ERC20.sol";

contract Exchange {
    address payable owner = payable(msg.sender);
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
    mapping(address => uint) public balanceOf;
    uint256 commissionFee = 0 ether;

    constructor(
        ERC20 erc20Address
        //uint256 amtErc20,
        //address ownerAddress //no need
    ) {
        erc20Contract = erc20Address;
        //owner = ownerAddress;
        //erc20contract.transfer(owner, amtErc20); //no need. add the mint() function to erc20.
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

    function getContractOwner() external view returns (address owner) {
        return owner;
    }

    function getTotalAmtEther() external view returns (uint256 balanceAmt) {
        return amtEtherTotal;
    }

    function getTotalAmtERC20() external view returns (uint256 balanceAmt) {
        return amtErc20Total;
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

    function addLiquidityEther(uint256 value) public payable {
        owner.transfer(value);
        amtEtherTotal = SafeMath.add(amtEtherTotal, value);
    }

    function addLiquidityERC20(uint256 value) public {
        //mint the amount of erc20 in frontend
        amtErc20Total = SafeMath.add(amtErc20Total, value);
    }

    // Only ERC20 contract owner can burn
    function burn(uint256 amount) public
        returns (uint256 amountEther, uint256 amountErc20)
    {
        // Call the ERC20 _burn() contract too
        balanceOf[owner] = SafeMath.sub(balanceOf[owner], amount);
        totalSupply = SafeMath.sub(totalSupply, amount);
        erc20Contract.burn(owner, amount);
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
