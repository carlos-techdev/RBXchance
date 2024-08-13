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

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      borderRadius: "0px",
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
    fontWeight: 300,
  },
  buttontesttt: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 300,
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
        fontWeight: 300,
      },
      "& label.Mui-focused": {
        color: "#5f6368",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 300,
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

const CreateRainModal = ({ open, handleClose }) => {
  const classes = useStyles();

  const [amount, setAmount] = useState("");

  const onChange = e => {
    setAmount(e.target.value);
  };

  const onClick = () => {
    chatSocket.emit(
      "send-chat-message",
      `.create-rain ${amount}`
    );
    setAmount("");
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
        <svg style={{ marginLeft: "10px", marginBottom: "-2px", }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6102 19.9999C17.9502 20.0099 19.2402 19.5099 20.2302 18.6099C23.5002 15.7499 21.7502 10.0099 17.4402 9.46995C15.9002 0.129949 2.43022 3.66995 5.62022 12.5599" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round" />
          <path d="M7.27986 12.9698C6.74986 12.6998 6.15986 12.5598 5.56986 12.5698C0.909864 12.8998 0.919864 19.6798 5.56986 20.0098" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.8198 9.88998C16.3398 9.62998 16.8998 9.48998 17.4798 9.47998" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.97022 20L7.97021 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.9702 20L11.9702 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.9702 16L11.9702 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.97022 16L7.97021 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg><span style={{ fontFamily: "Rubik", padding: "10px", fontWeight: "300", }}> Create Rain</span>
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <p>Amount will be divided evenly for those who have joined. If there is already an existing rain, your amount will be added to the current pot.</p>
          <br />
          <TextField
            className="input"
            variant="outlined"
            label="Min. $1.00"
            onChange={onChange}
            value={amount}
          />
          <Button
            className={classes.buttontesttt}
            style={{ fontFamily: "Rubik", }}
            variant="contained"
            onClick={onClick}
          >
            Create Rain
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

export default CreateRainModal;
