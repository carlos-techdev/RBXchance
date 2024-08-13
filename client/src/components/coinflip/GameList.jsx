import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import { coinflipSocket } from "../../services/websocket.service";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
//import CircularProgress from "@material-ui/core/CircularProgress";
import Tooltip from "@material-ui/core/Tooltip";

// Components
//import Animation from "../jackpot/Result";
//import Waiting from "../jackpot/Waiting";
import ProvablyModal from "../modals/coinflip/ProvablyModal";
import PrivateGameModal from "../modals/coinflip/PrivateGameModal";
import PrivateGameJoinModal from "../modals/PrivateGameJoinModal";


import VisibilityIcon from '@material-ui/icons/Visibility';
import ReplayIcon from '@material-ui/icons/Replay';
import AnnouncementIcon from '@material-ui/icons/Announcement';

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
  roundlistcoinflip: {
    "&:nth-child(odd)": {
      background: "#12171D",
      border: "1px solid #161D26",
    },
    display: "flex",
    height: "7.25rem",
    width: "100%",
    marginBottom: 20,
    position: "relative",
    border: "1px solid #161D26",
    borderRadius: 20,
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      display: "grid",
      maxHeight: "500px",
      height: "100%",
      marginBottom: "30px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      display: "grid",
      maxHeight: "500px",
      height: "100%",
      marginBottom: "30px",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      display: "grid",
      maxHeight: "500px",
      height: "100%",
      marginBottom: "30px",
    },
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
    display: "flex",
    alignItems: "center",
    borderRadius: "20px 0 0 20px",
    height: "100%",
    width: "3rem",
    paddingLeft: "35px",
    paddingRight: "35px",
    "&:hover": {
      background: "rgb(30 37 47)",
    },
    [theme.breakpoints.down("sm")]: {
      height: "fit-content",
      marginBottom: "1rem",
      width: "100%",
      borderRadius: "20px 20px 0px 0px",
    },
    "& span": {
      color: "#404956",
    },
  },
  callBot: {
    transform: "rotate(0deg) !important",
  },
  calledBot: {
    color: "#4caf50",
    marginLeft: "6px",
  },
  bluecolorjoin: {
    background: "rgb(109 109 109)",
    "&:hover": {
      background: "rgb(109 109 109)",
    },
  },
  value: {
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    maxWidth: "2rem",
    marginRight: "6.1rem",
    alignItems: "flex-start",
    marginLeft: "1rem",
    [theme.breakpoints.down("sm")]: {
      width: "fit-content",
      marginLeft: "1rem",
      marginRight: "3rem",
      marginBottom: "1rem",
      justifyContent: "flex-end",
    },
    justifyContent: "center",
    "& h1": {
      margin: 0,
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".1em",
      fontSize: 18,
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#5f6368",
    },
  },
  players: {
    width: "100%",
    display: "flex",
    padding: "10px 0px 10px 0px",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0",
      alignItems: "center",
      display: "unset",
      padding: "0rem",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "1rem",
      maxWidth: "300px",
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
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
      marginBottom: "25px",
    },
    "& img": {

    },
    "& > span": {
      marginLeft: "1rem",
      fontSize: "10px",
      textTransform: "uppercase",
      [theme.breakpoints.down("xs")]: {
        //display: "none",
      },
    },
  },
  result: {
    background: "#272b2f",
    borderRadius: "40px",
    width: "110%",
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
    borderRadius: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      borderRadius: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      borderRadius: "100%",
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
    fontSize: "10.2px",
    boxShadow: "none",
    fontWeight: 500,
    padding: "5px 10px 5px 10px",
    letterSpacing: ".051em",
    background: props => props.color,
    [theme.breakpoints.down("xs")]: {
      //display: "none",
    },
    "&:hover": {
      background: props => props.color,
      boxShadow: "none",
    },
    "& span": {
      marginLeft: 0,
    },
    "& :nth-child(1)": {
      textTransform: "capitalize",
      fontSize: "10.2px",
    },
  },
}))(Button);

// Custom Styled Component
//const ColorCircularProgress = withStyles({
//  root: {
//    color: "#ffffff",
//  },
//})(CircularProgress);

const Game = ({ game, user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);
  const [privateGameModalVisible, setPrivateGameModalVisible] = useState(false);
  const [joining, setJoining] = useState(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedSide, setSelectedSide] = useState("");

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
  // Captcha value changed (completed)
  const captchaOnChange = response => {
    if (isAuthenticated) {
      setJoining(selectedSide);
      coinflipSocket.emit("join-game", game._id, selectedSide, response);
      history.push(game.inviteLink);
    } else {
      setJoining(selectedSide);
      coinflipSocket.emit("join-game", game._id, selectedSide, response);
    }
  };

  const onClickView = () => {
    setTimeout(() => {
      history.push(`/coinflip/private/${game.inviteCode}`);
    }, 200)

  };

  // componentDidMount
  useEffect(() => {
    // Handle join event
    const joinEvent = () => {
      setJoining(null);
      setJoinModalVisible(false);
      setSelectedSide("");
    };

    // Listeners
    coinflipSocket.on("game-join-error", joinEvent);
    coinflipSocket.on("game-join-success", joinEvent);

    // componentDidUnmount
    return () => {
      // Remove listeners
      coinflipSocket.off("game-join-error", joinEvent);
      coinflipSocket.off("game-join-success", joinEvent);
    };
  }, []);

  return (
    <Box
      key={game._id}
      className={classes.roundlistcoinflip}
      style={
        game.ended
          ? { animation: "blinker 1.5s forwards", WebkitAnimation: "blinker 1.5s forwards", MozAnimation: "blinker 1.5s forwards", }
          : game.ownPrivateGame
            ? {}
            : {}
      }
    >
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
      {game.ownPrivateGame && (
        <PrivateGameModal
          open={privateGameModalVisible}
          handleClose={() => setPrivateGameModalVisible(state => !state)}
          link={game.inviteLink}
        />
      )}
      {game.status === 1 && (
        <IconButton
          className={classes.provably}
          color="primary"
          onClick={onClickView}
        >
          <Tooltip
            title="Join or spectate"
            placement="top"
          >
            <VisibilityIcon />
          </Tooltip>
        </IconButton>
      )}
      {game.status === 2 && (
        <IconButton
          className={classes.provably}
          color="primary"
          onClick={onClickView}
        >
          <Tooltip
            title="Join or spectate"
            placement="top"
          >
            <VisibilityIcon />
          </Tooltip>
        </IconButton>
      )}
      {game.status === 3 && (
        <IconButton
          className={classes.provably}
          color="primary"
          onClick={onClickView}
        >
          <Tooltip
            title="Rewatch game"
            placement="top"
          >
            <ReplayIcon />
          </Tooltip>
        </IconButton>
      )}
      <Box className={classes.value}>
        <h1>${(game.betAmount * game.playerAmount).toFixed(2)}</h1>
      </Box>
      <Box className={classes.players}>
        {game.players.find(player => player.color === "red") ? (
          <Box
            className={classes.player}
            style={
              game.status === 3 && game.winningSide === "red" ? (
                { opacity: 1 }
              ) : game.status === 1 ? (
                { opacity: 1 }
              ) : game.status === 2 ? (
                { opacity: 1 }
              ) : game.status === 3 && game.winningSide !== "red" ? (
                { opacity: 0.15, transition: "all 0.3s ease" }
              ) : (
                { opacity: 1 }
              )
            }
          >
            <img
              src={cupRed}
              alt="Red"
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
            {game.status === 3 && game.winningSide === "red" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "rgb(254 170 6)", }} fontSize="small" />
              </Tooltip>
            )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupRed}
              alt="Red"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid rgb(212 135 11)", }} />
            <JoinBtn
              style={{ background: "rgb(212 135 11)", }}
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
        {game.players.find(player => player.color === "blue") ? (
          <Box
            className={classes.player}
            style={
              game.status === 3 && game.winningSide === "blue" ? (
                { opacity: 1 }
              ) : game.status === 1 ? (
                { opacity: 1 }
              ) : game.status === 2 ? (
                { opacity: 1 }
              ) : game.status === 3 && game.winningSide !== "blue" ? (
                { opacity: 0.15, transition: "all 0.3s ease" }
              ) : (
                { opacity: 1 }
              )
            }
          >
            <img
              src={cupBlue}
              alt="Blue"
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
            {game.status === 3 && game.winningSide === "blue" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "rgb(117 117 117)", }} fontSize="small" />
              </Tooltip>
            )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupBlue}
              alt="Blue"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid rgb(109 109 109)", }} />
            <JoinBtn
              className={classes.bluecolorjoin}
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
      <Box className={classes.players}>
        {game.playerAmount === 2 ? undefined : game.players.find(
          player => player.color === "green"
        ) ? (
          <Box
            className={classes.player}
            style={
              game.status === 3 && game.winningSide === "green" ? (
                { opacity: 1 }
              ) : game.status === 1 ? (
                { opacity: 1 }
              ) : game.status === 2 ? (
                { opacity: 1 }
              ) : game.status === 3 && game.winningSide !== "green" ? (
                { opacity: 0.15, transition: "all 0.3s ease" }
              ) : (
                { opacity: 1 }
              )
            }
          >
            <img
              src={cupGreen}
              alt="Green"
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
            {game.status === 3 && game.winningSide === "green" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "#2ebd50", }} fontSize="small" />
              </Tooltip>
            )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupGreen}
              alt="Green"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid #2ebd4f", }} />
            <JoinBtn
              style={{ background: "#429245", }}
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
          <Box
            className={classes.player}
            style={
              game.status === 3 && game.winningSide === "yellow" ? (
                { opacity: 1 }
              ) : game.status === 1 ? (
                { opacity: 1 }
              ) : game.status === 2 ? (
                { opacity: 1 }
              ) : game.status === 3 && game.winningSide !== "yellow" ? (
                { opacity: 0.15, transition: "all 0.3s ease" }
              ) : (
                { opacity: 1 }
              )
            }
          >
            <img
              src={cupYellow}
              alt="Yellow"
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
            {game.status === 3 && game.winningSide === "yellow" && (
              <Tooltip
                title="This player won the game."
                placement="top"
              >
                <AnnouncementIcon className={classes.calledBot} style={{ color: "#cab921", }} fontSize="small" />
              </Tooltip>
            )}
          </Box>
        ) : (
          <Box className={classes.player}>
            <img
              src={cupYellow}
              alt="Yellow"
              style={{ height: "2.3rem", }}
            />
            <Avatar variant="rounded" className={classes.avatar} style={{ border: "2px solid #cab921", }} />
            <JoinBtn
              style={{ background: "#bbae3c", }}
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