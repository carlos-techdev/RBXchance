import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { logout } from "../actions/auth";
import { createDepositSession, unlinkRobloxUsername, getUserCryptoInformation, tryCreateOrderSkinsBack } from "../services/api.service.js";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Deposit from "../components/modals/DepositModal";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundPositionY: "-100px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% calc(100% + 100px)",
    height: "calc(100vh - 100px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "146px 20px 0",
  },
  depositContainer: {
    maxWidth: "842px",
    padding: "40px 90px",
    background: "#12171D",
    border: "1px solid #161D26",
    borderRadius: "12px",
    width: "100%",
    position: "relative",
    zIndex: 2,
    margin: 0,
    fontSize: "100%",
    font: "inherit",
    verticalAlign: "baseline",
    boxSizing: "border-box",
  },
  titleNick: {
    fontWeight: 600,
    fontSize: "32px",
    color: "#fff",
    textAlign: "center",
    position: "relative",
    zIndex: 3,
    background: "#12171D",
    marginBottom: "12px",
    margin: 0,
    padding: 0,
    border: 0,
    font: "inherit",
    verticalAlign: "baseline",
    boxSizing: "border-box",
    borderRadius: "12px"
  },
  description: {
    fontWeight: 500,
    fontSize: "16px",
    color: "#929292",
    marginBottom: "32.5px",
    lineHeight: "28px",
    textAlign: "center",
    margin: 0,
    padding: 0,
    border: 0,
    font: "inherit",
    verticalAlign: "baseline",
    boxSizing: "border-box",
  },
  inputContainer: {
    display: "flex",
    alignItems: "flex-end",
    margin: 0,
    padding: 0,
    border: 0,
    fontSize: "100%",
    font: "inherit",
    verticalAlign: "baseline",
    boxSizing: "border-box",
  },
  imgContainer: {
    width: "60px",
    minWidth: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFC440",
    borderRadius: "6px",
    marginRight: "15px",
  },
  userInputContainer: {
    width: "100%",
    width: "600px",
    position: "relative",
  },
  userInputContainer2: {
    width: "100%",
    borderRadius: "6px",
    position: "relative",
  },
  nameInput: {
    height: "60px",
    background: "0 0",
    width: "100%",
    borderRadius: "6px",
    outline: 0,
    border: 0,
    paddingLeft: "18px",
    paddingRight: "36px",
    fontWeight: 500,
    fontSize: "20px",
    color: "#fff",
    border: "3px dashed #FFC440",
  },
  depositButton: {
    width: "100%",
    height: "60px",
    outline: 0,
    border: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    color: "#fff",
    marginTop: "44px",
    background: "#FFC440"
  },
  para: {
    textAlign: "center",
    fontWeight: 500,
    fontSize: "18px",
    color: "#fff",
  },
  button: {  
    textTransform: "none",
    width: "100px",
    padding: "16px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.4rem",
    fontSize: "15px",
    fontWeight: 400,
    marginBottom: "32.5px",
    color: "rgba(239,250,251,.72)",
    background: "#12171D",
    transition: "all .3s ease",
    fontFamily: "Rubik",
    border: "1px solid #161D26",
    flexGrow: 1
  },
  selected: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
  selectorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "40px",
  },
  selectorBox: {
    width: "100%",
    maxWidth: "286px",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-betweew",
    alignItems: "center",
    borderRadius: "12px",
    background: "#0D1116",
    cursor: "pointer",
    textDecoration: "none",
    border: "1px solid #161D26",
  },
  selectorIcon: {
    width: "144px",
    height: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFC440",
    borderRadius: "12px",
  },
  selectorSpan: {
    fontWeight: 500,
    fontSize: "32px",
    color: "#929292",
    marginTop: "60px",
    textTransform: "none",
  }
}));

const DepositPage = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.robloxUsername);
  const [gameCode, setGamecode] = useState("mm2");
  const [after, setAfter] = useState(false);
  const [start, setStart] = useState(true);
  const [privLink, setPrivlink] = useState("");
  const [botUsername, setBotusername] = useState("");
  const [openDeposit, setOpenDeposit] = useState(false);


  const fetchData = async () => {
    setLoading(true);
    // call to get mm2, psx, dahood, and adopt me

    // end code
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [])
  
  const getPrivateServerLink = async () => {
    try {
      const res = await createDepositSession(username, user._id, gameCode, localStorage.getItem('token'));
      console.log(res)
      if(res.error) throw new Error(res.reason);

      setPrivlink(res.link)
      setBotusername(res.botusername)

      setAfter(true);
    } catch (error) {
      addToast("There was an error creating deposit: " + error, { appearance: "error" });
      setAfter(false)
    }
  }

  const handleInputChange = event => {
    setUsername(event.target.value);
  };

  return (
    <div className={classes.root}>
      {!user ? (
        <div style={{color: "#fff"}}>Please login to deposit.</div>
      ) : (
      <div>
        <Deposit handleClose={() => setOpenDeposit(!openDeposit)} open={openDeposit} user={user}/>
        <div style={{display:start?"":"none"}} className={classes.depositContainer}>
          <h1 className={classes.titleNick}>Deposit more balance</h1>
          <h2 className={classes.description}>Do you want to deposit with crypto or items?</h2>
          <div className={classes.selectorContainer}> 
            <div className={classes.selectorBox} onClick={() => setOpenDeposit(!openDeposit)}>
              <div className={classes.selectorIcon} >
                <img src="https://starpets.gg/img/cash-icon.15cb32df.svg" />
              </div>
              <span className={classes.selectorSpan}>Other</span>
            </div>
            <div className={classes.selectorBox} onClick={() => setStart(!start)}>
              <div className={classes.selectorIcon} >
                <img src="https://starpets.gg/img/deposit-icon.6de8b97e.svg" />
              </div>
              <span className={classes.selectorSpan}>Items</span>
            </div>
          </div>
        </div>
        <div style={{display:start||after?"none":""}} className={classes.depositContainer}>
          <h1 className={classes.titleNick}>Current Game Nickname</h1>
          <h2 className={classes.description}>Your current roblox account link is below, you must deposit from this account. 
          <br />
          <span style={{cursor: "pointer", color: "#FFC440"}} onClick={async () => {await unlinkRobloxUsername(user?.robloxUsername, user?._id); window.location.reload()}}>Click here</span> to remove the link to this account!
          </h2>
          <div style={{gap: "0.75rem"}} className={classes.inputContainer}>
            <Button className={`${classes.button} ${
              gameCode === "mm2" ? classes.selected : ""
            }`} style={{ fontSize: "0.7rem" }}
            onClick={() => setGamecode("mm2")}>MM2</Button>
            <Button className={`${classes.button} ${
              gameCode === "psx" ? classes.selected : ""
            }`} style={{ fontSize: "0.7rem", pointerEvents: "none", opacity: 0.25 }}
            onClick={() => setGamecode("psx")}>PSX</Button>
            <Button className={`${classes.button} ${
              gameCode === "dahood" ? classes.selected : ""
            }`} style={{ fontSize: "0.7rem", pointerEvents: "none", opacity: 0.25 }}
            onClick={() => setGamecode("dahood")}>Dahood</Button>
            <Button className={`${classes.button} ${
              gameCode === "adoptme" ? classes.selected : ""
            }`} style={{ fontSize: "0.7rem" }}
            onClick={() => setGamecode("adoptme")}>Adopt Me</Button>
          </div>
          <div className={classes.inputContainer}>
            <div className={classes.imgContainer}>
              <img src="https://starpets.gg/img/users.2d01a1f6.svg" />
            </div>
            <div className={classes.userInputContainer}>
              <div className={classes.userInputContainer2}>
                <a href={"https://www.roblox.com/users/profile?username=" + user?.robloxUsername} target="_blank" rel="noreferrer">
                  <input
                    className={classes.nameInput}
                    type="text"
                    placeholder="In-game Nickname"
                    value={username}
                    disabled={true}
                    onChange={handleInputChange}
                  />
                </a>
              </div>        
            </div>    
          </div>
          <div 
            className={classes.depositButton}
            style={{
              cursor: username ? "pointer" : "not-allowed",
              opacity: username ? 1 : 0.75,
              pointerEvents: username ? "all" : "none",
            }}
            onClick={() => getPrivateServerLink()}
          >
            Deposit
            <img style={{marginLeft:"7px"}} src="https://starpets.gg/img/right-arrow.90646259.svg" />
          </div>
          <div style={{marginTop: "19px"}}>
            <p className={classes.para}>
              Read an <span style={{color:"#FFC440",cursor:"pointer"}}>{/*<a href="/depositguide">*/}deposit guide{/*</a>*/}</span>
            </p>
          </div>
        </div>
        <div style={{display:after?"":"none"}} className={classes.depositContainer}>
          <h1 className={classes.titleNick}>Bot Name: <span style={{color:"#FFC440"}}>{botUsername}</span></h1>
          <br />
          <h2 className={classes.description}><a style={{ textDecoration: "none" }} href={privLink} target="_blank" rel="noreferrer"><span style={{color:"#FFC440",cursor:"pointer"}}>Click here</span></a> to join private server.</h2>
          <h2 className={classes.description} style={{marginTop: "19px"}}><b>Only</b> trade with the bot username listed.</h2>
          <div style={{marginTop: "19px"}}>
            <p className={classes.para}>
              <span style={{color:"#929292", fontSize: "0.75rem"}}>By depositing you agree to our <a href="/terms" target="_blank" rel="noreferrer"><span style={{cursor:"pointer",}}>TOS</span></a></span>
            </p>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

DepositPage.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(DepositPage);