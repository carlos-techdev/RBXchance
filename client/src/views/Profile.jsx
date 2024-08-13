import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { getUserProfileData, getUserVipData } from "../services/api.service";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { logout } from "../actions/auth";

import { useToasts } from "react-toast-notifications";

// MUI Components
//import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Grow from '@material-ui/core/Grow';

import SelfExcludeModal from "../components/modals/SelfExcludeModal";

import TextField from "@material-ui/core/TextField";

import Vip from "../components/modals/VIPModal";

// Icons
import EmojiEvents from "@material-ui/icons/Stars";
import MonetizationOn from "@material-ui/icons/MonetizationOn";
import SportsEsports from "@material-ui/icons/PlayCircleFilled";
import RemoveCircle from "@material-ui/icons/RemoveCircle";
import AddCircle from "@material-ui/icons/AddCircle";
import SecurityIcon from "@material-ui/icons/Security";

// Components
import AccountVerificationModal from "../components/modals/AccountVerificationModal";

import { chatSocket } from "../services/websocket.service";

// Custom styles
const useStyles = makeStyles(theme => ({
  profile: {
    margin: "5rem 12rem",
    color: "#e0e0e0",
    [theme.breakpoints.down("sm")]: {
      margin: "2rem 0",
    },
    "& > h1": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "20px",
      fontWeight: 500,
      letterSpacing: ".1em",
      margin: 0,
      marginBottom: "1rem",
    },
  },
  userWrap: {
    display: "flex",
    border: "1px solid #161D26",
    background: "repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(0,0,0,.02) 0,rgba(0,0,0,.02) 30px)",
    borderRadius: "10px",
    // border: "2px solid #2f3947",
    padding: "2rem",
  },
  user: {
    display: "flex",
    flexDirection: "column",
    "& > h1": {
      margin: 0,
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& > h5": {
      margin: 0,
      textTransform: "uppercase",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  pfp: {
    height: "70px",
    width: "70px",
    borderRadius: "100%",
  },
  logoutt: {
    textAlign: "left",
    marginLeft: "160px",
  },
  dangerzone: {
    background: "#12171D",
    border: "1px solid #161D26",
    borderRadius: "10px",
    padding: "20px",
  },
  bet: {
    minWidth: "fit-content",
    textAlign: "center",
    backgroundColor: "#0D1116",
    boxShadow: "none",
    color: "white",
    marginLeft: "-90px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "#0D1116",
      boxShadow: "none",
    },
  },
  grid: {
    border: "1px solid #161D26",
    borderRadius: "0.4rem",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    [theme.breakpoints.down("xs")]: {
      flexWrap: "wrap",
      flexDirection: "column",
    },
    "& > div": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#0D1116",
      borderRadius: "10px",
      // border: "2px solid #2f3947",
      width: "19%",
      height: "7rem",
      padding: "0 2rem",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        marginBottom: 10,
      },
      "& svg": {
        marginRight: "0.25rem",
        color: "#FFC440",
      },
      "& h1": {
        margin: 0,
        filter: "drop-shadow(1px 2px 20px blue) invert(25%)",
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  tran: {
    background: "#0D1116",
    borderRadius: "10px",
    border: "1px solid #161D26",
    backgroundColor: "#12171D",
    // border: "2px solid #2f3947",
    padding: "2rem",
    paddingTop: "1rem",
    maxHeight: "23rem",
    overflowY: "auto",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    "& th": {
      borderBottom: "none",
      color: "#FFC440",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      paddingLeft: 0,
    },
    "& td": {
      borderBottom: "1px #2f3947 solid",
      background: "#0D1116",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
      "&:nth-child(n+1):nth-child(-n+3)": {
        color: "#9d9d9d",
        fontFamily: "Rubik",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".05em",
      },
    },
  },
  notVerified: {
    background: "#272b2f",
    boxShadow: "0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12)",
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".05em",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "1rem",
    borderRadius: "0.25rem",
    [theme.breakpoints.down("xs")]: {
      padding: "1rem",
    },
    "& > div": {
      margin: "0 auto 0 0",
      display: "flex",
      alignItems: "center",
    },
    "& svg": {
      marginRight: "1rem",
      color: "#FFC440",
    },
  },
  verifyBtn: {
    backgroundColor: "#273a4f",
    borderColor: "#273a4f",
    color: "#e0e0e0",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
    padding: "0.3rem 2rem",
    textTransform: "capitalize",
    marginLeft: "1rem",
    "&:hover": {
      backgroundColor: "#273a4f",
    },
  },
  reverse: {
    fontFamily: "Rubik",
  },
  nonenav: {
    color: "#d5d6d8",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  bronzenav: {
    color: "#C27C0E",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  silvernav: {
    color: "#95A5A6",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  goldnav: {
    color: "#b99309",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  diamondnav: {
    color: "#3498DB",
    fontSize: "11px",
    fontFamily: "Rubik",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  progressbox: {
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      background: "#0D1116",
      "& > input": {
        color: "#cccc",
        fontFamily: "Rubik",
        marginRight: "100px",
        fontSize: "14px",
      },
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#ff9800",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#ff9800",
      },
      "& .MuiInput-underline:after": {
        border: "1px solid #2f3947",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid #2f3947",
        },
        "&:hover fieldset": {
          border: "1px solid #2f3947",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid #2f3947",
        },
      },
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#264d68",
      color: "#e4e4e4",
      "&:hover": {
        background: "#264d68",
      },
      "& .MuiButton-label": {
      },
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "36rem",
  },
  noTransactions: {
    width: "100%",
    textAlign: "center",
    padding: "2rem 0 1rem 0",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  verifybutton: {
    color: "#5f6368",
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
  },
  userinfo: {
    display: "flex",
    flexDirection: "column",
    gridGap: "4px",
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const Profile = ({ isLoading, isAuthenticated, user, logout }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [openSelfexcludeModal, setOpenSelfexcludeModal] = useState(false);
  const [displayname, setDisplayname] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [openVip, setOpenVip] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [vipData, setVipData] = useState(null);
  const [vipDataColor, setVipDataColor] = useState(null);
  const [vipDataName, setVipDataName] = useState(null);
  const open = Boolean(anchorEl);

  // Get verbal month from js month index
  const getMonthFromIndex = index => {
    switch (index) {
      default:
      case 0:
        return "JAN";
      case 1:
        return "FEB";
      case 2:
        return "MAR";
      case 3:
        return "APR";
      case 4:
        return "MAY";
      case 5:
        return "JUN";
      case 6:
        return "JUL";
      case 7:
        return "AUG";
      case 8:
        return "SEP";
      case 9:
        return "OCT";
      case 10:
        return "NOV";
      case 11:
        return "DEC";
    }
  };

  // Parse unix timestamp to readable format
  const parseDate1 = timestamp => {
    const d = new Date(timestamp);
    return `${d.getDate()} ${getMonthFromIndex(
      d.getMonth()
    )} ${d.getFullYear()}`;
  };
  // Parse unix timestamp to readable format
  const parseDate2 = timestamp => {
    const d = new Date(timestamp);
    return `${getMonthFromIndex(
      d.getMonth()
    )} ${d.getDate()}, ${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  // Open verification modal
  const onClick = () => {
    setModalVisible(state => !state);
  };

  // Change avatar method
  const inputFile = React.createRef();

  const changeAvatar = () => {
    inputFile.current.click();
  }

  const onChangeAvatar = async (e) => {
    let base64 = await fileToBase64(e.target.files[0]);
    if (base64.indexOf("data:image/jpeg;base64") === -1) return addToast("Invalid image!", { appearance: "error" });
    chatSocket.emit("set-avatar", base64);
    inputFile.current.value = null;
  }

  const fileToBase64 = async file => {
    return new Promise(resolve => {
      try {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          resolve(reader.result);
        };
        reader.onerror = function (error) {
          throw error;
        };
      } catch (e) {
        addToast("Invalid image, try again!", { appearance: "error" });
      }
    });
  }

  // Set display name through chat socket
  const changeDisplayname = () => {
    chatSocket.emit("set-displayname", displayname);
  }

  // Input onChange event handler
  const onChangeDisplayname = e => {
    setDisplayname(e.target.value);
  };

  // componentDidMount
  useEffect(() => {
    // Get profile data from API
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserProfileData();
        setProfile(data);
        const data2 = await getUserVipData();
        setVipData(data2);
        const currentMajorLevel = data2.majorLevelNames.find((levelName, index) => {
          const currentLevelIndex = data2.allLevels.findIndex((level) => level.name === data2.currentLevel.name);
          const nextIndex = data2.allLevels.findIndex((level) => level.levelName === data2.majorLevelNames[index + 1]);
          if (currentLevelIndex >= index && (nextIndex === -1 || currentLevelIndex < nextIndex)) {
            return true;
          }
          return false;
        });
        const currentMajorLevelIndex = data2.majorLevelNames.indexOf(currentMajorLevel);
        setVipDataColor(data2.majorLevelColors[currentMajorLevelIndex]);
        setVipDataName(currentMajorLevel);

        setDisplayname(user.username);
        setAvatar(data.avatar)
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading user profile data:", error);
      }
    };
    if (!isLoading && isAuthenticated) {
      fetchData();
    }

  }, [isLoading, isAuthenticated, user.username]);

  // If user is not logged in
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/" />;
  }

  return isLoading || !user ? (
    <Box className={classes.loader}>
      <ColorCircularProgress />
    </Box>
  ) : (
    <Box style={{ margin: "10px", }}>
      <AccountVerificationModal
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <Vip handleClose={() => setOpenVip(!openVip)} open={openVip} />
      <Box>
        <Container maxWidth="lg">
          <Grow in timeout={620}>
            <Box className={classes.profile}>
              {!loading && !profile.hasVerifiedAccount && (
                <Box className={classes.notVerified}>
                  <div>
                    <SecurityIcon />
                    <p>
                      We need additional information to verify your account. After
                      verification you can claim your free $0.5!
                    </p>
                  </div>
                  <Button
                    className={classes.verifyBtn}
                    size="medium"
                    color="primary"
                    variant="contained"
                    onClick={onClick}
                  >
                    <span className={classes.reverse}>VERIFY NOW</span>
                  </Button>
                </Box>
              )}
              <h1 style={{ marginLeft: "5px", }}>Profile <span style={{ color: "#FFC440", fontSize: "16px", }}>{user._id}</span></h1>
              <Box className={classes.userWrap} style={{ backgroundColor: "#12171D", }}>
                <Box className={classes.user}>
                  {loading ? (
                    <Box></Box>
                  ) : (
                    <Box className={classes.avatar} style={{
                      width: "65px", height: "65px", background: `${vipDataColor}`,
                    }}>
                      <Box className={classes.avatarimg}>
                        <img className={classes.avatarimg2} id="avatar-img" alt="Avatar" src={avatar} />
                      </Box>
                      <Box
                        onClick={() => setOpenVip(!openVip)}
                        onClose={() => setAnchorEl(null)}
                        className={classes.level}
                        style={{ background: `${vipDataColor}`, cursor: "pointer", }}>
                        {vipData.currentLevel.name}
                      </Box>
                    </Box>)}
                  <div className={classes.logoutt} style={{ marginBottom: "20px", marginTop: "-50px", }}>
                    <Tooltip
                      interactive
                      title={
                        <span>
                          Logout
                        </span>
                      }
                      placement="right"
                    >
                      <Button
                        className={classes.bet}
                        size="medium"
                        color="primary"
                        variant="contained"
                        onClick={() => logout()}
                      >
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sign-in-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-sign-in-alt fa-w-16 fa-9x" style={{ width: "20px", }}><path fill="currentColor" d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z" className=""></path></svg>
                      </Button>
                    </Tooltip>
                  </div>
                  <br />
                  <input onChange={onChangeAvatar} type="file" id="file" accept=".jpg, .jpeg" ref={inputFile} style={{ display: 'none' }} />

                  {/* BUTTON CHANGE AVATAR */}
                  <Box>
                    <Button disableRipple onClick={changeAvatar} className={classes.buttontes} variant="contained" style={{ fontFamily: "Rubik", marginTop: "15px",  background: `${vipDataColor}`, fontSize: "13px", }}>CHANGE AVATAR</Button>
                  </Box>

                  <h5 style={{ textTransform: "none", marginTop: "23px", marginBottom: "2px", marginLeft: "2px", }}>Username</h5>
                  <Box position="relative" className={classes.progressbox} style={{ maxWidth: "300px", }}>
                    <TextField
                      name="name"
                      className="input"
                      variant="outlined"
                      inputProps={{ maxLength: 16 }}
                      placeholder="#USERNAME"
                      onChange={onChangeDisplayname}
                      value={displayname}
                    />
                    <Button
                      onClick={changeDisplayname}
                      className={classes.buttontest}
                      variant="contained"
                      style={{ fontFamily: "Rubik", background: "rgb(47 57 71)", fontSize: "12px", }}
                    >CHANGE</Button>
                  </Box>
                  <br />
                  <h5 style={{ textTransform: "inherit", marginTop: "10px", marginBottom: "25px", marginLeft: "1px", }}>Member since {parseDate1(user.created)}</h5>
                  {/*<Box className={classes.dangerzone}>
                    <h2 style={{ fontWeight: 500, }}>Danger Zone</h2>
                    <p style={{ marginTop: "-10px", }}>If needed, you can lock yourself out of your account for a set period of time. You won't be able to access the website until the restriction expires. During this time, we will not remove your lock for any reason, even if you change your mind.</p>
                    <br />
                    <Box>
                      <Button
                        className={classes.buttontest}
                        variant="contained"
                        style={{ fontFamily: "Rubik", background: "#f44336", }}
                        onClick={() => setOpenSelfexcludeModal(!openSelfexcludeModal)}>Self Exclusion Lock</Button>
                      <SelfExcludeModal handleClose={() => setOpenSelfexcludeModal(!openSelfexcludeModal)} open={openSelfexcludeModal} />
                    </Box>
                  </Box>*/}
                </Box>
              </Box>
              <Grid className={classes.grid} container style={{backgroundColor: "#12171D",}}>
                <Box style={{backgroundColor: "#12171D",}}>
                  <Box display="flex" alignItems="center" style={{ marginBottom: "5px", }}>
                    <EmojiEvents /> VIP RANK
                  </Box>
                  <h1>
                    <span
                      open={open}
                      style={{ cursor: "pointer", }}
                      onClick={() => setOpenVip(!openVip)}
                      onClose={() => setAnchorEl(null)}
                    >
                      <span className="nonenav">{vipDataName}</span>
                    </span>
                  </h1>
                </Box>
                <Box style={{backgroundColor: "#12171D",}}>
                  <Box display="flex" alignItems="center" style={{ marginBottom: "5px", }}>
                    <MonetizationOn /> PROFIT
                  </Box>
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      `$${parseCommasToThousands(cutDecimalPoints(((profile.totalDeposited - profile.totalWithdrawn - user.wallet) * (-1)).toFixed(7)))}`
                    )}
                  </h1>
                </Box>
                <Box style={{backgroundColor: "#12171D",}}>
                  <Box display="flex" alignItems="center" style={{ marginBottom: "5px", }}>
                    <AddCircle /> DEPOSITED
                  </Box>
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      `$${parseCommasToThousands(profile.totalDeposited)}`
                    )}
                  </h1>
                </Box>
                <Box style={{backgroundColor: "#12171D",}}>
                  <Box display="flex" alignItems="center" style={{ marginBottom: "5px", }}>
                    <RemoveCircle /> WITHDRAWN
                  </Box>
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      `$${parseCommasToThousands(profile.totalWithdrawn)}`
                    )}
                  </h1>
                </Box>
                <Box style={{backgroundColor: "#12171D",}}>
                  <Box display="flex" alignItems="center" style={{ marginBottom: "5px", }}>
                    <SportsEsports /> WAGERED
                  </Box>
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      `$${parseCommasToThousands(profile.wager)}`
                    )}
                  </h1>
                </Box>
              </Grid>
              <br /> <br />
              <h1 style={{ marginLeft: "5px", }}>Transaction History</h1>
              <Box className={classes.tran}>
                {loading ? (
                  <LoadingTable />
                ) : profile.transactions.length >= 1 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>TOTAL</TableCell>
                        <TableCell>REASON</TableCell>
                        <TableCell>EXTRA</TableCell>
                        <TableCell>TIME</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile.transactions.map(transaction => (
                        <TableRow key={transaction._id}>
                          <TableCell>{transaction._id}</TableCell>
                          <TableCell>${parseFloat(transaction.amount).toFixed(2)}</TableCell>
                          <TableCell>{transaction.reason}</TableCell>
                          <TableCell>NO EXTRA DATA</TableCell>
                          <TableCell>{parseDate2(transaction.created)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className={classes.noTransactions}>NO TRANSACTIONS</div>
                )}
              </Box>
              <br />
              <br />
              <br />
              <br />
            </Box>
          </Grow>
        </Container>
      </Box>
    </Box>
  );
};

const LoadingTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Time</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Array(3)
          .fill()
          .map((element, index) => (
            <TableLoader key={index} />
          ))}
      </TableBody>
    </Table>
  );
};

const TableLoader = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton animation="wave" height={25} width={250} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={100} />
      </TableCell>
      <TableCell>
        <Skeleton animation="wave" height={25} width={50} />
      </TableCell>
    </TableRow>
  );
};

Profile.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
  logout: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { logout })(Profile);
