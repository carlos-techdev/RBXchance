import React, { useState, useEffect, useRef } from "react";
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
import Grow from '@material-ui/core/Grow';

// Components
import Game from "../components/coinflip/Game";
//import RoundSkeleton from "../components/RoundSkeleton";
import PrivateGameModal from "../components/modals/coinflip/PrivateGameModal";
import CircularProgress from "@material-ui/core/CircularProgress";

import error from "../assets/error.wav";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      //paddingBottom: "100%",
    },
  },
  container: {
    width: "100%",
    minHeight: "32.5rem",
    paddingTop: 50,
    paddingLeft: "150px",
    paddingRight: "150px",
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
      paddingLeft: "15px",
      paddingRight: "15px",
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: 25,
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: 25,
    },
    "& > div": {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "auto",
      },
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
  controls: {
    background: "#1e2225",
    padding: "1rem 5rem",
    // paddingTop: "2rem",
    borderBottom: "2px solid #2a4e2b",
    [theme.breakpoints.down("sm")]: {
      background: "#212529",
      borderBottom: "0px",
      padding: "1rem",
      paddingTop: "3rem",
      display: "grid",
    },
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
    [theme.breakpoints.down("sm")]: {
      //width: "100%",
      marginBottom: "100px",
      display: "flex",
      flexWrap: "wrap",
    },
  },
  create: {
    backgroundColor: "#3386c9",
    borderColor: "#3386c9",
    boxShadow: "0 1.5px #191e24",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0 2rem",
    textTransform: "capitalize",
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      padding: "6px 16px",
    },
    "&:hover": {
      backgroundColor: "#3386c9",
    },
  },
  inputIcon: {
    marginTop: "0 !important",
    color: "#FFC440",
    background: "transparent !important",
  },
  multiplier: {
    backgroundColor: "#32363c",
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
    backgroundColor: "#32363c",
    borderColor: "#32363c",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      //display: "none",
      //marginBottom: "10px",
    },
  },
  gamesdesign: {
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      height: "100%",
    },
  },
  result: {
    background: "#070A15",
    width: "30%",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    marginBottom: "50px",
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
  reverse: {
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
}));

// Custom Styled Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#ffffff",
    opacity: "0",
  },
})(CircularProgress);


const Coinflip = ({ user, match, history, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [privateLink, setPrivateLink] = useState(null);
  const [finalCountdown, setFinalCountdown] = useState(0);
  const isMountedRef = useRef(true);


  // Show private game invite link
  const addPrivateGame = inviteLink => {
    setPrivateLink(inviteLink);
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
  const gameRolled = async newData => {

    // Coundown stage commences
    await new Promise(resolve => {
      let secunde = 5;
      setFinalCountdown(secunde);
      let int = setInterval(() => {
        secunde -= 1;
        setFinalCountdown(secunde);
        if (secunde <= 0) { clearInterval(int); setFinalCountdown(""); resolve(); }
      }, 1000);
    });

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
    }, 1);
    // Wait for the animation
    setTimeout(() => {
      // Make the game disabled
      setGames(state =>
        state.map(game =>
          game._id === newData._id ? { ...game, ended: true } : game
        )
      );
    }, 3000);
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
    isMountedRef.current = true;
    // Fetch active games from the API
    const fetchData = async () => {
      setLoading(true);
      try {
        const games = await getActiveCoinflipGames();
        if (isMountedRef.current) {
          // Update state
          setGames(games);
          setLoading(false);
        }
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
        if (isMountedRef.current) {
          // Update State
          setGames([game]);
          setLoading(false);
        }
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
      if (isMountedRef.current) {
        // Fetch games when component mounts
        fetchData();
      }
    }
    if (isMountedRef.current) {
      // Listeners
      coinflipSocket.on("game-creation-error", creationError);
      coinflipSocket.on("game-joined", gameJoined);
      coinflipSocket.on("game-called-bot", gameBotCalled);
      coinflipSocket.on("game-rolled", gameRolled);
      coinflipSocket.on("game-rolling", gameRolling);
      coinflipSocket.on("private-game-created", addPrivateGame);
      coinflipSocket.on("game-join-error", joinError);
      coinflipSocket.on("game-join-success", joinSuccess);
      coinflipSocket.on("game-call-bot-error", callingBotError);
      coinflipSocket.on("game-call-bot-success", callingBotSuccess);
    }
    // componentDidUnmount
    return () => {
      isMountedRef.current = false;
      // Remove listeners
      coinflipSocket.off("game-creation-error", creationError);
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


  }, [addToast, match.params]);

  return (
    <Box >
      <PrivateGameModal
        open={privateGameModalVisible}
        handleClose={() => setPrivateGameModalVisible(state => !state)}
        link={privateLink}
      />

      <Box className={classes.root} >
        <Container maxWidth="lg" className={classes.container} >
          <Grow in timeout={520}>
            <Grid container spacing={3}>
              {loading ? (
                <ColorCircularProgress />
              ) : games.length > 0 ? (
                <Box className={classes.gamesdesign}>
                  {games.map(game => (
                    <Game key={game._id} game={game} user={user} finalCountdown={finalCountdown} />
                  ))}
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
    </Box>
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
