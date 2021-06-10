const ERC20Improved = artifacts.require("ERC20Improved");
const Exchange = artifacts.require("Exchange");

module.exports = async function (deployer, network, accounts) {
  let deployAccount = accounts[0];
  let erc20 = await deployer.deploy(ERC20Improved, "NAME1", "SYMBOL1", {
    from: deployAccount,
  });
  await deployer.deploy(Exchange, ERC20Improved.address, {
    from: deployAccount,
  });
};