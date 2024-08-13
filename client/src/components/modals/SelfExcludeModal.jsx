import React, { useState } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: ".1em",
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      background: "#12171D",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: "70%",
        marginTop: "50px",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "70%",
        marginTop: "50px",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "70%",
        marginTop: "50px",
        margin: "15px",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#3a3f64",
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      background: "#141629",
    },
    "& .MuiFormHelperText-root.Mui-disabled": {
      color: "#4960ed",
    },
    "& b": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
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
  numbers: {
    color: "#9e9e9e",
    fontFamily: "Rubik",
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: ".1em",
  },
}));

const Field = withStyles({
  root: {
    width: "100%",
    marginBottom: 20,
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
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "1px solid #2f3947",
      },
      "&:hover fieldset": {
        border: "1px solid #2f3947",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #2f3947",
      },
    },
  },
})(TextField);

const Control = withStyles({
  root: {
    width: "100%",
    marginBottom: 20,
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
      borderBottomColor: "#5f6368",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#5f6368",
      },
      "&:hover fieldset": {
        borderColor: "#5f6368",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#5f6368",
      },
    },
  },
})(FormControl);

const SelfExcludeModal = ({ open, handleClose }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [hoursAmount, setHoursAmount] = useState("24");
  const [modeSelection, setModeSelection] = useState('');

  const handleChange = (event) => {
    setModeSelection(event.target.value);
  };


  const onChange = e => {
    setHoursAmount(e.target.value);
  };

  const applySelfExclude = () => {
    chatSocket.emit(
      "send-chat-message",
      `/selfexclude ${modeSelection} ${hoursAmount}`
    );
  };

  return (
    <Dialog
      className={classes.modal}
      style={{ fontFamily: "Rubik", height: "90%", }}
      onClose={handleClose}
      fullScreen={fullScreen}
      open={open}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
        <span style={{ fontFamily: "Rubik", color: "#4caf50", }}><b>Self Exclusion Lock</b></span>
      </DialogTitle>
      <DialogContent dividers>
        <p>Gamemode selection</p>
        <Control className={classes.control} fullWidth style={{ marginBottom: "40px" }}>
          <Select
            labelId="demo-simple-select-label"
            value={modeSelection}
            label="Gamemode selection"
            onChange={handleChange}
          >
            <MenuItem value={'All_Modes'}>All modes</MenuItem>
            <MenuItem value={'Jackpot'}>Jackpot</MenuItem>
            <MenuItem value={'Coinflip'}>Coinflip</MenuItem>
            <MenuItem value={'Crash'}>Crash</MenuItem>
            <MenuItem value={'Roulette'}>Roulette</MenuItem>
          </Select>
        </Control>
        <br />
        <Field
          className={classes.field}
          variant="outlined"
          label="Duration in hours"
          onChange={onChange}
          value={hoursAmount}
        />
        <Button
          style={{ fontFamily: "Rubik", background: "#d32f23", color: "#ffffff", }}
          variant="contained"
          onClick={applySelfExclude}
        >
          SELF-EXCLUDE
        </Button>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelfExcludeModal;
