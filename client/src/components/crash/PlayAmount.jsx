
import React, { useState, useEffect } from "react";
import { getCrashSchema } from "../../services/api.service";
import { crashSocket } from "../../services/websocket.service";

import Box from "@material-ui/core/Box";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch crash schema from API
  const fetchData = async () => {
    try {
      const schema = await getCrashSchema();

      // Update state
      setPlayAmount(schema.current.players.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading crash schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    crashSocket.on("game-starting", fetchData);
    crashSocket.on("game-start", fetchData);
    crashSocket.on("game-end", fetchData);
    crashSocket.on("game-bets", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      crashSocket.off("game-starting", fetchData);
      crashSocket.off("game-start", fetchData);
      crashSocket.off("game-end", fetchData);
      crashSocket.off("game-bets", fetchData);
    };
  });

  return (
    <Box style={{ color: "#b7b7b7", fontSize: "11px", margin: "auto", marginLeft: "0px", }}>
      ${parseFloat(playAmount).toFixed(2)}
    </Box>
  );
};
