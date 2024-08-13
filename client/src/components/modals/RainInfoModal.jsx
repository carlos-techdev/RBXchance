import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import raininfopng from "../../assets/raininfo.PNG";

// Custom Styles
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
      maxWidth: "680px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: "60%",
        marginTop: "50px",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "60%",
        marginTop: "50px",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "60%",
        marginTop: "50px",
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
  raininfo: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
    alignItems: "center",
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
    },
    [theme.breakpoints.down("sm")]: {
      display: "inherit",
    },
    [theme.breakpoints.down("md")]: {
      display: "inherit",
    },
  },
  raininfoIMG: {
    zIndex: "1",
    borderRadius: "12px",
    transform: "scale(.8)",
    padding: "12px",
    backgroundColor: "#252c34",
  },
}));

const RainInfoModal = ({ open, handleClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      style={{ fontFamily: "Rubik", }}
      open={open}
    >
      <DialogTitle onClose={handleClose} className={classes.titlerubik} style={{ fontFamily: "Rubik", }}>
        <svg style={{ marginRight: "9px", marginBottom: "-2px", }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.6102 19.9999C17.9502 20.0099 19.2402 19.5099 20.2302 18.6099C23.5002 15.7499 21.7502 10.0099 17.4402 9.46995C15.9002 0.129949 2.43022 3.66995 5.62022 12.5599" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round" />
          <path d="M7.27986 12.9698C6.74986 12.6998 6.15986 12.5598 5.56986 12.5698C0.909864 12.8998 0.919864 19.6798 5.56986 20.0098" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.8198 9.88998C16.3398 9.62998 16.8998 9.48998 17.4798 9.47998" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.97022 20L7.97021 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.9702 20L11.9702 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.9702 16L11.9702 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.97022 16L7.97021 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg><span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Chat Rain</span>
      </DialogTitle>
      <DialogContent dividers>
        <Box className={classes.raininfo}>
          <p>Rains are given out randomly throughout the day by users, mods and admins to players that are active on the site and in chat.
            In order to join the random rain in chat you need to be signed in. The duration of each Rain is 2 minutes.</p>
          <img className={classes.raininfoIMG} src={raininfopng} alt=""></img>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RainInfoModal;
