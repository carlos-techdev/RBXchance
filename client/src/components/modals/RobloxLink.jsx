import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

// service import
import { checkPhrase } from "../../services/api.service.js";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
    },
    "& .MuiDialog-paperWidthSm": {
      width: "60%",
      background: "#12171D", //#12171D
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#3a3f64",
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      background: "#12171D",
    },
    "& .MuiFormHelperText-root.Mui-disabled": {
      color: "#4960ed",
    },
  },
  cryptos: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      margin: "0 14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      marginRight: "14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(4)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      marginRight: "14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(5)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      "& img": {
        width: "7rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
  },
  crypto: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "3rem",
      padding: "0",
      minWidth: 0,
    },
    "&:hover": {
      transform: "scale(1.06)",
      transition: "400ms all",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  ferzBz: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    gap: "16px",
  },
  bHNrGF: {
    width: "150px",
    height: "54px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "row",
    borderRadius: "3px",
    backgroundColor: "#0D1116",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      width: "140px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "140px",
    },
    [theme.breakpoints.down("md")]: {
      width: "140px",
    },
  },
  iconHold: {
    width: "64px",
    height: "54px",
    display: "flex",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    backgroundColor: "rgb(24 29 36)",
    borderRadius: "2px 0px 0px 2px",
    marginDottom: "8px",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s",
  },
  info: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    WebkitBoxPack: "center",
    justifyContent: "center",
    WebkitBoxAlign: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: 300,
  },
  title: {
    color: "rgb(255, 255, 255)",
  },
  BoxAll: {
    padding: "0.5rem",
    display: "grid",
    gap: "0.75rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(calc(100% - .75rem), 1fr))",
    [theme.breakpoints.down("xs")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0rem",
    },
  },
  link: {
    width: "-webkit-fit-content",
    width: "-moz-fit-content",
    width: "fit-content",
    background: "#0D1116",
    borderRadius: "4px",
    padding: "1rem 1.75rem",
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    textAlign: "left",
    marginLeft: "auto",
    cursor: "pointer",
    fontFamily: "Rubik",
  },
  linkText: {
    color: "rgba(239,250,251,.5)",
    gridRow: 1,
    gridColumn: 1,
    fontSize: ".9rem",
    marginRight: "30px",
  },
  linkSvg: {
    gridRow: 1,
    gridColumn: 1,
    margin: "auto 0",
    marginLeft: "auto",
    height: "20px !important",
    width: "20px !important"
  },
  inputContainer: {
    display: "flex",
    alignItems: "flex-end",
    margin: 0,
    padding: 0,
    border: 0,
    fontSize: "100%",
    font: "inherit",
    verticalAlign: "baseline",
    boxSizing: "border-box",
  },
  imgContainer: {
    width: "60px",
    minWidth: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFC440",
    borderRadius: "6px",
    marginRight: "15px",
  },
  userInputContainer: {
    width: "100%",
    width: "600px",
    position: "relative",
  },
  userInputContainer2: {
    width: "100%",
    borderRadius: "6px",
    position: "relative",
  },
  nameInput: {
    height: "60px",
    background: "0 0",
    width: "100%",
    borderRadius: "6px",
    outline: 0,
    border: 0,
    paddingLeft: "18px",
    paddingRight: "36px",
    fontWeight: 500,
    fontSize: "20px",
    color: "#fff",
    border: "3px dashed #FFC440",
  },
}));

const RobloxLink = ({ open, handleClose, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const openn = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    window.location.reload();
  }


  const copyLinkAction = () => {
    const phrase = user?.mnemonicPhrase;
    navigator.clipboard.writeText(phrase)
      .then(() => {
        addToast("Successfully copied phrase!", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy phrase.", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
  };

  const handleInputChange = event => {
    setUsername(event.target.value);
  };

  const verifyUsername = async () => {
    try {
      const res = await checkPhrase(username, user._id);
      console.log(res)

      if(res?.taken) { 
        addToast(
          "Another user has already linked this roblox account!",
          { appearance: "error" }
        );
      }

      if(res?.mnemonicPhrase) {
        addToast(
          "The phrase does not match/exisit on the roblox account!",
          { appearance: "error" }
        );
      }

      if(res?.success) window.location.reload();
    } catch(error) {
      addToast(
        "There was an error while verifying your roblox account. Please try again!",
        { appearance: "error" }
      );
    }
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
        <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Please add the following phrase to your Roblox description page:</span>
      </DialogTitle>
      <DialogContent className={classes.cryptos} dividers>
        <Box
          open={openn}
          onClose={() => setAnchorEl(null)}
          display="flex"
          className={classes.BoxAll}
        >
          <div className={classes.link} onClick={() => copyLinkAction()}>
            <span className={classes.linkText}>{user?.mnemonicPhrase}</span>
            <svg className={classes.linkSvg} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" fill="currentColor"><g><path d="M789.3,696.6V109.4C789.3,55.9,742.4,9,688.9,9H110.4C56.8,9,10,55.9,10,109.4v587.2c0,53.5,46.8,100.4,100.4,100.4h578.5C742.4,796.9,789.3,750.1,789.3,696.6z M76.9,696.6V109.4c0-20.1,13.4-33.5,33.5-33.5h578.5c20.1,0,33.5,13.4,33.5,33.5v587.2c0,20.1-13.4,33.5-33.5,33.5H110.4C90.3,730,76.9,716.7,76.9,696.6z"></path><path d="M889.6,209.7c-20.1,0-33.5,13.4-33.5,33.5c0,20.1,13.4,33.5,33.5,33.5c20.1,0,33.5,13.4,33.5,33.5v580.5c0,20.1-13.4,33.5-33.5,33.5H311.1c-20.1,0-33.5-6.7-33.5-26.8c0-20.1-13.4-33.5-33.5-33.5c-20.1,0-33.5,13.4-33.5,33.5c0,53.5,46.8,93.7,100.4,93.7h578.5c53.5,0,100.4-46.8,100.4-100.4V310.1C990,256.6,943.2,209.7,889.6,209.7z"></path></g></svg>
          </div>
          <div className={classes.inputContainer}>
            <div className={classes.userInputContainer}>
              <div className={classes.userInputContainer2}>
                <input
                  className={classes.nameInput}
                  type="text"
                  placeholder="Roblox Nickname"
                  value={username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
      <Button
          onClick={() => handleLogout()}
          className={classes.buttontest}
          color="primary"
        >
          LOGOUT
        </Button>
        <Button
          onClick={() => verifyUsername()}
          className={classes.buttontest}
          color="primary"
        >
          VERIFY ACCOUNT
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const mapStateToProps = state => ({
  logout: PropTypes.func.isRequired,
});


export default connect(mapStateToProps, { logout })(RobloxLink);