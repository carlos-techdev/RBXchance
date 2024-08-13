import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { TransitionGroup } from 'react-transition-group';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    background: "#12171D",
    border: "1px solid #161D26",
    borderRadius: "0.4rem",
    marginTop: "0.75rem",
    width: "100%",
    height: 450,
    maxHeight: "800px", //new
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      marginTop: 20,
    },
  },
  userlevel: {
    fontSize: 9,
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
  betAmount: {
    width: "100%",
    height: "2.1rem",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    color: "#485261",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& span": {
      display: "flex",
      marginLeft: "auto",
      color: "#4caf50",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
  bets: {
    display: "flex",
    color: "white",
    height: "100%",
    flexDirection: "column",
    overflowY: "auto",
  },
  bet: {
    display: "flex",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 5,
    width: "100%",
    padding: 10,
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: ".1em",
    background: "#0D1116",
    border: "1px solid #161D26",
    position: "relative",
  },
  winningAmount: {
    color: "#6afe43",
    filter: "drop-shadow(0px 0px 15px green) invert(10%)",
  },
  avatar: {
    height: 25,
    width: 25,
    borderRadius: "100%",
  },
}));

const Bets = ({ players, loading }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.betAmount}>
        ALL BETS
        <Box style={{ marginLeft: "auto", color: "#ccc", }}>
          {loading
            ? "Loading..."
            : "$" +
            players
              .map(player => parseFloat(player.betAmount))
              .reduce((a, b) => a + b, 0)
              .toFixed(2)}
        </Box>
      </Box>

      <Box className={classes.bets}>
        <TransitionGroup>
          {players.sort((a, b) => b.betAmount - a.betAmount).map((player, index) => (
            <Collapse key={index}>
              <Box key={index} padding={"0 1rem"}>
                <Box className={classes.bet}>
                  <Box
                    style={{
                      width: "50%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      className={classes.avatar}
                      src={player.avatar}
                      variant="rounded"
                    />
                    {<Box
                      style={{
                        padding: "4px",
                        fontSize: "9px",
                        color: "#ffffff",
                        marginRight: "-10px",
                        marginLeft: "10px",
                        borderRadius: "5px",
                        background: `${player.level.levelColor}`,
                      }} className="userlevel">{player.level.name}</Box>}
                    <Box ml={2}>{player.username}</Box>
                  </Box>
                  <Box ml="auto" style={{ width: "20%" }}>
                    {player.stoppedAt &&
                      `${(player.stoppedAt / 100).toFixed(2)}x`}
                  </Box>
                  <Box ml="auto" style={{ width: "20%" }}>
                    ${player.betAmount.toFixed(2)}
                  </Box>
                  <Box
                    ml="auto"
                    style={{ width: "20%" }}
                    className={classes.winningAmount}
                  >
                    {player.winningAmount &&
                      `+$${player.winningAmount.toFixed(2)}`}
                  </Box>
                </Box>
              </Box>
            </Collapse>
          ))}
        </TransitionGroup>
      </Box>
    </Box>
  );
};

Bets.propTypes = {
  players: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default Bets;
