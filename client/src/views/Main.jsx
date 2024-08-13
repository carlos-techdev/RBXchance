import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";
import { connect } from "react-redux";

import { chatSocket } from "../services/websocket.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";

import { getUserVipData } from "../services/api.service";

// MUI Containers
import Box from "@material-ui/core/Box";
import { NavLink as Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Grow from '@material-ui/core/Grow';

// Modals
import Market from "../components/modals/MarketModal";
import Deposit from "../components/modals/DepositModal";
import Vip from "../components/modals/VIPModal";
import Free from "../components/modals/FreeModal";
import Coupon from "../components/modals/CouponModal";
import TriviaInfo from "../components/modals/TriviaInfoModal";
import RainInfo from "../components/modals/RainInfoModal";

import { Carousel } from "react-bootstrap";
import "./Carousel.css";

import discordbanner from "../assets/discordbanner.png";
import jackpotbanner from "../assets/jackpotbanner.png";
import rbxchancebanner from "../assets/jackpotbanner.png";
import crashbanner from "../assets/jackpotbanner.png";
import roulettebanner from "../assets/jackpotbanner.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    padding: "0.5rem 8rem 4rem 8rem",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "1rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "1rem",
    },
  },
  lastupdate: {
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
  },
  counterup: {
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
    color: "#5f6368",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& h1": {
      margin: "0 0 2rem 0",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "22px",
      fontWeight: 500,
      letterSpacing: ".005em",
      [theme.breakpoints.down("xs")]: {
        fontSize: "16px",
        margin: "0px",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "16px",
        margin: "0px",
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "16px",
        margin: "0px",
      },
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  animationnetworkwrapper1: {
    marginRight: "auto",
    marginTop: "16px",
    fontSize: "14px",
    color: "#505b65",
    [theme.breakpoints.down("sm")]: {
    },
  },
  animationnetworkwrapper: {
    color: "rgb(76, 175, 80)",
    borderRadius: "100%",
    animation: "blink 1.6s linear infinite",
    marginRight: "2px",
    [theme.breakpoints.down("sm")]: {
    },
  },
  animationnetwork: {
    color: "rgb(76, 175, 80)",
    borderRadius: "100%",
    [theme.breakpoints.down("sm")]: {
    },
  },
  games: {
    display: "grid",
    gridGap: "12px",
    gridTemplateColumns: "repeat(auto-fill,minmax(20%,1fr))",
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
    },
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))",
    },
  },
  game: {
    width: "100%",
    height: "100%",
    aspectRatio: "245/298",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "center",
    position: "relative",
    backgroundColor: "#1e242b",
    borderRadius: "10px",
    padding: "16px",
    transition: ".2s",
    border: "1px solid #333b42",
    userSelect: "none",
    overflow: "hidden",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
  },
  gamesimages: {
    width: "unset",
    height: "100%",
    position: "absolute",
    top: 0,
    zIndex: "0!important",
  },
  gamesimagesnew: {
    backgroundColor: "#FFC440",
    borderRadius: "5px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "500",
    position: "absolute",
    padding: "4px 10px",
    top: "7px",
    right: "7px",
    textTransform: "uppercase",
    zIndex: 1,
  },
  rewards: {
    display: "grid",
    gridGap: "12px",
    outline: "none",
    gridTemplateColumns: "repeat(auto-fill,minmax(164px,1fr))",
    [theme.breakpoints.down("xs")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
    },
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
    },
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))",
    },
  },
  reward: {
    width: "100%",
    height: "100%",
    aspectRatio: "245/120",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    background: "linear-gradient(180deg,#12171D,#11161c)",
    borderRadius: "10px",
    transition: ".2s",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    userSelect: "none",
    overflow: "hidden",
    fontWeight: 600,
    border: "none",
    "& svg": {
      color: "#5b6368",
    },
    "&:hover": {
      background: "linear-gradient(rgb(27 45 61),#0b77c833)",
      cursor: "pointer",
      "& svg": {
        color: "#1982d1",
      },
    },
  },
  rewardname: {
    color: "#e0e0e0",
    fontSize: "16px",
    fontWeight: "500",
    fontFamily: "Rubik",
    textTransform: "uppercase",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gridGap: "4vw",
    [theme.breakpoints.down("xs")]: {
      display: "grid",
    },
    [theme.breakpoints.down("sm")]: {
      display: "grid",
    },
    [theme.breakpoints.down("md")]: {
      display: "grid",
    },
  },
  headerleft: {
    display: "flex",
    flexDirection: "column",
    gridGap: "4px",
  },
  headerright: {
    display: "flex",
    alignItems: "center",
    gridGap: "20px",
    margin: "0 0 2rem 0",
    [theme.breakpoints.down("xs")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "10px",
    },
  },
  headerbuttons: {
    display: "flex",
    alignItems: "center",
    gridGap: "16px",
    [theme.breakpoints.down("xs")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "10px",
    },
  },
  headerseperator: {
    width: "1px",
    height: "40px",
    backgroundColor: "#242b33",
  },
  headeruser: {
    display: "flex",
    alignItems: "center",
    gridGap: "16px",
    borderRadius: "5px",
    padding: "6px 8px",
    margin: "-6px -8px",
    color: "#5b6368",
    [theme.breakpoints.down("xs")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "10px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "10px",
    },
  },
  headerbuttonsDep: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: "#fff",
    outline: "none",
    padding: "5px 20px",
    borderRadius: "5px",
    transform: "translateZ(0)",
    backgroundColor: "#FFC440",
    fontFamily: "Rubik",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: ".2s",
    [theme.breakpoints.down("xs")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    "&:hover": {
      backgroundColor: "#41a8fa",
    },
  },
  headerbuttonsDepSpan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    position: "relative",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    userSelect: "none",
    gridGap: "8px",
    [theme.breakpoints.down("xs")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "5px",
    },
  },
  headerbuttonsWith: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    outline: "none",
    color: "#fff",
    padding: "5px 20px",
    borderRadius: "5px",
    transform: "translateZ(0)",
    backgroundColor: "#bb2f2a",
    fontFamily: "Rubik",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: ".2s",
    [theme.breakpoints.down("xs")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    [theme.breakpoints.down("md")]: {
      padding: "4px 10px",
      fontSize: "12px",
    },
    "&:hover": {
      backgroundColor: "#c9433e",
    },
  },
  headerbuttonsWithSpan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    position: "relative",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    userSelect: "none",
    gridGap: "8px",
    [theme.breakpoints.down("xs")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("sm")]: {
      gridGap: "5px",
    },
    [theme.breakpoints.down("md")]: {
      gridGap: "5px",
    },
  },
  headerbuttonsLogin: {
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    color: "#fff",
    padding: "11px 20px",
    borderRadius: "5px",
    transform: "translateZ(0)",
    backgroundColor: "#FFC440",
    fontFamily: "Rubik",
    fontSize: "15px",
    border: "none",
    cursor: "pointer",
    transition: ".2s",
    "&:hover": {
      backgroundColor: "#409fea",
    },
  },
  avatar: {
    width: "35px",
    height: "35px",
    position: "relative",
    padding: "2px",
    borderRadius: "50%",
    backgroundColor: "#333b42",
    flexShrink: 0,
  },
  avatarimg: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  avatarimg2: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    position: "relative",
    WebkitUserDrag: "none",
  },
  level: {
    width: "23px",
    height: "23px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "-2px",
    bottom: "-2px",
    color: "#fff",
    fontSize: "9px",
    fontWeight: "500",
    backgroundColor: "#333b42",
    border: "1px solid #242b33",
    borderRadius: "50px",
    paddingTop: "2px",
  },
  userinfo: {
    display: "flex",
    flexDirection: "column",
    gridGap: "4px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "13px",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "13px",
    },
  },
  username: {
    color: "#a4aaae",
  },
  balances: {
    display: "flex",
    alignItems: "center",
    gridGap: "8px",
    color: "#fff",
  },
  coins: {
    display: "flex",
    alignItems: "center",
    gridGap: "4px",
  },
  dollarsign: {
    color: "#FFC440",
    fontWeight: 800,
  },
}));

const Main = ({ isAuthenticated, isLoading, user }) => {
  // Declare State
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [vipData, setVipData] = useState(null);
  const [openMarket, setOpenMarket] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openVip, setOpenVip] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openTriviaInfo, setOpenTriviaInfo] = useState(false);
  const [openRainInfo, setOpenRainInfo] = useState(false);
  const [vipDataColor, setVipDataColor] = useState(null);

  const [usersOnline, setUsersOnline] = useState("Connected");

  // Update users online count
  const updateUsersOnline = newCount => {
    setUsersOnline(newCount + " online");
  };

  // componentDidMount
  useEffect(() => {
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
    // Listeners
    chatSocket.on("users-online", updateUsersOnline);

    // componentDidUnmount
    return () => {
      // Remove listeners
      chatSocket.off("users-online", updateUsersOnline);
    };
  }, [isAuthenticated]);

  return (
    <Box className={classes.root}>
      <Grow in timeout={430}>
        <Container className={classes.container}>
          <Market handleClose={() => setOpenMarket(!openMarket)} open={openMarket} user={user} />
          <Deposit handleClose={() => setOpenDeposit(!openDeposit)} open={openDeposit} user={user} />
          <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
          <Free handleClose={() => setOpenFree(!openFree)} open={openFree} />
          <Coupon handleClose={() => setOpenCoupon(!openCoupon)} open={openCoupon} />
          <TriviaInfo handleClose={() => setOpenTriviaInfo(!openTriviaInfo)} open={openTriviaInfo} />
          <RainInfo handleClose={() => setOpenRainInfo(!openRainInfo)} open={openRainInfo} />
          <Box className={classes.animationnetworkwrapper1}>
            <p><span className={classes.animationnetworkwrapper}><span className={classes.animationnetwork}>●</span></span> {usersOnline}</p>
          </Box>
          <Box className={classes.header}>
            <Box className={classes.headerleft}>
              {isLoading ? (<Box></Box>
              ) : isAuthenticated && user ? (
                <h1>Welcome Back, {user.username}!</h1>
              ) : (<h1>Welcome! Login to start playing.</h1>
              )}
            </Box>
            {isLoading ? (<Box></Box>
            ) : isAuthenticated && user ? (
              <Box className={classes.headerright}>
                <Box className={classes.headerbuttons}>
                  <span
                    style={{ cursor: "pointer", }}
                    onClick={() => setOpenDeposit(!openDeposit)}
                  >
                    <button className={classes.headerbuttonsDep}><span className={classes.headerbuttonsDepSpan}><span aria-label="Tray Plus icon" role="img" className="material-design-icon tray-plus-icon"><svg data-v-8351ef5e="" data-v-98afd824="" fill="currentColor" width="24" height="24" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-8351ef5e="" data-v-98afd824="" d="M2 12H4V17H20V12H22V17A2 2 0 0 1 20 19H4A2 2 0 0 1 2 17M11 5H13V8H16V10H13V13H11V10H8V8H11Z"><title data-v-8351ef5e="" data-v-98afd824="">Tray Plus icon</title></path></svg></span>Deposit</span></button>
                  </span>
                  <span
                    style={{ cursor: "pointer", }}
                    onClick={() => setOpenMarket(!openMarket)}
                  >
                    <button className={classes.headerbuttonsWith}><span className={classes.headerbuttonsWithSpan}><span aria-label="Tray Minus icon" role="img" className="material-design-icon tray-minus-icon"><svg fill="currentColor" width="24" height="24" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-8351ef5e="" data-v-98afd824="" d="M16 10H8V8H16M2 17A2 2 0 0 0 4 19H20A2 2 0 0 0 22 17V12H20V17H4V12H2Z"><title data-v-8351ef5e="" data-v-98afd824="">Tray Minus icon</title></path></svg></span>Withdraw</span></button>
                  </span>
                </Box>
                <Box className={classes.headerseperator}></Box>
                <Link exact to="/profile" style={{ textDecoration: "none", outline: "none", }}>
                  <Box className={classes.headeruser}>
                    {loading ? (
                      <Box></Box>
                    ) : (
                      <Box className={classes.avatar} style={{
                        width: "40px", height: "40px", background: `${vipDataColor}`,
                      }}>
                        <Box className={classes.avatarimg}>
                          <img className={classes.avatarimg2} alt="Avatar" src={user.avatar} />
                        </Box>
                        <Box className={classes.level} style={{ background: `${vipDataColor}`, }}>
                          {vipData.currentLevel.name}
                        </Box>
                      </Box>)}
                    <Box className={classes.userinfo}>
                      <Box className={classes.username}></Box>
                      <Box className={classes.balances}>
                        <Box className={classes.coins}><span className={classes.dollarsign}>$ </span>{parseCommasToThousands(cutDecimalPoints(user.wallet.toFixed(7)))}</Box>
                      </Box>
                    </Box>
                  </Box>
                </Link>
              </Box>
            ) : (
              <Box className={classes.headerright}>
                <Box className={classes.headerbuttons}>
                  <Link exact to="/registration" style={{ textDecoration: "none", outline: "none", }}>
                    <button className={classes.headerbuttonsLogin}><span className={classes.headerbuttonsDepSpan}><span aria-label="Tray Plus icon" role="img" className="material-design-icon tray-plus-icon"></span>Login or Register</span></button>
                  </Link>
                </Box>
              </Box>
            )}
          </Box>
          {isLoading ? (
            <Box></Box>
          ) : (
            <Carousel
              touch={true}
              prevIcon={<svg width="58" height="58" fill="none" xmlns="http://www.w3.org/2000/svg" className=""><path d="M2.31 33a8 8 0 010-8l9.88-17.115a8 8 0 016.929-4H38.88a8 8 0 016.928 4L55.691 25a8 8 0 010 8l-9.882 17.115a8 8 0 01-6.928 4H19.12a8 8 0 01-6.928-4L2.309 33z" fill="#5B6368"></path><path data-v-1163a730="" d="M31.762 35.339l-2.102 1.947L20.714 29l8.946-8.286 2.102 1.947L24.934 29l6.828 6.339z" fill="#fff"></path><path data-v-1163a730="" d="M23.476 27.62h13.81v2.761h-13.81v-2.762z" fill="#fff"></path></svg>}
              nextIcon={<svg style={{ transform: "rotate(180deg)", }} width="58" height="58" fill="none" xmlns="http://www.w3.org/2000/svg" className=""><path d="M2.31 33a8 8 0 010-8l9.88-17.115a8 8 0 016.929-4H38.88a8 8 0 016.928 4L55.691 25a8 8 0 010 8l-9.882 17.115a8 8 0 01-6.928 4H19.12a8 8 0 01-6.928-4L2.309 33z" fill="#5B6368"></path><path data-v-1163a730="" d="M31.762 35.339l-2.102 1.947L20.714 29l8.946-8.286 2.102 1.947L24.934 29l6.828 6.339z" fill="#fff"></path><path data-v-1163a730="" d="M23.476 27.62h13.81v2.761h-13.81v-2.762z" fill="#fff"></path></svg>}
            >
              <Carousel.Item>
                <a
                  style={{ cursor: "pointer", textDecoration: "none", }}
                  href="https://discord.gg/rbxchance"
                  target="_blank"
                  rel="noreferrer" alt="Discord"
                >
                  <img
                    style={{ width: "100%", border: "1px solid rgb(51 59 66)", borderRadius: "10px", }}
                    className="d-block w-100"
                    src={discordbanner}
                    alt="First slide"
                  />
                </a>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  style={{ width: "100%", border: "1px solid rgb(51 59 66)", borderRadius: "10px", }}
                  className="d-block w-100"
                  src={discordbanner}
                  alt="First slide"
                />
              </Carousel.Item>
            </Carousel>
          )}
          <br />
          <Box style={{ borderBottom: "1px solid rgb(51 59 66)", marginTop: "5px", marginBottom: "10px", }}></Box>
          <br />
          <h1 style={{ fontSize: "18px", marginBottom: "15px", }}>Games</h1>
          {isLoading ? (
            <Box></Box>
          ) : (
            <Box className={classes.games}>
              <Box className={classes.game}>
                <div className={classes.gamesimagesnew}>New</div>
                <img alt="Jackpot" className={classes.gamesimages} src={jackpotbanner} />
              </Box>
              <Box className={classes.game}>
                <img alt="Coinflip" className={classes.gamesimages} src={rbxchancebanner} />
              </Box>
              <Box className={classes.game}>
                <img alt="Crash" className={classes.gamesimages} src={crashbanner} />
              </Box>
              <Box className={classes.game}>
                <img alt="Roulette" className={classes.gamesimages} src={roulettebanner} />
              </Box>
            </Box>
          )}
          <br /><br />
          <h1 style={{ fontSize: "18px", marginBottom: "15px", }}>Rewards</h1>
          <Box className={classes.rewards}>
            {isAuthenticated && user ? (
              <span
                style={{ cursor: "pointer", }}
                onClick={() => setOpenCoupon(!openCoupon)}
              >
                <button className={classes.reward}>
                  <span aria-label="Brightness Percent icon" role="img" className="material-design-icon brightness-percent-icon bonusPromotion icon"><svg data-v-c655217e="" fill="currentColor" width="40" height="40" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M20.04,8.71V4H15.34L12,0.69L8.71,4H4V8.71L0.69,12L4,15.34V20.04H8.71L12,23.35L15.34,20.04H20.04V15.34L23.35,12L20.04,8.71M8.83,7.05C9.81,7.05 10.6,7.84 10.6,8.83A1.77,1.77 0 0,1 8.83,10.6C7.84,10.6 7.05,9.81 7.05,8.83C7.05,7.84 7.84,7.05 8.83,7.05M15.22,17C14.24,17 13.45,16.2 13.45,15.22A1.77,1.77 0 0,1 15.22,13.45C16.2,13.45 17,14.24 17,15.22A1.78,1.78 0 0,1 15.22,17M8.5,17.03L7,15.53L15.53,7L17.03,8.5L8.5,17.03Z"><title data-v-c655217e="">Brightness Percent icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "8px", }}>Coupon Code</div>
                </button></span>) : (
              <Link exact to="/registration" style={{ textDecoration: "none", outline: "none", }}>
                <button className={classes.reward}>
                  <span aria-label="Brightness Percent icon" role="img" className="material-design-icon brightness-percent-icon bonusPromotion icon"><svg data-v-c655217e="" fill="currentColor" width="40" height="40" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M20.04,8.71V4H15.34L12,0.69L8.71,4H4V8.71L0.69,12L4,15.34V20.04H8.71L12,23.35L15.34,20.04H20.04V15.34L23.35,12L20.04,8.71M8.83,7.05C9.81,7.05 10.6,7.84 10.6,8.83A1.77,1.77 0 0,1 8.83,10.6C7.84,10.6 7.05,9.81 7.05,8.83C7.05,7.84 7.84,7.05 8.83,7.05M15.22,17C14.24,17 13.45,16.2 13.45,15.22A1.77,1.77 0 0,1 15.22,13.45C16.2,13.45 17,14.24 17,15.22A1.78,1.78 0 0,1 15.22,17M8.5,17.03L7,15.53L15.53,7L17.03,8.5L8.5,17.03Z"><title data-v-c655217e="">Brightness Percent icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "8px", }}>Coupon Code</div>
                </button></Link>
            )}
            <Link exact to="/race" style={{ textDecoration: "none", outline: "none", }}>
              <button className={classes.reward}>
                <svg style={{ width: "38px", height: "38px" }} aria-hidden="true" focusable="false" data-prefix="far" data-icon="receipt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-receipt fa-w-16 fa-fw"><path fill="currentColor" d="M210.4 173.6c-50.8 0-86.1 10-114.4 22.1V102a56 56 0 1 0-64 0v388a22 22 0 0 0 22 22h20a22 22 0 0 0 22-22V298.7c28.3-12.1 63.6-22.1 114.4-22.1a144.77 144.77 0 0 1 29.6 3.26v-103a144.77 144.77 0 0 0-29.6-3.26zM240 374.82c39.58 8.25 77.24 29.4 128 31.38v-95c-50.76-2-88.42-23.13-128-31.38zM368 97.76a169.27 169.27 0 0 1-18.5 1c-37.32 0-70.17-16.92-109.5-27.17v105.23c39.58 8.25 77.24 29.4 128 31.38zm143.9 146.3v-84c-35.79 24.58-88.14 48.3-136.3 48.3-2.57 0-5.09-.07-7.6-.16v103c2.51.09 5 .16 7.6.16 48.2 0 100.6-23.76 136.4-48.36v-17.16c-.06-.57-.09-1.16-.1-1.78z" className="fa-primary"></path></svg>
                <div className={classes.rewardname} style={{ marginTop: "12px", }}>RACE</div>
              </button>
            </Link>
            {isAuthenticated && user ? (
              <span
                style={{ cursor: "pointer", }}
                onClick={() => setOpenVip(!openVip)}
              >
                <button className={classes.reward}>
                  <span style={{ marginTop: "-3px", }} aria-label="Chevron Double Up icon" role="img" className="material-design-icon chevron-double-up-icon levelRewards icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z"><title data-v-c655217e="">Chevron Double Up icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "4px", }}>VIP Levels</div>
                </button>
              </span>) : (
              <Link exact to="/registration" style={{ textDecoration: "none", outline: "none", }}>
                <button className={classes.reward}>
                  <span style={{ marginTop: "-3px", }} aria-label="Chevron Double Up icon" role="img" className="material-design-icon chevron-double-up-icon levelRewards icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z"><title data-v-c655217e="">Chevron Double Up icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "4px", }}>VIP Levels</div>
                </button>
              </Link>
            )}
            {isAuthenticated && user ? (
              <span
                style={{ cursor: "pointer", }}
                onClick={() => setOpenFree(!openFree)}
              >
                <button className={classes.reward}>
                  <span style={{ marginTop: "-3px", }} aria-label="Package Variant Closed icon" role="img" className="material-design-icon package-variant-closed-icon dailyCase icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"><title data-v-c655217e="">Package Variant Closed icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "4px", }}>Free Code</div>
                </button>
              </span>) : (
              <Link exact to="/registration" style={{ textDecoration: "none", outline: "none", }}>
                <button className={classes.reward}>
                  <span style={{ marginTop: "-3px", }} aria-label="Package Variant Closed icon" role="img" className="material-design-icon package-variant-closed-icon dailyCase icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z"><title data-v-c655217e="">Package Variant Closed icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "4px", }}>Free Code</div>
                </button>
              </Link>
            )}
            {isAuthenticated && user ? (
              <Link exact to="/affiliates" style={{ textDecoration: "none", outline: "none", }}>
                <button className={classes.reward}>
                  <span style={{ marginTop: "-5px", outline: "none", }} aria-label="Account Group icon" role="img" className="material-design-icon account-group-icon affiliates icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"><title data-v-c655217e="">Account Group icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "4px", }}>Affiliates</div>
                </button>
              </Link>) : (
              <Link exact to="/registration" style={{ textDecoration: "none", outline: "none", }}>
                <button className={classes.reward}>
                  <span style={{ marginTop: "-5px", }} aria-label="Account Group icon" role="img" className="material-design-icon account-group-icon affiliates icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"><title data-v-c655217e="">Account Group icon</title></path></svg></span>
                  <div className={classes.rewardname} style={{ marginTop: "4px", }}>Affiliates</div>
                </button>
              </Link>
            )}
            <span
              style={{ cursor: "pointer", }}
              onClick={() => setOpenTriviaInfo(!openTriviaInfo)}
            >
              <button className={classes.reward}>
                <span aria-label="Lightbulb On icon" role="img" className="material-design-icon lightbulb-on-icon trivia icon"><svg data-v-c655217e="" fill="currentColor" width="40" height="40" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z"><title data-v-c655217e="">Lightbulb On icon</title></path></svg></span>
                <div className={classes.rewardname} style={{ marginTop: "8px", }}>Trivia</div>
              </button>
            </span>
            <span
              style={{ cursor: "pointer", }}
              onClick={() => setOpenRainInfo(!openRainInfo)}
            >
              <button className={classes.reward}>
                <svg style={{ width: "38px", height: "38px" }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="1.5em" height="1.5em" viewBox="0 0 512 512" size="46" className="airdrop icon"><path data-v-c655217e="" fill="currentColor" d="M272 192v128h32c7 0 13.7 1.5 19.7 4.2L443.8 192h-28.3c.3-5.3.5-10.6.5-16 0-63.9-22.2-121.16-57.1-159.31C450 49.27 493.4 122.6 507.8 173.6c2.7 9.5-5.7 18.4-14.7 18.4h-6L346.8 346.3c3.3 6.5 5.2 13.9 5.2 21.7v96c0 26.5-21.5 48-48 48h-96.9c-25.6 0-48-21.5-48-48v-96c0-7.8 2.8-15.2 6.1-21.7L24.92 192h-6.03C9 192 1.483 183.1 4.181 173.6 18.64 122.6 61.97 49.27 153.1 16.69 118.2 54.84 96 112.1 96 176c0 5.4.16 10.7.47 16h-28.3L188.3 324.2c6-2.7 11.8-4.2 18.8-4.2h32V192H128.5c-.3-5.3-1.4-10.6-1.4-16 0-51 16.8-95.99 41.1-127.57C192.5 16.89 223.8 0 255.1 0c33.1 0 64.4 16.89 88.7 48.43C368.1 80.01 384 125 384 176c0 5.4-.2 10.7-.5 16H272z"></path></svg>
                <div className={classes.rewardname} style={{ marginTop: "12px", }}>Rain</div>
              </button>
            </span>
            <a
              style={{ cursor: "pointer", textDecoration: "none", outline: "none", }}
              href="https://discord.gg/rbxchance"
              target="_blank"
              rel="noreferrer" alt="Giveaways"
            >
              <button className={classes.reward}>
                <span style={{ marginTop: "-4px", }} aria-label="Wallet Giftcard icon" role="img" className="material-design-icon wallet-giftcard-icon sidebarGiveaway icon"><svg data-v-c655217e="" fill="currentColor" width="46" height="46" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-c655217e="" d="M20,14H4V8H9.08L7,10.83L8.62,12L11,8.76L12,7.4L13,8.76L15.38,12L17,10.83L14.92,8H20M20,19H4V17H20M9,4A1,1 0 0,1 10,5A1,1 0 0,1 9,6A1,1 0 0,1 8,5A1,1 0 0,1 9,4M15,4A1,1 0 0,1 16,5A1,1 0 0,1 15,6A1,1 0 0,1 14,5A1,1 0 0,1 15,4M20,6H17.82C17.93,5.69 18,5.35 18,5A3,3 0 0,0 15,2C13.95,2 13.04,2.54 12.5,3.35L12,4L11.5,3.34C10.96,2.54 10.05,2 9,2A3,3 0 0,0 6,5C6,5.35 6.07,5.69 6.18,6H4C2.89,6 2,6.89 2,8V19C2,20.11 2.89,21 4,21H20C21.11,21 22,20.11 22,19V8C22,6.89 21.11,6 20,6Z"><title data-v-c655217e="">Wallet Giftcard icon</title></path></svg></span>
                <div className={classes.rewardname} style={{ marginTop: "4px", }}>Giveaways</div>
              </button>
            </a>
            <a
              style={{ cursor: "pointer", textDecoration: "none", outline: "none", }}
              href="https://twitter.com/rbxchance"
              target="_blank"
              rel="noreferrer" alt="Twitter"
            >
              <button className={classes.reward}>
                <svg style={{ width: "38px", height: "38px" }} fill="currentColor" width="18" height="18" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-17895ccb="" data-v-98afd824="" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"><title data-v-17895ccb="" data-v-98afd824="">Twitter icon</title></path></svg>
                <div className={classes.rewardname} style={{ marginTop: "12px", }}>Twitter</div>
              </button>
            </a>
            <a
              style={{ cursor: "pointer", textDecoration: "none", outline: "none", }}
              href="https://discord.gg/rbxchance"
              target="_blank"
              rel="noreferrer" alt="Discord"
            >
              <button className={classes.reward}>
                <svg style={{ width: "38px", height: "38px" }} fill="currentColor" width="18" height="18" viewBox="0 0 24 24" className="material-design-icon__svg"><path data-v-17895ccb="" data-v-98afd824="" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C7.4,22 3.55,18.92 2.36,14.73L6.19,16.31C6.45,17.6 7.6,18.58 8.97,18.58C10.53,18.58 11.8,17.31 11.8,15.75V15.62L15.2,13.19H15.28C17.36,13.19 19.05,11.5 19.05,9.42C19.05,7.34 17.36,5.65 15.28,5.65C13.2,5.65 11.5,7.34 11.5,9.42V9.47L9.13,12.93L8.97,12.92C8.38,12.92 7.83,13.1 7.38,13.41L2,11.2C2.43,6.05 6.73,2 12,2M8.28,17.17C9.08,17.5 10,17.13 10.33,16.33C10.66,15.53 10.28,14.62 9.5,14.29L8.22,13.76C8.71,13.58 9.26,13.57 9.78,13.79C10.31,14 10.72,14.41 10.93,14.94C11.15,15.46 11.15,16.04 10.93,16.56C10.5,17.64 9.23,18.16 8.15,17.71C7.65,17.5 7.27,17.12 7.06,16.67L8.28,17.17M17.8,9.42C17.8,10.81 16.67,11.94 15.28,11.94C13.9,11.94 12.77,10.81 12.77,9.42A2.5,2.5 0 0,1 15.28,6.91C16.67,6.91 17.8,8.04 17.8,9.42M13.4,9.42C13.4,10.46 14.24,11.31 15.29,11.31C16.33,11.31 17.17,10.46 17.17,9.42C17.17,8.38 16.33,7.53 15.29,7.53C14.24,7.53 13.4,8.38 13.4,9.42Z"><title data-v-17895ccb="" data-v-98afd824="">Steam icon</title></path></svg>
                <div className={classes.rewardname} style={{ marginTop: "12px", }}>Discord</div>
              </button>
            </a>
          </Box>
        </Container>
      </Grow>
    </Box>
  );
};

Main.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Main);
