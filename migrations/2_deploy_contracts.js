const ERC20 = artifacts.require("ERC20");
const Exchange = artifacts.require("Exchange");

module.exports = async function(deployer, network, accounts) {
	let deployAccount = accounts[0];
    let erc20 = await deployer.deploy(ERC20, {from: deployAccount})
    await deployer.deploy(Exchange, ERC20.address, {from: deployAccount});

} 
