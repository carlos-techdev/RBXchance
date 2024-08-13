import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CasinoIcon from "@material-ui/icons/Casino";

import ProvablyModal from "../modals/jackpot/ProvablyModal";

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
    display: "grid",
    height: "auto",
    width: "100%",
    padding: "30px",
    fontFamily: "Rubik",
    fontWeight: 500,
    background: "rgb(30 37 47)",
    boxShadow: "none",
    color: "rgb(210, 217, 223)",
    marginBottom: 0,
    position: "relative",
    border: "1px solid rgb(38 48 63)",
    borderRadius: 0,
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  provably: {
    background: "#272b2f",
    display: "flex",
    alignItems: "center",
    borderRadius: "5px 0 0 5px",
    height: "100%",
    width: "3rem",
    [theme.breakpoints.down("sm")]: {
      height: "fit-content",
      position: "absolute",
      margin: "1rem",
      borderRadius: "100%",
    },
    "& span": {
      color: "#5f6368",
    },
    "& svg": {
      transform: "rotate(45deg)",
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
    display: "flex",
    flexDirection: "column",
    width: "10rem",
    maxWidth: "3rem",
    marginRight: "8rem",
    alignItems: "flex-start",
    marginLeft: "3rem",
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
      fontSize: 20,
    },
    "& h3": {
      margin: 0,
      fontSize: 12,
      color: "#5f6368",
    },
  },
  historyplayers: {
    flexWrap: "wrap",
    display: "flex",
  },
  players: {
    width: "100%",
    //margin: "0 5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    [theme.breakpoints.down("sm")]: {
      margin: "0 0",
      alignItems: "center",
      display: "unset",
      padding: "1.2rem",
    },
    [theme.breakpoints.down("md")]: {
      margin: "0 1rem",
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
    [theme.breakpoints.down("sm")]: {
      flexDirection: "row",
      marginBottom: "25px",
    },
    "& img": {
      height: "auto",
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
      //display: "none",
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
  roundwinner: {
    fontSize: "24px",
    fontWeight: "500",
    [theme.breakpoints.down("xs")]: {
      fontSize: "16px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "16px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
    },
  },
}));

const Game = ({ game, user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const [provablyModalVisible, setProvablyModalVisible] = useState(false);

  //Pie, player colors
  const pieCOLORS = [
    "#469dda", "#de5041", "#24a94d", "#edb545", "#e760da", "#5574df", "#e17624", "#4b9a6c", "#ab73e8",
    "#317262", "#c3e089", "#805151", "#a36f9d", "#c4b174", "#95da36", "#d5a1af", "#cb377a", "#3d6b23",
    "#cb6e51", "#85358d", "#51d7b3", "#745427", "#92972f", "#cc626e", "#cda0db", "#b0d8ac", "#99292f",
    "#375164", "#7d335e", "#6ca454", "#dc6fbc", "#4d468a", "#68c5d2", "#82794e", "#d5da3d", "#d1997b",
    "#a178d4", "#769d82", "#d23b58", "#a7b8cc", "#55de41", "#50543e", "#5a81cf", "#86401f", "#c48c41",
    "#5a642b"];

  return (
    <Box
      key={game._id}
      className={classes.round}
    >
      <ProvablyModal
        game={game}
        handleClose={() => setProvablyModalVisible(state => !state)}
        open={provablyModalVisible}
      />

      <Box style={{ padding: "30px", marginRight: "20px", marginBottom: "20px", border: "1px solid rgb(22 27 33)", background: "rgb(39 46 56)", borderRadius: "10px", boxShadow: "none", }}>
        <span className={classes.roundwinner}>
          <span style={{ color: game.players.map(player => player._id).includes(game.winner._id) ? pieCOLORS[game.players.findIndex(player => player._id === game.winner._id)] : "rgb(158 158 158)", }}>{game.winner.username} </span>
          <span style={{ color: "#c9d0d6", }}>won 🏆 </span>
          <span style={{ color: game.players.map(player => player._id).includes(game.winner._id) ? pieCOLORS[game.players.findIndex(player => player._id === game.winner._id)] : "rgb(158 158 158)", }}>({game.winner.winningPercentage.toFixed(2)}%)</span></span>
        <br />
        <span style={{ color: "#7b7d7e", }}>Game ID: <span style={{ color: "#9e9e9e", }}>{game._id}</span></span>
        <br />
        <span><span style={{ color: "#9e9e9e", }}>🏷️</span> <span style={{ color: "rgb(210 217 223)", }}>{game.randomModule.toFixed(2)}</span>%</span>
        <IconButton
          onClick={() => setProvablyModalVisible(state => !state)}
          color="primary"
        >
          <CasinoIcon style={{ color: "rgb(104 109 116)", }} />
        </IconButton>
      </Box>

      <Box className={classes.historyplayers}>
        {game.players.map((player, index) => (
          <Box key={player._id} style={{ padding: "30px", border: `1px solid ${pieCOLORS[index]}`, borderRadius: "10px", marginRight: "20px", marginTop: "20px", background: "#0D1116", }}>
            <Avatar
              className={classes.avatar2}
              style={{ marginBottom: "10px", borderRadius: "100%", marginLeft: "10px", }}
              src={player.avatar}
              variant="rounded"
            />
            <span>{player.username} <br /><span style={{ color: "rgb(117 121 127)", }}>{player.winningPercentage.toFixed(2)}%</span></span>
          </Box>
        ))}
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
