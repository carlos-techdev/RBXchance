import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import {
  getActiveCoinflipGames,
  getCoinflipPrivateGame,
  getUserPrivateCoinflipGames,
} from "../services/api.service";
import { coinflipSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import RefreshIcon from '@material-ui/icons/Refresh';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@material-ui/core/Collapse';
import Grow from '@material-ui/core/Grow';

// Components
import Game from "../components/coinflip/GameList";
import RoundSkeleton from "../components/RoundSkeleton";
import Color from "../components/controls/Color";
import PrivateGameModal from "../components/modals/coinflip/PrivateGameModal";

import { TotalAmount as TotalPlayAmount } from "../components/coinflip/TotalAmount";
import { JoinableAmount as CoinflipJoinableAmount } from "../components/coinflip/JoinableAmount";

import error from "../assets/error.wav";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    // width: "75%",
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  container: {
    width: "100%",
    minHeight: "32.5rem",
    marginTop: 20,
    maxHeight: "670px",
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "0px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#3e4a59",
      borderRadius: "14px",
    },
    "&::-webkit-scrollbar-track": {
      borderRadius: "14px",
      background: "#0D1116",
    },
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      marginTop: 15,
      overflow: "scroll",
      maxHeight: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      marginTop: 15,
      overflow: "scroll",
      maxHeight: "100%",
    },
    [theme.breakpoints.down("md")]: {
      padding: 0,
      marginTop: 15,
      overflow: "scroll",
      maxHeight: "100%",
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "100%",
    },
    "& > div": {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "auto",
      },
    },
  },
  containerGrid: {
    display: "inherit",
    width: "calc(100% + 35px)",
    overflowY: "hidden",
    overflowX: "hidden",
    scrollbarWidth: "none",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      margin: "0px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      margin: "0px",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      margin: "0px",
    },
  },
  box: {
    marginBottom: 5,
  },
  round: {
    display: "flex",
    height: "10rem",
    width: "100%",
    marginBottom: 10,
    border: "1px solid #111729",
    borderRadius: 5,
  },
  logo: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "19px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
    },
  },
  provably: {
    background: "#111729",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "3rem",
    "& span": {
      color: "#232b42",
    },
    "& svg": {
      transform: "rotate(45deg)",
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    alignItems: "center",
    justifyContent: "center",
    "& h1": {
      margin: 0,
      color: "white",
      fontSize: 20,
      fontWeight: "100",
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#191c30",
    },
  },
  players: {
    width: "15rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
  player: {
    display: "flex",
    color: "white",
    alignItems: "center",
    "& img": {
      width: "2rem",
      height: "auto",
      marginRight: "1rem",
    },
    "& span": {
      marginLeft: "1rem",
    },
  },
  coinflipGamesLayout: {
    marginLeft: "9%",
    marginRight: "9%",
    marginTop: "2.5rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "5%",
      marginRight: "5%",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "5%",
      marginRight: "5%",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "5%",
      marginRight: "5%",
    },
  },
  gamesStats: {
    background: "#12171D",
    borderRadius: "15px",
    marginBottom: "20px",
    marginTop: "25px",
    [theme.breakpoints.down("xs")]: {

    },
  },
  gamesStats2: {
    border: "1px solid #161D26",
    height: "100px",
    position: "sticky",
    marginTop: "20px",
    borderRadius: "15px",
    [theme.breakpoints.down("xs")]: {
      height: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      height: "100%",
    },
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  totalAmountCoinflip: {
    margin: "20px",
    padding: "12px",
    background: "#0D1116",
    border: "2px solid #0D1116",
    borderRadius: "15px",
    [theme.breakpoints.down("xs")]: {

    },
  },
  totalJoinableCoinflip: {
    margin: "20px",
    padding: "12px",
    background: "#0D1116",
    border: "2px solid #0D1116",
    borderRadius: "15px",
    [theme.breakpoints.down("xs")]: {

    },
  },
  totalHistoryCoinflip: {
    margin: "20px",
    padding: "12px",
    background: "#0D1116",
    border: "2px solid #0D1116",
    borderRadius: "15px",
    marginLeft: "auto",
    cursor: "pointer",
    "&:hover": {
      border: "2px solid #3386c9",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "20px",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "20px",
    },
  },
  gamesStatsInside: {
    display: "flex",
    position: "relative",
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
  gameLayout: {
    // display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
    },
  },
  controls: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    order: "initial",
    background: "#12171D",
    border: "1px solid #161D26",
    paddingTop: "1rem",
    borderRadius: "20px",
    marginTop: "20px",
    marginRight: "30px",
    [theme.breakpoints.down("xs")]: {

    },
    [theme.breakpoints.down("sm")]: {

    },
    [theme.breakpoints.down("md")]: {

    },
  },
  innercontrols: {
    position: "sticky",
    width: "100%",
    display: "flex",
    gap: "0.5rem",
    [theme.breakpoints.down("sm")]: {

    },
  },
  betbuttons: {
    position: "relative",
    marginBottom: "10px",
    height: "fit-content",
    [theme.breakpoints.down("sm")]: {

    },
  },
  betbuttons2: {
    transition: "opacity .2s ease",
    height: "fit-content",
    marginBottom: "10px",
    [theme.breakpoints.down("sm")]: {

    },
  },
  create: {
    backgroundColor: "#FFC440",
    borderColor: "#FFC440",
    boxShadow: "0 1.5px #191e24",
    color: "#000",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    width: "200px",
    height: "100%",
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      padding: "6px 16px",
    },
    "&:hover": {
      backgroundColor: "#FFC440",
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#FFC440",
    background: "transparent !important",
  },
  multiplier: {
    backgroundColor: "#0D1116",
    borderColor: "#32363c",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      marginTop: "15px",
      marginBottom: "25px",
    },
  },
  multiplier2: {
    backgroundColor: "#0D1116",
    boxShadow: "none",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".1px",
    marginRight: 10,
    padding: "3px 12px",
    "&:hover": {
      backgroundColor: "#0D1116",
      boxShadow: "none",
    },
    [theme.breakpoints.down("sm")]: {

    },
  },
  gamesdesign: {
    width: "100%",
    marginTop: "12px",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
      marginBottom: "200px",
    },
  },
  animationnetworkwrapper1: {
    marginRight: "auto",
    marginTop: "16px",
    fontSize: "13px",
    color: "#d5d9dd",
    [theme.breakpoints.down("sm")]: {
    },
  },
  animationnetworkwrapper: {
    color: "rgb(76, 175, 80)",
    borderRadius: "100%",
    animation: "blink 1.6s linear infinite",
    marginRight: "2px",
    [theme.breakpoints.down("sm")]: {
    },
  },
  animationnetwork: {
    color: "rgb(76, 175, 80)",
    borderRadius: "100%",
    [theme.breakpoints.down("sm")]: {
    },
  },
  result: {
    background: "#070A15",
    width: "30%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  private: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      display: "inherit",
    },
    "& > span:nth-child(2)": {
      marginLeft: 10,
      marginRight: 40,
      [theme.breakpoints.down("sm")]: {
        marginLeft: 0,
        //display: "none",
        marginRight: 40,
        marginTop: "5px",
      },
    },
    "& > span:nth-child(1)": {
      [theme.breakpoints.down("sm")]: {
        //display: "none",
      },
    },
  },
  reverse2: {
    alignItems: "center",
    justifyContent: "center",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "12px",
    marginBottom: "5px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  popover: {
    marginTop: 10,
    position: "relative",
    "& > .MuiPopover-paper": {
      background: "#32363c",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "11px",
      fontWeight: 500,
      letterSpacing: ".1em",
      width: 300,
      overflow: "visible",
      padding: "1rem 2rem",
    },
    "& .MuiSlider-markLabel": {
      color: "white",
      opacity: 0.5,
      transition: "0.5s ease",
      fontSize: 10,
    },
    "& .MuiSlider-markLabelActive": {
      color: "white",
      opacity: 1,
      transition: "0.5s ease",
      fontSize: 12,
    },
  },
  noGames: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  gamecollapse: {
    marginRight: "15px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "30px",
      marginRight: "1px",
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "30px",
      marginRight: "1px",
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: "30px",
      marginRight: "1px",
    },
  },
}));


// Custom Styled Component
const BetInput = withStyles(theme => ({
  root: {
    width: "100%",
    marginTop: "auto",
    marginRight: "1rem",
    borderRadius: "10px",
    background: "#32363c",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      marginBottom: "10px",
    },
    "& :before": {
      display: "none",
    },
    "& :after": {
      display: "none",
    },
    "& label": {
      color: "#323956",
      fontSize: 15,
    },
    "& div input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      marginLeft: "-15px",
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
      borderRadius: "10px",
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


const Coinflip = ({ user, match, history, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [games, setGames] = useState([]);
  const [privateGame] = useState(true);
  const [betAmount, setBetAmount] = useState("0.00");
  const playerAmount = 2;
  const [costMultiplier] = useState(0);
  const [color, setColor] = useState("red");
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [privateLink, setPrivateLink] = useState(null);

  // TextField onChange event handler
  const onChange = e => {
    const value = e.target.value;
    setBetAmount(value);
  };

  // Button switch onChange event handler
  const colorOnChange = e => {
    setColor(e.target.value);
  };

  // Add new game
  const addGame = game => {
    setCreating(false);
    setGames(state => (state ? [game, ...state] : null));
  };

  // Show private game invite link
  const addPrivateGame = inviteLink => {
    setCreating(false);
    setPrivateLink(inviteLink);
    //setPrivateGameModalVisible(true);
    setTimeout(() => {
      history.push(inviteLink);
    }, 200)

  };

  // Button onClick event handler
  const onClickHistory = () => {
    setTimeout(() => {
      history.push("/coinflip_history");
    }, 200)
  };

  // Button onClick event handler
  const onClick = () => {
    setCreating(true);
    coinflipSocket.emit(
      "create-new-game",
      playerAmount,
      color,
      parseFloat(betAmount),
      privateGame,
      costMultiplier / 100
    );
  };

  // Handle player join event
  const gameJoined = data => {
    const { _id, newPlayer } = data;

    // Update State
    setGames(state =>
      state.map(game =>
        game._id === _id
          ? { ...game, players: [...game.players, newPlayer] }
          : game
      )
    );
  };

  // Handle game called bot event
  const gameBotCalled = data => {
    const { _id, playerId } = data;

    // Update State
    setGames(state =>
      state.map(game =>
        game._id === _id
          ? { ...game, voteBot: [...game.voteBot, playerId] }
          : game
      )
    );
  };

  // Handle game end event
  const gameRolled = newData => {
    //console.log(
    //  "[Coinflip] Game",
    //  newData._id,
    //  "rolled. Result:",
    //  newData.winningSide
    //);

    // Update State
    setTimeout(() => {
      setGames(state =>
        state.map(game =>
          game._id === newData._id ? { ...game, ...newData, status: 3 } : game
        )
      );
    }, 1000);
    // Wait for the animation
    setTimeout(() => {
      // Make the game disabled
      setGames(state =>
        state.map(game =>
          game._id === newData._id ? { ...game, ended: true } : game
        )
      );
    }, 18500);
  };

  // Handle game rolling event
  const gameRolling = gameId => {
    //console.log("[Coinflip] Game", gameId, "rolling...");
    // Update State
    setGames(state =>
      state.map(game => (game._id === gameId ? { ...game, status: 2 } : game))
    );
  };

  // componentDidMount
  useEffect(() => {
    // Fetch active games from the API
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getActiveCoinflipGames();
        // Update state
        setGames(games);
        setLoading(false);
      } catch (error) {
        addToast(
          "There was an error while loading games data, please try again later!",
          { appearance: "error" }
        );
        console.log("There was an error while loading Coinflip games:", error);
      }
    };

    // Fetch private game data from API
    const fetchPrivateGameData = async inviteCode => {
      setLoading(true);
      try {
        const game = await getCoinflipPrivateGame(inviteCode);

        // Update State
        setGames([game]);
        setLoading(false);
      } catch (error) {
        // If game was not found
        if (error.response && error.response.status === 400) {
          addToast("Couldn't find any active games with that invite link!", {
            appearance: "error",
          });
          playSound(errorAudio);
          history.push("/coinflip");
        } else {
          addToast(
            "There was an error while loading that private game data, please try again later!",
            { appearance: "error" }
          );
          playSound(errorAudio);
          history.push("/coinflip");
        }
        console.log(
          "There was an error while loading private game data:",
          error
        );
      }
    };

    // There was an error while creating a game
    const creationError = msg => {
      // Update state
      setCreating(false);

      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Joining a game was successfull
    const joinSuccess = () => {
      //addToast("Successfully joined a game!", { appearance: "success" });
    };

    // There was an error while joining a game
    const joinError = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Calling a bot was successfull
    const callingBotSuccess = () => {
      //addToast("Successfully called a bot!", { appearance: "success" });
    };

    // There was an error while calling a bot
    const callingBotError = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // If game id was passed (private game route)
    if (match.params.inviteCode) {
      // Fetch private game data
      fetchPrivateGameData(match.params.inviteCode);
    } else {
      // Fetch games when component mounts
      fetchData();
    }
    // Listeners
    coinflipSocket.on("game-creation-error", creationError);
    coinflipSocket.on("new-coinflip-game", addGame);
    coinflipSocket.on("game-joined", gameJoined);
    coinflipSocket.on("game-called-bot", gameBotCalled);
    coinflipSocket.on("game-rolled", gameRolled);
    coinflipSocket.on("game-rolling", gameRolling);
    coinflipSocket.on("private-game-created", addPrivateGame);
    coinflipSocket.on("game-join-error", joinError);
    coinflipSocket.on("game-join-success", joinSuccess);
    coinflipSocket.on("game-call-bot-error", callingBotError);
    coinflipSocket.on("game-call-bot-success", callingBotSuccess);


    // componentDidUnmount
    return () => {
      // Remove listeners
      coinflipSocket.off("game-creation-error", creationError);
      coinflipSocket.off("new-coinflip-game", addGame);
      coinflipSocket.off("game-joined", gameJoined);
      coinflipSocket.off("game-called-bot", gameBotCalled);
      coinflipSocket.off("game-rolled", gameRolled);
      coinflipSocket.off("game-rolling", gameRolling);
      coinflipSocket.off("private-game-created", addPrivateGame);
      coinflipSocket.off("game-join-error", joinError);
      coinflipSocket.off("game-join-success", joinSuccess);
      coinflipSocket.off("game-call-bot-error", callingBotError);
      coinflipSocket.off("game-call-bot-success", callingBotSuccess);
    };
    // eslint-disable-next-line
  }, [addToast, match.params]);

  // When user is loaded, fetch private games
  useEffect(() => {
    // Fetch private games from api
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getUserPrivateCoinflipGames();

        // Update state
        setGames(state => [...games, ...state]);
        setLoading(false);
      } catch (error) {
        addToast(
          "There was an error while loading your private games data, please try again later!",
          { appearance: "error" }
        );
        console.log(
          "There was an error while loading private Coinflip games:",
          error
        );
      }
    };

    // If game id was not passed (general route)
    if (!match.params.inviteCode) {
      fetchData();
    }
    // componentDidUnmount
  }, [addToast, match.params]); //isAuthenticated,

  // When player amount is changed, reset colors
  useEffect(() => {
    setColor("red");
  }, [playerAmount]);
  return (
    <Box className={classes.coinflipGamesLayout}>
      <Box className={classes.gamesStats}>
        <Box className={classes.gamesStats2}>
          <Box className={classes.gamesStatsInside}>
            <Box className={classes.totalAmountCoinflip}>
              <span style={{ color: "rgb(228 228 228)", fontSize: "20px", marginRight: "5px", marginLeft: "10px", display: "flex", }}><span style={{ color: "#4caf50", fontWeight: "800", }}>$</span><span style={{ color: "#f1f1f1", fontWeight: "500", marginLeft: "12px", }}><TotalPlayAmount /></span><span style={{ color: "#fff", fontSize: "14px", marginLeft: "12px", marginTop: "6px", }}>Total amount</span></span>
            </Box>
            <Box className={classes.totalJoinableCoinflip}>
              <span style={{ color: "rgb(228 228 228)", fontSize: "20px", display: "flex", marginRight: "5px", marginLeft: "5px", }}><span style={{ color: "#4caf50", fontWeight: "800", }}><LogoutIcon style={{ marginBottom: "-5px", color: "#ce9529", }} /></span><span style={{ color: "#f1f1f1", fontWeight: "500", marginLeft: "12px", }}><CoinflipJoinableAmount /></span><span style={{ color: "#fff", fontSize: "14px", marginLeft: "12px", marginTop: "6px", }}>Joinable games</span></span>
            </Box>
            <Box onClick={onClickHistory} className={classes.totalHistoryCoinflip} >
              <span style={{ color: "rgb(228 228 228)", fontSize: "20px", marginRight: "5px", marginLeft: "5px", }}><span style={{ color: "#fff", fontWeight: "800", }}><RefreshIcon style={{ marginBottom: "-5px", color: "#3386c9", }} /></span><span style={{ color: "#f1f1f1", fontWeight: "500", marginLeft: "12px", }}>History</span></span>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.gameLayout}>
        <PrivateGameModal
          open={privateGameModalVisible}
          handleClose={() => setPrivateGameModalVisible(state => !state)}
          link={privateLink}
        />
        <Toolbar variant="dense" className={classes.controls}>
          <Box className={classes.innercontrols}>
            {/*<Box className={classes.reverse2}>Bet amount</Box>*/}
            <div >
              <Box className={classes.betbuttons}>
                <BetInput
                  label=""
                  variant="filled"
                  onChange={onChange}
                  value={betAmount}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        className={classes.inputIcon}
                        position="start"
                      >
                        <AttachMoneyIcon style={{ fontSize: 16 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box className={classes.betbuttons2}>
                <Button
                  className={classes.multiplier2}
                  size="medium"
                  color="primary"
                  disableRipple
                  variant="contained"
                  onClick={() =>
                    setBetAmount(state => (parseFloat(state) / 2).toFixed(2))
                  }
                >
                  <span className={classes.reverse}>1/2</span>
                </Button>
                <Button
                  className={classes.multiplier2}
                  size="medium"
                  color="primary"
                  disableRipple
                  variant="contained"
                  onClick={() =>
                    setBetAmount(state => (parseFloat(state) * 2).toFixed(2))
                  }
                >
                  <span className={classes.reverse}>2x</span>
                </Button>
                <Button
                  className={classes.multiplier2}
                  size="medium"
                  color="primary"
                  disableRipple
                  variant="contained"
                  onClick={() => setBetAmount(user ? user.wallet : 0)}
                >
                  <span className={classes.reverse}>Max</span>
                </Button>
              </Box>            
            </div>
            <Color
              value={color}
              playerAmount={playerAmount}
              onChange={colorOnChange}
            />
            <Button
              className={classes.create}
              size="medium"
              color="primary"
              variant="contained"
              onClick={onClick}
            >
              <Box className={classes.reverse}>
                {creating ? (
                  "Starting..."
                ) : (
                  <Fragment style={{backgroundColor: "#FFC440"}}>
                    Start new game{" "}
                    {privateGame &&
                      costMultiplier &&
                      !isNaN(betAmount) &&
                      !isNaN(costMultiplier) &&
                      !isNaN(playerAmount)
                      ? `($${(
                        (parseFloat(betAmount) || 0) +
                        betAmount * (costMultiplier / 100) * (playerAmount - 1)
                      ).toFixed(2)})`
                      : ""}
                  </Fragment>
                )}
              </Box>
            </Button>
          </Box>
          {/*<Box className={classes.animationnetworkwrapper1}>
            <p><span className={classes.animationnetworkwrapper}><span className={classes.animationnetwork}>●</span></span> Network Status</p>
          </Box>*/}
        </Toolbar>

        <Box className={classes.root}>
          <Container maxWidth="lg" className={classes.container} style={games.length > 5 ? { overflow: "scroll" } : { overflow: "hidden" }}>
            <Grow in timeout={820}>
              <Grid container spacing={3} className={classes.containerGrid} >
                {loading ? (
                  <RoundSkeleton />
                ) : games.length > 0 ? (
                  <Box className={classes.gamesdesign}>
                    <TransitionGroup>
                      {games.map((game, index) => (
                        <Collapse key={index} className={classes.gamecollapse}>
                          <Game key={game._id} game={game} user={user} />
                        </Collapse>
                      ))}
                    </TransitionGroup>
                  </Box>
                ) : (
                  <Container className={classes.noGames}>
                    <p>NO CURRENTLY ACTIVE GAMES!</p>
                  </Container>
                )}
              </Grid>
            </Grow>
          </Container>
        </Box>
      </Box >
    </Box >
  );
};

Coinflip.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Coinflip);
