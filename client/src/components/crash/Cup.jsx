import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";

// MUI Components
import Box from "@material-ui/core/Box";

//Assets
import Water from "../../assets/waterfall.gif";

// Custom Styled Componen
const Cup = withStyles({
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    display: "flex",
    width: "17.7vw",
    minWidth: 225,
    maxWidth: 390,
    justifyContent: "center",
    alignItems: "center",
    "&::after": {
      content: "''",
      position: "absolute",
      left: "50%",
      bottom: "-20px",
      transform: "translateX(-50%)",
      width: "80%",
      height: "20px",
      backgroundColor: "#ded6d6",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      zIndex: -1,
      transition: "background-color 0.2s linear",
    },
    "& .mid": {
      width: "100%",
      height: "17.2vw",
      minHeight: 215,
      maxHeight: 380,
      WebkitClipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
      overflow: "hidden",
      transition: "background-color 0.2s linear",
      "& .shade": {
        backgroundColor: "rgb(38, 48, 63, 0.5)",
        height: "100%",
        "&::after": {
          content: "''",
          position: "absolute",
          left: "0",
          bottom: "-20px",
          width: "100%",
          height: "20px",
          backgroundColor: "#292f3b",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          transition: "background-color 0.2s linear",
        },
      },
      "& .water": {
        position: "absolute",
        bottom: 0,
        height: "100%",
        width: "100%",
        overflow: "hidden",
        transition: "height 0.4s linear",
        "& div": {
          position: "absolute",
          bottom: "15%",
          left: "50%",
          marginLeft: -500,
          marginBottom: -200025,
          width: 1000,
          height: 200025,
          backgroundColor: "#FFC440",
          zIndex: -1,
          transition: "background-color 0.4s linear, bottom 1s linear",
        },
      },
    },
    "& .topBar": {
      position: "absolute",
      height: 15,
      width: "85%",
      left: "50%",
      top: 25,
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: 30,
      transition: "background-color 0.2s linear",
    },
    "& .midBar": {
      position: "absolute",
      height: 15,
      width: "72.5%",
      left: "50%",
      top: 50,
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: 30,
      transition: "background-color 0.2s linear",
    },
    "& .bottomBar": {
      position: "absolute",
      height: 15,
      width: "45%",
      left: "50%",
      bottom: -15,
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: 30,
      zIndex: 1,
      transition: "background-color 0.2s linear",
    },
    "& .top": {
      position: "absolute",
      height: 25,
      width: "19.3vw",
      minWidth: 255,
      maxWidth: 420,
      left: "50%",
      top: -25,
      backgroundColor: "#e3e3e3",
      transform: "translateX(-50%)",
      borderRadius: 30,
      "&::before": {
        content: "''",
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "92.5%",
        height: "100%",
        backgroundColor: "#F4F4F4",
        borderRadius: 30,
      },
    },
    "&.crashed": {
      "&::after": {
        backgroundColor: "#ded6d6",
      },

      "& .mid": {
        backgroundColor: "rgba(255, 69, 69, 0.6)",

        "& .shade": {
        },

        "& .water": {
          "& div": {
            backgroundColor: "#ff7b7b",
          },
        },
      },
      "& .topBar": {
      },
      "& .midBar": {
      },
      "& .bottomBar": {
      },
    },
  },
  "@keyframes water": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
})(Box);

const useStyles = makeStyles({
  meta: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    textAlign: "center",
  },
  payout: {
    color: "#f8f8f8",
    fontFamily: "Rubik",
    fontSize: "40px",
    fontWeight: 500,
    letterSpacing: ".1em",
    userSelect: "none",
    lineHeight: 1,
  },
  profit: {
    color: "#11ca52",
    fontFamily: "Rubik",
    fontSize: "30px",
    fontWeight: 500,
    letterSpacing: ".1em",
    userSelect: "none",
    lineHeight: 1,
    marginTop: 3,
    transition: "color 0.4s ease",
    "&.cashed": {
      color: "#11ca52",
    },
  },
});

// Same game states as in backend
const GAME_STATES = {
  NotStarted: 1,
  Starting: 2,
  InProgress: 3,
  Over: 4,
  Blocking: 5,
  Refunded: 6,
};

const BET_STATES = {
  Playing: 1,
  CashedOut: 2,
};

const CupAnimation = ({ loading, payout, ownBet, gameState }) => {
  const classes = useStyles();

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <Cup
        className={`${gameState === GAME_STATES.Over ? "crashed" : "running"}`}
      >
        <div className="mid">
          <div className="shade"></div>
          <div className="water">
            <div
              style={{
                bottom:
                  gameState === GAME_STATES.InProgress
                    ? `${(payout / 10) * 90 + 10}%`
                    : "0%",
              }}
            ></div>
          </div>
        </div>
        <div className="top">
          <div
            style={{
              display:
                payout > 11 && gameState !== GAME_STATES.Over
                  ? "inline"
                  : "none",
            }}
          >
            <img src={Water} alt={"Splashing"} style={{ width: "40%", marginLeft: "50%", opacity: 0.2, }} />
          </div>
        </div>
        <div className="topBar"></div>
        <div className="midBar"></div>
        <div className="bottomBar"></div>
      </Cup>
      <div className={classes.meta}>
        <div className={classes.payout}>
          {loading ? "LOADING" : `x${payout.toFixed(2)}`}
        </div>
        {(gameState === GAME_STATES.InProgress ||
          gameState === GAME_STATES.Over) &&
          ownBet && (
            <div
              className={`${classes.profit} ${ownBet.status === BET_STATES.CashedOut ? "cashed" : ""
                }`}
            >
              +$
              {ownBet.status === BET_STATES.Playing
                ? parseCommasToThousands(
                  cutDecimalPoints((ownBet.betAmount * payout).toFixed(7))
                )
                : parseCommasToThousands(
                  cutDecimalPoints(ownBet.winningAmount.toFixed(7))
                )}
            </div>
          )}
      </div>
    </Box>
  );
};

export default CupAnimation;
