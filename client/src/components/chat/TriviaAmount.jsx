
import React, { useState, useEffect, useRef } from "react";
import { getChatData } from "../../services/api.service";
import { chatSocket } from "../../services/websocket.service";

import Box from "@material-ui/core/Box";

export const TriviaAmount = () => {
  const [triviaPlayerAmount, setTriviaPlayerAmount] = useState(0);
  const isMountedRef = useRef(true);

  // Fetch crash schema from API
  const fetchData = async () => {
    try {
      const schema = await getChatData();

      if (isMountedRef.current) {
        // Update state
        setTriviaPlayerAmount(schema.trivia.winners.length);
      }
    } catch (error) {
      console.log("There was an error while loading trivia schema:", error);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if (isMountedRef.current) {
      fetchData();
      chatSocket.on("trivia-state-changed", fetchData);
      chatSocket.on("trivia-join-winner", fetchData);
    }
    // componentDidUnmount
    return () => {
      isMountedRef.current = false;
      // Remove listeners
      chatSocket.off("trivia-state-changed", fetchData);
      chatSocket.on("trivia-join-winner", fetchData);
    };
  }, []);

  return (
    <Box style={{ marginRight: "1px", marginLeft: "8px", }}>
      {triviaPlayerAmount}
    </Box>
  );
};
