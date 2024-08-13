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

import Kappa from "../../assets/emoji/kappa.png";
import Kek from "../../assets/emoji/kek.png";
import Stonks from "../../assets/emoji/stonks.png";
import Yes from "../../assets/emoji/yes.png";
import No from "../../assets/emoji/no.png";
import Stfu from "../../assets/emoji/stfu.png";
import Knife from "../../assets/emoji/knife.png";
import Chill from "../../assets/emoji/chill.png";
import Fax from "../../assets/emoji/fax.png";
import Cap from "../../assets/emoji/cap.png";
import Bruh from "../../assets/emoji/bruh.png";
import Tate from "../../assets/emoji/andrewtate.png";
import BTC from "../../assets/emoji/bitcoin.png";
import Damn from "../../assets/emoji/damn.png";
import Pray from "../../assets/emoji/pray.png";
import Sus from "../../assets/emoji/sus.png";
import Sadge from "../../assets/emoji/sadge.png";
import Tom from "../../assets/emoji/tom.png";
import Yikes from "../../assets/emoji/yikes.png";
import Angry from "../../assets/emoji/angry.png";
import Sad from "../../assets/emoji/sad.png";
import Cry from "../../assets/emoji/pepehands.png";
import Wtf from "../../assets/emoji/wtf.png";
import Swag from "../../assets/emoji/swag.png";
import Fuck from "../../assets/emoji/fuck.png";
import Yey from "../../assets/emoji/Yey.png";
import Clown from "../../assets/emoji/clown.png";
import Rip from "../../assets/emoji/rip.png";
import Pepe from "../../assets/emoji/pepe.png";
import Monkas from "../../assets/emoji/monkaS.png";

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
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        height: "70%",
        margin: "15px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        height: "70%",
        margin: "15px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        height: "70%",
        margin: "15px",
      },
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 300,
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

const ChatRulesModal = ({ open, handleClose }) => {
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
        <svg data-v-17895ccb="" data-v-98afd824="" fill="currentColor" width="18" height="18" viewBox="0 0 24 24" className="material-design-icon__svg" style={{ color: "rgb(44, 128, 175)", marginTop: "-5px", marginRight: "10px", }}><path data-v-17895ccb="" data-v-98afd824="" d="M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z"><title data-v-17895ccb="" data-v-98afd824=""></title></path></svg><span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Chat Rules</span>
      </DialogTitle>
      <DialogContent dividers>
        <p><span className={classes.numbers}>1.</span> English only please.</p>
        <p><span className={classes.numbers}>2.</span> Do not harass, insult, or post content that is offensive.</p>
        <p><span className={classes.numbers}>3.</span> Promotion of any kind is not allowed.</p>
        <p><span className={classes.numbers}>4.</span> Do not link or discuss any other gambling related website.</p>
        <p><span className={classes.numbers}>5.</span> If you have any doubt please use the provably fair section.</p>
        <p><span className={classes.numbers}>6.</span> No spam.</p>
        <p><span className={classes.numbers}>7.</span> No links in chat. (except Coinflip battles)</p>
        <p><span className={classes.numbers}>8.</span> Do not ask for items, trivia or giveaways.</p>
        <br />
        <h2 style={{ fontFamily: "Rubik", fontWeight: "300", }}>Emotes</h2>
        <Box style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(50px, 1fr))", fontSize: "12px", gridGap: "2px", }}>
          <p>Kappa </p>
          <img style={{ width: "30px", height: "32px", }} src={Kappa} alt="Kappa" title="Kappa" />
          <p>Kek </p>
          <img style={{ width: "30px", height: "32px", }} src={Kek} alt="Kek" title="Kek" />
          <p>Stonks </p>
          <img style={{ width: "30px", height: "32px", }} src={Stonks} alt="Stonks" title="Stonks" />          <p>Yes </p>
          <img style={{ width: "30px", height: "32px", }} src={Yes} alt="Yes" title="Yes" />          <p>No </p>
          <img style={{ width: "30px", height: "32px", }} src={No} alt="No" title="No" />          <p>Stfu </p>
          <img style={{ width: "30px", height: "32px", }} src={Stfu} alt="Stfu" title="Stfu" />          <p>Knife </p>
          <img style={{ width: "30px", height: "32px", }} src={Knife} alt="Knife" title="Knife" />          <p>Chill </p>
          <img style={{ width: "30px", height: "32px", }} src={Chill} alt="Chill" title="Chill" />          <p>Fax </p>
          <img style={{ width: "30px", height: "32px", }} src={Fax} alt="Fax" title="Fax" />          <p>Cap </p>
          <img style={{ width: "30px", height: "32px", }} src={Cap} alt="Cap" title="Cap" />          <p>Bruh </p>
          <img style={{ width: "30px", height: "32px", }} src={Bruh} alt="Bruh" title="Bruh" />           <p>Tate </p>
          <img style={{ width: "30px", height: "32px", }} src={Tate} alt="Tate" title="Tate" />          <p>BTC </p>
          <img style={{ width: "30px", height: "32px", }} src={BTC} alt="BTC" title="BTC" />          <p>Damn </p>
          <img style={{ width: "30px", height: "32px", }} src={Damn} alt="Damn" title="Damn" />          <p>Pray </p>
          <img style={{ width: "30px", height: "32px", }} src={Pray} alt="Pray" title="Pray" />          <p>Sus </p>
          <img style={{ width: "30px", height: "32px", }} src={Sus} alt="Sus" title="Sus" />          <p>Sadge </p>
          <img style={{ width: "30px", height: "32px", }} src={Sadge} alt="Sadge" title="Sadge" /><p>Tom </p>
          <img style={{ width: "30px", height: "32px", }} src={Tom} alt="Tom" title="Tom" /><p>Yikes </p>
          <img style={{ width: "30px", height: "32px", }} src={Yikes} alt="Yikes" title="Yikes" /><p>Angry </p>
          <img style={{ width: "30px", height: "32px", }} src={Angry} alt="Angry" title="Angry" /><p>Sad </p>
          <img style={{ width: "30px", height: "32px", }} src={Sad} alt="Sad" title="Sad" /><p>Cry </p>
          <img style={{ width: "30px", height: "32px", }} src={Cry} alt="Cry" title="Cry" /><p>Wtf </p>
          <img style={{ width: "30px", height: "32px", }} src={Wtf} alt="Wtf" title="Wtf" /><p>Swag </p>
          <img style={{ width: "30px", height: "32px", }} src={Swag} alt="Swag" title="Swag" /><p>Fuck </p>
          <img style={{ width: "30px", height: "32px", }} src={Fuck} alt="Fuck" title="Fuck" /><p>Yey </p>
          <img style={{ width: "30px", height: "32px", }} src={Yey} alt="Yey" title="Yey" /><p>Clown </p>
          <img style={{ width: "30px", height: "32px", }} src={Clown} alt="Clown" title="Clown" /><p>Rip </p>
          <img style={{ width: "30px", height: "32px", }} src={Rip} alt="Rip" title="Rip" /><p>Pepe </p>
          <img style={{ width: "30px", height: "32px", }} src={Pepe} alt="Pepe" title="Pepe" /><p>Monkas </p>
          <img style={{ width: "30px", height: "32px", }} src={Monkas} alt="Monkas" title="Monkas" />
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

export default ChatRulesModal;
