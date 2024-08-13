import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { jackpotSocket } from "../services/websocket.service";
import { getJackpotSchema } from "../services/api.service";
import { useToasts } from "react-toast-notifications";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Grow from '@material-ui/core/Grow';

// Components
import PrevGame from "../components/jackpot/PrevGame";

import error from "../assets/error.wav";
import success from "../assets/success.wav";
import pointer2 from "../assets/pointer2.svg";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

// Custom styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    paddingLeft: "150px",
    paddingRight: "150px",
    paddingTop: 30,
    paddingBottom: 100,
    [theme.breakpoints.down("xs")]: {
      padding: "0rem 1.2rem 2rem 1.2rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0rem 1.2rem 2rem 1.2rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0rem 1.2rem 2rem 1.2rem",
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
    background: "#212529",
    //padding: "1rem 3rem",
    paddingTop: "1.5rem",
    marginBottom: "-20px",
    marginTop: "-30px",
    [theme.breakpoints.down("xs")]: {
      padding: "0rem 0rem",
      //marginLeft: 20,
      display: "block",
      marginBottom: "80px",
      //marginTop: "20px",
      // paddingTop: "2rem",
    },
  },
  right: {
    display: "flex",
    marginLeft: "auto",
    height: "2.25rem",
    marginRight: "-24px",
    background: "#32363c",
    borderRadius: "4px",
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
      marginRight: "-2px",
      background: "#32363c00",
    },
  },
  game: {
    display: "flex",
    alignItems: "center",
    background: "#272b2f",
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
    background: "#272b2f",
    borderRadius: "5px",
    width: "100%",
    height: "55vh",
    marginTop: 5,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("xs")]: {
      "& > img": {
        width: "75%",
      },
      "& .react-responsive-spritesheet": {
        transform: "scale(0.3)",
      },
    },
    [theme.breakpoints.up("sm")]: {
      "& > img": {
        width: "75%",
      },
      "& .react-responsive-spritesheet": {
        transform: "scale(0.6)",
      },
    },
    [theme.breakpoints.up("md")]: {
      "& > img": {
        width: "75%",
      },
      "& .react-responsive-spritesheet": {
        transform: "scale(0.85)",
      },
    },
    [theme.breakpoints.up("lg")]: {
      "& > img": {
        width: "75%",
      },
      "& .react-responsive-spritesheet": {
        transform: "scale(1)",
      },
    },
  },
  jackpotLayer: {
    position: "relative",
  },
  jackpotPointer: {
    position: "absolute",
    top: "18%",
    left: "51.223%",
    transform: "translateX(-50%) translateZ(0)",
    zIndex: "11",
    width: "41.5px",
    height: "31px",
    background: `url(${pointer2}) 50%/100% 100% no-repeat`,
  },
  jackpotCenterCircle: {
    position: "absolute",
    zIndex: 1,
    top: "51.2%",
    left: "22.65%",
    right: 0,
    transform: "translateY(-50%)",
    marginLeft: "1.223%",
    textAlign: "center",
  },
  jackpotCenter: {
    position: "absolute",
    zIndex: 1,
    top: "50%",
    left: 0,
    right: 0,
    transform: "translateY(-50%)",
    marginLeft: "1.223%",
    textAlign: "center",
  },
  jackpotTextPot: {
    fontSize: "20px",
    letterSpacing: "0.1rem",
    color: "#cbc8cf",
  },
  jackpotTextValue: {
    fontSize: "40px",
    color: "#1786c2",
    marginTop: "-15px",
    marginBottom: "-10px",
  },
  jackpotTextSize: {
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: "1px",
    color: "#555b62",
  },
  labelPieInfo: {
    fontSize: "15px",
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
      background: "#272b2f",
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
    display: "grid",
    alignItems: "space-between",
    gridColumnGap: 10,
    gridRowGap: 10,
    gridTemplateColumns: "auto auto auto auto",
    width: "100%",
    minHeight: "8vh",
    //marginTop: 15,
    [theme.breakpoints.down("xs")]: {
      display: "unset",
      gridTemplateColumns: "auto auto",
      gridRowGap: 10,
    },
  },
  smallBet: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "left",
    width: "100%",
    height: 70,
    background: "#272b2f",
    borderRadius: 5,
    paddingLeft: "1rem",
    [theme.breakpoints.down("xs")]: {
      padding: 9,
      paddingLeft: 12,
      marginBottom: 10,
    },
    "& h3, h5": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& span": {
      color: "#FFC440",
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
    color: "#FFC440",
    background: "transparent !important",
  },
  userlevel: {
    background: "#31363c",
    fontSize: 10,
    padding: "5px 10px",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".15em",
    marginTop: "-4px",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
    borderRight: "1px solid #272b2f",
  },
  hashvalue: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "15px",
    marginTop: "1.5rem",
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
  },
  create: {
    backgroundColor: "#3386c9",
    borderColor: "#3386c9",
    boxShadow: "0px 0px 0px 0px #32363c",
    color: "#ffffff",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    padding: "0 2rem",
    [theme.breakpoints.down("xs")]: {
      padding: "0.5rem",
    },
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#3386c9",
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
    [theme.breakpoints.down("xs")]: {
      marginRight: "34%",
    },
  },
  ballWrap: {
    width: 952,
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ballBox: {
    width: 952,
    height: 206,
    position: "relative",
    top: 0,
    transition: "0.25s ease",
    [theme.breakpoints.down("xs")]: {
      transform: "scale(0.3)",
    },
    [theme.breakpoints.up("sm")]: {
      transform: "scale(0.6)",
    },
    [theme.breakpoints.up("md")]: {
      transform: "scale(0.85)",
    },
    [theme.breakpoints.up("lg")]: {
      transform: "scale(1)",
    },
  },
  ball: {
    width: 982,
    height: "100%",
    position: "relative",
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
}));

const Jackpot = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [prevGames, setPrevGames] = useState([]);

  // Fetch Jackpot schema from API
  const fetchData = async () => {
    try {
      const schema = await getJackpotSchema();
      //console.log("Schema:", schema);

      // Get current game status
      const currentStatus = schema.current.status;

      // If current game is on countdown
      if (currentStatus === 2) {
      } else if (currentStatus === 3) {
        // Do nothing
      } else if (currentStatus === 4) {
        // If current game is rolling
        //console.log("jackpot game rolling...");
      }

      setPrevGames(schema.history);
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };



  // componentDidMount
  useEffect(() => {
    // New round has started
    const newRound = (gameId, privateHash) => {
      // Update state
      fetchData();
      //console.log("Jackpot Game Reseted!");
    };

    // Game joining error handler
    const handleError = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    // Game joining success handler
    const handleSuccess = msg => {
      playSound(successAudio);
    };

    // Fetch data initially
    fetchData();

    // Listeners
    jackpotSocket.on("game-join-error", handleError);
    jackpotSocket.on("game-join-success", handleSuccess);
    jackpotSocket.on("new-round", newRound);

    // componentDidUnmount
    return () => {
      // Remove Listeners
      jackpotSocket.off("game-join-error", handleError);
      jackpotSocket.off("game-join-success", handleSuccess);
      jackpotSocket.off("new-round", newRound);
    };
  }, [addToast]);

  return (
    <Box className={classes.barContainer}>
      <Box className={classes.root}>
        <Container maxWidth="lg">
          <Grow in timeout={520}>
            <Grid container>
              <br />
              <br />
              <p style={{ color: "#ccc", fontWeight: "500", fontSize: "20px", }}>Jackpot History<br /> <span style={{ color: "#9e9e9e", fontSize: "15px", }}>Last 25 Rounds</span></p>
              <br />
              <br />
              {prevGames.map(game => (
                <PrevGame key={game._id} game={game} user={user} />
              ))}
            </Grid>
          </Grow>
        </Container>
      </Box>
    </Box>
  );
};

Jackpot.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Jackpot);
