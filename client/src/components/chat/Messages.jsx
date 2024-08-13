import React, { useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
// import ScrollToBottom from "react-scroll-to-bottom";
import PropTypes from "prop-types";

// Components
// MUI Components
import Box from "@material-ui/core/Box";
import ModeratedMessage from "./ModeratedMessage";
import SkeletonMessage from "./SkeletonMessage";

const useStyles = makeStyles({
  root: {
    flex: "1 1",
    flexDirection: "column",
    overflowX: "hidden",
    // overflowY: "scroll",
    position: "relative",
    // scrollbarWidth: "1px",
    borderTop: "1px solid #161D26",
    // maskImage: "linear-gradient(0deg,rgba(0,0,0,1) 80%,rgba(0,0,0,0))",
    "&::-webkit-scrollbar": {
      display: "none",
      background: "transparent"
    },
  },
  box: {
    background: "#848dad0a",
  },
  content: {
    color: "#707479",
    fontSize: 13,
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".1em",
    whiteSpace: "normal",
    marginTop: 7,
    marginRight: "20px",
    wordWrap: "break-word",
    hyphens: "auto",
  },
  avatar: {
    width: 35,
    height: 35,
    border: "2px solid #3b4047",
    marginTop: "-5px",
    marginLeft: "20px",
    marginRight: "8px",
    margin: "0px 15px",
    borderRadius: "100%",
  },
  chatbox: {
    display: "flex",
    padding: "20px 0px 20px 0px",
    // borderTop: "1.5px solid #1b1f22",
    fontFamily: "Rubik",
    borderRadius: 0,
    "& .message": {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      justifyContent: "center",
      "& > div": {
        maxWidth: "210px",
      },
    },
    "& .message .username": {
      color: "#e0e0e0",
      fontFamily: "Rubik",
      textTransform: "uppercase",
      fontWeight: 500,
      letterSpacing: ".1em",
      position: "relative",
      marginTop: "7px",
      fontSize: "9.6px",
    },
    "& .admin": {
      background: "#ca382d",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
    },
    "& .mod": {
      background: "#3e8441",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .dev": {
      background: "#0b655c",
      borderRadius: "5.1px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 4.5px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .partner": {
      background: "#791f84",
      borderRadius: "5.1px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 4.5px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .user": {
      background: "#31363c",
      borderRadius: 3,
      fontSize: "9.6px",
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
      fontSize: "9px",
      padding: "5px 4.5px",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      marginRight: "8px",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
      borderRadius: "2.5px",
    },
    "& .bronze": {
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .silver": {
      background: "#95A5A6",
      borderRadius: "5.1px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .gold": {
      background: "#b99309",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
      color: "#fff",
      fontFamily: "Rubik",
      fontWeight: 500,
      letterSpacing: ".15em",
      marginTop: "-4px",
    },
    "& .diamond": {
      background: "#3498DB",
      borderRadius: "2.5px",
      fontSize: "9.4px",
      marginRight: 10,
      padding: "5px 5.1px",
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

const Messages = ({ chatMessages, loading, user }) => {
  // Declare State
  const classes = useStyles();
  const emptyDiv = useRef(null);

  // Scroll chat using ref
  const scrollChat = () => {
    // Call method on that element
    if (emptyDiv && emptyDiv.current)
      emptyDiv.current.scrollIntoView({ behavior: "smooth" });
  };

  // When chat messages change
  useEffect(() => {
    scrollChat();
  }, [chatMessages]);

  // When messages load the first time
  useEffect(() => {
    // Set timeout for animation
    const timeout = setTimeout(() => {
      // If messages are loaded
      if (chatMessages) scrollChat();
    }, 500);

    // Clear function
    return () => {
      // Save memory and remove timeout
      clearTimeout(timeout);
    };
    // eslint-disable-next-line
  }, [loading]);

  return (
    <Box className={classes.root}>
      <Box>
        {loading
          ? Array(15)
            .fill()
            .map((element, index) => <SkeletonMessage key={index} />)
          : chatMessages.map((message, idx) =>
            <ModeratedMessage rank={user && user.rank ? user.rank : null} key={message.msgId} message={message} />
          )}
      </Box>
      <Box style={{ float: "left", clear: "both" }} ref={emptyDiv}></Box>
    </Box>
  );
};

Messages.propTypes = {
  chatMessages: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(Messages);
