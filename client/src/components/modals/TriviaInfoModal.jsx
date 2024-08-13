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

import triviainfopng from "../../assets/triviainfo.png";

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
  triviainfo: {
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
  triviainfoIMG: {
    zIndex: "1",
    borderRadius: "12px",
    transform: "scale(.8)",
    padding: "12px",
    backgroundColor: "#252c34",
  },
}));

const TriviaInfoModal = ({ open, handleClose }) => {
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: "-2px", marginRight: "7px", }}>
          <path d="M18.97 22H4.96997C1.96997 22 1.96997 20.65 1.96997 19V18C1.96997 17.45 2.41997 17 2.96997 17H20.97C21.52 17 21.97 17.45 21.97 18V19C21.97 20.65 21.97 22 18.97 22Z" stroke="#FFC440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M20.72 13V17H3.27002V13C3.27002 9.16 5.98002 5.95 9.59002 5.18C10.13 5.06 10.69 5 11.27 5H12.72C13.3 5 13.87 5.06 14.41 5.18C18.02 5.96 20.72 9.16 20.72 13Z" stroke="#FFC440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M14.5 4.5C14.5 4.74 14.47 4.96 14.41 5.18C13.87 5.06 13.3 5 12.72 5H11.27C10.69 5 10.13 5.06 9.59 5.18C9.53 4.96 9.5 4.74 9.5 4.5C9.5 3.12 10.62 2 12 2C13.38 2 14.5 3.12 14.5 4.5Z" stroke="#FFC440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          <path d="M15 11H9" stroke="#FFC440" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg><span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Trivia</span>
      </DialogTitle>
      <DialogContent dividers>
        <Box className={classes.triviainfo}>
          <p>Trivias are short, time-limited questionnaires that appear in chat. They contain general knowledge questions and a list of possible (correct and incorrect) answers. The first users who manage to answer the trivia correctly will receive a reward specified on the trivia.
            Trivias are made by staff members and appear randomly throughout the day.</p>
          <img className={classes.triviainfoIMG} src={triviainfopng} alt=""></img>
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

export default TriviaInfoModal;
