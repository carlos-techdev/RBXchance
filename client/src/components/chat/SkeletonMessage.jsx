import React from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles({
  content: {
    overflowY: "hidden",
    color: "#707479",
    fontSize: 13,
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".1em",
    whiteSpace: "normal",
    marginTop: 7,
    background: "#607d8b0d",
    padding: "10px",
    borderRadius: "20px",
    marginRight: "70px",
  },
  avatar: {
    width: 31,
    height: 31,
    marginTop: "-5px",
    marginLeft: "20px",
    marginRight: "8px",
    margin: "0px 15px",
    borderRadius: "100%",
  },
  chatbox: {
    display: "flex",
    padding: "20px 0px",
    margin: "0px 15px",
    // borderTop: "1.5px solid #212529",
    fontFamily: "Rubik",
    borderRadius: 0,
    "& .message": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "& > div": {
        display: "flex",
      },
    },
    "& .message .username": {
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      marginTop: "4px",
      fontSize: 11,
    },
    "& .admin": {
      background: "#ca382d",
      borderRadius: 3,
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
    },
    "& .mod": {
      background: "#3e8441",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .dev": {
      background: "#0b655c",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .partner": {
      background: "#791f84",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .user": {
      background: "#31363c",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .userlevel": {
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
      borderRight: "1px solid #1a1f26",
    },
    "& .bronze": {
      background: "#C27C0E",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .silver": {
      background: "#95A5A6",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .gold": {
      background: "#b99309",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .diamond": {
      background: "#3498DB",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      fontSize: 9,
      marginRight: 10,
      padding: "5px 10px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
  },
  gif: {
    width: "100%",
    borderRadius: 5,
    marginTop: 5,
  },
});

const SkeletonMessage = () => {
  // Declare state
  const classes = useStyles();

  // Random number helper
  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Randomly generate skeleton chat message
  const message = {
    contentLength: randomIntFromInterval(3, 255),
    isGif: Math.random() < 0.5,
    user: {
      usernameLength: randomIntFromInterval(5, 16),
      rank: 1,
    },
  };

  return (
    <Box className={classes.chatbox}>
      <Skeleton
        variant="rect"
        className={classes.avatar}
        width={25}
        height={25}
      />
      <div className="message">
        {message.user.rank === 5 ? (
          <Box>
            <div className="username">
              <Skeleton
                variant="text"
                width={message.user.usernameLength}
                height={5}
              />
            </div>
            <div className="admin">
              <Skeleton
                variant="text"
                className={classes.avatar}
                width={10}
                height={5}
              />
            </div>
          </Box>
        ) : (
          <div className="username">
            <Skeleton
              variant="text"
              width={message.user.usernameLength}
              height={5}
            />{" "}
            {message.user.rank === 4 && (
              <Skeleton
                variant="text"
                className={classes.avatar}
                width={7}
                height={5}
              />
            )}
          </div>
        )}
        {/* {message.isGif ? (
          <div className={classes.content}>
            <Skeleton variant="rect" width={210} height={210} />
          </div>
        ) : (
        )} */}
        <div className={classes.content}>
          {Array(Math.round(message.contentLength / 30))
            .fill()
            .map((element, index) => (
              <Skeleton key={index} variant="text" width={38} height={5} />
            ))}
        </div>
      </div>
    </Box>
  );
};

export default SkeletonMessage;
