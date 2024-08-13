import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getUserAffiliatesData,
  updateUserAffiliateCode,
  claimUserAffiliateEarnings,
} from "../services/api.service";
import { Redirect } from "react-router-dom";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { useToasts } from "react-toast-notifications";
import { changeWallet } from "../actions/auth";

// MUI Components
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import Grow from '@material-ui/core/Grow';

import success from "../assets/success.wav";
import error from "../assets/error.wav";

const errorAudio = new Audio(error);
const successAudio = new Audio(success);

const playSound = audioFile => {
  audioFile.play();
};

// Custom Styles
const useStyles = makeStyles(theme => ({
  profile: {
    margin: "5rem 10rem",
    color: "#e0e0e0",
    [theme.breakpoints.down("xs")]: {
      margin: "2rem 0",
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "2rem 0",
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("md")]: {
      margin: "2rem 0",
      padding: "2rem 1.5rem 2rem 1.5rem",
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
    "& .saveBtn": {
      left: "1rem",
      top: "0.55rem",
      width: "6rem",
      background: "#FFC440",
      color: "#000",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".1em",
      [theme.breakpoints.down("xs")]: {
        left: "0rem",
        marginBottom: "50px",
      },
      [theme.breakpoints.down("sm")]: {
        left: "0rem",
        marginBottom: "50px",
      },
      [theme.breakpoints.down("md")]: {
        left: "0rem",
        marginBottom: "50px",
      },
      "& .MuiButton-label": {
      },
    },
  },
  userWrap: {
    border: "1px solid #161D26",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#12171D",
    borderRadius: "10px",
    // border: "2px solid #2f3947",
    padding: "2rem",
    height: "fit-content",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& input": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
    },
    "& label": {
      color: "#5f6368",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& label.Mui-focused": {
      color: "#5f6368",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
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
    "& > div": {
      width: "100%",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 20,
      },
      "& > div": {
        width: "100%",
      },
    },
  },
  userWrap2: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "unset",
    },
    [theme.breakpoints.down("sm")]: {
      display: "unset",
    },
    [theme.breakpoints.down("md")]: {
      display: "unset",
    },
  },
  grid: {
    flexWrap: "nowrap",
    justifyContent: "space-between",
    margin: "1rem 0 2rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
    "& .stats": {
      width: "24%",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        width: "100%",
        marginTop: 20,
      },
    },
    "& .earnings": {
      width: "49%",
      background: "#12171D",
      borderRadius: "10px",
      // border: "2px solid #2f3947",
      color: "#e0e0e0",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      position: "relative",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        fontSize: 11,
        marginTop: "20px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        fontSize: 11,
        marginTop: "20px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        fontSize: 11,
        marginTop: "20px",
      },
      "& > button": {
        position: "absolute",
        background: "#FFC440",
        color: "#e0e0e0",
        fontFamily: "Rubik",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: ".05em",
        width: "6rem",
        right: "2rem",
        [theme.breakpoints.down("xs")]: {
          width: "5rem",
          right: "0.8rem",
        },
        [theme.breakpoints.down("sm")]: {
          width: "5rem",
          right: "0.8rem",
        },
        [theme.breakpoints.down("md")]: {
          width: "5rem",
          right: "0.8rem",
        },
        "& .MuiButton-label": {
        },
      },
    },
    "& > div": {
      border: "1px solid #161D26",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      background: "#12171D",
      borderRadius: "10px",
      // border: "2px solid #2f3947",
      height: "7rem",
      padding: "0 2rem",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "13px",
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
  tran: {
    border: "1px solid #161D26",
    background: "#12171D",
    borderRadius: "10px",
    // border: "2px solid #2f3947",
    padding: "2rem",
    paddingTop: "1rem",
    [theme.breakpoints.down("sm")]: {
      padding: "1rem",
    },
    "& th": {
      borderBottom: "none",
      color: "#000",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      paddingLeft: 0,
    },
    "& .MuiAvatar-root": {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
    },
    "& td": {
      borderBottom: "1px #2f3947 solid",
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
      letterSpacing: ".05em",
      paddingLeft: 0,
      "&:nth-child(1)": {
        paddingLeft: "1rem",
      },
    },
  },
  bgInput: {
    "& .MuiOutlinedInput-root": {
    },
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "36rem",
  },
  noAffiliates: {
    width: "100%",
    textAlign: "center",
    padding: "2rem 0 1rem 0",
    color: "#9d9d9d",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".05em",
  },
}));

// Custom Component
const ColorCircularProgress = withStyles({
  root: {
    color: "#4f79fd",
  },
})(CircularProgress);

const Affiliates = ({ isAuthenticated, isLoading, user, changeWallet }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [affiliatesData, setAffiliatesData] = useState(null);
  const [affiliateCode, setAffiliateCode] = useState("Loading...");

  // Get affiliates data from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserAffiliatesData();

      // Update state
      setAffiliatesData(data);
      setAffiliateCode(data.affiliateCode);
      setLoading(false);
    } catch (error) {
      console.log(
        "There was an error while loading user affiliates data:",
        error
      );
    }
  };

  // Save user affiliate code
  const saveAffiliateCode = async () => {
    setSaving(true);
    try {
      const response = await updateUserAffiliateCode(affiliateCode);

      // Update state
      setSaving(false);
      setAffiliateCode(response.newAffiliateCode);
      setAffiliatesData(state =>
        state ? { ...state, affiliateCode: response.newAffiliateCode } : null
      );
      addToast("Successfully updated your affiliate code!", {
        appearance: "success",
      });
      playSound(successAudio);
    } catch (error) {
      setSaving(false);

      // If user generated error
      if (error.response && error.response.data && error.response.data.errors) {
        // Loop through each error
        for (
          let index = 0;
          index < error.response.data.errors.length;
          index++
        ) {
          const validationError = error.response.data.errors[index];
          addToast(validationError.msg, { appearance: "error" });
          playSound(errorAudio);
        }
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log(
          "There was an error while updating user affiliate code:",
          error
        );
        addToast(
          "There was an error while updating your affiliate code. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  // Claim user affiliate earnings
  const claimEarnings = async () => {
    setClaiming(true);
    try {
      const response = await claimUserAffiliateEarnings();

      // Update state
      setClaiming(false);
      setAffiliatesData(state =>
        state ? { ...state, affiliateMoneyAvailable: 0 } : null
      );
      addToast(`Successfully claimed ${response.claimedAmount} credits!`, {
        appearance: "success",
      });
      playSound(successAudio);

      // Update redux state
      changeWallet({ amount: response.claimedAmount });
    } catch (error) {
      setClaiming(false);

      // Check if user caused this error
      if (error.response && error.response.data && error.response.data.error) {
        addToast(error.response.data.error, { appearance: "error" });
        playSound(errorAudio);
      } else {
        console.log(
          "There was an error while claiming user affiliate earnings:",
          error
        );
        addToast(
          "There was an error while claiming your affiliate earnings. Please try again later!",
          { appearance: "error" }
        );
        playSound(errorAudio);
      }
    }
  };

  // Input onChange event handler
  const onChange = (e, newValue) => {
    setAffiliateCode(e.target.value);
  };

  // componentDidMount
  useEffect(() => {
    if (!isLoading && isAuthenticated) fetchData();
  }, [isLoading, isAuthenticated]);

  // If user is not logged in
  if (!isLoading && !isAuthenticated) {
    return <Redirect to="/" />;
  }

  return isLoading || !user ? (
    <Box className={classes.loader}>
      <ColorCircularProgress />
    </Box>
  ) : (
    <Box>
      <Box>
        <Grow in timeout={420}>
          <Container maxWidth="lg">
            <Box className={classes.profile}>
              <h1 style={{ marginLeft: "5px", }}>Affiliates</h1>
              <br />
              <Box className={classes.userWrap}>
                <p style={{ marginLeft: "5px", }}>Become our affiliate and earn money for every referral. When your referrals play or deposit, watch your earnings grow. More referrals - more earnings. Just share your code or link.</p>
                <br />
                <Box className={classes.userWrap2}>
                  <Box position="relative">
                    <TextField
                      className={classes.bgInput}
                      variant="outlined"
                      label="SET YOUR CODE"
                      disabled={loading}
                      value={affiliateCode}
                      onChange={onChange}
                    />
                    <Button
                      className="saveBtn"
                      variant="contained"
                      disabled={saving || loading}
                      onClick={saveAffiliateCode}
                    >
                      {saving ? "SAVING..." : "SAVE"}
                    </Button>
                  </Box>
                  <TextField
                    className={classes.bgInput}
                    variant="outlined"
                    label="YOUR AFFILIATE LINK"
                    disabled={loading}
                    value={loading ? "LOADING..." : affiliatesData.affiliateLink}
                    onFocus={e => e.target.select()}
                  />
                </Box>
              </Box>
              <br /> <br />
              <h1 style={{ marginLeft: "5px", }}>Statistics</h1>
              <Grid className={classes.grid} container>
                <Box className="stats">
                  TOTAL EARNED
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      `$${parseCommasToThousands(
                        affiliatesData.affiliateMoney.toFixed(2)
                      )}`
                    )}
                  </h1>
                </Box>
                <Box className="stats">
                  AFFILIATED USERS
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      parseCommasToThousands(affiliatesData.usersAffiliated)
                    )}
                  </h1>
                </Box>
                <Box className="earnings">
                  YOUR AVAILABLE EARNINGS
                  <h1>
                    {loading ? (
                      <Skeleton animation="wave" height={40} width={150} />
                    ) : (
                      `$${parseCommasToThousands(
                        affiliatesData.affiliateMoneyAvailable.toFixed(2)
                      )}`
                    )}
                  </h1>
                  <Button
                    variant="contained"
                    onClick={claimEarnings}
                    disabled={claiming || loading}
                    style={{
                      color: "#000"
                    }}
                  >
                    {claiming ? "CLAIMING..." : "CLAIM"}
                  </Button>
                </Box>
              </Grid>
              <br />
              <h1 style={{ marginLeft: "5px", }}>Affiliated Users</h1>
              <Box className={classes.tran}>
                {loading ? (
                  <LoadingTable />
                ) : affiliatesData.affiliatedUsers.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Total Wager</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {affiliatesData.affiliatedUsers.map(user => {
                        return (
                          <TableRow key={user._id}>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Avatar src={user.avatar} variant="rounded" />
                                <Box ml="1rem" className={classes.desktop}>
                                  {user.username}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>${user.wager.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className={classes.noAffiliates}>
                    No one used your code yet. Share it to start earning!
                  </div>
                )}
              </Box>
            </Box>
          </Container>
        </Grow>
      </Box>
    </Box>
  );
};

const LoadingTable = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User</TableCell>
          <TableCell>Total Wager</TableCell>
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
  // Declare State
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell>
        <Box display="flex" alignItems="center">
          <Skeleton height={30} width={30} variant="rect" animation="wave" />
          <Box ml="1rem" className={classes.desktop}>
            <Skeleton animation="wave" height={25} width={50} />
          </Box>
        </Box>
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
    </TableRow>
  );
};

Affiliates.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(Affiliates);
