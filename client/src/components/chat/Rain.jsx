import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { chatSocket } from "../../services/websocket.service";
import { useToasts } from "react-toast-notifications";

import { RainAmount as RainPlayersAmount } from "./RainAmount";

// MUI Components
import Slide from "@material-ui/core/Slide";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

//Components
import RainCAPTCHA from "../modals/RainModal";

// Assets
import umbrella from "../../assets/umbrela.gif";

// Custom styles
const useStyles = makeStyles(theme => ({
  root: {
    padding: 20,
    height: "7rem",
    width: "100%",
    position: "relative",
  },
  content: {
    width: "102%",
    height: "130%",
    display: "flex",
    position: "relative",
    background: "repeating-linear-gradient(85deg,transparent,transparent 3px,rgba(0,0,0,.04) 0,rgba(0,0,0,.04) 5px)",
    borderRadius: "5px",
    marginLeft: "-3px",
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
      width: "180px",
      filter: "drop-shadow(0px 0px 10px #031722) invert(5%)",
      marginLeft: "10px",
    },
  },
  join: {
    backgroundColor: "#266388",
    borderRadius: "5px",
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontWeight: 500,
    boxShadow: "none",
    margin: "auto",
    textTransform: "inherit",
    marginRight: "1rem",
    marginTop: "5px",
    fontSize: 10,
    "&:hover": {
      backgroundColor: "#387499",
      boxShadow: "none",
    },
  },
}));

const Rain = ({ rain }) => {
  // Declare state
  const classes = useStyles();
  const { addToast } = useToasts();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Open reCaptcha Modal
  const onClick = () => {
    setModalVisible(state => !state);
  };

  // Handle reCaptcha completed event
  const onChange = value => {
    setLoading(true);
    chatSocket.emit("enter-rain", value);
  };


  // componentDidMount
  useEffect(() => {
    let isMounted = true;

    // Handle rain joining error event
    const onError = message => {
      setLoading(false);
      addToast(message, { appearance: "error" });
      setModalVisible(state => !state);
    };

    // Handle rain joining success event
    const onSuccess = message => {
      setLoading(false);
      addToast(message, { appearance: "success" });
      setModalVisible(state => !state);
    };
    if (isMounted) {
      // Listeners
      chatSocket.on("rain-join-error", onError);
      chatSocket.on("rain-join-success", onSuccess);
    }
    // componentDidUnmount
    return () => {
      isMounted = false;
      // Remove Listeners
      chatSocket.off("rain-join-error", onError);
      chatSocket.off("rain-join-success", onSuccess);
    };
  }, [addToast]);

  return (
    <Slide in={rain.active} direction={"right"}>
      <Box className={classes.root}>
        <Box className={classes.content} style={{ backgroundColor: "#144868", }}>
          {/*<img src={umbrella} alt="umbrella" />*/}
          <Box style={{ fontFamily: "Rubik", fontWeight: 300, color: "#ebe9e9", marginLeft: "13px", marginTop: "10px", width: "150%", }}>
            <span style={{ fontWeight: 500, color: "#59b5ff", }}>${parseFloat(rain.prize).toFixed(2)} Rain</span>
            <br />
            <Box style={{ display: "flex", marginBottom: "-19px", }}><RainPlayersAmount /> participants</Box>
            <br />
            <Button
              onClick={onClick}
              className={classes.join}
              variant="contained"
            >
              Join For Free
            </Button>
          </Box>

          <RainCAPTCHA
            open={modalVisible}
            handleClose={() => setModalVisible(state => !state)}
            onChange={onChange}
            loading={loading}
          />
        </Box>
      </Box>
    </Slide>
  );
};

export default Rain;
