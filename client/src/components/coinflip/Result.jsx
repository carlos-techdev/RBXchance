import React from "react";
import Spritesheet from "react-responsive-spritesheet";

// MUI Components
import Box from "@material-ui/core/Box";

// Assets
import ctsprite1 from "../../assets/ct1_original_fixed.png";
import ctsprite2 from "../../assets/ct2_original_fixed.png";
import tsprite1 from "../../assets/t1_original_fixed.png";
import tsprite2 from "../../assets/t2_original_fixed.png";

const Round = ({ players, winner }) => {
  // Declare State
  const imagesCT = [ctsprite1, ctsprite2];
  const randomImageCT = imagesCT[Math.floor(Math.random() * imagesCT.length)];

  const imagesT = [tsprite1, tsprite2];
  const randomImageT = imagesT[Math.floor(Math.random() * imagesT.length)];

  //console.log(winner); //2 is blue, 1 is red

  return (
    <Box>
      {players === 2 && winner === 1 ? (
        <Spritesheet
          image={randomImageT}
          widthFrame={240}
          heightFrame={240}
          steps={80}
          fps={40}
          style={{
            zIndex: 3,
            marginLeft: "15px",
          }}
        />
      ) : players === 2 && winner === 2 ? (
        <Spritesheet
          image={randomImageCT}
          widthFrame={240}
          heightFrame={240}
          steps={80}
          fps={40}
          style={{
            zIndex: 3,
            marginLeft: "15px",
          }}
        />
      ) : null}
    </Box>
  );
};

export default Round;
