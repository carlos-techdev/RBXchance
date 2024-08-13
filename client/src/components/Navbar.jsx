import React from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../actions/auth";

// MUI Components
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import ChatIcon from "@material-ui/icons/Chat";
import MenuIcon from '@material-ui/icons/Menu';
//import Toolbar from "@material-ui/core/Toolbar";

import logo from "../assets/wide-logo.png";

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 1000,
    background: "transparent",
    display: "flex",
    textAlign: "center",
    width: "0%",
    height: "90px",
    boxShadow: "none",
    position: "fixed",
    pointerEvents: "all",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      zIndex: 100000,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      zIndex: 100000,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      zIndex: 100000,
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: "280px",
    },
    "& .MuiToolbar-gutters": {
      [theme.breakpoints.down("sm")]: {
        paddingLeft: 10,
        paddingRight: 10,
      },
    },
  },
  LogoClass: {
    pointerEvents: "all",
    transition: "all 400ms",
    transform: "scale(1)",
    WebkitTransform: "scale(1)",
    "&:hover": {
      transition: "all 400ms",
      transform: "scale(1.06)",
      WebkitTransform: "scale(1.06)",
    },
  },
  mobileNav1: {
    display: "none",
    pointerEvents: "all",
    zIndex: 1000,
    padding: 20,
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      marginTop: "5px",
      marginLeft: 0,
      marginRight: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      marginTop: "5px",
      marginLeft: 0,
      marginRight: "auto",
    },
    [theme.breakpoints.down("md")]: {
      display: "flex",
      marginTop: "5px",
      marginLeft: 0,
      marginRight: "auto",
    },
  },
  mobileNav2: {
    display: "none",
    zIndex: 1000,
    padding: 20,
    pointerEvents: "all",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      marginTop: "5px",
      marginLeft: "auto",
      marginRight: 0,
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      marginTop: "5px",
      marginLeft: "auto",
      marginRight: 0,
    },
    [theme.breakpoints.down("md")]: {
      display: "flex",
      marginTop: "5px",
      marginLeft: "auto",
      marginRight: 0,
    },
  },
  logoimage: {
    outline: "none",
    pointerEvents: "all",
    [theme.breakpoints.down("xs")]: {
      textAlign: "center",
    },
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
    },
    [theme.breakpoints.down("md")]: {
      textAlign: "center",
    },
  },
  boxmenu: {
    display: "unset",
    pointerEvents: "all",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "center",
    },
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

const Navbar = ({ mobileChat, setMobile, mobileNav, setMobileNav, isAuthenticated, isLoading, user, logout }) => {

  // Declare State
  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.root}>
      <Box className={classes.boxmenu}>
        <Box className={classes.mobileNav1}>
          <Button
            disableRipple
            onClick={() => setMobileNav(!mobileNav)}
            size="large"
            color="primary"
          >
            <span>
              <MenuIcon style={{ color: "white" }} />
            </span>
          </Button>
        </Box>
        <Box className={classes.mobileNav2}>
          <Button
            disableRipple
            onClick={() => setMobile(!mobileChat)}
            size="large"
            color="primary"
          >
            <span>
              <ChatIcon style={{ color: "white" }} />
            </span>
          </Button>
        </Box>
      </Box>
    </AppBar>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { logout })(Navbar);
