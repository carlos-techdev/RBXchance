import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

import { NavLink as Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";
import { chatSocket } from "../../services/websocket.service";
import { getUserVipData } from "../../services/api.service";

//components
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import ControlsOnline from "./ControlsOnline";
import Avatar from "@material-ui/core/Avatar";
import Skeleton from "@material-ui/lab/Skeleton";

// Components
import { PlayAmount as RoulettePlayAmount } from "../../components/roulette/PlayAmount";
import { PlayAmount as CoinflipPlayAmount } from "../coinflip/PlayAmount";
import { PlayAmount as JackpotPlayAmount } from "../../components/jackpot/PlayAmount";
import { PlayAmount as CrashPlayAmount } from "../../components/crash/PlayAmount";
import { PlayAmount as BattlesPlayAmount } from "../../components/battles/PlayAmount";
import { RaceAmount } from "../../components/RaceAmount";

// Modals
import Market from "../modals/MarketModal";
import Deposit from "../modals/DepositModal";
import RobloxLink from "../modals/RobloxLink";
import Vip from "../modals/VIPModal";
import Free from "../modals/FreeModal";

import caseSVG from "../../assets/caseicon.svg";

const useStyles = makeStyles(theme => ({
  root: {
    "& > div": {
      "& > div": {
        width: "100%",        
        [theme.breakpoints.down("xs")]: {
          textAlign: "center",
        },
        "& > a": {
          color: "#707479",
          fontFamily: "Rubik",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: ".1em",
          cursor: "pointer",
          textDecoration: "none",
        },
        "& > a:hover": {
          textDecoration: "none",
          outline: "none",
        },
      },
    },
  },
  root2: {
    display: "inherit",
    paddingLeft: "0px",
    paddingRight: "0px",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      flexDirection: "column",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      flexDirection: "column",
    },
    [theme.breakpoints.down("md")]: {
      display: "flex",
      flexDirection: "column",
    },
  },
  subJackpot: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        //backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "20px",
        marginLeft: "21px",
      },
    },
  },
  subActiveJackpot: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        color: "#FFC440",
      },
    },
  },
  subTOS: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "3.3rem",
      color: "#707479",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {

      },
    },
  },
  subActiveTOS: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "3.3rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "20px",
        marginLeft: "21px",
        color: "#FFC440",
      },
    },
  },
  subCoinflip: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      fontFamily: "Rubik",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "19px",
        marginLeft: "20px",
      },
    },
  },
  subActiveCoinflip: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "19px",
        marginLeft: "20px",
        color: "#FFC440",
      },
    },
  },
  subRoulette: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "22px",
        marginLeft: "20px",
      },
    },
  },
  subActiveRoulette: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "22px",
        marginLeft: "20px",
        color: "#FFC440",
      },
    },
  },
  subCrash: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "20px",
        marginLeft: "21px",
        color: "#707479",
      },
    },
  },
  subActiveCrash: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        marginRight: "20px",
        marginLeft: "21px",
        color: "#FFC440",
      },
    },
  },

  subRace: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        marginRight: "22px",
        marginLeft: "22px",
        color: "#707479",
      },
    },
  },
  subActiveRace: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        color: "#FFC440",
      },
    },
  },
  subDeposit: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#16A34A",
        "& span .MuiButton-startIcon": {
          color: "#16A34A",
        },
      },
      "&:active": {
        color: "#16A34A",
      },
      "& span .MuiButton-startIcon": {
        color: "#707479",
      },
    },
  },
  subWithdraw: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#F53737",
        "& span .MuiButton-startIcon": {
          color: "#F53737",
        },
      },
      "&:active": {
        color: "#F53737",
      },
      "& span .MuiButton-startIcon": {
        color: "#707479",
      },
    },
  },
  subAffiliate: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      color: "#707479",
      borderLeft: "2px solid #12171D",
      borderRadius: "0px",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "&:hover": {
        // backgroundColor: "rgb(23 29 34)",
        color: "#e0e0e0",
        "& span .MuiButton-startIcon": {
          color: "#FFC440",
        },
      },
      "&:active": {
        color: "#e0e0e0",
      },
      "& span .MuiButton-startIcon": {
        color: "#707479",
      },
    },
  },
  subActiveAffiliate: {
    textDecoration: "none",
    "& > button": {
      width: "100%",
      height: "2.5rem",
      fontFamily: "Rubik",
      fontSize: "12.5px",
      fontWeight: 500,
      letterSpacing: ".05em",
      color: "#e0e0e0",
      borderLeft: "2px solid #FFC440",
      borderRadius: "0px",
      marginRight: 20,
      "& img": {
        opacity: 0.15,
      },
      "& span .MuiButton-startIcon": {
        color: "#FFC440",
      },
    },
  },
  category: {
    color: "#707479",
    fontFamily: "Rubik",
    fontSize: "11px",
    fontWeight: 500,
    letterSpacing: ".05em",
    marginLeft: "32px",
  },
  reverse: {

  },
  reverse2: {
    display: "flex",
  },
  login: {
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "25px",
    paddingTop: "9px",
    [theme.breakpoints.down("xs")]: {
      marginBottom: "35px",
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "35px",
    },
    [theme.breakpoints.down("md")]: {
      marginBottom: "35px",
    },
    "& > button": {
      height: 40,
    },
    "& > h5": {
      marginRight: 20,
      fontWeight: 500,
      color: "#e0e0e0",
    },
  },
  noLink: {
    textDecoration: "none",
    margin: "10px",
  },
  google: {
    fontFamily: "Rubik",
    textTransform: "capitalize",
    fontSize: "12px",
    width: "100%",
    background: "#FFC440",
    color: "white",
    margin: "1.5rem 0rem",
    maxWidth: "10px",
    "&:hover": {
      opacity: "0.9",
      background: "#FFC440",
    },
  },
  pfp: {
    padding: "0.5rem 0rem 0rem 1.5rem",
    outline: "none",
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "0rem",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0rem",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "0rem",
    },
    "& div": {
      outline: "none",
      height: "2.5rem",
      width: "2.5rem",
      borderRadius: "100%",
    },
  },
  avatar2: {
    outline: "none",
    "&:hover": {
      transition: "all 400ms",
      transform: "scale(1.06)",
      WebkitTransform: "scale(1.06)",
    },
  },
  pfpp: {
    marginTop: "15px",
    "& div": {
      height: "2.5rem",
      width: "2.5rem",
      borderRadius: "100%",
    },
    "& .usernamenav": {
      color: "#ffc107",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .levelnav": {
      color: "#fff",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
      padding: "5px",
      marginLeft: "15px",
      borderRadius: "5px",
    },
    "& .levelnav:hover": {
      color: "#fff",
      filter: "drop-shadow(0px 0px 15px #2b2f34) invert(0%)",
    },
    "& .nonenav": {
      color: "#d5d6d8",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .bronzenav": {
      color: "#C27C0E",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .silvernav": {
      color: "#95A5A6",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .goldnav": {
      color: "#b99309",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
    "& .diamondnav": {
      color: "#3498DB",
      fontSize: "11px",
      fontFamily: "Rubik",
      fontWeight: 500,
      textTransform: "uppercase",
    },
  },
  balance: {
    marginLeft: "1.8rem",
    marginTop: "0.5rem",
  },
  onlineOrNot1: {
    marginTop: "0px"
  },
  onlineOrNot2: {
    // marginTop: "180px",
    [theme.breakpoints.down("xs")]: {
      marginTop: "0px"
    },
    [theme.breakpoints.down("sm")]: {
      marginTop: "0px"
    },
    [theme.breakpoints.down("md")]: {
      marginTop: "0px"
    },
  },
  price: {
    fontFamily: "Rubik",
    color: "#FFC440",
    fontWeight: 500,
    letterSpacing: ".1em",
    margin: "auto",
    position: "absolute",
    marginTop: "-1px",
  },
  freeinfo: {
    "& .freenav": {
      color: "#FFC440",
    },
    "& .freenav:hover": {
      color: "#1a77ab",
    },
  },
}));

const HeaderNav = ({ isAuthenticated, isLoading, user, logout, handleClose }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [openMarket, setOpenMarket] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [openBlox, setOpenBlox] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState(null);
  const [usersOnline, setUsersOnline] = useState("---");
  const [vipData, setVipData] = useState(null);
  const [vipDataColor, setVipDataColor] = useState(null);
  //const openMobile = Boolean(mbAnchorEl);

  // Update users online count
  const updateUsersOnline = newCount => {
    setUsersOnline(newCount);
  };

  // If user has clicked affiliate link
  useEffect(() => {
    if(!user?.robloxUsername && user) setOpenBlox(true);
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          setLoading(true);
          const data = await getUserVipData();
          // Update state
          setVipData(data);
          const currentMajorLevel = data.majorLevelNames.find((levelName, index) => {
            const currentLevelIndex = data.allLevels.findIndex((level) => level.name === data.currentLevel.name);
            const nextIndex = data.allLevels.findIndex((level) => level.levelName === data.majorLevelNames[index + 1]);
            if (currentLevelIndex >= index && (nextIndex === -1 || currentLevelIndex < nextIndex)) {
              return true;
            }
            return false;
          });
          const currentMajorLevelIndex = data.majorLevelNames.indexOf(currentMajorLevel);
          setVipDataColor(data.majorLevelColors[currentMajorLevelIndex]);
        }
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user vip data:", error);
      }
    };
    fetchData();
    // Get affiliate code from localStorage
    const storageCode = localStorage.getItem("affiliateCode");
    // If user is logged in
    if (!isLoading && isAuthenticated && storageCode) {
      if(!user?.robloxUsername && user) setOpenBlox(true);
      // Remove item from localStorage
      localStorage.removeItem("affiliateCode");
      setOpenFree(true);
      setAffiliateCode(storageCode);
    }
  }, [isLoading, isAuthenticated]);

  // componentDidMount
  useEffect(() => {
    if(!user?.robloxUsername && user) setOpenBlox(true);

    // Listeners
    chatSocket.on("users-online", updateUsersOnline);

    // componentDidUnmount
    return () => {
      // Remove listeners
      chatSocket.off("users-online", updateUsersOnline);
    };
  }, []);

  return (
    <Toolbar variant="dense" className={classes.root2}>
      <RobloxLink open={openBlox} user={user}  />
      <Market handleClose={() => setOpenMarket(!openMarket)} open={openMarket} user={user} />
      <Deposit handleClose={() => setOpenDeposit(!openDeposit)} open={openDeposit} user={user} />
      <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
      <Free handleClose={() => setOpenFree(!openFree)} open={openFree} code={affiliateCode} />
      <Box className={classes.root}>
        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? "" : (
          <Box>
            <Link to="/registration" className={classes.noLink} style={{ outline: "none", }}>
              <Button disableRipple className={classes.google} variant="contained">
                <i
                  style={{ marginRight: 6, fontSize: 13 }}
                  className="fas fa-sign-in-alt"
                ></i>
              </Button>
            </Link>
          </Box>
        )}
      </Box>
      <Box style={{ borderTop: "1px solid #161D26", width: "100%", }}>
        <br />
        <Link
          exact
          activeClassName={classes.subActiveCrash}
          className={classes.subCrash}
          style={{outline: "none"}}
          to="/home"
        >
          <Button disableRipple startIcon={<svg style={{ width: "25px", marginLeft: "3px", marginRight: "3px", }} width="22" height="19" viewBox="0 0 22 19" fill="currentColor" xmlns="http://www.w3.org/2000/svg" ><path d="M11 5.78613L3.1539 12.2544C3.1539 12.2636 3.15161 12.277 3.14702 12.2953C3.14253 12.3135 3.14014 12.3266 3.14014 12.336V17.2257C3.14014 17.4622 3.2266 17.6671 3.39947 17.8397C3.5723 18.0124 3.77695 18.0993 4.01349 18.0993H8.40708V12.0131H13.593V18.0995H17.9865C18.223 18.0995 18.428 18.0128 18.6005 17.8397C18.7734 17.6673 18.8602 17.4622 18.8602 17.2257V12.336C18.8602 12.2997 18.8552 12.2723 18.8464 12.2544L11 5.78613Z"></path><path d="M21.8485 9.12048L18.8603 6.63697V1.06951C18.8603 0.942228 18.8194 0.837557 18.7372 0.755637C18.6558 0.673813 18.5511 0.6329 18.4236 0.6329H15.8037C15.6762 0.6329 15.5716 0.673813 15.4897 0.755637C15.4079 0.837557 15.367 0.942276 15.367 1.06951V3.73038L12.0375 0.946577C11.7468 0.710041 11.401 0.591797 11.0007 0.591797C10.6004 0.591797 10.2547 0.710041 9.96364 0.946577L0.152119 9.12048C0.0611663 9.19313 0.0113165 9.29091 0.00204435 9.41375C-0.00718001 9.53648 0.0246034 9.64369 0.0974902 9.73459L0.943503 10.7444C1.01639 10.8262 1.11179 10.8763 1.23008 10.8946C1.33929 10.9037 1.4485 10.8718 1.55771 10.7991L11.0004 2.92528L20.4432 10.799C20.5161 10.8625 20.6115 10.8942 20.7298 10.8942H20.7708C20.8889 10.8762 20.9841 10.8258 21.0573 10.7442L21.9035 9.73454C21.9762 9.64345 22.0081 9.53644 21.9986 9.41356C21.9893 9.29106 21.9392 9.19327 21.8485 9.12048Z"></path></svg>} className={classes.reverse2}></Button>
        </Link>

        <br />
        <Box style={{ borderBottom: "1px solid #161D26", }}></Box>
        <br />
        
        <Link
          exact
          activeClassName={classes.subActiveCrash}
          className={classes.subCrash}
          style={{outline: "none"}}
          to="/deposit"
        >
          <Button disableRipple startIcon={<svg style={{ width: "25px", marginLeft: "3px", marginRight: "3px", }} fill="currentColor" width="24" height="24" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-27f1f907="" data-v-98afd824="" d="M2 12H4V17H20V12H22V17A2 2 0 0 1 20 19H4A2 2 0 0 1 2 17M11 5H13V8H16V10H13V13H11V10H8V8H11Z"><title data-v-27f1f907="" data-v-98afd824="">Tray Plus icon</title></path></svg>} className={classes.reverse2}></Button>
        </Link>
        <Link
          exact
          activeClassName={classes.subActiveCrash}
          className={classes.subCrash}
          style={{outline: "none"}}
          to="/market"
        >
          <Button disableRipple startIcon={<svg style={{ width: "25px", marginLeft: "3px", marginRight: "3px", }} fill="currentColor" width="24" height="24" viewBox="0 0 24 24" class="material-design-icon__svg"><path data-v-8351ef5e="" data-v-98afd824="" d="M16 10H8V8H16M2 17A2 2 0 0 0 4 19H20A2 2 0 0 0 22 17V12H20V17H4V12H2Z"><title data-v-8351ef5e="" data-v-98afd824="">Tray Minus icon</title></path></svg>} className={classes.reverse2}></Button>
        </Link>

        <br />
        <Box style={{ borderBottom: "1px solid #161D26", }}></Box>
        <br />
        
        <Link
          exact
          activeClassName={classes.subActiveJackpot}
          className={classes.subJackpot}
          to="/jackpot"
          style={{ outline: "none", }}
        >
          <Button disableRipple startIcon={<svg style={{ fontSize: "18px", }} aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-notch" className="svg-inline--fa fa-circle-notch fa-w-16 fa-fw" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"></path></svg>} className={classes.reverse2}></Button>
        </Link>

        <Link
          exact
          activeClassName={classes.subActiveCoinflip}
          className={classes.subCoinflip}
          to="/coinflip"
          style={{ outline: "none", }}
        >
          <Button disableRipple startIcon={<svg focusable="false" data-prefix="" data-icon="coin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="" style={{ width: "19px", marginLeft: "3px", marginRight: "3px", }}><g className="fa-group"><path fill="currentColor" d="M0 208C0 128.44 114.67 64 256 64s256 64.44 256 144-114.67 144-256 144S0 287.56 0 208z" className="fa-secondary"></path><path fill="currentColor" d="M0 320c0 27.77 18 53.37 48 74.33V330c-18.85-12-35.4-25.36-48-40.38zm80 92.51c27.09 12.89 59.66 22.81 96 28.8V377c-35.39-6-67.81-15.88-96-29zM464 330v64.32c30.05-21 48-46.56 48-74.33v-30.36C499.4 304.65 482.85 318 464 330zM336 441.31c36.34-6 68.91-15.91 96-28.8V348c-28.19 13.12-60.61 23-96 29zM208 381.2v64.09c15.62 1.51 31.49 2.71 48 2.71s32.38-1.2 48-2.71V381.2a477.2 477.2 0 0 1-48 2.8 477.2 477.2 0 0 1-48-2.8z" className="fa-primary"></path></g></svg>} className={classes.reverse2}></Button>
        </Link>
        
        <Link
          exact
          activeClassName={classes.subActiveCrash}
          className={classes.subCrash}
          style={{outline: "none"}}
          to="/battles"
        >
          <Button disableRipple startIcon={<svg width="20" height="20" viewBox="0 0 20 20" style={{ width: "19px", marginLeft: "3px", marginRight: "3px", }} fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.4375 11.7812L4.59375 15.375L7.46875 17.5312M1 17.5312L2.4375 18.9688M4.59375 15.375L2.4375 17.5312M6.75 16.0938L18.9688 3.875V1H16.0938L3.875 13.2188" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.2188 16.0938L9.98438 12.8594M12.8594 9.98438L16.0938 13.2188M17.5312 11.7812L15.375 15.375L12.5 17.5312M18.9688 17.5312L17.5312 18.9688M15.375 15.375L17.5312 17.5312M7.10938 9.98438L1 3.875V1H3.875L9.98438 7.10938" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>} className={classes.reverse2}></Button>
        </Link>

        <br />
        <Box style={{ borderBottom: "1px solid #161D26", }}></Box>
        <br />

        <Link
          exact
          activeClassName={classes.subActiveCrash}
          className={classes.subCrash}
          style={{outline: "none"}}
          to="/cases"
        >
          <Button disableRipple startIcon={<svg style={{ width: "19px", marginLeft: "3px", marginRight: "3px", }} viewBox="0 0 30 24" height="24" width="30" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" xmlns="http://www.w3.org/2000/svg" d="M21 4.23529H24V24H6V4.23529H9V2.82353C9 2.07468 9.31607 1.35651 9.87868 0.826993C10.4413 0.297478 11.2044 0 12 0H18C18.7957 0 19.5587 0.297478 20.1213 0.826993C20.6839 1.35651 21 2.07468 21 2.82353V4.23529ZM25.5 4.23529H27C27.7957 4.23529 28.5587 4.53277 29.1213 5.06229C29.6839 5.5918 30 6.30998 30 7.05882V21.1765C30 21.9253 29.6839 22.6435 29.1213 23.173C28.5587 23.7025 27.7957 24 27 24H25.5V4.23529ZM4.5 4.23529V24H3C2.20435 24 1.44129 23.7025 0.87868 23.173C0.316071 22.6435 0 21.9253 0 21.1765V7.05882C0 5.50588 1.35 4.23529 3 4.23529H4.5ZM12 2.82353V4.23529H18V2.82353H12Z"></path></svg>} className={classes.reverse2}></Button>
        </Link>

        <Link
          exact
          activeClassName={classes.subActiveCrash}
          className={classes.subCrash}
          to="/crash"
          style={{ outline: "none", }}
        >
          <Button disableRipple startIcon={<svg style={{ fontSize: "17px", }} width="25" height="25" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M3.354 19.596a1.644 1.644 0 1 1 2.05 2.051l-2.353.714a.329.329 0 0 1-.41-.41l.713-2.355Zm8.82-15.568C15.05 2.154 18.47 2 22.015 2c.544 0 .986.441.984.985 0 3.403-.156 6.966-2.029 9.842-.987 1.517-2.37 2.777-3.916 3.794a8.228 8.228 0 0 1-3.423 6.197.99.99 0 0 1-.949.109.988.988 0 0 1-.595-.747c-.15-.886-.548-1.868-1.133-2.86-.656.18-1.293.325-1.89.428a.985.985 0 0 1-.866-.274l-2.674-2.673a.985.985 0 0 1-.274-.866c.103-.596.25-1.233.428-1.889-.99-.585-1.972-.983-2.858-1.132a.985.985 0 0 1-.638-1.545A8.232 8.232 0 0 1 8.38 7.945c1.016-1.546 2.276-2.929 3.793-3.917Zm3.69 7.752a2.848 2.848 0 1 0 0-5.696 2.848 2.848 0 0 0 0 5.696Z"></path></svg>} className={classes.reverse2}></Button>
        </Link>

        <Link
          exact
          activeClassName={classes.subActiveRoulette}
          className={classes.subRoulette}
          to="/roulette"
          style={{ outline: "none", }}
        >
          <Button disableRipple startIcon={<svg style={{ fontSize: "17px", }} width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.956 12.069 5.4 4.255A10.24 10.24 0 0 0 3.124 6.97l8.832 5.1ZM8.467 21.657c1.088.397 2.262.613 3.488.613v-10.2l-3.488 9.587Z" fill="currentColor"></path><path d="m11.956 12.07-8.832 5.1A10.283 10.283 0 0 0 5.4 19.882l6.556-7.814Z" fill="#161b21"></path><path d="M11.956 12.07 5.4 19.882a10.16 10.16 0 0 0 3.067 1.774l3.489-9.588Z" fill="currentColor"></path><path d="M1.912 13.84a10.11 10.11 0 0 0 1.212 3.33l8.832-5.1-10.044 1.77Z" fill="currentColor"></path><path d="m11.956 12.07 8.834 5.1a10.17 10.17 0 0 0 1.212-3.33l-10.046-1.77Z" fill="#161b21"></path><path d="M11.956 12.07v10.2c1.225 0 2.4-.216 3.488-.613l-3.488-9.588Z" fill="#161b21"></path><path d="M18.514 19.883a10.24 10.24 0 0 0 2.276-2.714l-8.834-5.1 6.558 7.814ZM1.911 10.298c-.1.575-.156 1.166-.156 1.77 0 .606.057 1.197.156 1.772l10.044-1.771-10.044-1.771Z" fill="currentColor"></path><path d="m11.956 12.07 3.488 9.587a10.193 10.193 0 0 0 3.067-1.774l-6.555-7.814Z" fill="currentColor"></path><path d="M11.956 12.069 22 13.84c.1-.575.156-1.166.156-1.771S22.1 10.873 22 10.298l-10.044 1.77Z" fill="currentColor"></path><path d="M20.79 6.969a10.283 10.283 0 0 0-2.276-2.714l-6.558 7.814 8.834-5.1Z" fill="#161b21"></path><path d="M11.956 12.07 22 10.297a10.11 10.11 0 0 0-1.213-3.33l-8.831 5.101Z" fill="currentColor"></path><path d="M3.124 6.969a10.17 10.17 0 0 0-1.212 3.329l10.044 1.771-8.832-5.1Z" fill="#161b21"></path><path d="m11.956 12.07 6.555-7.815a10.16 10.16 0 0 0-3.067-1.774l-3.488 9.588ZM11.956 12.07 8.466 2.48A10.25 10.25 0 0 0 5.4 4.255l6.556 7.814Z" fill="currentColor"></path><path d="M11.955 1.868c-1.226 0-2.4.216-3.488.613l3.488 9.588v-10.2Z" fill="#161b21"></path><path d="m11.956 12.069 3.49-9.588a10.158 10.158 0 0 0-3.488-.613V12.07h-.002Z" fill="currentColor"></path><path d="M13.26 17.058a5.085 5.085 0 1 0-2.308-9.904 5.085 5.085 0 0 0 2.309 9.904Z" fill="#161b21"></path></svg>} className={classes.reverse2}></Button>
        </Link>

        {isLoading ? (
          <div className={classes.login}>
            <Skeleton
              height={36}
              width={120}
              animation="wave"
              variant="rect"
              style={{ marginRight: "1rem" }}
            />
            <Skeleton height={36} width={120} animation="wave" variant="rect" />
          </div>
        ) : isAuthenticated && user ? (
          <Box>
            <br />
            <Box style={{ borderBottom: "1px solid #161D26", }}></Box>
            <br />
            {/*<Link
              exact
              activeClassName={classes.subActiveCrash}
              to="/rewards"
              style={{ outline: "none", }}
              className={classes.subCrash}>
              <Button disableRipple className={classes.reverse2} startIcon={<svg style={{ width: "19px", marginLeft: "3px", marginRight: "3px", }} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7h6zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9H2.5z"></path></svg>}></Button>
            </Link>*/}

            <Box
              activeClassName={classes.subActiveCrash}
              style={{ outline: "none", }}
              className={classes.subCrash}>
              <Button onClick={() => setOpenVip(!openVip)} disableRipple startIcon={<svg style={{ width: "19px", marginLeft: "3px", marginRight: "3px", }} stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506V2.5zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43a.522.522 0 0 0 .023.07zM9 3h2.932a.56.56 0 0 0 .023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0V3zm6 4v7.5a1.5 1.5 0 0 1-1.5 1.5H9V7h6zM2.5 16A1.5 1.5 0 0 1 1 14.5V7h6v9H2.5z"></path></svg>} className={classes.reverse2}></Button>
            </Box>
            <Link
              exact
              activeClassName={classes.subActiveCrash}
              to="/affiliates"
              style={{ outline: "none", }}
              className={classes.subCrash}>
              <Button disableRipple className={classes.reverse2} startIcon={<svg style={{ width: "19px", marginLeft: "3px", marginRight: "3px", }} aria-hidden="true" focusable="false" data-prefix="far" data-icon="link" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-link fa-w-16 fa-fw"><path fill="currentColor" d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z"></path></svg>}></Button>
            </Link>
          </Box>
        ) : (
          <Box>
          </Box>
        )}
        <br />
        <Box style={{ borderBottom: "1px solid #161D26", }}></Box>
        <br />
        <Link
          exact
          style={{ outline: "none", }}
          activeClassName={classes.subActiveTOS}
          className={classes.subTOS}
          to="/terms"
        >
          <Button disableRipple className={classes.reverse2}>
            <span className={classes.reverse}>TOS</span>
          </Button>
        </Link>
        <Link
          exact
          style={{ outline: "none", }}
          activeClassName={classes.subActiveTOS}
          className={classes.subTOS}
          to="/fair"
        >
          <Button disableRipple className={classes.reverse2}>
            <span className={classes.reverse}>FAIR</span>
          </Button>
        </Link>
        <Link
          exact
          style={{ outline: "none", }}
          activeClassName={classes.subActiveTOS}
          className={classes.subTOS}
          to="/faq"
        >
          <Button disableRipple className={classes.reverse2}>
            <span className={classes.reverse}>FAQ</span>
          </Button>
        </Link>
        <br />
      </Box>
    </Toolbar>
  );
};

HeaderNav.propTypes = {
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

export default connect(mapStateToProps, { logout })(HeaderNav);
