import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import Container from "@material-ui/core/Container";

class Exchange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeRate: 0,
      owner: false,
      exchangeType: "etherToERC20",
      exchangeAmt: 0,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount = async () => {
    const owner = await this.props.exchangeContract.methods.getContractOwner().call();
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

  handleExchange = async (e) => {
    e.preventDefault();
    try {
      if (this.state.exchangeType === "etherToERC20") {
        //no need allowance function. contract send ERC20 straight to user
        await this.props.exchangeContract.methods
          .exchangeEtherToERC20(this.state.exchangeAmt)
          .send({ from: this.props.web3.currentProvider.selectedAddress, value: this.props.web3.utils.toWei(this.state.exchangeAmt, 'ether') })
          .on("receipt", (receipt) => {
            console.log(receipt);
            alert("Success. Please wait for reload");
            window.location.reload(false);
          })
          .on("error", (error) => {
            alert("Unsuccess with error message" + error.message);
            window.location.reload(false);
          });
      } else if (this.state.exchangeType === "erc20ToEther") {
        console.log(this.props.exchangeContract.networks["3"]["address"])
        //allowance function. user allow contract to send to contract. async.
        await this.props.erc20Contract.methods.approve(this.props.exchangeContract.address, this.state.exchangeAmt).send({ from: this.props.web3.currentProvider.selectedAddress });
        await this.props.exchangeContract.methods
          .exchangeERC20ToEther(this.state.exchangeAmt)
          .send({ from: this.props.web3.currentProvider.selectedAddress })
          .on("receipt", (receipt) => {
            console.log(receipt);
            alert("Success. Please wait for reload");
            window.location.reload(false);
          })
          .on("error", (error) => {
            alert("Unsuccess with error message" + error.message);
            window.location.reload(false);
          });
      }

    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const useStyles = makeStyles((theme) => ({
      paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
      submit: {
        margin: theme.spacing(3, 0, 2),
      },
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
    }));
    const style = useStyles;

    return (
      <div>
        <Container
          component="main"
          maxWidth="xs"
          style={{ marginTop: "30px", backgroundColor: "white" }}
        >
          <div className={style.paper}>
            <form
              className={style.form}
              noValidate
              onSubmit={this.handleExchange}
              style={{ marginTop: "30px" }}
            >
              <Grid item xs={12}>
                <FormControl className={style.formControl}>
                  <InputLabel id="exchangeType">ExchangeType</InputLabel>
                  <Select
                    labelId="exchangeTypeLabel"
                    id="selectExchangeType"
                    value={this.state.exchangeType}
                    onChange={this.handleInputChange}
                  >
                    <MenuItem value={"etherToERC20"}>EtherToERC20</MenuItem>
                    <MenuItem value={"erc20ToEther"}>ERC20ToEther (Note that you will be allowing the contract to send the erc20</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <br></br>
              <Grid item xs={12}>
                <TextField
                  name="exchangeAmt"
                  variant="outlined"
                  required
                  fullWidth
                  id="exchangeAmt"
                  value={this.state.exchangeAmt}
                  onChange={this.handleInputChange}
                  label="Amount of selected currency to exchange:"
                  autoFocus
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={style.submit}
                style={{ marginTop: "30px", marginBottom: "20px" }}
              >
                Submit
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}
export default Exchange;
