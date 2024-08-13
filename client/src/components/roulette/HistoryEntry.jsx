import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

// Assets
import red from "../../assets/punch.png";
import black from "../../assets/wrench.png";
import green from "../../assets/rocket.svg";

// Components
import ProvablyModal from "../modals/roulette/ProvablyModal";

// Custom Styled Component
const His = withStyles({
  root: {
    cursor: "pointer",
    marginRight: 10,
    background: props => props.bg,
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "12px",
    width: "2rem",
    fontWeight: 500,
    letterSpacing: ".05em",
    height: props => props.height,
    boxShadow: props => props.glow,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    "&:hover": {
      transition: "all 300ms",
      transform: "scale(1.1)",
      WebkitTransform: "scale(1.1)",
      filter: "brightness(1.15)",
    },
  },
})(Box);

const HistoryEntry = ({ game }) => {
  // Declare State
  const [modalVisible, setModalVisible] = useState(false);

  // Button onClick event handler
  const onClick = () => {
    setModalVisible(state => !state);
  };

  return (
    <Fragment>
      <ProvablyModal
        game={game}
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <div onClick={onClick}>
        <Tooltip title="Click to view Provably Fair" placement="bottom">
          {game.winner === "red" ? (
            <His height="2rem" bg="#FCB122"><img src={red} alt="Red" style={{ height: "60%", width: "60%", }} /></His>
          ) : game.winner === "black" ? (
            <His height="2rem" bg="#58A8FF"><img src={black} alt="Black" style={{ height: "60%", width: "60%", }} /></His>
          ) : game.winner === "green" ? (
            <His height="2rem" bg="#EE2472"><img src={green} style={{
              height: "90%",
              width: "100%",
              padding: "0.30rem",
              marginTop: "0px",
              verticalAlign: "middle",
              borderStyle: "none",
            }} /></His>
          ) : (
            <span>INVALID</span>
          )}
        </Tooltip>
      </div>
    </Fragment>
  );
};

HistoryEntry.propTypes = {
  game: PropTypes.object.isRequired,
};

export default HistoryEntry;
