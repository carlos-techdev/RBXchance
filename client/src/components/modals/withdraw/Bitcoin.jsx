import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { withdrawCrypto } from "../../../services/api.service";
import PropTypes from "prop-types";
import { changeWallet } from "../../../actions/auth";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import error from "../../../assets/error.wav";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: "2rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 10,
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
    height: "10rem",
    justifyContent: "space-around",
    marginTop: "25px",
    color: "#cfcfd0",
    "& > div": {
      "& label": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#e4e4e4",
      },
      "& .MuiInput-underline:after": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
        "&:hover fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
      },
      "& > div > input": {
        color: "#cfcfd0",
      },
    },
    "& > div > div": {
      background: "#0D1116 !important",
      color: "#cfcfd0",
    },
  },
  value: {
    position: "relative",
    width: "100%",
    color: "#cfcfd0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      color: "#cfcfd0",
    },
    "& > div": {
      width: "100%",
      color: "#cfcfd0",
      "& > div": {
        background: "#0D1116 !important",
        color: "#cfcfd0",
      },
      "& > div > input": {
        color: "#cfcfd0",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      backgroundColor: "#2f3947 !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  Depvalue: {
    position: "relative",
    width: "75%",
    color: "#cfcfd0",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      color: "#cfcfd0",
    },
    "& > div": {
      width: "100%",
      "& > div": {
        background: "#0D1116 !important",
        color: "#cfcfd0",
      },
      "& > div > input": {
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "#cfcfd0",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      backgroundColor: "#1d76bd !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  withdraw: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "#FFC440 !important",
    width: "100%",
    marginTop: "1rem",
    height: "3rem",
  },
  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    display: "flex",
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
    },
  },
  cryptocolor: {
    color: "#f8931a",
  },
}));

const Bitcoin = ({ user, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [withdrawing, setWithdrawing] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // TextField onChange event handler
  const addressOnChange = e => {
    setAddress(e.target.value);
  };

  // TextField onChange event handler
  const amountOnChange = e => {
    setAmount(e.target.value);
  };

  // Button onClick event handler
  const onClick = async () => {
    setWithdrawing(true);
    try {
      const response = await withdrawCrypto("BTC", address, parseFloat(amount));

      // Update state
      setWithdrawing(false);
      changeWallet({ amount: -Math.abs(response.siteValue) });

      // Check transaction status
      if (response.state === 1) {
        addToast(
          `Successfully withdrawed ${response.siteValue.toFixed(
            2
          )} credits for ${response.cryptoValue.toFixed(
            8
          )} Bitcoin! Your withdrawal should manual confirm within a few minutes!`,
          { appearance: "success" }
        );
      } else {
        addToast(
          `Successfully withdrawed ${response.siteValue.toFixed(
            2
          )} credits for Bitcoin! Your withdrawal should manual confirm within a few minutes!`,
          { appearance: "success" }
        );
      }
    } catch (error) {
      setWithdrawing(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log("There was an error while withdrawing crypto:", error);
        addToast(
          "There was an error while requesting this withdrawal. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.cryptocolor}>
          Withdraw your desired amount of Bitcoin (BTC).
          <br /><br />
          You will be credited after 8 confirmations.
          <br />
          <br />
          Minimum withdraw amount is <span style={{ color: "#FFC440", }}>$5.00</span>
        </Box>
        <Box className={classes.inputs}>
          <TextField
            label="YOUR BITCOIN ADDRESS"
            variant="outlined"
            value={address}
            onChange={addressOnChange}
          />
          <Box className={classes.value}>
            <TextField
              label="MIN. $5.00"
              variant="outlined"
              value={amount}
              onChange={amountOnChange}
            />
            <Button style={{ border: "0px solid #272c2e", }} onClick={() => setAmount(user ? user.wallet : 0)}>
              MAX
            </Button>
          </Box>
        </Box>
        <Button
          style={{ border: "0px solid #272c2e", }}
          className={classes.withdraw}
          onClick={onClick}
          disabled={withdrawing}
        >
          {withdrawing ? "WITHDRAWING..." : "REQUEST WITHDRAWAL"}
        </Button>
      </Fragment>
    </Box>
  );
};

Bitcoin.propTypes = {
  user: PropTypes.object,
  changeWallet: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Bitcoin);
