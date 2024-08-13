import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";

import { TriviaAmount as TriviaPlayersAmount } from "./TriviaAmount";

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { chatSocket } from "../../services/websocket.service";
import { getChatData } from "../../services/api.service";

// MUI Components
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";

// Custom styles
const useStyles = makeStyles(theme => ({
  root: {
    padding: 20,
    width: "100%",
    height: "8rem",
    position: "relative",
    marginTop: "57px",
  },
  content: {
    width: "102%",
    height: "180%",
    border: "1px dashed #ffb900",
    marginLeft: "-3px",
    marginTop: "-60px",
    background: "#161b21",
    display: "flex",
    padding: "17px",
    position: "relative",
    borderRadius: "6px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    "& img": {
      marginRight: "15px",
    },
  },
  title: {
    color: "#ffb900",
    fontSize: 16,
    wordBreak: "break-word",
    fontFamily: "Rubik",
    fontWeight: 500,
    userSelect: "none",
    whiteSpace: "pre-wrap",
  },
  question: {
    color: "#ffffff",
    fontSize: "13px",
    marginTop: "3px",
    wordBreak: "break-word",
    fontFamily: "Rubik",
    fontWeight: 300,
    userSelect: "none",
    whiteSpace: "pre-wrap",
  },
  info: {
    color: "#ffb900",
    fontSize: 10,
    fontFamily: "Rubik",
    fontWeight: 400,
    display: "flex",
    letterSpacing: ".1em",
    position: "absolute",
    right: 5,
    bottom: 4,
  },
}));

const Trivia = ({ trivia }) => {
  // Declare state
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [startCountDown, setStartCountdown] = useState(false);
  const [waitTime, setWaitTime] = useState(60);

  // Countdown started LOW
  const countdownStarted = (triviaTime, triviaStarted) => {
    // Update state
    setStartCountdown(triviaStarted);
    setWaitTime(triviaTime / 1000);
  };

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getChatData();
        setStartCountdown(response.triviaCountdownStarted);
        setWaitTime(response.triviaTime / 1000);
        //console.log(response.triviaCountdownStarted);
        //console.log(response.triviaTime / 1000);

        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading Jackpot schema:", error);
      }
    };

    fetchData();
    chatSocket.on("countdown-started-trivia", countdownStarted);
    // componentDidUnmount
    return () => {
      // Remove listeners
      chatSocket.off("countdown-started-trivia", countdownStarted);
    };
  }, []);

  return (
    <Slide in={trivia.active} direction={"right"}>
      <Box className={classes.root}>
        <Box className={classes.content}>
          <Box>
            <div className={classes.title}>{trivia.question}</div>
            <div className={classes.question}>Type the right answer in chat!</div>
            <div className={classes.info}>
              <CountdownCircleTimer
                size={30}
                isPlaying={!loading && startCountDown === false ? false : true}
                duration={waitTime}
                //initialRemainingTime={waitTime}
                strokeWidth={4}
                strokeLinecap={"square"}
                colors={["#c5c9c6"]}
                trailColor={["#0D1116"]}
              >
              </CountdownCircleTimer>
              <span style={{
                display: "flex",
                background: "#1b222a",
                borderRadius: "5px",
                marginLeft: "20px",
                padding: "12px 13px 8px 15px",
                fontSize: "13px",
                marginTop: "-8px",
                marginBottom: "7px",
                color: "#cfcfcf",
                marginRight: "-15px",
              }}>
                <span style={{
                  color: "#FFC440",
                  fontWeight: 800,
                  marginRight: "6px",
                  fontSize: "18px",
                  marginBottom: "-19px",
                  marginTop: "-4px",
                }}>$</span>
                {parseCommasToThousands(cutDecimalPoints(trivia.prize.toFixed(7)))}{" "}
              </span>
              <Box
                style={{
                  display: "flex",
                  background: "#1b222a",
                  borderRadius: "5px",
                  marginLeft: "20px",
                  padding: "12px 13px 8px 15px",
                  fontSize: "13px",
                  marginTop: "-8px",
                  marginBottom: "7px",
                  color: "#cfcfcf",
                  marginRight: "5px",
                }}>
                <svg style={{ width: "20px", marginTop: "-4px", }} width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M29 3H26V2C26 1.47 25.79 0.960088 25.41 0.590088C25.04 0.210088 24.53 0 24 0H8C7.47 0 6.95997 0.210088 6.58997 0.590088C6.20997 0.960088 6 1.47 6 2V3H2.97998C2.44998 3 1.94995 3.21009 1.56995 3.59009C1.19995 3.96009 0.97998 4.47 0.97998 5V7C0.98998 8.33 1.50995 9.60003 2.44995 10.53C3.38995 11.47 4.65998 12 5.97998 12H6.48999C7.68999 15.74 11.01 18.54 15 18.95V22H12C11.73 22 11.48 22.11 11.29 22.29C11.11 22.48 11 22.73 11 23C11 23.27 11.11 23.52 11.29 23.71C11.48 23.89 11.73 24 12 24H20C20.27 24 20.52 23.89 20.71 23.71C20.89 23.52 21 23.27 21 23C21 22.73 20.89 22.48 20.71 22.29C20.52 22.11 20.27 22 20 22H17V18.95C18.95 18.75 20.7901 17.99 22.3101 16.76C23.8301 15.52 24.95 13.87 25.54 12H26C27.33 12 28.6 11.47 29.53 10.53C30.47 9.60003 31 8.33 31 7V5C31 4.47 30.79 3.96009 30.41 3.59009C30.04 3.21009 29.53 3 29 3ZM5.97998 10C5.18998 10 4.42999 9.68012 3.85999 9.12012C3.29999 8.56012 2.98998 7.8 2.97998 7V5H6V8.88989C6 9.25989 6.02006 9.63 6.06006 10H5.97998ZM29 7C29 7.8 28.68 8.56012 28.12 9.12012C27.56 9.68012 26.8 10 26 10H25.95C25.98 9.67 26 9.34 26 9V5H29V7Z" fill="#F3BC57" />
                </svg>
                <TriviaPlayersAmount /> / {trivia.winnerAmount}
              </Box>
            </div>
          </Box>
        </Box>
      </Box>
    </Slide>
  );
};

export default Trivia;
