import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Exchange from "./contracts/Exchange.json";
import ERC20 from "./contracts/ERC20.json";
import getWeb3 from "./getWeb3";
import HomePage from './components/HomePage'

import ErrorPage from "./components/ErrorPage";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetworkExchange = Exchange.networks[networkId];

      const exchangeInstance = new web3.eth.Contract(
        Exchange.abi,
        deployedNetworkExchange && deployedNetworkExchange.address
      );

      const deployedNetworkERC20 = ERC20.networks[networkId];
      const erc20Instance = new web3.eth.Contract(
        ERC20.abi,
        deployedNetworkERC20 && deployedNetworkERC20.address
      );

      console.log("Web3: " , web3)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        exchangeContract: exchangeInstance,
        erc20Contract: erc20Instance,
        // addressType: addressType,
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contracts. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        {!this.state.web3 || this.state.isError === true ? (
          <ErrorPage />
        ) : (
          <HomePage web3={this.state.web3}
          accounts={this.state.accounts}
          exchangeContract={this.state.exchangeContract}
          erc20Contract={this.state.erc20Contract}/>
        )}
      </div>
    );
  }
}

export default App;
