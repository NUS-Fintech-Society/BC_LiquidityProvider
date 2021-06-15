import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from "@material-ui/core/Container";

class ContractOwner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exchangeRate: 0,
      addEtherAmt: 0,
      addERC20Amt: 0,
      commissionFeeEarned: 0,
      burnERC20: 0,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount = async () => {
    const exchangeRate = await this.props.exchangeContract.methods
      .getExchangeRate()
      .call();
    this.setState({ exchangeRate: exchangeRate });
    const commissionFeeEarned = await this.props.exchangeContract.methods
      .getCommissionFeeEarned()
      .call();
    this.setState({ commissionFeeEarned: commissionFeeEarned });
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  handleSetExchangeRate = (e) => {
    e.preventDefault();
    try {
      this.props.exchangeContract.methods
        .setExchangeRate(this.state.exchangeRate)
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
    } catch (err) {
      console.log(err);
    }
  };

  handleAddEtherToPool = (e) => {
    e.preventDefault();
    try {
      this.props.exchangeContract.methods
        .addLiquidityEther(this.state.addEtherAmt)
        .send({
          from: this.props.web3.currentProvider.selectedAddress,
          value: this.props.web3.utils.toWei(this.state.addEtherAmt, "ether"),
        })
        .on("receipt", (receipt) => {
          console.log(receipt);
          alert("Success. Please wait for reload");
          window.location.reload(false);
        })
        .on("error", (error) => {
          alert("Unsuccess with error message" + error.message);
          window.location.reload(false);
        });
    } catch (err) {
      console.log(err);
    }
  };

  handleAddERC20ToPool = async (e) => {
    //add mint function. async.
    e.preventDefault();
    try {
      await this.props.erc20Contract.methods
        .mint(this.props.exchangeContract.address, this.state.addERC20Amt)
        .send({ from: this.props.web3.currentProvider.selectedAddress });
      await this.props.exchangeContract.methods
        .addLiquidityERC20(this.state.addERC20Amt)
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
    } catch (err) {
      console.log(err);
    }
  };

  handleReturnCommissionFee = (e) => {
    e.preventDefault();
    try {
      this.props.exchangeContract.methods
        .transferCommisionFeeEarned()
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
    } catch (err) {
      console.log(err);
    }
  };

  handleBurnERC20 = (e) => {
    e.preventDefault();
    try {
      this.props.exchangeContract.methods
        .burn(this.state.burnERC20)
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
    }));
    const style = useStyles;

    return (
      <div>
        <p> Commission Fee Earned in Total: {this.state.commissionFee}</p>
        <Container
          component="main"
          maxWidth="xs"
          style={{ marginTop: "30px", backgroundColor: "white" }}
        >
          <div className={style.paper}>
            <form
              className={style.form}
              noValidate
              onSubmit={this.handleSetExchangeRate}
              style={{ marginTop: "30px" }}
            >
              <Grid item xs={12}>
                <TextField
                  name="exchangeRate"
                  variant="outlined"
                  required
                  fullWidth
                  id="exchangeRate"
                  value={this.state.exchangeRate}
                  onChange={this.handleInputChange}
                  label="Exchange Rate of 1 ERC20 = ___ ether"
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
          <div className={style.paper}>
            <form
              className={style.form}
              noValidate
              onSubmit={this.handleAddEtherToPool}
              style={{ marginTop: "30px" }}
            >
              <Grid item xs={12}>
                <TextField
                  name="addEther"
                  variant="outlined"
                  required
                  fullWidth
                  id="addEther"
                  value={this.state.addEtherAmt}
                  onChange={this.handleInputChange}
                  label="Add ___ Ether to Pool:"
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
          <div className={style.paper}>
            <form
              className={style.form}
              noValidate
              onSubmit={this.handleAddERC20ToPool}
              style={{ marginTop: "30px" }}
            >
              <Grid item xs={12}>
                <TextField
                  name="addERC20"
                  variant="outlined"
                  required
                  fullWidth
                  id="addERC20"
                  value={this.state.addERC20Amt}
                  onChange={this.handleInputChange}
                  label="Add ___ ERC20 to pool:"
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
          <div className={style.paper}>

            <form
              className={style.form}
              noValidate
              onSubmit={this.handleBurnERC20}
              style={{ marginTop: "30px" }}
            >
              <Grid item xs={12}>
                <TextField
                  name="burnERC20"
                  variant="outlined"
                  required
                  fullWidth
                  id="burnERC20"
                  value={this.state.burnERC20}
                  onChange={this.handleInputChange}
                  label="Burn ___ ERC20:"
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
                Burn
              </Button>
            </form>
          </div>
          <div className={style.paper}>

            <form
              className={style.form}
              noValidate
              onSubmit={this.handleReturnCommissionFee}
              style={{ marginTop: "30px" }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={style.submit}
                style={{ marginTop: "30px", marginBottom: "20px" }}
              >
                Return Commission Fee
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}
export default ContractOwner;
