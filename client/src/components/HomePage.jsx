import React from "react";
import ContractOwner from "./ContractOwner.jsx";
import Exchange from "./Exchange.jsx";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeRate: 0,
      totalAmtERC20: 0,
      owner: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount = async () => {
    const owner = await this.props.exchangeContract.methods
      .getContractOwner()
      .call();
    if (this.props.accounts[0] === owner) {
      console.log("owner");
      this.setState({ owner: true });
    }
    const totalAmtERC20 = await this.props.exchangeContract.methods.getTotalAmtERC20().call();
    this.setState({ totalAmtERC20: totalAmtERC20 })

    const exchangeRate = await this.props.exchangeContract.methods
      .getExchangeRate()
      .call();
    this.setState({ exchangeRate: exchangeRate });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <h1>Hi. Description....</h1>
        <p>Exchange rate: 1 ERC20 = {this.state.exchangeRate} ether</p>
        <p>
          Total amount of ERC20 tokens: {this.state.totalAmtERC20}
        </p>
        {this.state.owner ? (
          <ContractOwner
            web3={this.props.web3}
            accounts={this.props.accounts}
            exchangeContract={this.props.exchangeContract}
            erc20Contract={this.props.erc20Contract}
          />
        ) : (
          <span></span>
        )}
        <Exchange
          web3={this.props.web3}
          accounts={this.props.accounts}
          exchangeContract={this.props.exchangeContract}
          erc20Contract={this.props.erc20Contract}
        />
      </div>
    );
  }
}
export default HomePage;
