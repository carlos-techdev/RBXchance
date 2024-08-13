import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

//assets
import logo from "./../assets/small-logo.png";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    alignItems: "center",
    justifyContent: "center",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "15px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "10rem",
      marginBottom: "1rem",
    },
    "& h1": {
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "27px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
});

const Err = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <img src={logo} alt="rbxchance" />
        <h1>YOU HAVE BEEN BANNED</h1>
        <span>
          If you think this was an error, you can appeal on our discord.
        </span>
      </Container>
    </Box>
  );
};

export default Err;
