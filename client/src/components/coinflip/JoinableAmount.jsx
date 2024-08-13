
import React, { useState, useEffect } from "react";
import { getUserPrivateCoinflipGamesJoinable } from "../../services/api.service";
import { coinflipSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";

export const JoinableAmount = () => {
  const [joinableAmount, setjoinableAmount] = useState("");


  const fetchData = async () => {
    try {
      const schema = await getUserPrivateCoinflipGamesJoinable();

      setjoinableAmount(schema);
    } catch (error) {
      console.log(
        "Error Coinflip:",
        error
      );
    }
  };

  useEffect(() => {
    let unmounted = false;

    if (!unmounted) {
      fetchData();
      coinflipSocket.on("new-coinflip-game", fetchData);
      coinflipSocket.on("game-joined", fetchData);
      coinflipSocket.on("game-called-bot", fetchData);
      coinflipSocket.on("game-rolled", fetchData);
      coinflipSocket.on("game-rolling", fetchData);
    }
    // componentDidUnmount
    return () => {
      unmounted = true;
      // Remove listeners
      coinflipSocket.off("new-coinflip-game", fetchData);
      coinflipSocket.off("game-joined", fetchData);
      coinflipSocket.off("game-called-bot", fetchData);
      coinflipSocket.off("game-rolled", fetchData);
      coinflipSocket.off("game-rolling", fetchData);
    };
  }, []);

  return (
    <Box>
      {joinableAmount}
    </Box>
  );
};
