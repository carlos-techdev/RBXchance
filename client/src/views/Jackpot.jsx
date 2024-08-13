import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { jackpotSocket } from "../services/websocket.service";
import { getJackpotSchema } from "../services/api.service";
import { useToasts } from "react-toast-notifications";

import { CountdownCircleTimer } from "react-countdown-circle-timer";

import { PieChart, Pie, Cell } from "recharts";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Tooltip from "@material-ui/core/Tooltip";
import Slider from 'react-input-slider';
import HistoryIcon from '@material-ui/icons/History';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { NavLink as Link } from "react-router-dom";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';

import error from "../assets/error.wav";
import success from "../assets/success.wav";
import pointer2 from "../assets/pointer.svg";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styled Component
const BetInput = withStyles(theme => ({
  root: {
    width: "8.5rem",
    [theme.breakpoints.down("xs")]: {
      width: "9rem",
    },
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#fff",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      padding: "0.5rem 1rem",
      "&.MuiFilledInput-root.Mui-focused": {
        background: "#32363c",
      },
    },
    "& div": {
      background: "#0D1116",
      height: "2.25rem",
      borderTopLeftRadius: 2,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      "&:hover": {
        background: "#0D1116",
        "&.MuiFilledInput-root.Mui-focused": {
          background: "#0D1116",
        },
      },
      "&.MuiFilledInput-root.Mui-focused": {
        background: "#0D1116",
      },
    },
    "&:hover": {
      background: "#0D1116",
    },
  },
}))(TextField);

// Custom styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingBottom: 100,
    transform: "translate(0%, 20%)",
    [theme.breakpoints.down("xs")]: {
      paddingTop: 27,
      paddingBottom: "160px",
    },
    "& > div > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      "& > hr": {
        width: "100%",
        marginTop: "1rem",
        background: "#32363c",
        borderColor: "#32363c",
      },
    },
  },
  rootContainer: {
    maxWidth: "100%",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  box: {
    marginBottom: 5,
  },
  logo: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "19px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  controls: {
    background: "#0D1116",
    display: "grid",
    paddingTop: "1.5rem",
    marginBottom: "-10px",
    marginTop: "-30px",
    [theme.breakpoints.down("xs")]: {
      display: "block",
      maxWidth: "100%",
      padding: "20px",
    },
  },
  right: {
    display: "flex",
    height: "2.25rem",
    margin: "auto",
    marginBottom: "10px",
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
      marginRight: "-2px",
      background: "#32363c00",
    },
  },
  game: {
    display: "flex",
    alignItems: "center",
    background: "#0D1116",
    borderRadius: "5px",
    width: "100%",
    height: "60px",
    [theme.breakpoints.down("xs")]: {
      "& > div": {
      },
    },
    "& > img": {
      marginLeft: "2rem",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
  },
  animation: {
    display: "flex",
    background: "#0D1116",
    borderRadius: "5px",
    width: "100%",
    height: "55vh",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      height: "65vh",
    },
  },
  jackpotPointerLow: {
    position: "absolute",
    top: "11.5%",
    left: "50%",
    transform: "translateX(-50%) translateZ(0)",
    zIndex: "11",
    width: "71.5px",
    height: "71px",
    background: `url(${pointer2}) 50%/100% 100% no-repeat`,
  },
  jackpotPointerMiddle: {
    position: "absolute",
    top: "11.5%",
    left: "50%",
    transform: "translateX(-50%) translateZ(0)",
    zIndex: "11",
    width: "71.5px",
    height: "71px",
    background: `url(${pointer2}) 50%/100% 100% no-repeat`,
  },
  jackpotPointerHigh: {
    position: "absolute",
    top: "11.5%",
    left: "50%",
    transform: "translateX(-50%) translateZ(0)",
    zIndex: "11",
    width: "71.5px",
    height: "71px",
    background: `url(${pointer2}) 50%/100% 100% no-repeat`,
  },
  jackpotCenterCircleLow: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: "19.4%",
    right: 0,
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  jackpotCenterCircleMiddle: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: "19.4%",
    right: 0,
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  jackpotCenterCircleHigh: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: "19.4%",
    right: 0,
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  jackpotCenterLow: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  jackpotCenterMiddle: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  jackpotCenterHigh: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
    textAlign: "center",
  },
  jackpotTextPotLow: {
    fontSize: "20px",
    letterSpacing: "0.1rem",
    color: "#cbc8cf",
  },
  jackpotTextPotMiddle: {
    fontSize: "20px",
    letterSpacing: "0.1rem",
    color: "#cbc8cf",
  },
  jackpotTextPotHigh: {
    fontSize: "20px",
    letterSpacing: "0.1rem",
    color: "#cbc8cf",
  },
  jackpotTextValueLow: {
    color: "#1786c2",
    marginTop: "-15px",
    fontSize: "40px",
    marginBottom: "-10px",
  },
  jackpotTextValueMiddle: {
    color: "#1786c2",
    marginTop: "-15px",
    fontSize: "40px",
    marginBottom: "-10px",
  },
  jackpotTextValueHigh: {
    color: "#1786c2",
    marginTop: "-15px",
    fontSize: "40px",
    marginBottom: "-10px",
  },
  jackpotTextHigh: {
    color: "#1786c2",
    marginTop: "-15px",
    fontSize: "40px",
    marginBottom: "-10px",
  },
  jackpotTextSizeLow: {
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#555b62",
  },
  jackpotTextSizeMiddle: {
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#555b62",
  },
  jackpotTextSizeHigh: {
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#555b62",
  },
  bets: {
    display: "grid",
    alignItems: "space-between",
    gridColumnGap: 15,
    gridTemplateColumns: "auto auto auto auto auto",
    width: "100%",
    height: "17vh",
    marginTop: 10,
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "auto auto",
      gridRowGap: 15,
      height: "fit-content",
    },
    "& > div": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      background: "#0D1116",
      boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
      borderRadius: 5,
      "& h5, h3": {
        margin: 0,
        fontWeight: "500",
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        letterSpacing: ".05em",
      },
      "& h3": {
        marginTop: 10,
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
      "& span": {
        color: "#FFC440",
      },
      "& hr": {
        width: "75%",
        opacity: 0.1,
        margin: "1rem 0",
      },
      "& .betLeft": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        color: "white",
        [theme.breakpoints.down("xs")]: {
          padding: "20px 15px",
        },
      },
      "& .betRight": {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#32363c",
        width: "40%",
        height: "100%",
        fontSize: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        [theme.breakpoints.down("xs")]: {
          background: "transparent",
        },
      },
    },
  },
  players: {
    margin: "auto",
    [theme.breakpoints.down("sm")]: {

    },
  },
  smallBet: {
    "&:nth-child(odd)": {
      background: "#0D1116",
      border: "1px solid #161D26",
    },
    background: "#32363c96",
    border: "1px solid #161D26",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    width: "560px",
    height: 70,
    marginBottom: "5px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    paddingLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 9,
      paddingLeft: 12,
      marginBottom: 10,
      maxWidth: "97%",
      marginLeft: "0px",
      marginTop: "70px",
    },
    "& h3, h5": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
  },
  potValue: {
    color: "white",
    display: "flex",
    alignItems: "center",
    marginRight: "1.3rem",
    "& img": {
      marginRight: "1rem",
    },
    "& h5, h3": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& h5": {
      color: "#4caf50",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& h3": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".05em",
      [theme.breakpoints.down("sm")]: {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "15px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  betInfo: {
    color: "white",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    marginLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: 8,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& h3": {
      margin: 0,
      [theme.breakpoints.down("xs")]: {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    background: "transparent !important",
  },
  userlevel: {
    padding: "4px 5px 4px 6px",
    borderRadius: "6px",
    marginRight: "10px",
    fontSize: 9,
    color: "#ffffff",
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".12em",
  },
  hashvalue: {
    color: "rgb(72, 82, 97)",
    fontFamily: "Rubik",
    fontSize: "15px",
    margin: "auto",
    marginLeft: "30px",
    cursor: "pointer",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
  avatar2: {
    borderRadius: "100%",
  },
  outline: {
    marginLeft: "auto",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    width: "30%",
    borderBottomRightRadius: "5px",
    borderTopRightRadius: "5px",
    background: "#23272b",
    [theme.breakpoints.down("xs")]: {
      background: "transparent",
      width: "20%",
    },
  },
  multiplier: {
    backgroundColor: "#32363c",
    borderColor: "#32363c",
    boxShadow: "0px 0px 0px 0px #32363c",
    color: "white",
    marginRight: 10,
    "&:hover": {
      backgroundColor: "#32363c",
    },
  },
  reverse: {
    fontFamily: "Rubik",
    color: "#000"
  },
  create: {
    backgroundColor: "#FFC440",
    borderColor: "#FFC440",
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "0px",
    borderTopRightRadius: "2px",
    borderBottomRightRadius: "2px",
    boxShadow: "none",
    color: "#e8e8e8",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    padding: "0 2rem",
    [theme.breakpoints.down("xs")]: {
      padding: "0.5rem",
    },
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#FFC440",
      opacity: "0.9",
      boxShadow: "none",
    },
  },
  round: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    "& > img": {
      width: 30,
      height: 30,
      marginLeft: 20,
    },
  },
  nonActive: {
    opacity: 0.35,
    transition: "0.25s ease",
  },
  activeRound: {
    transform: "scale(1.05)",
    opacity: 1,
    transition: "0.25s ease",
  },
  slidertest: {
    marginTop: "12px",
    marginRight: "15px",
    marginLeft: "10px",
    marginBottom: "5px",
  },
  sliderWrapper: {
    display: "flex",
    background: "#0D1116",
    borderRadius: "2px",
    marginRight: "15px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "10px",
      justifyContent: "center",
    },
  },
  sliderWrapperText1: {
    fontSize: "11px",
    fontFamily: "Rubik",
    color: "#5f6368",
    fontWeight: 500,
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "11px",
    letterSpacing: "0.05rem",
    [theme.breakpoints.down("xs")]: {

    },
  },
  sliderWrapperText2: {
    fontSize: "11px",
    fontFamily: "Rubik",
    color: "#5f6368",
    fontWeight: 500,
    marginLeft: "5px",
    marginRight: "15px",
    marginTop: "11px",
    letterSpacing: "0.05rem",
  },
  animationHashHistory: {
    display: "flex",
    position: "absolute",
    zIndex: 5000,
    top: "20px",
    right: "5px",
    [theme.breakpoints.down("xs")]: {
      top: "0px",
      right: "20px",
    },
  },
  barContainer: {
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginTop: "1rem",
    },
  },
  bar: {
    position: "absolute",
    width: "100%",
    top: 0,
    left: 0,
  },
  buttonhistoryicon: {
    "&:hover": {
      backgroundColor: "rgb(27 33 41)",
    },
  },
  classLowPotOn: {
    transform: "scale(1)",
    WebkitTransform: "scale(1)",
    transition: "all 400ms",
    marginLeft: "400px",
    marginTop: "0px",
    marginRight: "0px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.70)",
      WebkitTransform: "scale(0.70)",
      WebkitTapHighlightColor: "transparent",
      marginLeft: "410px",
      marginRight: "0px",
      marginTop: "-150px",
    },
  },
  classLowPotOff: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "0px",
    marginTop: "0px",
    marginRight: "0px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginRight: "-280px",
      marginLeft: "100px",
      marginBottom: "-260px",
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classLowPotOffHighOn: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "-400px",
    marginTop: "-260px",
    marginRight: "214px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      marginLeft: "-110px",
      marginBottom: "-550px",
      marginRight: "-80px",
      marginTop: "-260px",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classMiddlePotOn: {
    transform: "scale(1)",
    WebkitTransform: "scale(1)",
    transition: "all 400ms",
    marginLeft: "0px",
    marginTop: "0px",
    marginRight: "-250px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.70)",
      WebkitTransform: "scale(0.70)",
      marginRight: "-250px",
      marginTop: "-110px",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classMiddlePotOff: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "400px",
    marginTop: "0px",
    marginRight: "0px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classMiddlePotOffHighOn: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "-610px",
    marginTop: "220px",
    marginRight: "0px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      marginLeft: "-110px",
      marginRight: "-500px",
      marginBottom: "-350px",
      marginTop: "-60px",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classMiddlePotOffLowOn: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "0px",
    marginTop: "220px",
    marginRight: "-610px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      WebkitTapHighlightColor: "transparent",
      marginLeft: "-495px",
      marginRight: "-100px",
      marginTop: "270px",
    },
  },
  classHighPotOn: {
    transform: "scale(1)",
    WebkitTransform: "scale(1)",
    transition: "all 400ms",
    marginLeft: "0px",
    marginTop: "0px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.70)",
      WebkitTransform: "scale(0.70)",
      marginRight: "0px",
      marginTop: "-150px",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classHighPotOff: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "250px",
    marginTop: "0px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "-32px",
      marginRight: "105px",
      marginBottom: "-260px",
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      WebkitTapHighlightColor: "transparent",
    },
  },
  classHighPotOffLowOn: {
    transform: "scale(0.52)",
    WebkitTransform: "scale(0.52)",
    transition: "all 400ms",
    marginLeft: "210px",
    marginTop: "-250px",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.33)",
      WebkitTransform: "scale(0.33)",
      WebkitTapHighlightColor: "transparent",
      marginLeft: "-100px",
      marginRight: "300px",
      marginTop: "270px",
    },
  },

}));

const Jackpot = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [gameStatusLow, setGameStatusLow] = useState(1);
  const [gameStatusMiddle, setGameStatusMiddle] = useState(1);
  const [gameStatusHigh, setGameStatusHigh] = useState(1);

  const [focusLowPot, setFocusLowPot] = useState(false);
  const [focusMiddlePot, setFocusMiddlePot] = useState(true);
  const [focusHighPot, setFocusHighPot] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMiddle, setLoadingMiddle] = useState(true);
  const [loadingHigh, setLoadingHigh] = useState(true);

  const [joiningLow, setJoiningLow] = useState(false);
  const [joiningMiddle, setJoiningMiddle] = useState(false);
  const [joiningHigh, setJoiningHigh] = useState(false);

  const [betAmountLow, setBetAmountLow] = useState("0.00");
  const [betAmountMiddle, setBetAmountMiddle] = useState("0.00");
  const [betAmountHigh, setBetAmountHigh] = useState("0.00");

  const [timerDurationLow, setTimerDurationLow] = useState(19);
  const [timerDurationMiddle, setTimerDurationMiddle] = useState(19);
  const [timerDurationHigh, setTimerDurationHigh] = useState(19);

  const [waitTimeLow, setWaitTimeLow] = useState(19);
  const [waitTimeMiddle, setWaitTimeMiddle] = useState(19);
  const [waitTimeHigh, setWaitTimeHigh] = useState(19);

  const [potSizeLow, setPotSizeLow] = useState(classes.classLowPotOff);
  const [potSizeMiddle, setPotSizeMiddle] = useState(classes.classMiddlePotOn);
  const [potSizeHigh, setPotSizeHigh] = useState(classes.classHighPotOff);

  const [playersLow, setPlayersLow] = useState([]);
  const [playersMiddle, setPlayersMiddle] = useState([]);
  const [playersHigh, setPlayersHigh] = useState([]);

  const [gameIdLow, setGameIdLow] = useState(null);
  const [gameIdMiddle, setGameIdMiddle] = useState(null);
  const [gameIdHigh, setGameIdHigh] = useState(null);

  const [privateHashLow, setPrivateHashLow] = useState(null);
  const [privateHashMiddle, setPrivateHashMiddle] = useState(null);
  const [privateHashHigh, setPrivateHashHigh] = useState(null);

  const [jackpotAnimationDurationLow, setJackpotAnimationDurationLow] = useState(10);  // Animation Duration
  const [jackpotAnimationDurationMiddle, setJackpotAnimationDurationMiddle] = useState(10);  // Animation Duration
  const [jackpotAnimationDurationHigh, setJackpotAnimationDurationHigh] = useState(10);  // Animation Duration

  const [rotationLow, setRotationLow] = useState(0); // Rotation
  const [rotationMiddle, setRotationMiddle] = useState(0); // Rotation
  const [rotationHigh, setRotationHigh] = useState(0); // Rotation

  const [pieStartAngleLow, setPieStartAngleLow] = useState(null); // Piechart Startangle
  const [pieStartAngleMiddle, setPieStartAngleMiddle] = useState(null); // Piechart Startangle
  const [pieStartAngleHigh, setPieStartAngleHigh] = useState(null); // Piechart Startangle

  const [pieEndAngleLow, setPieEndAngleLow] = useState(null); // Piechart Startangle
  const [pieEndAngleMiddle, setPieEndAngleMiddle] = useState(null); // Piechart Startangle
  const [pieEndAngleHigh, setPieEndAngleHigh] = useState(null); // Piechart Startangle

  const [showWinnerTitleLow, setShowWinnerTitleLow] = useState(false);
  const [showWinnerTitleMiddle, setShowWinnerTitleMiddle] = useState(false);
  const [showWinnerTitleHigh, setShowWinnerTitleHigh] = useState(false);

  const [winnerINDEXLow, setWinnerIndexLow] = useState(null);
  const [winnerINDEXMiddle, setWinnerIndexMiddle] = useState(null);
  const [winnerINDEXHigh, setWinnerIndexHigh] = useState(null);

  const [showPointerLow, setShowPointerLow] = useState(false);
  const [showPointerMiddle, setShowPointerMiddle] = useState(false);
  const [showPointerHigh, setShowPointerHigh] = useState(false);

  const [hideTimerLow, setHideTimerLow] = useState("inherit");
  const [hideTimerMiddle, setHideTimerMiddle] = useState("inherit");
  const [hideTimerHigh, setHideTimerHigh] = useState("inherit");

  const [startCountDownLow, setStartCountdownLow] = useState(false);
  const [startCountDownMiddle, setStartCountdownMiddle] = useState(false);
  const [startCountDownHigh, setStartCountdownHigh] = useState(false);

  const dataPieOFF = [{ winningPercentage: 100, },]

  //Pie, player colors
  const pieCOLORS = [
    "#469dda", "#de5041", "#24a94d", "#edb545", "#e760da", "#5574df", "#e17624", "#4b9a6c", "#ab73e8",
    "#317262", "#c3e089", "#805151", "#a36f9d", "#c4b174", "#95da36", "#d5a1af", "#cb377a", "#3d6b23",
    "#cb6e51", "#85358d", "#51d7b3", "#745427", "#92972f", "#cc626e", "#cda0db", "#b0d8ac", "#99292f",
    "#375164", "#7d335e", "#6ca454", "#dc6fbc", "#4d468a", "#68c5d2", "#82794e", "#d5da3d", "#d1997b",
    "#a178d4", "#769d82", "#d23b58", "#a7b8cc", "#55de41", "#50543e", "#5a81cf", "#86401f", "#c48c41",
    "#5a642b", "#a123d4"];

  const dataPieLow = playersLow;
  const dataPieMiddle = playersMiddle;
  const dataPieHigh = playersHigh;

  const RADIAN = Math.PI / 180;

  //Label Low Circle
  const renderCustomizedLabelLow = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (dataPieLow.length > 0 && dataPieLow[index].winningPercentage > 6.99) {
      return (
        <svg
          x={x - 24}
          y={y - 24}
          fill="#39416D"
          textAnchor={"middle"}
          dominantBaseline="central"
          width={47}
          height={47}
          viewBox="0 0 47 47"
          style={{ clipPath: "circle(50%)", }}
          preserveAspectRatio="none"

        >
          <image
            href={dataPieLow[index].avatar}
            style={{
              clipPath: "circle(50%)",
              transform: `rotate(${-midAngle + 90}deg)`,
              transformOrigin: "center",
            }}
            height="47px"
            width="47px"
            textAnchor={"middle"}
            dominantBaseline="central"
            preserveAspectRatio="none"
          />
        </svg>
      );
    } else { }
  };

  //Label Middle Circle
  const renderCustomizedLabelMiddle = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (dataPieMiddle.length > 0 && dataPieMiddle[index].winningPercentage > 6.99) {
      return (
        <svg
          x={x - 24}
          y={y - 24}
          fill="#39416D"
          textAnchor={"middle"}
          dominantBaseline="central"
          width={47}
          height={47}
          viewBox="0 0 47 47"
          preserveAspectRatio="none"
          style={{ clipPath: "circle(50%)", }}
        >
          <image
            href={dataPieMiddle[index].avatar}
            style={{
              clipPath: "circle(50%)",
              transform: `rotate(${-midAngle + 90}deg)`,
              transformOrigin: "center"
            }}
            height="47px"
            width="47px"
            textAnchor={"middle"}
            dominantBaseline="central"
            preserveAspectRatio="none"
          />
        </svg>
      );
    } else { }
  };

  //Label High Circle
  const renderCustomizedLabelHigh = ({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (dataPieHigh.length > 0 && dataPieHigh[index].winningPercentage > 6.99) {
      return (
        <svg
          x={x - 24}
          y={y - 24}
          fill="#39416D"
          textAnchor={"middle"}
          dominantBaseline="central"
          width={47}
          height={47}
          viewBox="0 0 47 47"
          style={{ clipPath: "circle(50%)", }}
          preserveAspectRatio="none"
        >
          <image
            href={dataPieHigh[index].avatar}
            style={{
              clipPath: "circle(50%)",
              transform: `rotate(${-midAngle + 90}deg)`,
              transformOrigin: "center"
            }}
            height="47px"
            width="47px"
            textAnchor={"middle"}
            dominantBaseline="central"
            preserveAspectRatio="none"
          />
        </svg>
      );
    } else { }
  };

  // CheckFunction LOW
  function CheckFunctionLow() {
    if (dataPieLow.length > 0) {
      return dataPieLow;
    }
    else
      return dataPieOFF;
  };

  // CheckFunction Middle
  function CheckFunctionMiddle() {
    if (dataPieMiddle.length > 0) {
      return dataPieMiddle;
    }
    else
      return dataPieOFF;
  };

  // CheckFunction High
  function CheckFunctionHigh() {
    if (dataPieHigh.length > 0) {
      return dataPieHigh;
    }
    else
      return dataPieOFF;
  };

  // Pot LOW Title
  function PotTitleCheckLow() {
    if (playersLow.map(player => player.betAmount).reduce((a, b) => a + b, 0).toFixed(2) > 0) {
      return `$${playersLow.map(player => player.betAmount).reduce((a, b) => a + b, 0).toFixed(2)}`;
    }
    else
      return "-";
  };

  // Pot Middle Title
  function PotTitleCheckMiddle() {
    if (playersMiddle.map(player => player.betAmount).reduce((a, b) => a + b, 0).toFixed(2) > 0) {
      return `$${playersMiddle.map(player => player.betAmount).reduce((a, b) => a + b, 0).toFixed(2)}`;
    }
    else
      return "-";
  };

  // Pot High Title
  function PotTitleCheckHigh() {
    if (playersHigh.map(player => player.betAmount).reduce((a, b) => a + b, 0).toFixed(2) > 0) {
      return `$${playersHigh.map(player => player.betAmount).reduce((a, b) => a + b, 0).toFixed(2)}`;
    }
    else
      return "-";
  };

  // Button onClickFocusLow event handler LOW focus
  const onClickFocusLow = () => {
    setPotSizeLow(classes.classLowPotOn);
    setPotSizeMiddle(classes.classMiddlePotOffLowOn);
    setPotSizeHigh(classes.classHighPotOffLowOn);
    setFocusLowPot(true);
    setFocusMiddlePot(false);
    setFocusHighPot(false);
  };

  // Button onClickFocusMiddle event handler Middle focus
  const onClickFocusMiddle = () => {
    setPotSizeLow(classes.classLowPotOff);
    setPotSizeMiddle(classes.classMiddlePotOn);
    setPotSizeHigh(classes.classHighPotOff);
    setFocusLowPot(false);
    setFocusMiddlePot(true);
    setFocusHighPot(false);
  };

  // Button onClickFocusHigh event handler High focus
  const onClickFocusHigh = () => {
    setPotSizeLow(classes.classLowPotOffHighOn);
    setPotSizeMiddle(classes.classMiddlePotOffHighOn);
    setPotSizeHigh(classes.classHighPotOn);
    setFocusLowPot(false);
    setFocusMiddlePot(false);
    setFocusHighPot(true);
  };

  // TextField onChange event handler LOW
  const onChangeLow = e => {
    // Update state
    setBetAmountLow(e.target.value);
  };

  // TextField onChange event handler Middle
  const onChangeMiddle = e => {
    // Update state
    setBetAmountMiddle(e.target.value);
  };

  // TextField onChange event handler High
  const onChangeHigh = e => {
    // Update state
    setBetAmountHigh(e.target.value);
  };

  // Button onClick event handler LOW
  const onClickJoinLow = () => {
    setJoiningLow(true);
    jackpotSocket.emit("join-game-low", parseFloat(betAmountLow));
  };

  // Button onClick event handler Middle
  const onClickJoinMiddle = () => {
    setJoiningMiddle(true);
    jackpotSocket.emit("join-game-middle", parseFloat(betAmountMiddle));
  };

  // Button onClick event handler High
  const onClickJoinHigh = () => {
    setJoiningHigh(true);
    jackpotSocket.emit("join-game-high", parseFloat(betAmountHigh));
  };

  // Add player to the game LOW
  const addPlayerLow = player => {
    // Update state
    setPlayersLow(state => [...state, player]);
  };

  // Add player to the game Middle
  const addPlayerMiddle = player => {
    // Update state
    setPlayersMiddle(state => [...state, player]);
  };

  // Add player to the game High
  const addPlayerHigh = player => {
    // Update state
    setPlayersHigh(state => [...state, player]);
  };

  // Player's percentages updated Low
  const percentagesUpdatedLow = players => {
    // Update state
    setPlayersLow(players);
  };

  // Player's percentages updated Middle
  const percentagesUpdatedMiddle = players => {
    // Update state
    setPlayersMiddle(players);
  };

  // Player's percentages updated High
  const percentagesUpdatedHigh = players => {
    // Update state
    setPlayersHigh(players);
  };

  // Player's percentages updated LOW
  const potTitleHighLow = (status, player_index) => {
    // Update state
    setShowWinnerTitleLow(status);
    setWinnerIndexLow(player_index);
  };

  // Player's percentages updated Middle
  const potTitleHighMiddle = (status, player_index) => {
    // Update state
    setShowWinnerTitleMiddle(status);
    setWinnerIndexMiddle(player_index);
  };

  // Player's percentages updated High
  const potTitleHighHigh = (status, player_index) => {
    // Update state
    setShowWinnerTitleHigh(status);
    setWinnerIndexHigh(player_index);
  };

  // Countdown started LOW
  const countdownStartedLow = (time, pieStartAngle, pieEndAngle) => {
    // Update state
    setGameStatusLow(2);
    setStartCountdownLow(true);
    setPieStartAngleLow(pieStartAngle);
    setPieEndAngleLow(pieEndAngle);
    setWaitTimeLow(time / 1000);
  };

  // Countdown started Middle
  const countdownStartedMiddle = (time, pieStartAngle, pieEndAngle) => {
    // Update state
    setGameStatusMiddle(2);
    setStartCountdownMiddle(true);
    setPieStartAngleMiddle(pieStartAngle);
    setPieEndAngleMiddle(pieEndAngle);
    setWaitTimeMiddle(time / 1000);
  };

  // Countdown started High
  const countdownStartedHigh = (time, pieStartAngle, pieEndAngle) => {
    // Update state
    setGameStatusHigh(2);
    setStartCountdownHigh(true);
    setPieStartAngleHigh(pieStartAngle);
    setPieEndAngleHigh(pieEndAngle);
    setWaitTimeHigh(time / 1000);
  };

  // Get rotation for the wheel LOW
  const getRotationDEGLow = (winningTicket, maxTicket) => {
    const rotationPercent = winningTicket / maxTicket;
    const rotationDEG = ((360 - 360 * rotationPercent) + 360 * 30);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
    return rotationDEG;
  };

  // Get rotation for the wheel Middle
  const getRotationDEGMiddle = (winningTicket, maxTicket) => {
    const rotationPercent = winningTicket / maxTicket;
    const rotationDEG = ((360 - 360 * rotationPercent) + 360 * 30);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
    return rotationDEG;
  };

  // Get rotation for the wheel High
  const getRotationDEGHigh = (winningTicket, maxTicket) => {
    const rotationPercent = winningTicket / maxTicket;
    const rotationDEG = ((360 - 360 * rotationPercent) + 360 * 30);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
    return rotationDEG;
  };

  // componentDidMount
  useEffect(() => {
    let unmounted = false;
    // Fetch jackpot games schema from API
    const fetchData = async () => {
      setLoading(true);
      setLoadingMiddle(true);
      setLoadingHigh(true);
      try {
        const schema = await getJackpotSchema();

        // Get current games status
        const currentStatusLow = schema.current.status;
        const currentStatusMiddle = schema.currentMiddle.status;
        const currentStatusHigh = schema.currentHigh.status;
        setGameStatusLow(currentStatusLow);
        setGameStatusMiddle(currentStatusMiddle);
        setGameStatusHigh(currentStatusHigh);

        setWaitTimeLow(schema.current.timeLeft / 1000);
        setWaitTimeMiddle(schema.currentMiddle.timeLeft / 1000);
        setWaitTimeHigh(schema.currentHigh.timeLeft / 1000);

        setShowWinnerTitleLow(schema.current.AnimationEndedStatus);
        setShowWinnerTitleMiddle(schema.currentMiddle.AnimationEndedStatus);
        setShowWinnerTitleHigh(schema.currentHigh.AnimationEndedStatus);

        setWinnerIndexLow(schema.current.playerWinnerIndex);
        setWinnerIndexMiddle(schema.currentMiddle.playerWinnerIndex);
        setWinnerIndexHigh(schema.currentHigh.playerWinnerIndex);

        setPieStartAngleLow(schema.current.pieStartAngle);
        setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle);
        setPieStartAngleHigh(schema.currentHigh.pieStartAngle);

        setPieEndAngleLow(schema.current.pieEndAngle);
        setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle);
        setPieEndAngleHigh(schema.currentHigh.pieEndAngle);

        if (currentStatusLow === 2) {
          setStartCountdownLow(true);
        }
        if (currentStatusMiddle === 2) {
          setStartCountdownMiddle(true);
        }
        if (currentStatusHigh === 2) {
          setStartCountdownHigh(true);
        }

        if (currentStatusLow === 4) {
          setHideTimerLow("none");
          setShowPointerLow(true);
          setGameStatusLow(4);
          if (schema.current.AnimationDuration / 1000 > 5.50) {
            const rotationPercentCalc = schema.current.winningTicketCalc / schema.current.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) * (schema.current.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) - rotationDEGCalc
            setPieStartAngleLow(schema.current.pieStartAngle - pieDegreeCalc);
            setPieEndAngleLow(schema.current.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationLow(schema.current.AnimationDuration / 1000);
            setRotationLow(rotationDEGCalc);
          }
          else if (schema.current.AnimationDuration / 1000 > 1.1) {
            const rotationPercentCalc = schema.current.winningTicketCalc / schema.current.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) * (schema.current.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) - rotationDEGCalc
            setPieStartAngleLow(schema.current.pieStartAngle - pieDegreeCalc);
            setPieEndAngleLow(schema.current.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationLow(schema.current.AnimationDuration / 1000);
            setRotationLow(rotationDEGCalc);
          }
          else {
            const rotationPercentCalc = schema.current.winningTicketCalc / schema.current.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360) * (schema.current.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360) - rotationDEGCalc
            setPieStartAngleLow(schema.current.pieStartAngle - pieDegreeCalc);
            setPieEndAngleLow(schema.current.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationLow(schema.current.AnimationDuration / 1000);
            setRotationLow(rotationDEGCalc);
          }
        }
        if (currentStatusMiddle === 4) {
          setHideTimerMiddle("none");
          setShowPointerMiddle(true);
          setGameStatusMiddle(4);
          if (schema.currentMiddle.AnimationDuration / 1000 > 5.50) {
            const rotationPercentCalc = schema.currentMiddle.winningTicketCalc / schema.currentMiddle.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) * (schema.currentMiddle.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) - rotationDEGCalc
            setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle - pieDegreeCalc);
            setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationMiddle(schema.currentMiddle.AnimationDuration / 1000);
            setRotationMiddle(rotationDEGCalc);
          }
          else if (schema.currentMiddle.AnimationDuration / 1000 > 1.1) {
            const rotationPercentCalc = schema.currentMiddle.winningTicketCalc / schema.currentMiddle.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) * (schema.currentMiddle.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) - rotationDEGCalc
            setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle - pieDegreeCalc);
            setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationMiddle(schema.currentMiddle.AnimationDuration / 1000);
            setRotationMiddle(rotationDEGCalc);
          }
          else {
            const rotationPercentCalc = schema.currentMiddle.winningTicketCalc / schema.currentMiddle.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360) * (schema.currentMiddle.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360) - rotationDEGCalc
            setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle - pieDegreeCalc);
            setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationMiddle(schema.currentMiddle.AnimationDuration / 1000);
            setRotationMiddle(rotationDEGCalc);
          }
        }
        if (currentStatusHigh === 4) {
          setHideTimerHigh("none");
          setShowPointerHigh(true);
          setGameStatusHigh(4);
          if (schema.currentHigh.AnimationDuration / 1000 > 5.50) {
            const rotationPercentCalc = schema.currentHigh.winningTicketCalc / schema.currentHigh.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) * (schema.currentHigh.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) - rotationDEGCalc
            setPieStartAngleHigh(schema.currentHigh.pieStartAngle - pieDegreeCalc);
            setPieEndAngleHigh(schema.currentHigh.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationHigh(schema.currentHigh.AnimationDuration / 1000);
            setRotationHigh(rotationDEGCalc);
          }
          else if (schema.currentHigh.AnimationDuration / 1000 > 1.1) {
            const rotationPercentCalc = schema.currentHigh.winningTicketCalc / schema.currentHigh.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) * (schema.currentHigh.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) - rotationDEGCalc
            setPieStartAngleHigh(schema.currentHigh.pieStartAngle - pieDegreeCalc);
            setPieEndAngleHigh(schema.currentHigh.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationHigh(schema.currentHigh.AnimationDuration / 1000);
            setRotationHigh(rotationDEGCalc);
          }
          else {
            const rotationPercentCalc = schema.currentHigh.winningTicketCalc / schema.currentHigh.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360) * (schema.currentHigh.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360) - rotationDEGCalc
            setPieStartAngleHigh(schema.currentHigh.pieStartAngle - pieDegreeCalc);
            setPieEndAngleHigh(schema.currentHigh.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationHigh(schema.currentHigh.AnimationDuration / 1000);
            setRotationHigh(rotationDEGCalc);
          }
        }

        // Update state
        setGameIdLow(schema.current._id);
        setGameIdMiddle(schema.currentMiddle._id);
        setGameIdHigh(schema.currentHigh._id);

        setPrivateHashLow(schema.current.privateHash);
        setPrivateHashMiddle(schema.currentMiddle.privateHash);
        setPrivateHashHigh(schema.currentHigh.privateHash);

        setPlayersLow(schema.current.players);
        setPlayersMiddle(schema.currentMiddle.players);
        setPlayersHigh(schema.currentHigh.players);

        if (schema.current.timeLeft <= 0) {
          setStartCountdownLow(false);
        }
        if (schema.currentMiddle.timeLeft <= 0) {
          setStartCountdownMiddle(false);
        }
        if (schema.currentHigh.timeLeft <= 0) {
          setStartCountdownHigh(false);
        }

        setLoading(false);
        setLoadingMiddle(false);
        setLoadingHigh(false);
      } catch (error) {
        console.log("There was an error while loading Jackpot schema:", error);
      }
    };

    // Game rolled LOW
    const gameRolledLow = (winningTicketCalc, maxTicketCalc, AnimationDuration) => {
      // Update state
      const animation_duration = AnimationDuration / 1000;
      setJackpotAnimationDurationLow(animation_duration);
      setGameStatusLow(4);

      const rotationDegree = getRotationDEGLow(winningTicketCalc, maxTicketCalc);
      setRotationLow(rotationDegree);
    };

    // Game rolled Middle
    const gameRolledMiddle = (winningTicketCalc, maxTicketCalc, AnimationDuration) => {
      // Update state
      const animation_duration = AnimationDuration / 1000;
      setJackpotAnimationDurationMiddle(animation_duration);
      setGameStatusMiddle(4);

      const rotationDegree = getRotationDEGMiddle(winningTicketCalc, maxTicketCalc);
      setRotationMiddle(rotationDegree);
    };

    // Game rolled High
    const gameRolledHigh = (winningTicketCalc, maxTicketCalc, AnimationDuration) => {
      // Update state
      const animation_duration = AnimationDuration / 1000;
      setJackpotAnimationDurationHigh(animation_duration);
      setGameStatusHigh(4);

      const rotationDegree = getRotationDEGHigh(winningTicketCalc, maxTicketCalc);
      setRotationHigh(rotationDegree);
    };

    // Fetch Jackpot data from API Back From TAB
    const fetchDataBACKfromTAB = async (schema, type) => {
      setLoading(true);
      setLoadingMiddle(true);
      setLoadingHigh(true);
      try {
        const currentStatusLow = schema.current.status;
        const currentStatusMiddle = schema.currentMiddle.status;
        const currentStatusHigh = schema.currentHigh.status;

        if (currentStatusLow === 4) {
          setWaitTimeLow(0);
          setStartCountdownLow(false);
        }
        if (currentStatusMiddle === 4) {
          setWaitTimeMiddle(0);
          setStartCountdownMiddle(false);
        }
        if (currentStatusHigh === 4) {
          setWaitTimeHigh(0);
          setStartCountdownHigh(false);
        }
        //LOW
        if (type === "low" && schema.current.timeLeft / 1000 > 0 && schema.current.AnimationDuration / 1000 >= 10) {
          setWaitTimeLow(schema.current.timeLeft / 1000);
        }
        if (schema.current.AnimationDuration / 1000 < 10) {
          setWaitTimeLow(0);
          setStartCountdownLow(false);
        }
        //MIDDLE
        if (type === "middle" && schema.currentMiddle.timeLeft / 1000 > 0 && schema.currentMiddle.AnimationDuration / 1000 >= 10) {
          setWaitTimeMiddle(schema.currentMiddle.timeLeft / 1000);
        }
        if (schema.currentMiddle.AnimationDuration / 1000 < 10) {
          setWaitTimeMiddle(0);
          setStartCountdownMiddle(false);
        }
        //HIGH
        if (type === "high" && schema.currentHigh.timeLeft / 1000 > 0 && schema.currentHigh.AnimationDuration / 1000 >= 10) {
          setWaitTimeHigh(schema.currentHigh.timeLeft / 1000);
        }
        if (schema.currentHigh.AnimationDuration / 1000 < 10) {
          setWaitTimeHigh(0);
          setStartCountdownHigh(false);
        }

        setLoading(false);
        setLoadingMiddle(false);
        setLoadingHigh(false);
      } catch (error) {
        console.log("There was an error while loading jackpot schema:", error);
      }
    };

    // Fetch jackpot data from API Back From TAB
    const fetchDataBACKfromTAB2 = async (type) => {
      //setLoading(true);
      //setLoadingMiddle(true);
      //setLoadingHigh(true);
      try {
        const schema = await getJackpotSchema();
        // Get current games status
        const currentStatusLow = schema.current.status;
        const currentStatusMiddle = schema.currentMiddle.status;
        const currentStatusHigh = schema.currentHigh.status;

        if (currentStatusLow === 4 && type === "low") {
          setShowPointerLow(true);
          setGameStatusLow(4);
          setWaitTimeLow(0);
          setStartCountdownLow(false);
          if (schema.current.AnimationDuration / 1000 > 5.50) {
            const rotationPercentCalc = schema.current.winningTicketCalc / schema.current.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) * (schema.current.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) - rotationDEGCalc
            setPieStartAngleLow(schema.current.pieStartAngle - pieDegreeCalc);
            setPieEndAngleLow(schema.current.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationLow(schema.current.AnimationDuration / 1000);
            setRotationLow(rotationDEGCalc);
          }
          else if (schema.current.AnimationDuration / 1000 > 1.1) {
            const rotationPercentCalc = schema.current.winningTicketCalc / schema.current.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) * (schema.current.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) - rotationDEGCalc
            setPieStartAngleLow(schema.current.pieStartAngle - pieDegreeCalc);
            setPieEndAngleLow(schema.current.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationLow(schema.current.AnimationDuration / 1000);
            setRotationLow(rotationDEGCalc);
          }
          else {
            const rotationPercentCalc = schema.current.winningTicketCalc / schema.current.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360) * (schema.current.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360) - rotationDEGCalc
            setPieStartAngleLow(schema.current.pieStartAngle - pieDegreeCalc);
            setPieEndAngleLow(schema.current.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationLow(schema.current.AnimationDuration / 1000);
            setRotationLow(rotationDEGCalc);
          }
        }
        if (currentStatusMiddle === 4 && type === "middle") {
          setShowPointerMiddle(true);
          setGameStatusMiddle(4);
          setWaitTimeMiddle(0);
          setStartCountdownMiddle(false);
          if (schema.currentMiddle.AnimationDuration / 1000 > 5.50) {
            const rotationPercentCalc = schema.currentMiddle.winningTicketCalc / schema.currentMiddle.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) * (schema.currentMiddle.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) - rotationDEGCalc
            setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle - pieDegreeCalc);
            setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationMiddle(schema.currentMiddle.AnimationDuration / 1000);
            setRotationMiddle(rotationDEGCalc);
          }
          else if (schema.currentMiddle.AnimationDuration / 1000 > 1.1) {
            const rotationPercentCalc = schema.currentMiddle.winningTicketCalc / schema.currentMiddle.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) * (schema.currentMiddle.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) - rotationDEGCalc
            setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle - pieDegreeCalc);
            setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationMiddle(schema.currentMiddle.AnimationDuration / 1000);
            setRotationMiddle(rotationDEGCalc);
          }
          else {
            const rotationPercentCalc = schema.currentMiddle.winningTicketCalc / schema.currentMiddle.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360) * (schema.currentMiddle.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360) - rotationDEGCalc
            setPieStartAngleMiddle(schema.currentMiddle.pieStartAngle - pieDegreeCalc);
            setPieEndAngleMiddle(schema.currentMiddle.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationMiddle(schema.currentMiddle.AnimationDuration / 1000);
            setRotationMiddle(rotationDEGCalc);
          }
        }
        if (currentStatusHigh === 4 && type === "high") {
          setShowPointerHigh(true);
          setGameStatusHigh(4);
          setWaitTimeHigh(0);
          setStartCountdownHigh(false);
          if (schema.currentHigh.AnimationDuration / 1000 > 5.50) {
            const rotationPercentCalc = schema.currentHigh.winningTicketCalc / schema.currentHigh.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) * (schema.currentHigh.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 15) - rotationDEGCalc
            setPieStartAngleHigh(schema.currentHigh.pieStartAngle - pieDegreeCalc);
            setPieEndAngleHigh(schema.currentHigh.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationHigh(schema.currentHigh.AnimationDuration / 1000);
            setRotationHigh(rotationDEGCalc);
          }
          else if (schema.currentHigh.AnimationDuration / 1000 > 1.1) {
            const rotationPercentCalc = schema.currentHigh.winningTicketCalc / schema.currentHigh.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) * (schema.currentHigh.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360 * 5) - rotationDEGCalc
            setPieStartAngleHigh(schema.currentHigh.pieStartAngle - pieDegreeCalc);
            setPieEndAngleHigh(schema.currentHigh.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationHigh(schema.currentHigh.AnimationDuration / 1000);
            setRotationHigh(rotationDEGCalc);
          }
          else {
            const rotationPercentCalc = schema.currentHigh.winningTicketCalc / schema.currentHigh.maxTicketCalc;
            const rotationDEGCalc = ((360 - 360 * rotationPercentCalc) + 360) * (schema.currentHigh.AnimationDuration / 10000);  // original: ((360 - 360 * rotationPercent) + 360 * 30)
            const pieDegreeCalc = ((360 - 360 * rotationPercentCalc) + 360) - rotationDEGCalc
            setPieStartAngleHigh(schema.currentHigh.pieStartAngle - pieDegreeCalc);
            setPieEndAngleHigh(schema.currentHigh.pieEndAngle - pieDegreeCalc);
            setJackpotAnimationDurationHigh(schema.currentHigh.AnimationDuration / 1000);
            setRotationHigh(rotationDEGCalc);
          }
        }
        //setLoading(false);
        //setLoadingMiddle(false);
        //setLoadingHigh(false);
      } catch (error) {
        console.log("There was an error while loading Jackpot schema:", error);
      }
    };

    // New round has started LOW
    const newRoundLow = (timeLeft, gameId, privateHash) => {
      // Update state
      setLoading(true);
      //console.log("Jackpot Game Low Reseted!");
      setGameIdLow(gameId);
      setPrivateHashLow(privateHash);
      setGameStatusLow(1);
      setStartCountdownLow(false);
      setTimerDurationLow(19);
      setWaitTimeLow(19);
      setShowPointerLow(false);
      setHideTimerLow("inherit");
      setShowWinnerTitleLow(false);
      setBetAmountLow("0.00");
      setPlayersLow([]);
      setWinnerIndexLow(null);
      setPieStartAngleLow(-90);
      setPieEndAngleLow(270);
      setRotationLow(0);
      setJackpotAnimationDurationLow(0);
      setLoading(false);
    };

    // New round has started Middle
    const newRoundMiddle = (timeLeft, gameId, privateHash) => {
      // Update state
      setLoadingMiddle(true);
      //console.log("Jackpot Game Middle Reseted!");
      setGameIdMiddle(gameId);
      setPrivateHashMiddle(privateHash);
      setGameStatusMiddle(1);
      setStartCountdownMiddle(false);
      setTimerDurationMiddle(19);
      setWaitTimeMiddle(19);
      setShowPointerMiddle(false);
      setHideTimerMiddle("inherit");
      setShowWinnerTitleMiddle(false);
      setBetAmountMiddle("0.00");
      setPlayersMiddle([]);
      setWinnerIndexMiddle(null);
      setPieStartAngleMiddle(-90);
      setPieEndAngleMiddle(270);
      setRotationMiddle(0);
      setJackpotAnimationDurationMiddle(0);
      setLoadingMiddle(false);
    };

    // New round has started High
    const newRoundHigh = (timeLeft, gameId, privateHash) => {
      // Update state
      setLoadingHigh(true);
      //console.log("Jackpot Game High Reseted!");
      setGameIdHigh(gameId);
      setPrivateHashHigh(privateHash);
      setGameStatusHigh(1);
      setStartCountdownHigh(false);
      setTimerDurationHigh(19);
      setWaitTimeHigh(19);
      setShowPointerHigh(false);
      setHideTimerHigh("inherit");
      setShowWinnerTitleHigh(false);
      setBetAmountHigh("0.00");
      setPlayersHigh([]);
      setWinnerIndexHigh(null);
      setPieStartAngleHigh(-90);
      setPieEndAngleHigh(270);
      setRotationHigh(0);
      setJackpotAnimationDurationHigh(0);
      setLoadingHigh(false);
    };

    const onFocus = async () => {
      try {
        const schema = await getJackpotSchema();
        const currentStatusLow = schema.current.status;
        const currentStatusMiddle = schema.currentMiddle.status;
        const currentStatusHigh = schema.currentHigh.status;

        if (currentStatusLow === 4) {
          setWaitTimeLow(0);
          setStartCountdownLow(false);
          setHideTimerLow("none");
          setShowPointerLow(true);
        }
        if (currentStatusMiddle === 4) {
          setWaitTimeMiddle(0);
          setStartCountdownMiddle(false);
          setHideTimerMiddle("none");
          setShowPointerMiddle(true);
        }
        if (currentStatusHigh === 4) {
          setWaitTimeHigh(0);
          setStartCountdownHigh(false);
          setHideTimerHigh("none");
          setShowPointerHigh(true);
        }
        // LOW
        if (schema.current.timeLeft / 1000 < 19 && schema.current.timeLeft / 1000 > 0) {
          fetchDataBACKfromTAB(schema, "low");
        }
        // MIDDLE
        if (schema.currentMiddle.timeLeft / 1000 < 19 && schema.currentMiddle.timeLeft / 1000 > 0) {
          fetchDataBACKfromTAB(schema, "middle");
        }
        // HIGH
        if (schema.currentHigh.timeLeft / 1000 < 19 && schema.currentHigh.timeLeft / 1000 > 0) {
          fetchDataBACKfromTAB(schema, "high");
        }
      } catch (error) {
        console.log("There was an error while loading jackpot schema:", error);
      }
    };

    // delete this if causes issues
    const onFocus2 = async () => {
      try {
        const schema = await getJackpotSchema();

        // LOW
        if (schema.current.AnimationDuration / 1000 < 10 && schema.current.AnimationDuration / 1000 > 0) {
          setWaitTimeLow(0);
          setStartCountdownLow(false);
          setJackpotAnimationDurationLow(0);
          setRotationLow(0);
          setPieStartAngleLow(90);
          setPieEndAngleLow(-270);
          fetchDataBACKfromTAB2("low");
        }
        // MIDDLE
        if (schema.currentMiddle.AnimationDuration / 1000 < 10 && schema.currentMiddle.AnimationDuration / 1000 > 0) {
          setWaitTimeMiddle(0);
          setStartCountdownMiddle(false);
          setJackpotAnimationDurationMiddle(0);
          setRotationMiddle(0);
          setPieStartAngleMiddle(90);
          setPieEndAngleMiddle(-270);
          fetchDataBACKfromTAB2("middle");
        }
        // HIGH
        if (schema.currentHigh.AnimationDuration / 1000 < 10 && schema.currentHigh.AnimationDuration / 1000 > 0) {
          setWaitTimeHigh(0);
          setStartCountdownHigh(false);
          setJackpotAnimationDurationHigh(0);
          setRotationHigh(0);
          setPieStartAngleHigh(90);
          setPieEndAngleHigh(-270);
          fetchDataBACKfromTAB2("high");
        }
      } catch (error) {
        console.log("There was an error while loading Jackpot schema:", error);
      }
    };

    // Low Game joining error handler
    const handleErrorLow = msg => {
      setJoiningLow(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Middle Game joining error handler
    const handleErrorMiddle = msg => {
      setJoiningMiddle(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // High Game joining error handler
    const handleErrorHigh = msg => {
      setJoiningHigh(false);
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Low Game joining success handler
    const handleSuccessLow = msg => {
      setJoiningLow(false);
      playSound(successAudio);
    };

    // Middle Game joining success handler
    const handleSuccessMiddle = msg => {
      setJoiningMiddle(false);
      playSound(successAudio);
    };

    // High Game joining success handler
    const handleSuccessHigh = msg => {
      setJoiningHigh(false);
      playSound(successAudio);
    };

    if (!unmounted) {
      // Fetch data initially
      fetchData();

      // Listeners
      jackpotSocket.on("game-join-error-low", handleErrorLow);
      jackpotSocket.on("game-join-error-middle", handleErrorMiddle);
      jackpotSocket.on("game-join-error-high", handleErrorHigh);
      jackpotSocket.on("game-join-success-low", handleSuccessLow);
      jackpotSocket.on("game-join-success-middle", handleSuccessMiddle);
      jackpotSocket.on("game-join-success-high", handleSuccessHigh);
      jackpotSocket.on("new-player-low", addPlayerLow);
      jackpotSocket.on("new-player-middle", addPlayerMiddle);
      jackpotSocket.on("new-player-high", addPlayerHigh);
      jackpotSocket.on("percentages-updated-low", percentagesUpdatedLow);
      jackpotSocket.on("percentages-updated-middle", percentagesUpdatedMiddle);
      jackpotSocket.on("percentages-updated-high", percentagesUpdatedHigh);
      jackpotSocket.on("pottitlehigh-updated-low", potTitleHighLow);
      jackpotSocket.on("pottitlehigh-updated-middle", potTitleHighMiddle);
      jackpotSocket.on("pottitlehigh-updated-high", potTitleHighHigh);
      jackpotSocket.on("countdown-started-low", countdownStartedLow);
      jackpotSocket.on("countdown-started-middle", countdownStartedMiddle);
      jackpotSocket.on("countdown-started-high", countdownStartedHigh);
      jackpotSocket.on("game-rolled-low", gameRolledLow);
      jackpotSocket.on("game-rolled-middle", gameRolledMiddle);
      jackpotSocket.on("game-rolled-high", gameRolledHigh);
      jackpotSocket.on("new-round-low", newRoundLow);
      jackpotSocket.on("new-round-middle", newRoundMiddle);
      jackpotSocket.on("new-round-high", newRoundHigh);
      window.addEventListener("focus", onFocus);
      window.addEventListener("focus", onFocus2);
    }
    // componentDidUnmount
    return () => {
      unmounted = true;
      // Remove Listeners
      jackpotSocket.off("game-join-error-low", handleErrorLow);
      jackpotSocket.off("game-join-error-middle", handleErrorMiddle);
      jackpotSocket.off("game-join-error-high", handleErrorHigh);
      jackpotSocket.off("game-join-success-low", handleSuccessLow);
      jackpotSocket.off("game-join-success-middle", handleSuccessMiddle);
      jackpotSocket.off("game-join-success-high", handleSuccessHigh);
      jackpotSocket.off("new-player-low", addPlayerLow);
      jackpotSocket.off("new-player-middle", addPlayerMiddle);
      jackpotSocket.off("new-player-high", addPlayerHigh);
      jackpotSocket.off("percentages-updated-low", percentagesUpdatedLow);
      jackpotSocket.off("percentages-updated-middle", percentagesUpdatedMiddle);
      jackpotSocket.off("percentages-updated-high", percentagesUpdatedHigh);
      jackpotSocket.off("pottitlehigh-updated-low", potTitleHighLow);
      jackpotSocket.off("pottitlehigh-updated-middle", potTitleHighMiddle);
      jackpotSocket.off("pottitlehigh-updated-high", potTitleHighHigh);
      jackpotSocket.off("countdown-started-low", countdownStartedLow);
      jackpotSocket.off("countdown-started-middle", countdownStartedMiddle);
      jackpotSocket.off("countdown-started-high", countdownStartedHigh);
      jackpotSocket.off("game-rolled-low", gameRolledLow);
      jackpotSocket.off("game-rolled-middle", gameRolledMiddle);
      jackpotSocket.off("game-rolled-high", gameRolledHigh);
      jackpotSocket.off("new-round-low", newRoundLow);
      jackpotSocket.off("new-round-middle", newRoundMiddle);
      jackpotSocket.off("new-round-high", newRoundHigh);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("focus", onFocus2);
    };
  }, [addToast]);

  return (
    <Box className={classes.barContainer}>
      <Box className={classes.root}>
        <Container className={classes.rootContainer}>
          <Box className={classes.logo}>

          </Box>
          <Grid container>
            <Grow in timeout={820}>
              <Box className={classes.animation}>
                <Box className={classes.animationHashHistory}>
                  <Tooltip
                    interactive
                    title={
                      <span>
                        Check Game History
                      </span>
                    }
                    placement="bottom"
                  >
                    <Link
                      style={{ textDecoration: "none", }}
                      exact
                      to="/history"
                    >
                      <Button disableRipple style={{ textDecoration: "none", }} className={classes.buttonhistoryicon}>
                        <HistoryIcon style={{ color: "rgb(72, 82, 97)", cursor: "pointer", fontSize: "25px", marginRight: "-50px", marginBottom: "7px", }} />
                      </Button>
                    </Link>
                  </Tooltip>
                  <Tooltip
                    interactive
                    title={
                      <span>
                        Round ID: {focusLowPot === true ? gameIdLow : focusMiddlePot === true ? gameIdMiddle : focusHighPot === true ? gameIdHigh : ""}
                        <br />
                        Private Hash: {focusLowPot === true ? privateHashLow : focusMiddlePot === true ? privateHashMiddle : focusHighPot === true ? privateHashHigh : ""}
                      </span>
                    }
                    placement="bottom"
                  >
                    <p className={classes.hashvalue}><InfoOutlinedIcon /></p>
                  </Tooltip>
                </Box>
                <Box
                  className={potSizeLow}
                  onClick={onClickFocusLow}
                  style={{ cursor: focusLowPot === false ? "pointer" : "default", }}
                >
                  {showPointerLow === true ? (
                    <Box className={classes.jackpotPointerLow}></Box>
                  ) : (
                    <Box></Box>
                  )}
                  <Box className={classes.jackpotCenterLow}>
                    <p className={classes.jackpotTextPotLow}>LOW</p>
                    <p className={classes.jackpotTextValueLow}>{PotTitleCheckLow()}</p>
                    <p className={classes.jackpotTextSizeLow}>0,1 - 5</p>
                  </Box>
                  {loading ? (
                    <Box></Box>
                  ) : (
                    <Box className={classes.jackpotCenterCircleLow} style={{ display: hideTimerLow, }}>
                      <CountdownCircleTimer
                        size={244}
                        isPlaying={startCountDownLow === false ? false : true}
                        duration={timerDurationLow}
                        initialRemainingTime={waitTimeLow}
                        strokeWidth={4}
                        strokeLinecap={"square"}
                        colors={["#c5c9c6"]}
                        trailColor={["#0D1116"]}
                        onComplete={() => {
                          // do your stuff here
                          setShowPointerLow(true);
                          return { shouldRepeat: false, } // repeat animation false
                        }}
                      >
                      </CountdownCircleTimer>
                    </Box>)}
                  <Box
                    style={gameStatusLow === 4 ?
                      {
                        transform: `rotate(${rotationLow}deg)`,
                        WebkitTransform: `rotate(${rotationLow}deg)`,
                        transition: `transform ${jackpotAnimationDurationLow}s cubic-bezier(0.000, 0.440, 0.385, 1.000)`,
                      } : {
                        transform: `rotate(${rotationLow}deg)`,
                        WebkitTransform: `rotate(${rotationLow}deg)`,
                        transition: `transform ${jackpotAnimationDurationLow}s cubic-bezier(0.000, 0.440, 0.385, 1.000)`,
                      }
                    }>
                    <PieChart width={398} height={398}>
                      <Pie
                        data={CheckFunctionLow()}
                        cx={194}
                        cy={194}
                        isAnimationActive={false}
                        startAngle={pieStartAngleLow}
                        endAngle={pieEndAngleLow}
                        innerRadius={132}
                        outerRadius={197.19}
                        fill="#85898e"
                        paddingAngle={0}
                        dataKey="winningPercentage"
                        blendStroke
                        label={focusLowPot === true ? renderCustomizedLabelLow : ""}
                        labelLine={false}
                      >
                        {
                          dataPieLow.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieCOLORS[index]}
                              style={{
                                opacity: index === winnerINDEXLow && showWinnerTitleLow === true ? 1 : index !== winnerINDEXLow && showWinnerTitleLow === true ? 0.6 : 1
                              }}
                            />
                          ))
                        }
                      </Pie>
                    </PieChart>
                  </Box>
                </Box>
                <Box
                  className={potSizeMiddle}
                  onClick={onClickFocusMiddle}
                  style={{ cursor: focusMiddlePot === false ? "pointer" : "default", }}
                >
                  {showPointerMiddle === true ? (
                    <Box className={classes.jackpotPointerMiddle}></Box>
                  ) : (
                    <Box></Box>
                  )}
                  <Box className={classes.jackpotCenterMiddle}>
                    <p className={classes.jackpotTextPotMiddle}>MEDIUM</p>
                    <p className={classes.jackpotTextValueMiddle}>{PotTitleCheckMiddle()}</p>
                    <p className={classes.jackpotTextSizeMiddle}>1 - 25</p>
                  </Box>
                  {loadingMiddle ? (
                    <Box></Box>
                  ) : (
                    <Box className={classes.jackpotCenterCircleMiddle} style={{ display: hideTimerMiddle, }}>
                      <CountdownCircleTimer
                        size={244}
                        isPlaying={startCountDownMiddle === false ? false : true}
                        duration={timerDurationMiddle}
                        initialRemainingTime={waitTimeMiddle}
                        strokeWidth={4}
                        strokeLinecap={"square"}
                        colors={["#c5c9c6"]}
                        trailColor={["#0D1116"]}
                        onComplete={() => {
                          // do your stuff here
                          setShowPointerMiddle(true);
                          return { shouldRepeat: false, } // repeat animation false
                        }}
                      >
                      </CountdownCircleTimer>
                    </Box>)}
                  <Box
                    style={gameStatusMiddle === 4 ?
                      {
                        transform: `rotate(${rotationMiddle}deg)`,
                        WebkitTransform: `rotate(${rotationMiddle}deg)`,
                        transition: `transform ${jackpotAnimationDurationMiddle}s cubic-bezier(0.000, 0.440, 0.385, 1.000)`,
                      } : {
                        transform: `rotate(${rotationMiddle}deg)`,
                        WebkitTransform: `rotate(${rotationMiddle}deg)`,
                        transition: `transform ${jackpotAnimationDurationMiddle}s cubic-bezier(0.000, 0.440, 0.385, 1.000)`,
                      }
                    }>
                    <PieChart width={398} height={398}>
                      <Pie
                        data={CheckFunctionMiddle()}
                        cx={194}
                        cy={194}
                        isAnimationActive={false}
                        startAngle={pieStartAngleMiddle}
                        endAngle={pieEndAngleMiddle}
                        innerRadius={132}
                        outerRadius={197.19}
                        fill="#85898e"
                        paddingAngle={0}
                        dataKey="winningPercentage"
                        blendStroke
                        label={focusMiddlePot === true ? renderCustomizedLabelMiddle : ""}
                        labelLine={false}
                      >
                        {
                          dataPieMiddle.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieCOLORS[index]}
                              style={{
                                opacity: index === winnerINDEXMiddle && showWinnerTitleMiddle === true ? 1 : index !== winnerINDEXMiddle && showWinnerTitleMiddle === true ? 0.6 : 1
                              }}
                            />
                          ))
                        }
                      </Pie>
                    </PieChart>
                  </Box>
                </Box>
                <Box
                  className={potSizeHigh}
                  onClick={onClickFocusHigh}
                  style={{ cursor: focusHighPot === false ? "pointer" : "default", }}
                >
                  {showPointerHigh === true ? (
                    <Box className={classes.jackpotPointerHigh}></Box>
                  ) : (
                    <Box></Box>
                  )}
                  <Box className={classes.jackpotCenterHigh}>
                    <p className={classes.jackpotTextPotHigh}>HIGH</p>
                    <p className={classes.jackpotTextValueHigh}>{PotTitleCheckHigh()}</p>
                    <p className={classes.jackpotTextSizeHigh}>10 - 2,500</p>
                  </Box>
                  {loadingHigh ? (
                    <Box></Box>
                  ) : (
                    <Box className={classes.jackpotCenterCircleHigh} style={{ display: hideTimerHigh, }}>
                      <CountdownCircleTimer
                        size={244}
                        isPlaying={startCountDownHigh === false ? false : true}
                        duration={timerDurationHigh}
                        initialRemainingTime={waitTimeHigh}
                        strokeWidth={4}
                        strokeLinecap={"square"}
                        colors={["#c5c9c6"]}
                        trailColor={["#0D1116"]}
                        onComplete={() => {
                          // do your stuff here
                          setShowPointerHigh(true);
                          return { shouldRepeat: false, } // repeat animation false
                        }}
                      >
                      </CountdownCircleTimer>
                    </Box>)}
                  <Box
                    style={gameStatusHigh === 4 ?
                      {
                        transform: `rotate(${rotationHigh}deg)`,
                        WebkitTransform: `rotate(${rotationHigh}deg)`,
                        transition: `transform ${jackpotAnimationDurationHigh}s cubic-bezier(0.000, 0.440, 0.385, 1.000)`,
                      } : {
                        transform: `rotate(${rotationHigh}deg)`,
                        WebkitTransform: `rotate(${rotationHigh}deg)`,
                        transition: `transform ${jackpotAnimationDurationHigh}s cubic-bezier(0.000, 0.440, 0.385, 1.000)`,
                      }
                    }>
                    <PieChart width={398} height={398}>
                      <Pie
                        data={CheckFunctionHigh()}
                        cx={194}
                        cy={194}
                        isAnimationActive={false}
                        startAngle={pieStartAngleHigh}
                        endAngle={pieEndAngleHigh}
                        innerRadius={132}
                        outerRadius={197.19}
                        fill="#85898e"
                        paddingAngle={0}
                        dataKey="winningPercentage"
                        blendStroke
                        label={focusHighPot === true ? renderCustomizedLabelHigh : ""}
                        labelLine={false}
                      >
                        {
                          dataPieHigh.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieCOLORS[index]}
                              style={{
                                opacity: index === winnerINDEXHigh && showWinnerTitleHigh === true ? 1 : index !== winnerINDEXHigh && showWinnerTitleHigh === true ? 0.6 : 1
                              }}
                            />
                          ))
                        }
                      </Pie>
                    </PieChart>
                  </Box>
                </Box>
              </Box>
            </Grow>
            {focusLowPot === true ? (
              <Toolbar variant="dense" className={classes.controls}>
                <Box className={classes.right}>
                  <Box className={classes.sliderWrapper}>
                    <p className={classes.sliderWrapperText1}>MIN: 0,1</p>
                    <Slider
                      className={classes.slidertest}
                      styles={{
                        track: {
                          backgroundColor: '#5f6368',
                          height: "3px",
                          marginTop: "17px",
                          width: "113px",
                          touchAction: "none",
                        },
                        active: {
                          backgroundColor: '#ebebeb'
                        },
                        thumb: {
                          width: 14,
                          height: 14,
                        },
                      }}
                      axis="x"
                      xstep={0.1}
                      xmin={0.1}
                      xmax={isAuthenticated && user.wallet > 5 ? 5 : isAuthenticated && user.wallet < 5 ? user.wallet : 5}
                      x={betAmountLow}
                      onChange={({ x }) => setBetAmountLow(parseFloat(x.toFixed(0)) + ".00")}
                    />
                    <p className={classes.sliderWrapperText2}>MAX: {isAuthenticated && user.wallet > 5 ? "5" : isAuthenticated && user.wallet < 5 ? user.wallet.toFixed(2) : "5"}</p>
                  </Box>
                  <BetInput
                    label=""
                    value={betAmountLow}
                    onChange={onChangeLow}
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          style={{
                            color: !isAuthenticated ? "#ffffff" : playersLow.map(player => player._id).includes(user._id) && isAuthenticated ? pieCOLORS[playersLow.findIndex(player => player._id === user._id)] : "#707479"
                          }}
                          position="start"
                        >
                          <AttachMoneyIcon style={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    className={classes.create}
                    size="medium"
                    color="primary"
                    variant="contained"
                    disabled={joiningLow}
                    onClick={onClickJoinLow}
                  >
                    <span className={classes.reverse}>
                      {joiningLow ? "JOINING..." : "PLACE BET"}
                    </span>
                  </Button>
                </Box>
                <Grid className={classes.players}>
                  <TransitionGroup>
                    {playersLow.map((player, index) => (
                      <Collapse key={index}>
                        <Box className={classes.smallBet}>
                          <Avatar src={player.avatar} variant="rounded" className={classes.avatar2}
                            style={{ borderRadius: "50%", border: `3px solid ${pieCOLORS[index]}`, filter: `drop-shadow(0 0 3px ${pieCOLORS[index]})`, }} />
                          <Tooltip
                            interactive
                            title={
                              <span>
                                <h5 style={{ fontSize: "10px", fontFamily: "Rubik", fontWeight: 200, margin: "0px", }}>
                                  Winning Chance: <span style={{ marginLeft: "3px", }}>%</span>
                                  {player.winningPercentage.toFixed(2)}{" "}
                                </h5>
                              </span>
                            }
                            placement="right"
                          >
                            <Box className={classes.betInfo}>
                              <span
                                style={{ background: player.level.levelColor }}
                                className={classes.userlevel}>{player.level.name}</span>
                              <h3 style={{ color: "#e4e4e4", cursor: "pointer", }}>
                                {player.username}
                              </h3>
                            </Box>
                          </Tooltip>
                          <Box style={{ margin: "auto", marginRight: "15px", display: "flex", }}>
                            <h5>
                              <span style={{ color: `${pieCOLORS[index]}`, }}>$</span>
                              {player.betAmount.toFixed(2)}{" "}
                            </h5>
                          </Box>
                        </Box>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </Grid>
              </Toolbar>
            ) : focusMiddlePot === true ? (
              <Toolbar variant="dense" className={classes.controls}>
                <Box className={classes.right}>
                  <Box className={classes.sliderWrapper}>
                    <p className={classes.sliderWrapperText1}>MIN: 1</p>
                    <Slider
                      className={classes.slidertest}
                      styles={{
                        track: {
                          backgroundColor: '#5f6368',
                          height: "3px",
                          marginTop: "17px",
                          width: "115px",
                          touchAction: "none",
                        },
                        active: {
                          backgroundColor: '#ebebeb'
                        },
                        thumb: {
                          width: 14,
                          height: 14,
                        },
                      }}
                      axis="x"
                      xstep={0.5}
                      xmin={1}
                      xmax={isAuthenticated && user && user.wallet > 25 ? 25 : isAuthenticated && user && user.wallet < 25 ? user.wallet : 25}
                      x={betAmountMiddle}
                      onChange={({ x }) => setBetAmountMiddle(parseFloat(x.toFixed(0)) + ".00")}
                    />
                    <p className={classes.sliderWrapperText2}>MAX: {isAuthenticated && user && user.wallet > 25 ? "25" : isAuthenticated && user && user.wallet < 25 ? user.wallet.toFixed(2) : "25"}</p>
                  </Box>
                  <BetInput
                    label=""
                    value={betAmountMiddle}
                    onChange={onChangeMiddle}
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          style={{
                            color: !isAuthenticated ? "#ffffff" : isAuthenticated && user && playersMiddle.map(player => player._id).includes(user._id) ? pieCOLORS[playersMiddle.findIndex(player => player._id === user._id)] : "#707479"
                          }}
                          position="start"
                        >
                          <AttachMoneyIcon style={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    className={classes.create}
                    size="medium"
                    color="primary"
                    variant="contained"
                    disabled={joiningMiddle}
                    onClick={onClickJoinMiddle}
                  >
                    <span className={classes.reverse}>
                      {joiningMiddle ? "JOINING..." : "PLACE BET"}
                    </span>
                  </Button>
                </Box>
                <Grid className={classes.players}>
                  <TransitionGroup>
                    {playersMiddle.map((player, index) => (
                      <Collapse key={index}>
                        <Box className={classes.smallBet}>
                          <Avatar src={player.avatar} variant="rounded" className={classes.avatar2}
                            style={{ borderRadius: "50%", border: `3px solid ${pieCOLORS[index]}`, filter: `drop-shadow(0 0 3px ${pieCOLORS[index]})`, }} />
                          <Tooltip
                            interactive
                            title={
                              <span>
                                <h5 style={{ fontSize: "10px", fontFamily: "Rubik", fontWeight: 200, margin: "0px", }}>
                                  Winning Chance: <span style={{ marginLeft: "3px", }}>%</span>
                                  {player.winningPercentage.toFixed(2)}{" "}
                                </h5>
                              </span>
                            }
                            placement="right"
                          >
                            <Box className={classes.betInfo}>
                              <span
                                style={{ background: player.level.levelColor }}
                                className={classes.userlevel}>{player.level.name}</span>
                              <h3 style={{ color: "#e4e4e4", cursor: "pointer", }}>
                                {player.username}
                              </h3>
                            </Box>
                          </Tooltip>
                          <Box style={{ margin: "auto", marginRight: "15px", display: "flex", }}>
                            <h5>
                              <span style={{ color: `${pieCOLORS[index]}`, }}>$</span>
                              {player.betAmount.toFixed(2)}{" "}
                            </h5>
                          </Box>
                        </Box>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </Grid>
              </Toolbar>
            ) : (
              <Toolbar variant="dense" className={classes.controls}>
                <Box className={classes.right}>
                  <Box className={classes.sliderWrapper}>
                    <p className={classes.sliderWrapperText1}>MIN: 10</p>
                    <Slider
                      className={classes.slidertest}
                      styles={{
                        track: {
                          backgroundColor: '#5f6368',
                          height: "3px",
                          marginTop: "17px",
                          width: "93px",
                          touchAction: "none",
                        },
                        active: {
                          backgroundColor: '#ebebeb'
                        },
                        thumb: {
                          width: 14,
                          height: 14,
                        },
                      }}
                      axis="x"
                      xstep={1}
                      xmin={10}
                      xmax={isAuthenticated && user.wallet > 2500 ? 2500 : isAuthenticated && user.wallet < 2500 ? user.wallet : 2500}
                      x={betAmountHigh}
                      onChange={({ x }) => setBetAmountHigh(parseFloat(x.toFixed(0)) + ".00")}
                    />
                    <p className={classes.sliderWrapperText2}>MAX: {isAuthenticated && user.wallet > 2500 ? "2500" : isAuthenticated && user.wallet < 2500 ? user.wallet.toFixed(2) : "2500"}</p>
                  </Box>
                  <BetInput
                    label=""
                    value={betAmountHigh}
                    onChange={onChangeHigh}
                    variant="filled"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          className={classes.inputIcon}
                          style={{
                            color: !isAuthenticated ? "#ffffff" : playersHigh.map(player => player._id).includes(user._id) && isAuthenticated ? pieCOLORS[playersHigh.findIndex(player => player._id === user._id)] : "#707479"
                          }}
                          position="start"
                        >
                          <AttachMoneyIcon style={{ fontSize: 16 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    className={classes.create}
                    size="medium"
                    color="primary"
                    variant="contained"
                    disabled={joiningHigh}
                    onClick={onClickJoinHigh}
                  >
                    <span className={classes.reverse}>
                      {joiningHigh ? "JOINING..." : "PLACE BET"}
                    </span>
                  </Button>
                </Box>
                <Grid className={classes.players}>
                  <TransitionGroup>
                    {playersHigh.map((player, index) => (
                      <Collapse key={index}>
                        <Box className={classes.smallBet}>
                          <Avatar src={player.avatar} variant="rounded" className={classes.avatar2}
                            style={{ borderRadius: "50%", border: `3px solid ${pieCOLORS[index]}`, filter: `drop-shadow(0 0 3px ${pieCOLORS[index]})`, }} />
                          <Tooltip
                            interactive
                            title={
                              <span>
                                <h5 style={{ fontSize: "10px", fontFamily: "Rubik", fontWeight: 200, margin: "0px", }}>
                                  Winning Chance: <span style={{ marginLeft: "3px", }}>%</span>
                                  {player.winningPercentage.toFixed(2)}{" "}
                                </h5>
                              </span>
                            }
                            placement="right"
                          >
                            <Box className={classes.betInfo}>
                              <span
                                style={{ background: player.level.levelColor }}
                                className={classes.userlevel}>{player.level.name}</span>
                              <h3 style={{ color: "#e4e4e4", cursor: "pointer", }}>
                                {player.username}
                              </h3>
                            </Box>
                          </Tooltip>
                          <Box style={{ margin: "auto", marginRight: "15px", display: "flex", }}>
                            <h5>
                              <span style={{ color: `${pieCOLORS[index]}`, }}>$</span>
                              {player.betAmount.toFixed(2)}{" "}
                            </h5>
                          </Box>
                        </Box>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                </Grid>
              </Toolbar>
            )}
          </Grid>
        </Container>
      </Box>
    </Box >
  );
};

Jackpot.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Jackpot);
