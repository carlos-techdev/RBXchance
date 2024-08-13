
import React, { useState, useEffect } from "react";
import { getJackpotSchema } from "../../services/api.service";
import { jackpotSocket } from "../../services/websocket.service";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch jackpot schema from API
  const fetchData = async () => {
    try {
      const schema = await getJackpotSchema();

      // Update state
      setPlayAmount(schema.current.players.reduce((a, b) => a + b.betAmount, 0) + schema.currentMiddle.players.reduce((a, b) => a + b.betAmount, 0) + schema.currentHigh.players.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading jackpot schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    jackpotSocket.on("new-round-low", fetchData);
    jackpotSocket.on("new-round-middle", fetchData);
    jackpotSocket.on("new-round-high", fetchData);
    jackpotSocket.on("new-player-low", fetchData);
    jackpotSocket.on("new-player-middle", fetchData);
    jackpotSocket.on("new-player-high", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      jackpotSocket.off("new-round-low", fetchData);
      jackpotSocket.off("new-round-middle", fetchData);
      jackpotSocket.off("new-round-high", fetchData);
      jackpotSocket.off("new-player-low", fetchData);
      jackpotSocket.off("new-player-middle", fetchData);
      jackpotSocket.off("new-player-high", fetchData);
    };
  });

  return (
    <div style={{ color: "#b7b7b7", fontSize: "11px", margin: "auto", marginLeft: "0px", }}>
      ${parseFloat(playAmount).toFixed(2)}
    </div>
  );
};
