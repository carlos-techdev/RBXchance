import React, { useState, useEffect, useRef } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import { coinflipSocket } from "../../services/websocket.service";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useHistory } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
//import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

// Components
import Animation from "./Result";
import Waiting from "./Waiting";
import ProvablyModal from "../modals/coinflip/ProvablyModal";
import PrivateGameModal from "../modals/coinflip/PrivateGameModal";
import PrivateGameJoinModal from "../modals/PrivateGameJoinModal";

// Icons
//import CasinoIcon from "@material-ui/icons/Casino";
import InfoIcon from '@material-ui/icons/Info';
import AdbIcon from "@material-ui/icons/Adb";
import DoneIcon from "@material-ui/icons/Done";
import AnnouncementIcon from '@material-ui/icons/Announcement';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

// Assets
import cupRed from "../../assets/coin-t.png";
import cupBlue from "../../assets/coin-ct.png";
import cupGreen from "../../assets/greencup.svg";
import cupYellow from "../../assets/yellowcup.svg";
import Logo from "../../assets/cupsbot.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  container: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 120,
  },
  box: {
    marginBottom: 5,
  },
  round: {
    //display: "flex",
    height: "10rem",
    width: "100%",
    marginBottom: 20,
    position: "relative",
    borderRadius: 5,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      display: "grid",
      height: "100%",
      marginBottom: "100px",
    },
  },
  animation123: {
    display: "flex",
    borderBottom: "0px",
    border: "2px solid #0D1116",
    borderRadius: "10px 10px 0px 0px",
    width: "100%",
    height: "40vh",
    marginTop: 28,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  userlevel: {
    fontSize: 10,
    padding: "5px 7px",
    color: "#fff",
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".15em",
    marginTop: "-4px",
    borderTopLeftRadius: "3px",
    borderBottomLeftRadius: "3px",
    borderRight: "1px solid #272b2f",
  },
  provably: {
    alignItems: "center",
    width: "100%",
    borderTop: "0px",
    border: "2px solid #0D1116",
    [theme.breakpoints.down("sm")]: {
      height: "fit-content",
    },
    "& span": {
      color: "#404956",
    },
    "& svg": {

    },
  },
  callBot: {
    transform: "rotate(0deg) !important",
  },
  calledBot: {
    color: "#4caf50",
    marginLeft: "6px",
  },
  value: {
    background: "#0D1116",
    padding: "15px 30px 15px 30px",
    color: "#e0e0e0",
    border: "1px solid #12171D",
    borderRadius: "25px",
    [theme.breakpoints.down("xs")]: {
      borderRadius: "15px",
    },
  },
  players: {
    width: "100%",
    display: "flex",
    flexDirection: "inherit",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    border: "2px solid #0D1116",
    background: "#12171D",
    paddingTop: "20px",
    borderTop: "0px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0rem",
      maxWidth: "300%",
      alignItems: "center",
      margin: "0 0",
      display: "grid",
      padding: "0rem",
    },
    [theme.breakpoints.up("sm")]: {
      marginLeft: "0rem",
      maxWidth: "300%",
      alignItems: "center",
    },
    [theme.breakpoints.up("md")]: {
      marginLeft: "0rem",
      maxWidth: "300%",
      alignItems: "center",
    },
  },
  player: {
    display: "flex",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    alignItems: "center",
    position: "relative",
    borderRadius: "15px",
    background: "#0D1116",
    padding: "20px",
    minWidth: "350px",
    [theme.breakpoints.down("xs")]: {
      minWidth: "320px",
      flexDirection: "row",
      marginBottom: "25px",
      padding: "15px",
    },
    [theme.breakpoints.up("sm")]: {
      minWidth: "320px",
      flexDirection: "row",
      marginBottom: "25px",
    },
    [theme.breakpoints.up("md")]: {
      minWidth: "320px",
      flexDirection: "row",
      marginBottom: "25px",
    },
    "& img": {

    },
    "& > span": {
      marginLeft: "1rem",
      fontSize: "12px",
      textTransform: "uppercase",
      [theme.breakpoints.down("xs")]: {
        //display: "none",
      },
    },
  },
  result: {
    background: "#0D1116",
    borderRadius: "40px",
    width: "100%",
    marginTop: "0rem",
    margin: "1rem",
    display: "flex",
    alignItems: "center",
    position: "relative",
    justifyContent: "space-around",
    marginLeft: "auto",
    padding: "1rem",
    [theme.breakpoints.down("sm")]: {
      borderRadius: "0px",
      width: "100%",
      margin: "0rem",
      padding: "0rem",
      //marginLeft: "-1px",
    },
    "& > div": {
      height: "auto",
    },
    "& img": {
      height: "4rem",
      width: "auto",
    },
  },
  avatar: {
    marginLeft: "1rem",
    backgroundColor: "#272b2f",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      borderRadius: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      //display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "flex",
      borderRadius: "100%",
    },
  },
  waitingResult: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    height: "100% !important",
    width: "100%",
    zIndex: 1,
  },
}));

// Custom Styled Component
const JoinBtn = withStyles(theme => ({
  root: {
    marginLeft: "1rem",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".1em",
    background: props => props.color,
    [theme.breakpoints.down("xs")]: {
      //display: "none",
    },
    "&:hover": {
      background: props => props.color,
    },
    "& span": {
      marginLeft: 0,
    },
    "& :nth-child(1)": {
      textTransform: "capitalize",
      fontSize: 11,
    },
  },
}))(Button);

const renderTime = ({ remainingTime }) => {

  return (
    <Box className="timer123">
      <Box className="text123"></Box>
      <Box className="value123">{remainingTime}</Box>
      <Box className="text123"></Box>
    </Box>
  );
};

const Game = ({ game, user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [joining, setJoining] = useState(null);
  const [callingBot, setCallingBot] = useState(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedSide, setSelectedSide] = useState("");
  const isMountedRef = useRef(true);

  // Button onClick event handler
  const joinGame = color => {
    // If this is a private game
    if (game.privateGame) {
      setJoinModalVisible(true);
      setSelectedSide(color);
    } else {
      setJoining(color);
      coinflipSocket.emit("join-game", game._id, color);
    }
  };

  const history = useHistory();
  // Button onClick event handler
  const onClickBack = () => {
    setTimeout(() => {
      history.push("/coinflip");
    }, 200)
  };
  // Button onClick event handler
  const callBot = () => {
    setCallingBot(true);
    coinflipSocket.emit("call-bot", game._id);
  };

  // Parse winning side into SideIndex
  const getWinner = side => ["red", "blue", "green", "yellow"].indexOf(side) + 1;

  // Captcha changed (completed)
  const captchaOnChange = response => {
    if (isAuthenticated) {
      setJoining(selectedSide);
      coinflipSocket.emit("join-game", game._id, selectedSide, response);
    } else {
      setJoining(selectedSide);
      coinflipSocket.emit("join-game", game._id, selectedSide, response);
    }
  };

  // componentDidMount
  useEffect(() => {
    isMountedRef.current = true;
    // Handle join event
    const joinEvent = () => {
      setJoining(null);
      setJoinModalVisible(false);
      setSelectedSide("");
    };

    // Handle cancel event
    const callingBotEvent = () => {
      setCallingBot(null);
    };

    if (isMountedRef.current) {
      // Listeners
      coinflipSocket.on("game-join-error", joinEvent);
      coinflipSocket.on("game-join-success", joinEvent);
      coinflipSocket.on("game-call-bot-error", callingBotEvent);
      coinflipSocket.on("game-call-bot-success", callingBotEvent);
    }
    // componentDidUnmount
    return () => {
      isMountedRef.current = false;
      // Remove listeners
      coinflipSocket.off("game-join-error", joinEvent);
      coinflipSocket.off("game-join-success", joinEvent);
      coinflipSocket.off("game-call-bot-error", callingBotEvent);
      coinflipSocket.off("game-call-bot-success", callingBotEvent);
    };
  }, []);

  return (
    <Box
      key={game._id}
      className={classes.round}
      style={
        game.ended
          ? {}
          : game.ownPrivateGame
            ? {}
            : {}
      }
    >
      <Box className={classes.animation123}>
        <Box className={classes.result}>
          {game.status === 2 && (
            <Box className={classes.waitingResult}>
              <Box>
                <CountdownCircleTimer
                  isPlaying
                  duration={5}
                  strokeWidth={5}
                  strokeLinecap={"square"}
                  colors={["#34d11a"]}
                  trailColor={["#1c3f16"]}
                  onComplete={() => ({ shouldRepeat: false })}
                >
                  {renderTime}
                </CountdownCircleTimer>
              </Box>
            </Box>
          )}
          {game.status === 3 ? (
            <Animation
              players={game.playerAmount}
              winner={getWinner(game.winningSide)}
            />
          ) : game.status === 1 ? (
            <Waiting players={game.playerAmount} />
          ) : null}
        </Box>
      </Box>
      <ProvablyModal
        game={game}
        handleClose={() => setProvablyModalVisible(state => !state)}
        open={provablyModalVisible}
      />
      {game.privateGame && (
        <PrivateGameJoinModal
          loading={Boolean(joining)}
          open={joinModalVisible}
          handleClose={() => setJoinModalVisible(state => !state)}
          onChange={captchaOnChange}
        />
      )}
      {game.ownPrivateGame && (
        <PrivateGameModal
          open={privateGameModalVisible}
          handleClose={() => setPrivateGameModalVisible(state => !state)}
          link={game.inviteLink}
        />
      )}
      <Box className={classes.provably}>
        <IconButton
          style={{ WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)", }}
          onClick={onClickBack}
          color="primary"
        >
          <Tooltip
            title="Go back"
            placement="top"
          >
            <ExitToAppIcon />
          </Tooltip>
        </IconButton>
        <IconButton
          onClick={() => setProvablyModalVisible(state => !state)}
          color="primary"
        >
          <Tooltip
            title="View Provably Fair"
            placement="top"
          >
            <InfoIcon />
          </Tooltip>
        </IconButton>
        {isAuthenticated &&
          user &&
          game.players.length < game.playerAmount &&
          game.players.map(player => player._id).includes(user._id) &&
          game.voteBot &&
          !game.voteBot.includes(user._id) && (
            <IconButton
              onClick={() => (!callingBot ? callBot() : null)}
              color="primary"
            >
              <Tooltip
                title="Call a bot to join"
                placement="top"
              >
                <AdbIcon className={classes.callBot} />
              </Tooltip>
            </IconButton>
          )}
      </Box>
      <Box className={classes.players} style={{ borderBottom: "0px", }} >
        {game.players.find(player => player.color === "red") ? (
          <Box className={classes.player}
            style={
              game.ended && game.winningSide === "red" ? (
                { opacity: 1, border: "1px solid rgb(212 135 11)", marginTop: "25px", }
              ) : game.status === 1 ? (
                { opacity: 1, border: "1px solid rgb(212 135 11)", marginTop: "25px", }
              ) : game.status === 2 ? (
                { opacity: 1, border: "1px solid rgb(212 135 11)", marginTop: "25px", }
              ) : game.ended && game.winningSide !== "red" ? (
                { opacity: 0.15, transition: "all 0.3s ease", border: "1px solid rgb(212 135 11)", marginTop: "25px", }
              ) : (
                { opacity: 1, border: "1px solid rgb(212 135 11)", marginTop: "25px", }
              )
            }
          >
            <img
              src={cupRed}
              alt="Red Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "red").isBot
                  ? Logo
                  : game.players.find(player => player.color === "red").avatar
              }
              className={classes.avatar}
              style={{ border: "2px solid", borderColor: game.players.find(player => player.color === "red").isBot ? "rgb(64 73 86)" : `${game.players.find(player => player.color === "red").level.levelColor}`, }}
            />
            <span
              style={{
                padding: "3px 6px 3px 6px",
                borderRadius: "5px",
                marginRight: "-10px",
                marginLeft: "14px",
                color: "#fff",
                background: game.players.find(player => player.color === "red").isBot ? "rgb(64 73 86)" : `${game.players.find(player => player.color === "red").level.levelColor}`,
              }}
              className="userlevel">{game.players.find(player => player.color === "red").level.name}</span>
            <span>
              {game.players.find(player => player.color === "red").username}
            </span>
            {game.ended && game.winningSide === "red" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "rgb(212 135 11)", }} fontSize="small" />
              </Tooltip>
            )}
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "red")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player}
            style={{ border: "1px solid rgb(212 135 11)", marginTop: "25px", }}
          >
            <img
              src={cupRed}
              alt="Red Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid rgb(212 135 11)", }} />
            <JoinBtn
              style={{ background: "rgb(212 135 11)", boxShadow: "none", }}
              variant="contained"
              onClick={() => (!joining ? joinGame("red") : null)}
              disabled={joining ? (true) : (false)}
            >
              {joining === "red"
                ? "Joining..."
                : `Join for $${game.privateGame
                  ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                  : game.betAmount.toFixed(2)
                }`}
            </JoinBtn>
          </Box>
        )}
        <Box className={classes.value}>
          <p style={{ textAlign: "center", }}>VS</p>
          <h1 style={{ textAlign: "center", }}>${(game.betAmount * game.playerAmount).toFixed(2)}</h1>
        </Box>
        {game.players.find(player => player.color === "blue") ? (
          <Box className={classes.player}
            style={
              game.ended && game.winningSide === "blue" ? (
                { opacity: 1, border: "1px solid rgb(109 109 109)", marginTop: "25px", }
              ) : game.status === 1 ? (
                { opacity: 1, border: "1px solid rgb(109 109 109)", marginTop: "25px", }
              ) : game.status === 2 ? (
                { opacity: 1, border: "1px solid rgb(109 109 109)", marginTop: "25px", }
              ) : game.ended && game.winningSide !== "blue" ? (
                { opacity: 0.15, transition: "all 0.3s ease", border: "1px solid rgb(109 109 109)", marginTop: "25px", }
              ) : (
                { opacity: 1, border: "1px solid rgb(109 109 109)", marginTop: "25px", }
              )
            }
          >
            <img
              src={cupBlue}
              alt="Blue Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "blue").isBot
                  ? Logo
                  : game.players.find(player => player.color === "blue").avatar
              }
              className={classes.avatar}
              style={{ border: "2px solid", borderColor: game.players.find(player => player.color === "blue").isBot ? "rgb(64 73 86)" : `${game.players.find(player => player.color === "blue").level.levelColor}`, }}
            />
            <span
              style={{
                padding: "3px 6px 3px 6px",
                borderRadius: "5px",
                marginRight: "-10px",
                marginLeft: "14px",
                color: "#fff",
                background: game.players.find(player => player.color === "blue").isBot ? "rgb(64 73 86)" : `${game.players.find(player => player.color === "blue").level.levelColor}`,
              }}
              className="userlevel">{game.players.find(player => player.color === "blue").level.name}</span>
            <span>
              {game.players.find(player => player.color === "blue").username}
            </span>
            {game.ended && game.winningSide === "blue" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "rgb(64 73 86)", }} fontSize="small" />
              </Tooltip>
            )}
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "blue")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player} style={{ border: "1px solid rgb(109 109 109)", marginTop: "25px", }}>
            <img
              src={cupBlue}
              alt="Blue Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid rgb(109 109 109)", }} />
            <JoinBtn
              style={{ background: "rgb(109 109 109)", boxShadow: "none", }}
              variant="contained"
              onClick={() => (!joining ? joinGame("blue") : null)}
              disabled={joining ? (true) : (false)}
            >
              {joining === "blue"
                ? "Joining..."
                : `Join for $${game.privateGame
                  ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                  : game.betAmount.toFixed(2)
                }`}
            </JoinBtn>
          </Box>
        )}
      </Box>
      <Box className={classes.players} style={{ borderRadius: "0px 0px 10px 10px", borderTop: "0px", }}>
        {game.playerAmount === 2 ? undefined : game.players.find(
          player => player.color === "green"
        ) ? (
          <Box className={classes.player}
            style={
              game.ended && game.winningSide === "green" ? (
                { opacity: 1, border: "2px solid rgba(46, 189, 80)", filter: "drop-shadow(0 0 12px rgba(46, 189, 80,.2))", marginBottom: "25px", }
              ) : game.status === 1 ? (
                { opacity: 1, border: "2px solid rgba(46, 189, 80)", filter: "drop-shadow(0 0 12px rgba(46, 189, 80,.2))", marginBottom: "25px", }
              ) : game.status === 2 ? (
                { opacity: 1, border: "2px solid rgba(46, 189, 80)", filter: "drop-shadow(0 0 12px rgba(46, 189, 80,.2))", marginBottom: "25px", }
              ) : game.ended && game.winningSide !== "green" ? (
                { opacity: 0.15, transition: "all 0.3s ease", border: "2px solid rgba(46, 189, 80)", filter: "drop-shadow(0 0 12px rgba(46, 189, 80,.2))", marginBottom: "25px", }
              ) : (
                { opacity: 1, border: "2px solid rgba(46, 189, 80)", filter: "drop-shadow(0 0 12px rgba(46, 189, 80,.2))", marginBottom: "25px", }
              )
            }
          >
            <img
              src={cupGreen}
              alt="Green Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "green").isBot
                  ? Logo
                  : game.players.find(player => player.color === "green").avatar
              }
              className={classes.avatar}
              style={{ border: "2px solid #2ebd4f", }}
            />
            <span
              style={{
                padding: "3px 6px 3px 6px",
                borderRadius: "5px",
                marginRight: "-10px",
                marginLeft: "14px",
                color: "#fff",
                background: game.players.find(player => player.color === "green").isBot ? "rgb(64 73 86)" : `${game.players.find(player => player.color === "green").level.levelColor}`,
              }}
              className="userlevel">{game.players.find(player => player.color === "green").level.name}</span>
            <span>
              {game.players.find(player => player.color === "green").username}
            </span>
            {game.ended && game.winningSide === "green" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "#2ebd50", }} fontSize="small" />
              </Tooltip>
            )}
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "green")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player} style={{ border: "2px solid rgba(46, 189, 80)", filter: "drop-shadow(0 0 12px rgba(46, 189, 80,.2))", marginBottom: "25px", }}>
            <img
              src={cupGreen}
              alt="Green Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid #2ebd4f", }} />
            <JoinBtn
              style={{ background: "#429245", boxShadow: "none", }}
              variant="contained"
              onClick={() => (!joining ? joinGame("green") : null)}
              disabled={joining ? (true) : (false)}
            >
              {joining === "green"
                ? "Joining..."
                : `Join for $${game.privateGame
                  ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                  : game.betAmount.toFixed(2)
                }`}
            </JoinBtn>
          </Box>
        )}
        {game.playerAmount !== 4 ? undefined : game.players.find(
          player => player.color === "yellow"
        ) ? (
          <Box className={classes.player}
            style={
              game.ended && game.winningSide === "yellow" ? (
                { opacity: 1, border: "2px solid rgba(202, 185, 33)", filter: "drop-shadow(0 0 12px rgba(202, 185, 33,.2))", marginBottom: "25px", }
              ) : game.status === 1 ? (
                { opacity: 1, border: "2px solid rgba(202, 185, 33)", filter: "drop-shadow(0 0 12px rgba(202, 185, 33,.2))", marginBottom: "25px", }
              ) : game.status === 2 ? (
                { opacity: 1, border: "2px solid rgba(202, 185, 33)", filter: "drop-shadow(0 0 12px rgba(202, 185, 33,.2))", marginBottom: "25px", }
              ) : game.ended && game.winningSide !== "yellow" ? (
                { opacity: 0.15, transition: "all 0.3s ease", border: "2px solid rgba(202, 185, 33)", filter: "drop-shadow(0 0 12px rgba(202, 185, 33,.2))", marginBottom: "25px", }
              ) : (
                { opacity: 1, border: "2px solid rgba(202, 185, 33)", filter: "drop-shadow(0 0 12px rgba(202, 185, 33,.2))", marginBottom: "25px", }
              )
            }
          >
            <img
              src={cupYellow}
              alt="Yellow Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar
              variant="rounded"
              src={
                game.players.find(player => player.color === "yellow").isBot
                  ? Logo
                  : game.players.find(player => player.color === "yellow")
                    .avatar
              }
              className={classes.avatar}
              style={{ border: "2px solid #cab921", }}
            />
            <span
              style={{
                padding: "3px 6px 3px 6px",
                borderRadius: "5px",
                marginRight: "-10px",
                marginLeft: "14px",
                color: "#fff",
                background: game.players.find(player => player.color === "yellow").isBot ? "rgb(64 73 86)" : `${game.players.find(player => player.color === "yellow").level.levelColor}`,
              }}
              className="userlevel">{game.players.find(player => player.color === "yellow").level.name}</span>
            <span>
              {game.players.find(player => player.color === "yellow").username}
            </span>
            {game.ended && game.winningSide === "yellow" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "#cab921", }} fontSize="small" />
              </Tooltip>
            )}
            {game.voteBot &&
              game.voteBot.includes(
                game.players.find(player => player.color === "yellow")._id
              ) && (
                <Tooltip
                  title="This user voted for a bot to join"
                  placement="top"
                >
                  <DoneIcon className={classes.calledBot} fontSize="small" />
                </Tooltip>
              )}
          </Box>
        ) : (
          <Box className={classes.player} style={{ border: "2px solid rgba(202, 185, 33)", filter: "drop-shadow(0 0 12px rgba(202, 185, 33,.2))", marginBottom: "25px", }}>
            <img
              src={cupYellow}
              alt="Yellow Side"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid #cab921", }} />
            <JoinBtn
              style={{ background: "#bbae3c", boxShadow: "none", }}
              variant="contained"
              onClick={() => (!joining ? joinGame("yellow") : null)}
              disabled={joining ? (true) : (false)}
            >
              {joining === "yellow"
                ? "Joining..."
                : `Join for $${game.privateGame
                  ? (game.betAmount * (1 - game.costMultiplier)).toFixed(2)
                  : game.betAmount.toFixed(2)
                }`}
            </JoinBtn>
          </Box>
        )}
      </Box>
    </Box>
  );
};

Game.propTypes = {
  game: PropTypes.object.isRequired,
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Game);
