import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
// import { claimCouponCode } from "../../services/api.service";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "27%",
      background: "#12171D",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "45px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "45px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "45px",
      },
    },
  },
  vipTitle: {
    fontFamily: "Rubik",
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".05em",
    marginTop: "30px",
    marginLeft: "20px",
    "& > a": {
      color: "#FFC440",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  titlerubik: {
    fontFamily: "Rubik",
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      "& > input": {},
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#5f6368",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#5f6368",
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
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#FFC440",
      color: "#ffffff",
      "&:hover": {
        background: "#FFC440",
      },
      "& .MuiButton-label": {},
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
}));

const SkinsBackDeposit = ({ open, handleClose, changeWallet, url }) => {
  // Declare State
  const classes = useStyles();

  const [iframeURL, setIframeURL] = useState("");

  useEffect(() => {
    if (url) {
      setIframeURL(url);
      //console.log(url);
    }
  }, [url]);

  // Button onClick event handler
  const onClick = () => {
    setTimeout(() => {
      window.open(iframeURL);
    }, 200)
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik" }}
      open={open}
    >
      <DialogTitle
        className={classes.titlerubik}
        onClose={handleClose}
        style={{ fontFamily: "Rubik" }}
      ><span style={{ fontFamily: "Rubik", fontWeight: "300" }}>
          Deposit via SkinsBack
        </span>
      </DialogTitle>
      <DialogContent dividers>
        Click continue to deposit CS:GO / RUST / DOTA2 items
        <br /><br />
        <Button
          autoFocus
          disableRipple
          onClick={onClick}
          className={classes.buttontest}
          style={{ background: "#FFC440", letterSpacing: "0em", }}
          color="primary"
        >
          CONTINUE
        </Button>
        <br />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleClose}
          className={classes.buttontest}
          color="primary"
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SkinsBackDeposit.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
};

export default connect(() => ({}), { changeWallet })(SkinsBackDeposit);