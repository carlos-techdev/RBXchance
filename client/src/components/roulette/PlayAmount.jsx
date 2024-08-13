
import React, { useState, useEffect } from "react";
import { getRouletteSchema } from "../../services/api.service";
import { rouletteSocket } from "../../services/websocket.service";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch roulette schema from API
  const fetchData = async () => {
    try {
      const schema = await getRouletteSchema();

      // Update state
      setPlayAmount(schema.current.players.reduce((a, b) => a + b.betAmount, 0));
    } catch (error) {
      console.log("There was an error while loading roulette schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    rouletteSocket.on("new-player", fetchData);
    rouletteSocket.on("new-round", fetchData);

    // componentDidUnmount
    return () => {
      // Remove listeners
      rouletteSocket.off("new-player", fetchData);
      rouletteSocket.off("new-round", fetchData);
    };
  });

  return (
    <div style={{ color: "#b7b7b7", fontSize: "11px", margin: "auto", marginLeft: "0px", }}>
      ${parseFloat(playAmount).toFixed(2)}
    </div>
  );
};
