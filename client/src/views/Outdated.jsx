import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// Assets
import logo from "../assets/small-logo.png";

// Custom styles
const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
    display: "block",
    textAlign: "left",
    padding: "3rem 5rem",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  a: {
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    textDecoration: "none",
    "&:hover": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 400,
      letterSpacing: ".005em",
      textDecoration: "none",
    },
  },
  h1: {
    color: "#b9b9b9",
    fontFamily: "Rubik",
    fontSize: "27px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  img: {
    height: "3rem",
  },
}));

const Outdated = () => {
  // Declare State
  const classes = useStyles();

  return (
    <article className={classes.root}>
      <img src={logo} className={classes.img} alt="rbxchance.com Logo" />
      <h1 className={classes.h1}>OOPS, RUNNING LATE!</h1>
      <div>
        <p>
          We have detected that you are running a outdated version of the site.
          To ensure the best experience you must be using the latest version.
          <br />
          If you don't know what this means, you most certainly just need to
          refresh this page couple of times.
        </p>
      </div>
    </article>
  );
};

export default Outdated;
