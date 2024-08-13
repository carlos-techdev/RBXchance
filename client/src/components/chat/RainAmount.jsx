
import React, { useState, useEffect, useRef } from "react";
import { getChatData } from "../../services/api.service";
import { chatSocket } from "../../services/websocket.service";

import Box from "@material-ui/core/Box";

export const RainAmount = () => {
  const [rainPlayerAmount, setRainPlayerAmount] = useState(0);
  const isMountedRef = useRef(true);

  // Fetch crash schema from API
  const fetchData = async () => {
    try {
      const schema = await getChatData();

      if (isMountedRef.current) {
        // Update state
        setRainPlayerAmount(schema.rain.players.length);
      }
    } catch (error) {
      console.log("There was an error while loading rain schema:", error);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isMountedRef.current) {
      fetchData();
      chatSocket.on("rain-players-changed", fetchData);
      chatSocket.on("rain-join-error", fetchData);
      chatSocket.on("rain-join-success", fetchData);
      chatSocket.on("rain-state-changed", fetchData);
    }
    // componentDidUnmount
    return () => {
      isMountedRef.current = false;
      // Remove listeners
      chatSocket.off("rain-players-changed", fetchData);
      chatSocket.off("rain-join-error", fetchData);
      chatSocket.off("rain-join-success", fetchData);
      chatSocket.off("rain-state-changed", fetchData);
    };
  }, []);

  return (
    <Box style={{ marginRight: "5px", }}>
      {rainPlayerAmount}
    </Box>
  );
};
