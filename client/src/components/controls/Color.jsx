import React from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";

// MUI Components
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";

import tRed from "../../assets/coin-t.png";
import ctBlue from "../../assets/coin-ct.png";

const ColorOption = withStyles(theme => ({
  root: {
    marginRight: "2rem",
    marginLeft: "2rem",
    marginBottom: "20px",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "10px",
    },
  },
}))(Box);

const Checked = withStyles(theme => ({
  root: {
    height: "100%",
    borderRadius: "100px",
    margin: "2px",
    opacity: props => props.op,
    background: props => props.color,
    "&:before": {
      display: "flex",
      width: 30,
      height: 30,
      content: '""',
    },
    "&:hover": {
      background: "#272b2f",
    },
    "&.MuiCheckbox-colorSecondary:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
  },
}))(Box);

const ColorRadio = withStyles(theme => ({
  root: {
    padding: 0,
    height: "2.25rem",
    width: "3rem",
    color: "white",
    [theme.breakpoints.down("sm")]: {
    },
    "& span": {
    },
    "& .MuiTouchRipple-root": {
      opacity: 0,
    },
    "&:before": {
      background: "#ffffff",
    },
    "&:hover": {
      color: "#ffffff",
      backgroundColor: "#ffffff",
    },
    "&.MuiCheckbox-colorSecondary:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
  },
}))(Checkbox);

const useStyles = makeStyles(theme => ({
  reverse: {
    alignItems: "center",
    justifyContent: "center",
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "12px",
    marginBottom: "5px",
    fontWeight: 500,
    letterSpacing: ".1em",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  },
  colorbuttonsRED: {
    borderRadius: "100%",
    border: "2px solid #48d242",
    "&:hover": {
      borderRadius: "100%",
      border: "2px solid #48d242",
    },
  },
  colorbuttonsBLUE: {
    borderRadius: "100%",
    border: "2px solid #48d242",
    "&:hover": {
      borderRadius: "100%",
      border: "2px solid #48d242",
    },
  },
  colorbuttonsGREEN: {
    borderRadius: "100%",
    border: "1px solid #429245",
    "&:hover": {
      borderRadius: "100%",
      border: "1px solid #429245",
    },
  },
  colorbuttonsYELLOW: {
    borderRadius: "100%",
    border: "1px solid #cab921",
    "&:hover": {
      borderRadius: "100%",
      border: "1px solid #cab921",
    },
  },
  disabled: {
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
    display: "none",
  },
}));

const Color = ({ value, onChange, playerAmount }) => {
  // Declare State
  const classes = useStyles();

  return (
    <ColorOption>
      {/*<Box className={classes.reverse}>Side</Box>*/}
      <ColorRadio
        style={{ margin: "4.1px", marginLeft: "-9px", }}
        disableRipple
        checkedIcon={<div className={classes.colorbuttonsRED}><Checked op="1" color={`url(${tRed}) 50%/100% auto no-repeat`} /></div>}
        icon={<Checked op="1" color={`url(${tRed}) 50%/100% auto no-repeat`} />}
        onChange={onChange}
        checked={value === "red"}
        value="red"
      />
      <ColorRadio
        style={{ margin: "4.1px", marginLeft: "-9px", }}
        disableRipple
        checkedIcon={<div className={classes.colorbuttonsBLUE}><Checked op="1" color={`url(${ctBlue}) 50%/100% auto no-repeat`} /></div>}
        icon={<Checked op="1" color={`url(${ctBlue}) 50%/100% auto no-repeat`} />}
        onChange={onChange}
        checked={value === "blue"}
        value="blue"
      />
      <ColorRadio
        style={{ margin: "4.1px", marginLeft: "-9px", }}
        disableRipple
        checkedIcon={<div className={classes.colorbuttonsGREEN}><Checked op="1" color="#2ebd50" /></div>}
        icon={<Checked op="1" color="#2ebd50" />}
        onChange={onChange}
        checked={value === "green"}
        disabled={playerAmount < 3}
        className={playerAmount < 3 ? classes.disabled : ""}
        value="green"
      />
      <ColorRadio
        style={{ margin: "4.1px", marginLeft: "-9px", }}
        disableRipple
        checkedIcon={<div className={classes.colorbuttonsYELLOW}><Checked op="1" color="#cab921" /></div>}
        icon={<Checked op="1" color="#cab921" />}
        onChange={onChange}
        checked={value === "yellow"}
        disabled={playerAmount !== 4}
        className={playerAmount !== 4 ? classes.disabled : ""}
        value="yellow"
      />
    </ColorOption>
  );
};

Color.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  playerAmount: PropTypes.number.isRequired,
};

export default Color;
