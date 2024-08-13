
import React, { useState, useEffect } from "react";
import { getUserPrivateCoinflipGames } from "../../services/api.service";
import { coinflipSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";

export const TotalAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);


  const fetchData = async () => {
    try {
      const schema = await getUserPrivateCoinflipGames();

      // Update state
      setPlayAmount(schema.reduce((a, b) => a + b.totalBetAmount, 0));
    } catch (error) {
      console.log("There was an error while loading coinflip schema:", error);
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
      {parseFloat(playAmount).toFixed(2)}
    </Box>
  );
};
