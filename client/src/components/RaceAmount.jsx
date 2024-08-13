
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { chatSocket } from "../services/websocket.service";
import { getRaceInformation } from "../services/api.service";

// MUI Components
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  amount: {
    background: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 20px)",
  },
}));

export const RaceAmount = () => {
  const classes = useStyles();
  const [raceAmount, setRaceAmount] = useState(0);

  // Fetch race schema from API
  const fetchData = async () => {
    try {
      const schema = await getRaceInformation();

      if (schema?.activeRace?.prize) {
        setRaceAmount(schema.activeRace.prize)
      } else {
        setRaceAmount(0)
      }

    } catch (error) {
      console.log("There was an error while loading race schema:", error);
    }
  };

  useEffect(() => {
    fetchData();
    chatSocket.on("race-state-changed", fetchData);

    // componentDidUnmount
    return () => {
      chatSocket.off("race-state-changed", fetchData);
    }
  });

  return (
    raceAmount > 0 ?
      (
        <Box className={classes.amount} style={{ color: "#fff", fontSize: "11px", margin: "auto", marginLeft: "0px", backgroundColor: "#FFC440", borderRadius: "5px", padding: "5px 8px 5px 8px", }}>
          ${parseFloat(raceAmount).toFixed(2)}
        </Box>
      ) : (
        <Box className={classes.amount} style={{ color: "#fff", fontSize: "11px", margin: "auto", marginLeft: "0px", backgroundColor: "#FFC440", borderRadius: "5px", padding: "5px 8px 5px 8px", }}>
          $0.00
        </Box>
      )
  );
};
