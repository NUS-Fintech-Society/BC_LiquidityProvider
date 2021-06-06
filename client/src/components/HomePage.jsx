import React from "react";
import ContractOwner from "./ContractOwner.jsx";
import Exchange from "./Exchange.jsx";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeRate: 0,
      owner:  false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount = async () => {
    const owner = await this.props.exchangeInstance.methods.getContractOwner().call();
    if (this.props.accounts[0] === owner) {
      this.setState({ owner: true });
    }
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
        <h4>
          Exchange rate: 1 ERC20 =
          {this.state.exchangeContract.getExchangeRate()} ether
        </h4>
        <h4>
          Total amount of ERC20 tokens:
          {this.state.exchangeContract.getTotalAmtERC20()}
        </h4>
        {this.state.owner ? (
        <ContractOwner
          web3={this.props.web3}
          accounts={this.props.accounts}
          exchangeContract={this.props.exchangeContract}
          erc20Contract={this.props.erc20Contract}
        />) : (<span></span>)}
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
