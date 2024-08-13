
import React, { useState, useEffect } from "react";
import { battlesSocket } from "../../services/websocket.service";
import { getActiveBattlesGame } from "../../services/api.service";

export const PlayAmount = () => {
  const [playAmount, setPlayAmount] = useState(0);

  // Fetch battles schema from API
  const fetchData = async () => {
    try {
      const schema = await getActiveBattlesGame();

      setPlayAmount(schema.reduce((a, b) => a + b.price, 0));
    } catch (error) {
      console.log("There was an error while loading battles schema:", error);
    }
  };

  useEffect(() => {
    fetchData();

    battlesSocket.on("battles:new", fetchData);
    battlesSocket.on("battles:finished", fetchData);

    return () => {
      battlesSocket.off("battles:new", fetchData);
      battlesSocket.off("battles:finished", fetchData);
    };
  });

  return (
    <div style={{ color: "#b7b7b7", fontSize: "11px", margin: "auto", marginLeft: "0px", }}>
      ${parseFloat(playAmount).toFixed(2)}
    </div>
  );
};
