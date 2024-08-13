import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getRaceInformation, getLastRaceInformation, getRacePosition } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";

// Components
import Countdown from "react-countdown";

// MUI Components
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Skeleton from "@material-ui/lab/Skeleton";
import Grow from '@material-ui/core/Grow';

//import akskin from "../assets/akskin.png";
//import knifeskin from "../assets/knifeskin.png";
import knifeskin2 from "../assets/knifeskin2.png";
import howlskin from "../assets/howlskin.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
  userlevel: {
    fontSize: 10,
    padding: "5px 6px",
    fontFamily: "Rubik",
    fontWeight: 500,
    letterSpacing: ".15em",
    borderRadius: "6px",
    marginTop: "-4px",
    marginLeft: "-5px",
  },
  profile: {
    margin: "2.5rem 10rem",
    [theme.breakpoints.down("xs")]: {
      margin: "5px",
      marginTop: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "5px",
      marginTop: "40px",
    },
    [theme.breakpoints.down("md")]: {
      margin: "5px",
      marginTop: "40px",
    },
    color: "#e0e0e0",
    "& h1": {
      color: "#fff",
      fontFamily: "Rubik",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".1em",
      margin: 0,
      marginBottom: "1rem",
      [theme.breakpoints.down("xs")]: {
        marginBottom: "3rem",
      },
      [theme.breakpoints.down("sm")]: {
        marginBottom: "3rem",
      },
      [theme.breakpoints.down("md")]: {
        marginBottom: "3rem",
      },
    },
    "& h2": {},
    "& .saveBtn": {
      position: "absolute",
      right: "1rem",
      top: "0.55rem",
      width: "6rem",
      background: "#264d68",
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".1em",
      "& .MuiButton-label": {
      },
    },
  },
  userWrap: {
    display: "none",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#282c33",
    borderRadius: "0.25rem",
    padding: "2rem",
    height: "12rem",
    marginBottom: "2rem",
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& > div": {
      width: "49%",
      "& > div": {
        width: "100%",
      },
    },
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    "& .earnings": {
      width: "49%",
      background: "#699958a6",
      color: "#7ca253",
      position: "relative",
      "& > button": {
        position: "absolute",
        background: "#264d68",
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: ".05em",
        width: "6rem",
        right: "2rem",
        "& .MuiButton-label": {
        },
      },
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#272b2f",
      height: "7rem",
      padding: "0 2rem",
      borderRadius: "0.25rem",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
      "& svg": {
        marginRight: "0.25rem",
        color: "#FFC440",
      },
      "& h1": {
        margin: 0,
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  avatar: {
    width: "50px",
    height: "50px",
    position: "relative",
    padding: "2px",
    borderRadius: "50%",
    backgroundColor: "#333b42",
    flexShrink: 0,
    [theme.breakpoints.down("xs")]: {
      width: "40px",
      height: "40px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "40px",
      height: "40px",
    },
    [theme.breakpoints.down("md")]: {
      width: "40px",
      height: "40px",
    },
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
    width: "27px",
    height: "27px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "-2px",
    bottom: "-2px",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "500",
    backgroundColor: "#333b42",
    border: "2px solid #242b33",
    borderRadius: "50px",
    paddingTop: "2px",
    [theme.breakpoints.down("xs")]: {
      width: "25px",
      height: "25px",
      fontSize: "8px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "25px",
      height: "25px",
      fontSize: "8px",
    },
    [theme.breakpoints.down("md")]: {
      width: "25px",
      height: "25px",
      fontSize: "8px",
    },
  },
  usernamebox: {
    marginLeft: "1.4rem",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "3px",
      display: "flex",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "3px",
      display: "flex",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "3px",
      display: "flex",
    },
  },
  tran: {
    marginBottom: "5%",
    overflowY: "auto",
    paddingTop: "1rem",
    "& th": {
      borderBottom: "none",
      color: "#707479",
      fontFamily: "Rubik",
      fontSize: "14px",
      [theme.breakpoints.down("xs")]: {
        fontSize: "12px",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "12px",
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "12px",
      },
      padding: "0px",
      fontWeight: 500,
      letterSpacing: ".1em",
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "40px",
        [theme.breakpoints.down("xs")]: {
          paddingLeft: "5px",
        },
        [theme.breakpoints.down("sm")]: {
          paddingLeft: "5px",
        },
        [theme.breakpoints.down("md")]: {
          paddingLeft: "5px",
        },
      },
    },
    "& .MuiAvatar-root": {
      width: 36,
      height: 36,
      borderRadius: "100%",
    },
    "& tr": {
      marginBottom: "20px",
      "&:nth-child(1)": {
        marginBottom: "20px",
      },
    },
    "& td": {
      color: "#fff",
      fontFamily: "Rubik",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: ".05em",
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "2.7rem",
        borderTopLeftRadius: "20px",
        borderBottomLeftRadius: "20px",
        border: "1px solid #2f3947",
        borderRight: "0px",
        [theme.breakpoints.down("xs")]: {
          paddingLeft: "1.5rem",
          fontSize: "11px",
        },
        [theme.breakpoints.down("sm")]: {
          paddingLeft: "1.5rem",
          fontSize: "11px",
        },
        [theme.breakpoints.down("md")]: {
          paddingLeft: "1.5rem",
          fontSize: "11px",
        },
      },
      "&:nth-child(2)": {
        border: "1px solid #2f3947",
        borderRight: "0px",
        borderLeft: "0px",
        [theme.breakpoints.down("xs")]: {
          fontSize: "11px",
          maxWidth: "100px",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "11px",
          maxWidth: "100px",
        },
        [theme.breakpoints.down("md")]: {
          fontSize: "11px",
          maxWidth: "100px",
        },
      },
      "&:nth-child(3)": {
        border: "1px solid #2f3947",
        borderRight: "0px",
        borderLeft: "0px",
        [theme.breakpoints.down("xs")]: {
          fontSize: "11px",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "11px",
        },
        [theme.breakpoints.down("md")]: {
          fontSize: "11px",
        },
      },
      "&:nth-child(4)": {
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        border: "1px solid #2f3947",
        borderLeft: "0px",
        [theme.breakpoints.down("xs")]: {
          fontSize: "11px",
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: "11px",
        },
        [theme.breakpoints.down("md")]: {
          fontSize: "11px",
        },
      },
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  bgInput: {
    "& .MuiOutlinedInput-root": {
      background: "rgba(44, 48, 84, 0.45)",
    },
  },
  noRace: {
    height: "23rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "7rem",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    "& h3": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
  },
  prizebox: {
    background: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(0,0,0,.02) 0,rgba(0,0,0,.02) 30px)",
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "inherit",
    },
    [theme.breakpoints.down("sm")]: {
      display: "inherit",
    },
    [theme.breakpoints.down("md")]: {
      display: "inherit",
    },
  },
  raceTime: {
    color: "rgb(33, 150, 243)",
    fontSize: "18px",
    marginLeft: "116px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "66px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "66px",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "66px",
    },
  },
  racetimer: {

    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const Race = ({ isAuthenticated, isLoading }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [activeRace, setActiveRace] = useState(null);
  const [topWinners, setTopWinners] = useState(null);
  const [personalPosition, setPersonalPosition] = useState(0);
  const [personalProgress, setPersonalProgress] = useState(0);
  const [prizeDistribution, setPrizeDistribution] = useState([]);

  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      function z(t) {
        return t < 10 ? `0${t}` : t;
      }
      return (
        <span style={{ display: "flex", }}>
          <span style={{ padding: "25px 23px 25px 23px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", marginRight: "10px", }}>{days}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>DAYS</span></span> <span style={{ padding: "25px 15px 25px 20px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", marginRight: "10px", }}>{z(hours)}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>HOURS</span></span> <span style={{ padding: "25px 30px 25px 30px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", marginRight: "10px", }}>{z(minutes)}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>MIN</span></span> <span className={classes.racetimer} style={{ padding: "25px 20px 25px 25px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", }}>{z(seconds)}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>SECS</span></span>
        </span>
      );
    } else {
      // Render a countdown

      function z(t) {
        return t < 10 ? `0${t}` : t;
      }

      return (
        <span style={{ display: "flex", }}>
          <span style={{ padding: "25px 23px 25px 23px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", marginRight: "10px", }}>{days}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>DAYS</span></span> <span style={{ padding: "25px 15px 25px 20px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", marginRight: "10px", }}>{z(hours)}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>HOURS</span></span> <span style={{ padding: "25px 30px 25px 30px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", marginRight: "10px", }}>{z(minutes)}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>MIN</span></span> <span className={classes.racetimer} style={{ padding: "25px 20px 25px 25px", border: "1px solid #161D26", background: "rgb(27 33 41)", borderRadius: "20px", }}>{z(seconds)}<br /><span style={{ color: "rgb(104 107 114)", fontSize: "13px", }}>SECS</span></span>
        </span>
      );
    }
  };

  // componentDidMount
  useEffect(() => {
    // Fetch public data from the api
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getRaceInformation();
        const responseLast = await getLastRaceInformation();

        // If race is active
        if (response.active) {
          // Update state
          setTopWinners(response.topTen);
          setActiveRace(response.activeRace);
          setPrizeDistribution(response.prizeDistribution);
          setLoading(false);
        }
        // If Last Race
        else if (responseLast) {
          // Update state
          setTopWinners(responseLast.topTen);
          setActiveRace(responseLast.activeRace);
          setPrizeDistribution(responseLast.prizeDistribution);
          setLoading(false);
        }
        else {
          setActiveRace(null);
          setLoading(false);
        }

      } catch (error) {
        console.log("There was an error while loading race data:", error);
        addToast(
          "There was an error while loading race data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    // Fetch public data
    fetchData();
  }, [addToast]);

  // When user is loaded, fetch personal data
  useEffect(() => {
    // Fetch personal data from the api
    const fetchPersonalData = async () => {
      setLoadingPersonal(true);
      try {
        const response = await getRacePosition();

        // If race is active
        if (response.active) {
          // Update state
          setPersonalPosition(response.myPosition);
          setPersonalProgress(response.myProgress);
        }

        // Update state
        setLoadingPersonal(false);
      } catch (error) {
        console.log("There was an error while loading your race data:", error);
        addToast(
          "There was an error while loading your race data, please try again later!",
          { appearance: "error" }
        );
      }
    };

    if (!isLoading && isAuthenticated) fetchPersonalData();
  }, [isAuthenticated, isLoading, addToast]);

  return (
    <Box>
      <Box>
        <Grow in timeout={520}>
          <Container maxWidth="lg">
            <Box className={classes.profile}>
              <Box className={classes.prizebox} style={{ backgroundColor: activeRace ? "#12171D" : "rgb(27 33 41)", padding: "35px 35px 15px 35px", border: activeRace ? "1px solid #161D26" : "1px solid rgb(27 33 41)", borderRadius: "20px", }}>
                <h1 style={{ color: "#fff" }}>
                  {loading ? (
                    <Skeleton
                      width={80}
                      height={40}
                      variant="rect"
                      animation="wave"
                    />
                  ) : activeRace ? (
                    <span>
                      ${parseCommasToThousands(activeRace.prize.toFixed(2))} RACE
                      <br /> <span style={{ color: "rgb(104 107 114)", fontSize: "15px", display: "block", width: "260px", marginTop: "10px", }}>The more you bet, the bigger chance you have to win.</span>
                      <br />
                      <span style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center", animation: "6.5s ease 0s infinite beat", WebkitAnimation: "6.5s ease 0s infinite beat", MozAnimation: "6.5s ease 0s infinite beat",
                      }}>
                        <img src={howlskin} alt="Skins" width={200} />
                        <img src={knifeskin2} alt="Skins" width={200} />
                      </span>
                    </span>
                  ) : (
                    null
                  )}
                </h1>
                <h1 style={{ marginLeft: "auto", }}>
                  {!loading && activeRace && (
                    <span><span className={classes.raceTime}>{activeRace.active === true ? "RACE ENDS IN" : "RACE ENDED!"}</span> <br /><br />  <span><Countdown
                      date={new Date(activeRace.endingDate)}
                      renderer={renderer}
                      style={{ color: "#fff", }}
                    />
                    </span></span>
                  )}
                </h1>
              </Box>
              <Box className={classes.userWrap}>
                {loadingPersonal ? (
                  "LOADING YOUR STATISTICS..."
                ) : !isLoading && !isAuthenticated ? (
                  "SIGN IN TO ENTER THE RACE!"
                ) : !activeRace ? (
                  "NO ACTIVE RACE CURRENTLY"
                ) : personalPosition === -1 ? (
                  "ENTER THE RACE AND WIN"
                ) : (
                  <span>
                    Your position in the race:{" "}
                    <b>{parseCommasToThousands(personalPosition)}</b>
                    <br />
                    You have wagered{" "}
                    <b>${parseCommasToThousands(personalProgress)}</b> to the
                    race!
                  </span>
                )}
              </Box>

              {loading ? (
                <LoadingTable />
              ) : activeRace ? (
                <Fragment>
                  <br />
                  <Box className={classes.tran}>
                    <Table style={{ borderCollapse: "inherit", borderSpacing: "0 1rem", }}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.firstcell}>Rank</TableCell>
                          <TableCell>Username</TableCell>
                          <TableCell>Wagered</TableCell>
                          <TableCell>Prize</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topWinners.map((entry, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Box className={classes.avatar} style={{
                                    background: `${entry.user_levelColor}`,
                                  }}>
                                    <Box className={classes.avatarimg}>
                                      <img className={classes.avatarimg2} id="avatar-img" alt="Avatar" src={entry._user.avatar} />
                                    </Box>
                                    <Box
                                      className={classes.level}
                                      style={{ background: `${entry.user_levelColor}` }}>
                                      {entry.user_level}
                                    </Box>
                                  </Box>
                                  <Box className={classes.usernamebox}>
                                    <span style={{ marginLeft: "5px", }}>{entry._user.username}</span>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                ${parseCommasToThousands(entry.value.toFixed(2))}
                              </TableCell>
                              <TableCell style={{ color: "#2196ec" }}>
                                $
                                {parseCommasToThousands(
                                  (
                                    activeRace.prize *
                                    (prizeDistribution[index] / 100)
                                  ).toFixed(2)
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                </Fragment>
              ) : (
                <Box className={classes.noRace}>
                  <h3>NO CURRENTLY ACTIVE RACE!</h3>
                </Box>
              )}
            </Box>
          </Container>
        </Grow>
      </Box>
    </Box >
  );
};

// Loading table component
const LoadingTable = () => {

  return (
    <Fragment>
    </Fragment>
  );
};

Race.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps)(Race);
