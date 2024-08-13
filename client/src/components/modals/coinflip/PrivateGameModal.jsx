import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import PropTypes from "prop-types";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
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
  vipTitle: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#507afd",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "15px",
    fontWeight: 500,
    letterSpacing: ".1em",
    textAlign: "center",
    margin: "2rem auto",
    "& > a": {
      color: "#e4e4e4",
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
      "& > input": {
      },
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#fff",
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
      background: "#273a4f",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "&:hover": {
        background: "#273a4f",
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
}));

const PrivateGameModal = ({ open, handleClose, link }) => {
  // Declare State
  const classes = useStyles();
  const [copied, setCopied] = useState(false);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", }}>
        <span style={{ fontFamily: "Rubik", }}><span style={{ fontWeight: "300", }}></span>Private Game</span>
      </DialogTitle>
      <DialogContent dividers>
        <Box position="relative" className={classes.progressbox}>
          <TextField
            className="input"
            variant="outlined"
            label="Invite Link"
            inputProps={{ readOnly: false, "aria-readonly": false }}
            value={link || ""}
          />
          <CopyToClipboard text={link || ""} onCopy={() => setCopied(true)}>
            <Button className="saveBtn" variant="contained">
              {copied ? "Copied!" : "Copy"}
            </Button>
          </CopyToClipboard>
        </Box>
        <h4 className={classes.vipDesc}>
          You've created private Coinflip game, it will not be listed in the public
          games list. Share this link to people you want to invite!
        </h4>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PrivateGameModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  link: PropTypes.string,
};

export default PrivateGameModal;
