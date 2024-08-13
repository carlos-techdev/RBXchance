import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { unlinkRobloxUsername, makeWithdraw } from "../../services/api.service";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 300,
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      background: "#12171D",
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
      minWidth: 0,
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#e38b08",
      borderRadius: "6px",
      "& img": {
        width: "5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#3f51b5",
      borderRadius: "6px",
      margin: "0 10px",
      "& img": {
        width: "5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#e3e3e3",
      borderRadius: "6px",
      "& img": {
        width: "5rem",
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
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 300,
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
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(calc(100% - 1rem), 1fr))",
    [theme.breakpoints.down("xs")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0rem",
    },
  },  inputContainer: {
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
    background: "#8349FF",
    borderRadius: "6px",
    marginRight: "15px",
  },
  userInputContainer: {
    width: "100%",
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
    border: "3px dashed #8349FF",
  },
}));

const Market = ({ user, open, handleClose, items, type }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [username, setUsername] = useState("");
  const [sent, setSent] = useState(false);
  const [privLink, setPrivlink] = useState("");
  const [botUsername, setBotusername] = useState("");


  const sendWithdraw = async () => {
    setSent(true);
      try {
        const res = await makeWithdraw(user?.robloxUsername, user._id, localStorage.getItem('token'), items, type);

        if(res.error) throw res.reason;

        setPrivlink(res.link);
        setBotusername(res.botName);
        setSent(true)
      } catch (error) {
        addToast("There was an error creating withdraw: " + error, { appearance: "error" });
        setSent(false)
      }
  }

  const handleInputChange = event => {
    setUsername(event.target.value);
  };

  const closePopup = () => {
    setSent(false);
    handleClose();
  }

  const changeUser = async () => {
    try {
      const res = await unlinkRobloxUsername(user?.username, user._id);

      if(res?.success) {
        addToast(
          "Successfuly removed roblox link!",
          { appearance: "success" }
        )
        window.location.reload();
      }
    } catch (error) {
      addToast(
        "Failed to remove roblox link! " + error,
        { appearance: "error" }
      )
      console.log(error);
    }
  }


  return (
    <Dialog
      className={classes.modal}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle className={classes.titlerubik} style={{ fontFamily: "Rubik", }}>
        <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>{!sent ? "Withdraw Confirmation" : "Withdraw Confirmed"}</span>
      </DialogTitle>
      <DialogContent className={classes.cryptos} dividers>
        <Box display="flex" className={classes.BoxAll}>
          {sent ? (
            <div style={{textAlign: "center"}}>
              <div className={classes.depositContainer}>
                <h1 className={classes.titleNick}>Bot Name: <span style={{color:"#FFC440"}}>{botUsername}</span></h1>
                <h3 className={classes.description}><a style={{ textDecoration: "none" }} href={privLink} target="_blank" rel="noreferrer"><span style={{color:"#FFC440",cursor:"pointer"}}>Click here</span></a> to join private server.</h3>  
              </div>
            </div>
          ) : (
            <div style={{textAlign: "center"}}>
              <span style={{marginBottom: "0.5rem"}}>Current roblox account link: <a style={{color:"#FFC440"}} href={"https://www.roblox.com/users/profile?username=" + user?.robloxUsername} target="_blank" rel="noreferrer">{user?.robloxUsername}</a>. You must withdraw to this account. </span><br /><span style={{cursor: "pointer", color: "#FFC440"}} onClick={() => changeUser()}>Click here</span> to remove the link to this account!
            </div>
          )}

        </Box>
      </DialogContent>
      <DialogActions>
        {!sent ? (
          <Button
            onClick={() => sendWithdraw()}
            className={classes.buttontest}
            color="primary"
          >
            Continue Withdraw
          </Button>
        ): ""}

        <Button
          autoFocus
          onClick={() => closePopup()}
          className={classes.buttontest}
          color="primary"
        >
          {!sent ? "Cancel Withdraw" : "CLOSE"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Market.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Market);