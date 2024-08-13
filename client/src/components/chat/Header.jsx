import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import { NavLink as Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import { useHistory } from 'react-router-dom';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { chatSocket } from "../../services/websocket.service";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";
import { getUserVipData } from "../../services/api.service";
import Avatar from "@material-ui/core/Avatar";

import Button from "@material-ui/core/Button";
import CreateRainModal from "../modals/CreateRainModal";
import Free from "../modals/FreeModal";
const dlImageURL = 'https://growdice.co/assets/dl-2a39d38a.webp';

const useStyles = makeStyles(theme => ({
  root: {
    background: "#12171D",
    display: "flex",
    color: "rgb(72, 82, 97)",
    fontFamily: "Rubik",
    fontSize: "14px",
    padding: "20px",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
  rainbutton: {
    background: "#1d2834",
    border: "1px solid #1d2834",
    display: "flex",
    padding: "5px 9px 6px 11px",
    minWidth: "0",
    minHeight: "0",
    flexShrink: "0",
    marginRight: "4px",
    marginTop: "2px",
    borderRadius: "50%",
    "& .MuiButton-startIcon": {
      marginLeft: "-3px",
      marginRight: "-1px",
      marginTop: "2px",
      marginBottom: "2px",
    },
    "&:hover": {
      background: "#1d2834",
      border: "1px solid #1d3a4b",
      cursor: "pointer",
    },
  },
  racebutton: {
    background: "#1d3428",
    border: "1px solid #1d3428",
    display: "flex",
    padding: "7px 10px 7px 12px",
    minWidth: "0",
    minHeight: "0",
    flexShrink: "0",
    marginLeft: "5px",
    marginRight: "4px",
    marginTop: "2px",
    borderRadius: "50%",
    "& .MuiButton-startIcon": {
      marginLeft: "-3px",
      marginRight: "-1px",
      marginTop: "2px",
      marginBottom: "2px",
    },
    "&:hover": {
      background: "#1d3432",
      border: "1px solid #285a31",
      cursor: "pointer",
    },
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
  user: {
    display: "flex",
    alignItems: "center",
    gridGap: "16px",
    borderRadius: "5px",
    color: "#5b6368",
    textDecoration: "none",
  },
  pfp: {
    // padding: "1rem 0rem 0rem 1.5rem",
    outline: "none",
    display: "flex",
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
  price: {
    fontFamily: "Rubik",
    color: "#FFC440",
    fontWeight: 500,
    letterSpacing: ".1em",
    margin: "auto",
    position: "absolute",
    marginTop: "-1px",
  },
  pfpp: {
    marginLeft: "45px",
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
}));

const Messages = ({ isAuthenticated, isLoading, user }) => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [openFree, setOpenFree] = useState(false);
  const [usersOnline, setUsersOnline] = useState("---");
  const [vipData, setVipData] = useState(null);
  const [vipDataColor, setVipDataColor] = useState(null);

  const openCreateRainModal = () => {
    setModalVisible(true);
  }

  const handleLeftClick = e => {
    openCreateRainModal();
  };

  const updateUsersOnline = newCount => {
    setUsersOnline(newCount);
  };

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

    chatSocket.on("users-online", updateUsersOnline);

    return () => {
      chatSocket.off("users-online", updateUsersOnline);
    };
  }, []);


  return (
    <Box>
      <CreateRainModal
        handleClose={() => setModalVisible(!modalVisible)}
        open={modalVisible}
      />
      <Free handleClose={() => setOpenFree(!openFree)} open={openFree} />
      <Box className={classes.root}>
        {isAuthenticated && user ? (
          <Box>
            <Button
              onClick={handleLeftClick}
              className={classes.rainbutton}
              disableRipple
              startIcon=
              {<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6102 19.9999C17.9502 20.0099 19.2402 19.5099 20.2302 18.6099C23.5002 15.7499 21.7502 10.0099 17.4402 9.46995C15.9002 0.129949 2.43022 3.66995 5.62022 12.5599" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round" />
                <path d="M7.27986 12.9698C6.74986 12.6998 6.15986 12.5598 5.56986 12.5698C0.909864 12.8998 0.919864 19.6798 5.56986 20.0098" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.8198 9.88998C16.3398 9.62998 16.8998 9.48998 17.4798 9.47998" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.97022 20L7.97021 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.9702 20L11.9702 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.9702 16L11.9702 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.97022 16L7.97021 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>}>
            </Button>
          </Box>
        ) : (
          <Link exact to="/registration" style={{ textDecoration: "none", }}>
            <Box>
              <Button
                className={classes.rainbutton}
                disableRipple
                startIcon=
                {<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6102 19.9999C17.9502 20.0099 19.2402 19.5099 20.2302 18.6099C23.5002 15.7499 21.7502 10.0099 17.4402 9.46995C15.9002 0.129949 2.43022 3.66995 5.62022 12.5599" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinejoin="round" />
                  <path d="M7.27986 12.9698C6.74986 12.6998 6.15986 12.5598 5.56986 12.5698C0.909864 12.8998 0.919864 19.6798 5.56986 20.0098" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15.8198 9.88998C16.3398 9.62998 16.8998 9.48998 17.4798 9.47998" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.97022 20L7.97021 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.9702 20L11.9702 22" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.9702 16L11.9702 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.97022 16L7.97021 18" stroke="#FFC440" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>}>
              </Button>
            </Box>
          </Link>
        )}
        {isAuthenticated && user ? (
          <Box>
            <Button
              onClick={() => setOpenFree(!openFree)}
              className={classes.racebutton}
              disableRipple
              startIcon=
              {<svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.08658 19.5657L4.78803 20.2537L4.78803 20.2537L5.08658 19.5657ZM2.3806 16.7309L1.68314 17.0067L1.68314 17.0067L2.3806 16.7309ZM19.6194 16.7309L20.3169 17.0067L20.3169 17.0067L19.6194 16.7309ZM16.9134 19.5657L17.212 20.2537L17.212 20.2537L16.9134 19.5657ZM2 9.46448L2.74706 9.53085L2.78376 9.11773L2.45337 8.86702L2 9.46448ZM18.5 4.96446L18.5 4.21446L18.5 4.21446L18.5 4.96446ZM11.7678 3.85355L12.2981 4.38388L12.2981 4.38388L11.7678 3.85355ZM13.8891 1.73223L14.4194 2.26256L14.4194 2.26256L13.8891 1.73223ZM17.4246 1.73223L16.8943 2.26256L16.8943 2.26256L17.4246 1.73223ZM17.6835 4.96445L17.6835 5.71445L18.0663 5.71442L18.2909 5.40446L17.6835 4.96445ZM10.3891 3.85357L9.85877 4.3839L9.85877 4.3839L10.3891 3.85357ZM8.26778 1.73225L7.73745 2.26258L7.73745 2.26258L8.26778 1.73225ZM4.73225 1.73225L5.26258 2.26258L5.26258 2.26258L4.73225 1.73225ZM11 18.9645L11.75 18.9645L11.75 18.9645L11 18.9645ZM1.96752 9.43983L1.50739 10.0321L1.50739 10.0321L1.96752 9.43983ZM19.9354 9.51158L19.5043 8.89787L19.9354 9.51158ZM9.5 19.2145C8.3244 19.2145 7.48204 19.214 6.81769 19.1665C6.1608 19.1196 5.73463 19.0294 5.38514 18.8777L4.78803 20.2537C5.3574 20.5008 5.97308 20.61 6.71075 20.6627C7.44097 20.7149 8.34589 20.7145 9.5 20.7145V19.2145ZM1.25003 12.1073C1.25003 13.3179 1.24965 14.2616 1.29918 15.0221C1.3491 15.7887 1.45201 16.4221 1.68314 17.0067L3.07806 16.4551C2.92859 16.0771 2.84122 15.619 2.79601 14.9246C2.75039 14.2242 2.75003 13.3375 2.75003 12.1073H1.25003ZM5.38514 18.8777C4.34904 18.4281 3.51518 17.5607 3.07806 16.4551L1.68314 17.0067C2.26097 18.4681 3.37384 19.6401 4.78803 20.2537L5.38514 18.8777ZM19.25 12.1073C19.25 13.3374 19.2496 14.2242 19.204 14.9246C19.1588 15.619 19.0714 16.0771 18.9219 16.4551L20.3169 17.0067C20.548 16.4221 20.6509 15.7887 20.7008 15.0221C20.7504 14.2616 20.75 13.3178 20.75 12.1073H19.25ZM12.5 20.7145C13.6541 20.7145 14.559 20.7149 15.2893 20.6627C16.0269 20.61 16.6426 20.5008 17.212 20.2537L16.6149 18.8777C16.2654 19.0294 15.8392 19.1196 15.1823 19.1665C14.518 19.214 13.6756 19.2145 12.5 19.2145V20.7145ZM18.9219 16.4551C18.4848 17.5607 17.651 18.4281 16.6149 18.8777L17.212 20.2537C18.6262 19.6401 19.739 18.4681 20.3169 17.0067L18.9219 16.4551ZM2.75003 12.1073C2.75003 10.6341 2.68176 10.2657 2.74706 9.53085L1.25294 9.3981C1.18076 10.2105 1.25003 10.8214 1.25003 12.1073H2.75003ZM18.5 5.71446C19.4665 5.71446 20.25 6.49796 20.25 7.46446H21.75C21.75 5.66954 20.2949 4.21446 18.5 4.21446V5.71446ZM3.5 4.21446C1.70507 4.21446 0.25 5.66954 0.25 7.46446H1.75C1.75 6.49796 2.5335 5.71446 3.5 5.71446V4.21446ZM12.2981 4.38388L14.4194 2.26256L13.3588 1.2019L11.2374 3.32322L12.2981 4.38388ZM14.4194 2.26256C15.1028 1.57915 16.2109 1.57915 16.8943 2.26256L17.955 1.2019C16.6857 -0.067301 14.628 -0.067301 13.3588 1.2019L14.4194 2.26256ZM11.2374 3.32322C10.9239 3.63678 10.4446 4.14706 10.2762 4.76812L11.7238 5.16083C11.7761 4.96806 11.9726 4.70934 12.2981 4.38388L11.2374 3.32322ZM16.8943 2.26256C17.5102 2.87851 17.5714 3.84078 17.0761 4.52443L18.2909 5.40446C19.2117 4.13338 19.1003 2.34725 17.955 1.2019L16.8943 2.26256ZM10.9194 3.32324L8.79811 1.20192L7.73745 2.26258L9.85877 4.3839L10.9194 3.32324ZM8.79811 1.20192C7.52891 -0.0672876 5.47112 -0.0672876 4.20192 1.20192L5.26258 2.26258C5.94599 1.57916 7.05403 1.57916 7.73745 2.26258L8.79811 1.20192ZM9.85877 4.3839C10.0598 4.58497 10.189 4.83942 10.2762 5.16083L11.7238 4.76812C11.5903 4.2757 11.3574 3.76118 10.9194 3.32324L9.85877 4.3839ZM4.20192 1.20192C3.05657 2.34726 2.94516 4.13339 3.86601 5.40447L5.08074 4.52445C4.58546 3.8408 4.64663 2.87853 5.26258 2.26258L4.20192 1.20192ZM10.25 4.96448L10.25 18.9645L11.75 18.9645L11.75 4.96448L10.25 4.96448ZM4.47338 5.71446L11 5.71448L11 4.21448L4.47338 4.21446L4.47338 5.71446ZM3.5 9.21446C3.09497 9.21446 2.72397 9.07778 2.42766 8.84757L1.50739 10.0321C2.05758 10.4595 2.75007 10.7145 3.5 10.7145V9.21446ZM2.42766 8.84757C2.01395 8.52615 1.75 8.02631 1.75 7.46446H0.25C0.25 8.50907 0.74367 9.43875 1.50739 10.0321L2.42766 8.84757ZM2.45337 8.86702L2.42089 8.84238L1.51415 10.0373L1.54663 10.0619L2.45337 8.86702ZM12.5 19.2145H11V20.7145H12.5V19.2145ZM11 19.2145H9.5V20.7145H11V19.2145ZM10.25 18.9645L10.25 19.9645L11.75 19.9645L11.75 18.9645L10.25 18.9645ZM18.5 9.21446H11V10.7145H18.5V9.21446ZM11 9.21446H3.5V10.7145H11V9.21446ZM20.25 7.46446C20.25 8.05643 19.9568 8.58 19.5043 8.89787L20.3665 10.1253C21.2017 9.53862 21.75 8.56562 21.75 7.46446H20.25ZM19.5043 8.89787C19.2202 9.09743 18.8749 9.21446 18.5 9.21446V10.7145C19.1934 10.7145 19.8381 10.4965 20.3665 10.1253L19.5043 8.89787ZM20.75 12.1073C20.75 10.7624 20.7505 10.2318 20.6826 9.44695L19.1882 9.57621C19.2495 10.2851 19.25 10.7495 19.25 12.1073H20.75ZM11 5.71448L17.4246 5.71446L17.4246 4.21446L11 4.21448L11 5.71448ZM17.4247 5.71446L17.6835 5.71445L17.6834 4.21445L17.4246 4.21446L17.4247 5.71446ZM17.4246 5.71446L18.5 5.71446L18.5 4.21446L17.4246 4.21446L17.4246 5.71446ZM4.47338 4.21446H3.5V5.71446H4.47338V4.21446ZM3.5 5.71446L7.25 5.71447L7.25 4.21447L3.5 4.21446L3.5 5.71446ZM7.25 5.71447L11 5.71448L11 4.21448L7.25 4.21447L7.25 5.71447ZM4.47337 5.71446L7.25 5.71447L7.25 4.21447L4.47338 4.21446L4.47337 5.71446ZM11 5.71448L17.6835 5.71445L17.6835 4.21445L11 4.21448L11 5.71448Z" fill="#216F32" />
              </svg>}>
            </Button>
          </Box>
        ) : (
          <Link exact to="/registration" style={{ textDecoration: "none", }}>
            <Box>
              <Button
                className={classes.racebutton}
                disableRipple
                startIcon=
                {<svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.08658 19.5657L4.78803 20.2537L4.78803 20.2537L5.08658 19.5657ZM2.3806 16.7309L1.68314 17.0067L1.68314 17.0067L2.3806 16.7309ZM19.6194 16.7309L20.3169 17.0067L20.3169 17.0067L19.6194 16.7309ZM16.9134 19.5657L17.212 20.2537L17.212 20.2537L16.9134 19.5657ZM2 9.46448L2.74706 9.53085L2.78376 9.11773L2.45337 8.86702L2 9.46448ZM18.5 4.96446L18.5 4.21446L18.5 4.21446L18.5 4.96446ZM11.7678 3.85355L12.2981 4.38388L12.2981 4.38388L11.7678 3.85355ZM13.8891 1.73223L14.4194 2.26256L14.4194 2.26256L13.8891 1.73223ZM17.4246 1.73223L16.8943 2.26256L16.8943 2.26256L17.4246 1.73223ZM17.6835 4.96445L17.6835 5.71445L18.0663 5.71442L18.2909 5.40446L17.6835 4.96445ZM10.3891 3.85357L9.85877 4.3839L9.85877 4.3839L10.3891 3.85357ZM8.26778 1.73225L7.73745 2.26258L7.73745 2.26258L8.26778 1.73225ZM4.73225 1.73225L5.26258 2.26258L5.26258 2.26258L4.73225 1.73225ZM11 18.9645L11.75 18.9645L11.75 18.9645L11 18.9645ZM1.96752 9.43983L1.50739 10.0321L1.50739 10.0321L1.96752 9.43983ZM19.9354 9.51158L19.5043 8.89787L19.9354 9.51158ZM9.5 19.2145C8.3244 19.2145 7.48204 19.214 6.81769 19.1665C6.1608 19.1196 5.73463 19.0294 5.38514 18.8777L4.78803 20.2537C5.3574 20.5008 5.97308 20.61 6.71075 20.6627C7.44097 20.7149 8.34589 20.7145 9.5 20.7145V19.2145ZM1.25003 12.1073C1.25003 13.3179 1.24965 14.2616 1.29918 15.0221C1.3491 15.7887 1.45201 16.4221 1.68314 17.0067L3.07806 16.4551C2.92859 16.0771 2.84122 15.619 2.79601 14.9246C2.75039 14.2242 2.75003 13.3375 2.75003 12.1073H1.25003ZM5.38514 18.8777C4.34904 18.4281 3.51518 17.5607 3.07806 16.4551L1.68314 17.0067C2.26097 18.4681 3.37384 19.6401 4.78803 20.2537L5.38514 18.8777ZM19.25 12.1073C19.25 13.3374 19.2496 14.2242 19.204 14.9246C19.1588 15.619 19.0714 16.0771 18.9219 16.4551L20.3169 17.0067C20.548 16.4221 20.6509 15.7887 20.7008 15.0221C20.7504 14.2616 20.75 13.3178 20.75 12.1073H19.25ZM12.5 20.7145C13.6541 20.7145 14.559 20.7149 15.2893 20.6627C16.0269 20.61 16.6426 20.5008 17.212 20.2537L16.6149 18.8777C16.2654 19.0294 15.8392 19.1196 15.1823 19.1665C14.518 19.214 13.6756 19.2145 12.5 19.2145V20.7145ZM18.9219 16.4551C18.4848 17.5607 17.651 18.4281 16.6149 18.8777L17.212 20.2537C18.6262 19.6401 19.739 18.4681 20.3169 17.0067L18.9219 16.4551ZM2.75003 12.1073C2.75003 10.6341 2.68176 10.2657 2.74706 9.53085L1.25294 9.3981C1.18076 10.2105 1.25003 10.8214 1.25003 12.1073H2.75003ZM18.5 5.71446C19.4665 5.71446 20.25 6.49796 20.25 7.46446H21.75C21.75 5.66954 20.2949 4.21446 18.5 4.21446V5.71446ZM3.5 4.21446C1.70507 4.21446 0.25 5.66954 0.25 7.46446H1.75C1.75 6.49796 2.5335 5.71446 3.5 5.71446V4.21446ZM12.2981 4.38388L14.4194 2.26256L13.3588 1.2019L11.2374 3.32322L12.2981 4.38388ZM14.4194 2.26256C15.1028 1.57915 16.2109 1.57915 16.8943 2.26256L17.955 1.2019C16.6857 -0.067301 14.628 -0.067301 13.3588 1.2019L14.4194 2.26256ZM11.2374 3.32322C10.9239 3.63678 10.4446 4.14706 10.2762 4.76812L11.7238 5.16083C11.7761 4.96806 11.9726 4.70934 12.2981 4.38388L11.2374 3.32322ZM16.8943 2.26256C17.5102 2.87851 17.5714 3.84078 17.0761 4.52443L18.2909 5.40446C19.2117 4.13338 19.1003 2.34725 17.955 1.2019L16.8943 2.26256ZM10.9194 3.32324L8.79811 1.20192L7.73745 2.26258L9.85877 4.3839L10.9194 3.32324ZM8.79811 1.20192C7.52891 -0.0672876 5.47112 -0.0672876 4.20192 1.20192L5.26258 2.26258C5.94599 1.57916 7.05403 1.57916 7.73745 2.26258L8.79811 1.20192ZM9.85877 4.3839C10.0598 4.58497 10.189 4.83942 10.2762 5.16083L11.7238 4.76812C11.5903 4.2757 11.3574 3.76118 10.9194 3.32324L9.85877 4.3839ZM4.20192 1.20192C3.05657 2.34726 2.94516 4.13339 3.86601 5.40447L5.08074 4.52445C4.58546 3.8408 4.64663 2.87853 5.26258 2.26258L4.20192 1.20192ZM10.25 4.96448L10.25 18.9645L11.75 18.9645L11.75 4.96448L10.25 4.96448ZM4.47338 5.71446L11 5.71448L11 4.21448L4.47338 4.21446L4.47338 5.71446ZM3.5 9.21446C3.09497 9.21446 2.72397 9.07778 2.42766 8.84757L1.50739 10.0321C2.05758 10.4595 2.75007 10.7145 3.5 10.7145V9.21446ZM2.42766 8.84757C2.01395 8.52615 1.75 8.02631 1.75 7.46446H0.25C0.25 8.50907 0.74367 9.43875 1.50739 10.0321L2.42766 8.84757ZM2.45337 8.86702L2.42089 8.84238L1.51415 10.0373L1.54663 10.0619L2.45337 8.86702ZM12.5 19.2145H11V20.7145H12.5V19.2145ZM11 19.2145H9.5V20.7145H11V19.2145ZM10.25 18.9645L10.25 19.9645L11.75 19.9645L11.75 18.9645L10.25 18.9645ZM18.5 9.21446H11V10.7145H18.5V9.21446ZM11 9.21446H3.5V10.7145H11V9.21446ZM20.25 7.46446C20.25 8.05643 19.9568 8.58 19.5043 8.89787L20.3665 10.1253C21.2017 9.53862 21.75 8.56562 21.75 7.46446H20.25ZM19.5043 8.89787C19.2202 9.09743 18.8749 9.21446 18.5 9.21446V10.7145C19.1934 10.7145 19.8381 10.4965 20.3665 10.1253L19.5043 8.89787ZM20.75 12.1073C20.75 10.7624 20.7505 10.2318 20.6826 9.44695L19.1882 9.57621C19.2495 10.2851 19.25 10.7495 19.25 12.1073H20.75ZM11 5.71448L17.4246 5.71446L17.4246 4.21446L11 4.21448L11 5.71448ZM17.4247 5.71446L17.6835 5.71445L17.6834 4.21445L17.4246 4.21446L17.4247 5.71446ZM17.4246 5.71446L18.5 5.71446L18.5 4.21446L17.4246 4.21446L17.4246 5.71446ZM4.47338 4.21446H3.5V5.71446H4.47338V4.21446ZM3.5 5.71446L7.25 5.71447L7.25 4.21447L3.5 4.21446L3.5 5.71446ZM7.25 5.71447L11 5.71448L11 4.21448L7.25 4.21447L7.25 5.71447ZM4.47337 5.71446L7.25 5.71447L7.25 4.21447L4.47338 4.21446L4.47337 5.71446ZM11 5.71448L17.6835 5.71445L17.6835 4.21445L11 4.21448L11 5.71448Z" fill="#216F32" />
                </svg>}>
              </Button>
            </Box>
          </Link>
        )}
        <Box className={isAuthenticated ? classes.onlineOrNot1 : classes.onlineOrNot2}>
          { isAuthenticated && user ? (
          <Box className={classes.pfp} style={{ marginLeft: "20px" }}>
            <Box className={classes.avatar2}>
              <Link exact to="/profile" >
                <Avatar variant="rounded" src={user.avatar} style={{ border: `2px solid ${vipDataColor}`, }} />
              </Link>
            </Box>
            <Link
              style={{
                textDecoration: "none",
                marginLeft: "52px",
                outline: "none",
                position: "absolute",
                color: "#fff",
                marginTop: "4px",
                fontSize: "13px",
              }}
              exact to="/profile"><span className="usernamenav">{user.username}</span>
    <Box className={classes.price}>
      <img src={dlImageURL} alt="DL" width="10" height="10" style={{ marginRight: '5px' }} />
      {parseCommasToThousands(
        cutDecimalPoints(user.wallet.toFixed(7))
      )}
    </Box>
            </Link>
            <Box className={classes.pfpp}>
              <span>
                <span
                >
                  {loading ?
                    (
                      <span className="levelnav"></span>
                    ) : (
                      <span
                        className="levelnav"
                        style={{ background: `${vipDataColor}`, }}
                      >
                        {vipData?.currentLevel?.name}
                      </span>
                    )}
                </span>
              </span>
            </Box>
          </Box>
           ) : "" }
        </Box>
      </Box>
    </Box>
  );
};

Messages.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(Messages);
