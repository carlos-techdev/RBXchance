import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@material-ui/core/Avatar";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      borderRadius: "0px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      background: "#12171D",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
      },
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  buttontesttt: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginLeft: "20px",
    marginTop: "10px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "0px",
    },
  },
  avatar: {
    width: 35,
    height: 35,
    marginTop: "15.5px",
    display: "flex",
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      "& > input": {
      },
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
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
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
      width: "7rem",
      background: "#1e72b6",
      color: "#e4e4e4",
      "&:hover": {
        background: "#1e72b6",
      },
      "& .MuiButton-label": {
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
  titlerubik: {
    fontFamily: "Rubik",
  }
}));

const TipModal = ({ open, userId, userName, userAvatar, handleClose }) => {
  const classes = useStyles();

  const [amountTip, setAmountTip] = useState("");

  const onChange = e => {
    setAmountTip(e.target.value);
  };

  const onClick = () => {
    chatSocket.emit(
      "send-chat-message",
      `/tip ${userId} ${amountTip}`
    );
    handleClose();
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "-2px", marginLeft: "13px", marginRight: "-3px", }}>
          <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#FFC440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M3.41016 22C3.41016 18.13 7.26015 15 12.0002 15C12.9602 15 13.8902 15.13 14.7602 15.37" stroke="#FFC440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M22 18C22 18.32 21.96 18.63 21.88 18.93C21.79 19.33 21.63 19.72 21.42 20.06C20.73 21.22 19.46 22 18 22C16.97 22 16.04 21.61 15.34 20.97C15.04 20.71 14.78 20.4 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.92 14.43 15.93 15.13 15.21C15.86 14.46 16.88 14 18 14C19.18 14 20.25 14.51 20.97 15.33C21.61 16.04 22 16.98 22 18Z" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M19.4897 17.98H16.5098" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M18 16.52V19.51" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg><span style={{ fontFamily: "Rubik", padding: "10px", fontWeight: "300", }}> Tip user</span>
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <Box className={classes.avatar}>
            <Avatar
              style={{ borderRadius: "50%", }}
              variant="rounded"
              src={userAvatar}
            />
            <span style={{ color: "#FFC440", marginLeft: "12px", marginTop: "11px", }}>{userName}</span>
          </Box>
          <br />
          ID: <span style={{ color: "rgb(104 117 128)", }}>{userId}</span><br />
          <br /><br />
          <TextField
            className="input"
            variant="outlined"
            label="$1.00 - $100.00"
            onChange={onChange}
            value={amountTip}
          />
          <Button
            className={classes.buttontesttt}
            style={{ fontFamily: "Rubik", }}
            variant="contained"
            onClick={onClick}
          >
            SEND
          </Button><br />
        </Box><br />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TipModal;
