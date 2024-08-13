import React from "react";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../services/api.service";

// MUI Components
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogContent from "@material-ui/core/DialogContent";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

// Custom Styles
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
      width: "50%",
      background: "#12171D",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: "31%",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "31%",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "31%",
        margin: "15px",
      },
    },
  },
  captcha: {
    padding: "0 2rem",
  },
  loader: {
    width: "304px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
}));

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd !important",
  },
})(CircularProgress);

const AdditionalVerification = ({ open, handleClose, onChange, loading }) => {
  // Declare State
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      fullScreen={fullScreen}
      open={open}
      style={{ fontFamily: "Rubik", }}
    >
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
        <span style={{ fontFamily: "Rubik", }}><span style={{ fontWeight: "300", marginRight: "10px", color: "#4caf50", }}><VerifiedUserIcon style={{ marginBottom: "-3.4px", }} /></span>Join Game</span>
      </DialogTitle>
      {loading ? (
        <DialogContent>
          <Box className={classes.loader}>
            <ColorCircularProgress />
          </Box>
        </DialogContent>
      ) : (
        <Box>
          <p style={{ marginLeft: "35px", fontWeight: "100", }}>Please verify captcha before joining.</p>
          <ReCAPTCHA
            className={classes.captcha}
            onChange={onChange}
            sitekey={RECAPTCHA_SITE_KEY}
          />
          <br />
        </Box>
      )}
      <DialogActions>
        {!loading && (
          <Button autoFocus onClick={handleClose} className={classes.buttontest} color="primary">
            CLOSE
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AdditionalVerification;
