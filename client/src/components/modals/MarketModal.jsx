import React, { useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Components
import Growtopia from "./withdraw/Growtopia";
import Litecoin from "./withdraw/Litecoin";
import Ethereum from "./withdraw/Ethereum";
import Bitcoin from "./withdraw/Bitcoin";
import SkinsBackWithdrawModalCSGO from "./withdraw/SkinsBackWithdrawModalCSGO";
import SkinsBackWithdrawModalRUST from "./withdraw/SkinsBackWithdrawModalRUST";
import SkinsBackWithdrawModalDOTA2 from "./withdraw/SkinsBackWithdrawModalDOTA2";
import WithdrawMM2 from "./withdraw/MM2";

// Assets
import growtopia from "../../assets/dl-2a39d38a.webp";

import bitcoin from "../../assets/btcdepwith.svg";
import ethereum from "../../assets/ethdepwith.svg";
import litecoin from "../../assets/ltcdepwith.svg";
import rust from "../../assets/rust.jpg";
import dota2 from "../../assets/dota2.png";
import { useEffect } from "react";
import { tryGetMarketItemsCSGO, tryGetMarketItemsRUST, tryGetMarketItemsDOTA2 } from "../../services/api.service";

const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 300,
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      background: "#12171D",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "80px",
        maxHeight: "80%",
      },
    },
    "& .MuiFormLabel-root.Mui-disabled": {
      color: "#3a3f64",
    },
    "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
      background: "#12171D",
    },
    "& .MuiFormHelperText-root.Mui-disabled": {
      color: "#4960ed",
    },
  },
  cryptos: {
    [theme.breakpoints.down("sm")]: {
      fontSize: 12,
      minWidth: 0,
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#e38b08",
      borderRadius: "6px",
      "& img": {
        width: "5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#3f51b5",
      borderRadius: "6px",
      margin: "0 10px",
      "& img": {
        width: "5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#e3e3e3",
      borderRadius: "6px",
      "& img": {
        width: "5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
  },
  crypto: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      height: "3rem",
      padding: "0",
      minWidth: 0,
    },
    "&:hover": {
      transform: "scale(1.06)",
      transition: "400ms all",
    },
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 300,
  },
  mobile: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
    },
  },
  ferzBz: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    gap: "16px",
  },
  bHNrGF: {
    width: "150px",
    height: "54px",
    marginTop: "10px",
    display: "flex",
    flexDirection: "row",
    borderRadius: "3px",
    backgroundColor: "#0D1116",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s",
    cursor: "pointer",
    [theme.breakpoints.down("xs")]: {
      width: "140px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "140px",
    },
    [theme.breakpoints.down("md")]: {
      width: "140px",
    },
  },
  iconHold: {
    width: "64px",
    height: "54px",
    display: "flex",
    WebkitBoxAlign: "center",
    alignItems: "center",
    WebkitBoxPack: "center",
    justifyContent: "center",
    backgroundColor: "rgb(24 29 36)",
    borderRadius: "2px 0px 0px 2px",
    marginDottom: "8px",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s",
  },
  info: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    WebkitBoxPack: "center",
    justifyContent: "center",
    WebkitBoxAlign: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: 300,
  },
  title: {
    color: "rgb(255, 255, 255)",
  },
  BoxAll: {
    [theme.breakpoints.down("xs")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "0rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0rem",
    },
  },
}));

const Market = ({ open, handleClose, user }) => {
  // Declare State
  const classes = useStyles();
  const [crypto, setCrypto] = useState("null");
  const [openSkinsBackCSGO, setOpenSkinsBackCSGO] = useState(false);
  const [openSkinsBackRUST, setOpenSkinsBackRUST] = useState(false);
  const [openSkinsBackDOTA2, setOpenSkinsBackDOTA2] = useState(false);
  const [openSkinsBackMM2, setOpenSkinsBackMM2] = useState(false);
  const [withItemsCSGO, setWithItemsCSGO] = useState([]);
  const [withItemsRUST, setWithItemsRUST] = useState([]);
  const [withItemsDOTA2, setWithItemsDOTA2] = useState([]);
  const [withItemsMM2, setWithItemsMM2] = useState([]);

  // Call setCrypto("dls") when the component renders
  React.useEffect(() => {
    setCrypto("dls");
    console.log("pressed");
  }, []); // The empty dependency array ensures this effect runs only once, similar to componentDidMount

  const [lastPressTimeCSGO, setLastPressTimeCSGO] = useState(
    Number(localStorage.getItem("lastPressTimeCSGO")) || null
  );

  const [lastPressTimeRUST, setLastPressTimeRUST] = useState(
    Number(localStorage.getItem("lastPressTimeRUST")) || null
  );

  const [lastPressTimeDOTA2, setLastPressTimeDOTA2] = useState(
    Number(localStorage.getItem("lastPressTimeDOTA2")) || null
  );

  const [lastPressTimeMM2, setLastPressTimeMM2] = useState(
    Number(localStorage.getItem("lastPressTimeMM2")) || null
  );

  // Button onClick skinsback csgo
  const onClickSkinsBackCSGO = () => {
    setCrypto("null");
    setOpenSkinsBackCSGO(true)
    setOpenSkinsBackRUST(false)
    setOpenSkinsBackDOTA2(false)
  };

  // Button onClick skinsback rust
  const onClickSkinsBackRUST = () => {
    setCrypto("null");
    setOpenSkinsBackRUST(true)
    setOpenSkinsBackDOTA2(false)
    setOpenSkinsBackCSGO(false)
  };

  // Button onClick skinsback dota2
  const onClickSkinsBackDOTA2 = () => {
    setCrypto("null");
    setOpenSkinsBackRUST(false)
    setOpenSkinsBackDOTA2(true)
    setOpenSkinsBackCSGO(false)
  };

  const onClickSkinsBackMM2 = () => {
    setCrypto("null");
    setOpenSkinsBackRUST(false)
    setOpenSkinsBackDOTA2(false)
    setOpenSkinsBackCSGO(false)
    setOpenSkinsBackMM2(true)
  };


  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const currentTime = new Date().getTime();
      if (lastPressTimeCSGO && currentTime - lastPressTimeCSGO < 25000) {

      }
      else {
        try {
          let items = await tryGetMarketItemsCSGO(user._id);
          setWithItemsCSGO(items);
          setLastPressTimeCSGO(currentTime);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (openSkinsBackCSGO) {
      fetchData();
    }
  }, [openSkinsBackCSGO, user, lastPressTimeCSGO]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const currentTime = new Date().getTime();
      if (lastPressTimeRUST && currentTime - lastPressTimeRUST < 25000) {

      }
      else {
        try {
          let items = await tryGetMarketItemsRUST(user._id);
          setWithItemsRUST(items);
          setLastPressTimeRUST(currentTime);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (openSkinsBackRUST) {
      fetchData();
    }
  }, [openSkinsBackRUST, user, lastPressTimeRUST]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const currentTime = new Date().getTime();
      if (lastPressTimeDOTA2 && currentTime - lastPressTimeDOTA2 < 25000) {

      }
      else {
        try {
          let items = await tryGetMarketItemsDOTA2(user._id);
          setWithItemsDOTA2(items);
          setLastPressTimeDOTA2(currentTime);
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (openSkinsBackDOTA2) {
      fetchData();
    }
  }, [openSkinsBackDOTA2, user, lastPressTimeDOTA2]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <SkinsBackWithdrawModalCSGO
        handleClose={() => setOpenSkinsBackCSGO(!openSkinsBackCSGO)}
        open={openSkinsBackCSGO}
        withItems={withItemsCSGO}
      />
      <SkinsBackWithdrawModalRUST
        handleClose={() => setOpenSkinsBackRUST(!openSkinsBackRUST)}
        open={openSkinsBackRUST}
        withItems={withItemsRUST}
      />
      <SkinsBackWithdrawModalDOTA2
        handleClose={() => setOpenSkinsBackDOTA2(!openSkinsBackDOTA2)}
        open={openSkinsBackDOTA2}
        withItems={withItemsDOTA2}
      />
      <WithdrawMM2
        handleClose={() => setOpenSkinsBackMM2(!openSkinsBackMM2)}
        open={openSkinsBackMM2}
        withItems={withItemsMM2}
      />
      <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
        <svg style={{ marginRight: "10px", marginBottom: "-3px", }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.85 3.9498V7.7498H13.35V3.9498C13.35 3.6798 13.11 3.5498 12.95 3.5498C12.9 3.5498 12.85 3.5598 12.8 3.5798L4.87 6.56981C4.34 6.7698 4 7.2698 4 7.8398V8.5098C3.09 9.1898 2.5 10.2798 2.5 11.5098V7.8398C2.5 6.6498 3.23 5.5898 4.34 5.1698L12.28 2.1698C12.5 2.0898 12.73 2.0498 12.95 2.0498C13.95 2.0498 14.85 2.8598 14.85 3.9498Z" fill="#FFC440" />
          <path d="M21.4997 14.5V15.5C21.4997 15.77 21.2897 15.99 21.0097 16H19.5497C19.0197 16 18.5397 15.61 18.4997 15.09C18.4697 14.78 18.5897 14.49 18.7897 14.29C18.9697 14.1 19.2197 14 19.4897 14H20.9997C21.2897 14.01 21.4997 14.23 21.4997 14.5Z" fill="#FFC440" />
          <path d="M5 15C4.06 15 3.19 15.33 2.5 15.88C1.58 16.61 1 17.74 1 19C1 19.75 1.21 20.46 1.58 21.06C2.27 22.22 3.54 23 5 23C6.01 23 6.93 22.63 7.63 22C7.94 21.74 8.21 21.42 8.42 21.06C8.79 20.46 9 19.75 9 19C9 16.79 7.21 15 5 15ZM3.42 18.46C3.13 18.17 3.13 17.69 3.42 17.4C3.72 17.11 4.19 17.11 4.49 17.4L5.01 17.93L5.51 17.42C5.81 17.13 6.28 17.13 6.58 17.42C6.87 17.72 6.87 18.19 6.58 18.49L6.07 18.99L6.6 19.51C6.89 19.81 6.89 20.28 6.6 20.58C6.45 20.72 6.26 20.79 6.07 20.79C5.88 20.79 5.69 20.72 5.54 20.58L5.01 20.05L4.46 20.6C4.31 20.75 4.12 20.82 3.93 20.82C3.74 20.82 3.55 20.75 3.4 20.6C3.11 20.31 3.11 19.83 3.4 19.54L3.95 18.99L3.42 18.46Z" fill="#FFC440" />
          <path d="M19.48 12.95H20.5C21.05 12.95 21.5 12.5 21.5 11.95V11.51C21.5 9.44 19.81 7.75 17.74 7.75H6.26C5.41 7.75 4.63 8.03 4 8.51C3.09 9.19 2.5 10.28 2.5 11.51V13.29C2.5 13.67 2.9 13.91 3.26 13.79C3.82 13.6 4.41 13.5 5 13.5C8.03 13.5 10.5 15.97 10.5 19C10.5 19.72 10.31 20.51 10.01 21.21C9.85 21.57 10.1 22 10.49 22H17.74C19.81 22 21.5 20.31 21.5 18.24V18.05C21.5 17.5 21.05 17.05 20.5 17.05H19.63C18.67 17.05 17.75 16.46 17.5 15.53C17.3 14.77 17.54 14.03 18.04 13.55C18.41 13.17 18.92 12.95 19.48 12.95ZM14 12.75H9C8.59 12.75 8.25 12.41 8.25 12C8.25 11.59 8.59 11.25 9 11.25H14C14.41 11.25 14.75 11.59 14.75 12C14.75 12.41 14.41 12.75 14 12.75Z" fill="#FFC440" />
        </svg>
        <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Withdraw</span>
      </DialogTitle>
      
      <DialogContent className={classes.cryptos} dividers>
        <Box display="flex" className={classes.BoxAll}>
          <div>

       { /*    <div className={classes.bHNrGF} onClick={() => setCrypto("dls")}>
                <div className={classes.iconHold}><img width="32px" height="32px" src={growtopia} alt="dls" /></div>
                <div className={classes.info}><div className={classes.title}>Diamond Lock</div></div>
              </div>*/}

             { /* <div>Cryptocurrencies</div>
            <div className={classes.ferzBz}>


              <div className={classes.bHNrGF} onClick={() => setCrypto("btc")}>
                <div className={classes.iconHold}><img width="32px" height="32px" src={bitcoin} alt="BTC" /></div>
                <div className={classes.info}><div className={classes.title}>Bitcoin</div></div>
              </div>
              <div className={classes.bHNrGF} onClick={() => setCrypto("eth")}>
                <div className={classes.iconHold}><img width="32px" height="32px" src={ethereum} alt="ETH" /></div>
                <div className={classes.info}><div className={classes.title}>Ethereum</div></div>
              </div>
              <div className={classes.bHNrGF} onClick={() => setCrypto("ltc")}>
                <div className={classes.iconHold}><img width="32px" height="32px" src={litecoin} alt="ETH" /></div>
                <div className={classes.info}><div className={classes.title}>Litecoin</div></div>
              </div>
  </div>*/}

          {/*<div style={{ borderBottom: "1px solid #161D26", }}></div>
            <br />
            <div>Game Items</div>
            <div className={classes.ferzBz}>
              <div className={classes.bHNrGF} onClick={onClickSkinsBackCSGO}>
                <div className={classes.iconHold}><svg width="26" height="16" viewBox="0 0 26 16" fill="none" style={{ width: "32px", height: "unset", }}><path d="M18.5805 0.651121C18.1256 0.883585 17.8413 1.55585 18.0056 2.02706C18.094 2.28465 18.0498 2.3412 17.835 2.25952C17.3675 2.0836 16.8179 2.46057 16.5588 3.12655C16.4514 3.40927 16.4135 3.62917 16.4135 4.07525L16.4072 4.65955H16.1798C15.8765 4.65955 15.8007 4.7538 15.8007 5.13076C15.8007 5.31297 15.7691 5.62082 15.7249 5.81559C15.6491 6.21141 15.687 6.29308 15.9776 6.29308C16.1545 6.29308 16.1545 6.33706 15.9776 6.47529C15.8513 6.58209 15.8449 6.60722 15.9018 7.29205C15.9523 7.92033 15.946 8.00829 15.8576 8.05855C15.7502 8.1151 15.6554 8.41039 15.7312 8.45437C15.7565 8.47322 15.7691 8.59259 15.7628 8.72453C15.7565 8.85647 15.7755 8.99469 15.807 9.03239C15.8386 9.07009 15.826 9.31511 15.7691 9.62925C15.7186 9.91826 15.6744 10.3266 15.6744 10.534C15.6681 10.8104 15.6302 10.9738 15.5291 11.1434C15.4533 11.2691 15.308 11.5015 15.2132 11.6649C15.1121 11.822 15.0173 12.0607 14.9984 12.1864C14.9794 12.312 14.891 12.557 14.8025 12.733C14.6762 12.9843 14.6572 13.1036 14.6825 13.3738C14.7078 13.6188 14.6762 13.8639 14.5625 14.2848C14.474 14.6178 14.4108 14.9885 14.4235 15.1518L14.4424 15.4346H14.9794H15.5164L15.4975 15.2147C15.4912 15.0953 15.4659 14.8503 15.4469 14.6806C15.409 14.3225 15.6175 13.644 15.7691 13.644C15.8134 13.644 15.9144 13.4869 15.9839 13.2984C16.0597 13.1036 16.1798 12.8335 16.2493 12.689C16.3251 12.5445 16.3883 12.2994 16.4009 12.1424C16.4199 11.8031 16.4767 11.646 16.6347 11.4764C16.9505 11.1371 17.1274 10.8795 17.1274 10.7602C17.1274 10.5465 17.4938 9.65439 17.6328 9.52873C17.7023 9.4659 17.7592 9.37794 17.7592 9.32768C17.7592 9.19574 17.8603 9.23344 17.9361 9.39679C17.974 9.47847 18.0751 9.56014 18.1825 9.57899C18.3151 9.60412 18.4415 9.73606 18.7068 10.1319C19.1427 10.779 19.1807 10.8167 19.4018 10.8167C19.5029 10.8167 19.6039 10.8481 19.6292 10.8921C19.6987 10.9989 19.6608 11.4576 19.5787 11.5518C19.4839 11.6649 19.5597 12.5696 19.6924 13.0157C19.8187 13.4304 19.8314 14.1026 19.7176 14.6304C19.6671 14.8503 19.6482 15.0388 19.6734 15.0639C19.6924 15.089 19.8756 15.1141 20.0778 15.1204C20.2799 15.1267 20.6274 15.1644 20.8548 15.2084C21.0823 15.2461 21.4171 15.2587 21.6003 15.2398C21.8909 15.2021 21.9288 15.1833 21.9288 15.0576C21.9288 14.888 21.8341 14.8 21.5371 14.6932C21.4108 14.6555 21.196 14.4796 21.0507 14.3099L20.7853 14.0021L20.8169 13.4932C20.9243 11.9099 20.9433 11.5455 20.9433 10.9612C20.9496 10.4272 20.9306 10.3015 20.8422 10.2387C20.7853 10.1947 20.6653 9.97481 20.5832 9.74863C20.3557 9.14548 20.0778 8.62401 19.7808 8.24704C19.3575 7.71928 19.3007 7.31718 19.6608 7.39258C19.8187 7.43027 19.8503 7.40514 19.964 7.18524C20.0588 6.99676 20.0904 6.78943 20.1093 6.26795C20.1283 5.60826 20.122 5.58941 19.9704 5.46375C19.8377 5.35695 19.7871 5.14333 19.8756 5.04909C19.8819 5.03652 20.0714 5.13076 20.2926 5.25014C20.8232 5.53915 21.3097 5.64595 21.5055 5.5203C21.872 5.28155 22.0362 5.06794 22.0804 4.76008C22.1183 4.5339 22.1626 4.44594 22.251 4.42709C22.3584 4.39568 22.3647 4.3517 22.3331 3.97473C22.3016 3.56634 22.3016 3.56006 22.529 3.32131L22.7564 3.08885H23.4135C23.881 3.08885 24.0768 3.06372 24.0958 3.00717C24.1147 2.95063 24.3548 2.93178 25.0434 2.93806C25.9089 2.94435 25.9721 2.93178 25.9721 2.82497C25.9721 2.71188 25.9279 2.71188 25.2456 2.74958C24.5317 2.79356 24.519 2.79356 24.519 2.65534C24.519 2.57994 24.4811 2.5234 24.4243 2.5234C24.3548 2.5234 24.3295 2.45429 24.3295 2.27209C24.3295 2.13386 24.3042 2.02077 24.2663 2.02077C24.2347 2.02077 24.2032 2.14643 24.2032 2.3035C24.2032 2.46057 24.1779 2.58623 24.14 2.58623C24.1084 2.58623 24.0768 2.55481 24.0768 2.5234C24.0768 2.4857 23.5082 2.46057 22.4974 2.46057C21.4866 2.46057 20.918 2.43544 20.918 2.39774C20.918 2.36005 20.8738 2.33491 20.8232 2.33491C20.7727 2.33491 20.7285 2.27837 20.7285 2.20926C20.7285 2.14015 20.7032 2.0836 20.6653 2.0836C20.6337 2.0836 20.6021 2.14643 20.6021 2.22811C20.6021 2.34748 20.5516 2.38518 20.3178 2.448C19.8819 2.5611 19.844 2.55481 19.844 2.3035C19.844 2.15271 19.8756 2.0836 19.9324 2.0836C20.2041 2.0836 20.2926 1.71292 20.1472 1.17888C20.0841 0.927565 20.0398 0.883585 19.6924 0.707666C19.2312 0.475203 18.9595 0.462637 18.5805 0.651121Z" fill="#33C16C"></path><path d="M1.5982 2.37234C1.33918 2.498 1.22546 2.60481 1.08015 2.8624L0.890625 3.18283V4.85406V6.53157L1.06752 6.86455C1.21282 7.13472 1.30759 7.23524 1.58556 7.37975L1.92672 7.55566L3.8915 7.53682L5.8626 7.51797L6.1153 7.34833C6.3996 7.15985 6.62071 6.85199 6.67757 6.55041L6.71548 6.35565H4.52958H2.34368V4.87919V3.40273H4.52958H6.71548L6.67757 3.19539C6.62071 2.9001 6.3301 2.52313 6.03949 2.37234C5.79942 2.24669 5.67307 2.24041 3.85991 2.22156L1.93303 2.20271L1.5982 2.37234Z" fill="#33C16C"></path><path d="M8.50305 2.32879C7.91551 2.60523 7.71967 2.9822 7.71335 3.84295C7.71335 4.54662 7.8397 4.87333 8.23771 5.18747L8.4841 5.38224L10.4362 5.40108L12.3884 5.41993V5.91627V6.4189H10.0446H7.70703L7.75125 6.55712C7.87761 6.97179 8.1619 7.29221 8.54728 7.44928C8.74312 7.53096 9.10323 7.5498 10.6637 7.5498C11.8451 7.5498 12.6411 7.52467 12.799 7.48069C13.1276 7.38645 13.5508 6.9655 13.6456 6.6388C13.6835 6.50058 13.7151 6.14874 13.7151 5.85345C13.7151 5.2503 13.6014 4.92987 13.2981 4.64715C12.9254 4.30159 12.8054 4.28274 10.8406 4.28274H9.04005V3.81153V3.34032H11.3207H13.6014L13.5572 3.1644C13.4877 2.88168 13.2729 2.58639 13.0012 2.41047L12.7485 2.24083L10.7521 2.22198C8.90738 2.20942 8.7368 2.2157 8.50305 2.32879Z" fill="#33C16C"></path><path d="M1.74982 8.96382C1.38972 9.08947 1.20019 9.24654 1.03593 9.56068C0.896943 9.82456 0.890625 9.88111 0.890625 11.5209C0.890625 12.9031 0.909578 13.2487 0.985389 13.4435C1.11174 13.7388 1.30127 13.9398 1.5982 14.0906C1.813 14.2037 1.98989 14.21 3.90413 14.21C6.2227 14.21 6.3301 14.1911 6.65862 13.7639C6.88606 13.4623 6.90501 13.3304 6.91764 12.168L6.92396 11.1314H4.95286C2.73537 11.1314 2.82382 11.1125 3.18392 11.5837C3.46822 11.9544 3.65143 12.0047 4.79492 12.0047L5.7552 12.011V12.5764V13.1419H3.8915H2.0278V11.5398V9.93765H4.46009C6.6144 9.93765 6.89237 9.92509 6.89237 9.84341C6.89237 9.53555 6.41855 9.04549 6.02686 8.93869C5.64148 8.83188 2.05939 8.85073 1.74982 8.96382Z" fill="#33C16C"></path><path d="M8.91323 8.92612C8.57208 9.03293 8.33833 9.19628 8.16775 9.44759L7.99717 9.70519L7.97822 11.4078C7.95295 13.2424 7.97822 13.4372 8.26251 13.7764C8.6163 14.1911 8.7237 14.21 10.8906 14.21C12.6975 14.21 12.8554 14.2037 13.0765 14.0843C13.3798 13.9335 13.6262 13.6445 13.7146 13.3429C13.7652 13.1921 13.7778 12.5199 13.7652 11.4141C13.7462 9.76173 13.7399 9.71147 13.6009 9.47901C13.5188 9.35335 13.3166 9.16487 13.1587 9.07062L12.8617 8.90099L10.9665 8.88842C9.92405 8.88214 9.00168 8.90099 8.91323 8.92612ZM12.6406 11.5398V13.2047H10.8717H9.10276V11.5398V9.87482H10.8717H12.6406V11.5398Z" fill="#33C16C"></path></svg></div>
                <div className={classes.info}><div className={classes.title}>CS:GO</div></div>
              </div>
              <div className={classes.bHNrGF} onClick={onClickSkinsBackRUST}>
                <div className={classes.iconHold}><img width="26px" height="26px" src={rust} alt="Rust" /></div>
                <div className={classes.info}><div className={classes.title}>RUST</div></div>
              </div>
              <div className={classes.bHNrGF} onClick={onClickSkinsBackDOTA2}>
                <div className={classes.iconHold}><img width="27px" height="27px" src={dota2} alt="Dota2" /></div>
                <div className={classes.info}><div className={classes.title}>DOTA2</div></div>
              </div>
              <div className={classes.bHNrGF} onClick={onClickSkinsBackMM2}>
                <div className={classes.iconHold}><img width="27px" height="27px" src={dota2} alt="Dota2" /></div>
                <div className={classes.info}><div className={classes.title}>MM2</div></div>
              </div>
            </div>*/}
          </div>
        </Box>
        <Box display="flex" flexDirection="column">
  {crypto === "btc" ? (
    <Fragment>
      <Bitcoin />
    </Fragment>
  ) : crypto === "eth" ? (
    <Fragment>
      <Ethereum />
    </Fragment>
  ) : crypto === "ltc" ? (
    <Fragment>
      <Litecoin />
    </Fragment>
  ) : crypto === "dls" ? (
    <Fragment>
      <Growtopia />
    </Fragment>
  ) : null}
          
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleClose}
          className={classes.buttontest}
          color="primary"
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Market;