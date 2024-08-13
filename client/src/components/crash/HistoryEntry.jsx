import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";

// MUI Components
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

// Components
import ProvablyModal from "../modals/crash/ProvablyModal";

// Custom Styled Component
const Multiplier = withStyles(theme => ({
  root: {
    backgroundColor: props => props.color,
    "&:hover": {
      backgroundColor: props => props.color,
    },
    color: "white",
    fontFamily: "Rubik",
    background: "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 20px)",
    marginRight: 8,
    [theme.breakpoints.down("sm")]: {
      marginTop: 5,
      fontSize: "0.675rem",
      padding: "4px 8px",
      minWidth: "initial",
    },
  },
}))(Button);

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
          {game.crashPoint < 1.2 ? (
            <Multiplier size="medium" style={{ backgroundColor: "#D24242", boxShadow: "none", }} variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
          ) : game.crashPoint >= 1.2 && game.crashPoint < 2 ? (
            <Multiplier size="medium" style={{ backgroundColor: "#D24242", boxShadow: "none", }} variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
          ) : game.crashPoint >= 2 && game.crashPoint < 100 ? (
            <Multiplier size="medium" style={{ backgroundColor: "#FFC440", boxShadow: "none", }} variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
          ) : (
            <Multiplier size="medium" style={{ backgroundColor: "#129540", boxShadow: "none", }} variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
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
