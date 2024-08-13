import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CopyBlock, ocean } from "react-code-blocks";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

// Import code samples
import pfCodeSamples from "../pfCodeSamples";
import { useState } from "react";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    padding: "4rem 8rem 4rem 8rem",
    [theme.breakpoints.down("xs")]: {
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#5f6368",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "100px",
    },
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "19px",
      fontWeight: 500,
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  openBtn: {
    color: "white",
    border: "none",
    fontFamily: "inherit",
    padding: ".4rem .6rem",
    borderRadius: ".2rem",
    marginLeft: "1rem",
    backgroundColor: "#1987cb",
    cursor: "pointer",
    transition: "all .3s ease",
    "&:hover": {
      background: "#1987cb",
    },
  },
}));

const Fair = () => {
  // Declare State
  const classes = useStyles();
  const [open, setOpen] = useState({
    coinflip: false,
    crash: false,
    jackpot: false,
    roulette: false,
  });

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <br />
        <h1><InfoOutlinedIcon style={{ marginBottom: "-5px", }} /> PROVABLY FAIR</h1>
        <br />
        <section>
          <b>How can I know that a game is fair?</b>
          <p>
            For each game we use an EOS Blockchain's Block that has been
            generated after all players have joined. We use that block's unique
            ID as our games "public seed". That means we cannot know the outcome
            of the game before it has rolled. Any questions or concerns, please contact one of our staff members.
          </p>
        </section>
        <br />
        <section>
          <b>Verifying Jackpot Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.jackpot ? (
              <ProvablyCodeBlock text={pfCodeSamples.jackpot} language={"javascript"} showLineNumbers={false} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, jackpot: !state.jackpot }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <br />
        <section>
          <b>Verifying Coinflip Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.coinflip ? (
              <ProvablyCodeBlock text={pfCodeSamples.coinflip} language={"javascript"} showLineNumbers={false} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, coinflip: !state.coinflip }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <br />
        <section>
          <b>Verifying Crash Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each round:
            {open.crash ? (
              <ProvablyCodeBlock text={pfCodeSamples.crash} language={"javascript"} showLineNumbers={false} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, crash: !state.crash }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
        <br />
        <section>
          <b>Verifying Roulette Gamemode Fairness</b>
          <p>
            Below is a code snippet describing the logic behind each roll:
            {open.roulette ? (
              <ProvablyCodeBlock text={pfCodeSamples.roulette} language={"javascript"} showLineNumbers={false} />
            ) : (
              <button
                className={classes.openBtn}
                onClick={() =>
                  setOpen(state => ({ ...state, roulette: !state.roulette }))
                }
              >
                Show code sample
              </button>
            )}
          </p>
        </section>
      </Container>
    </Box>
  );
};

const ProvablyCodeBlock = ({ text, language, showLineNumbers }) => {
  return (
    <CopyBlock
      text={text}
      language={language}
      showLineNumbers={showLineNumbers}
      theme={ocean}
      wrapLines
    />
  );
};

export default Fair;
