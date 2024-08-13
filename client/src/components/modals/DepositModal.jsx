import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core";

// service import
import { createDepositSession, unlinkRobloxUsername, getUserCryptoInformation, tryCreateOrderSkinsBack } from "../../services/api.service.js";
import growtopia from "../../assets/dl-2a39d38a.webp";

// MUI Components
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

// Components
import Growtopia from "./deposit/Growtopia";

import Litecoin from "./deposit/Litecoin";
import Ethereum from "./deposit/Ethereum";
import Bitcoin from "./deposit/Bitcoin";
import Dogecoin from "./deposit/Dogecoin";
import Usdt from "./deposit/Usdt";
import Usdc from "./deposit/Usdc";


import Coupon from "./CouponModal";

import SkinsBackDeposit from "./deposit/SkinsBackDepositModal";

// Assets
import bitcoin from "../../assets/btcdepwith.svg";
import ethereum from "../../assets/ethdepwith.svg";
import litecoin from "../../assets/ltcdepwith.svg";
import doge from "../../assets/dogecoin.webp";
import usdt from "../../assets/usdt.webp";
import usdc from "../../assets/usdc.webp";

// Custom Styles
const useStyles = makeStyles(theme => ({
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 500,
    },
    "& .MuiDialog-paperWidthSm": {
      width: "50%",
      background: "#12171D", //#12171D
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
    },
    "& div:nth-child(1)": {
      position: "relative",
    },
    "& button:nth-child(1)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(2)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      margin: "0 14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(3)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      marginRight: "14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(4)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      marginRight: "14px",
      "& img": {
        width: "3.5rem",
        [theme.breakpoints.down("sm")]: {
          width: "1rem",
        },
      },
    },
    "& button:nth-child(5)": {
      backgroundColor: "#0D1116",
      borderRadius: "50%",
      boxShadow: "none",
      "& img": {
        width: "7rem",
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
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  desktop: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
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
    padding: "2rem",
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
  x:{
    backgroundColor: "#151719"
  }
}));

const Deposit = ({ open, handleClose, user }) => {
  // Declare State
  const classes = useStyles();

  const [crypto, setCrypto] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCoupon, setOpenCoupon] = useState(false);
  const [openSkinsBack, setOpenSkinsBack] = useState(false);
  const [sbIframeUrl, setSbIframeUrl] = useState("");

  const openn = Boolean(anchorEl);

  // Button onClick skinsback
  const onClickSkinsBack = () => {
    setCrypto("");
    setOpenSkinsBack(!openSkinsBack)
  };

  // Button onClick coupon
  const onClickCoupon = () => {
    setCrypto("");
    setOpenCoupon(!openCoupon)
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        let order_data = await tryCreateOrderSkinsBack(user._id);
        setSbIframeUrl(`https://skinsback.com/pay?hash=${order_data.hash}`);
      } catch (e) {
        console.log(e);
      }
    }
    if (openSkinsBack) {
      fetchData();
    }
  }, [openSkinsBack, user]);

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <Coupon
        handleClose={() => setOpenCoupon(!openCoupon)}
        open={openCoupon}
      />
      <SkinsBackDeposit
        handleClose={() => setOpenSkinsBack(!openSkinsBack)}
        open={openSkinsBack}
        url={sbIframeUrl}
      />

      {!crypto ? (
      <div>
        <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
          <svg style={{ marginRight: "10px", marginBottom: "-3px", }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.25864 21.2448C8.90561 20.5978 9.27728 19.7719 9.37364 18.9184C9.50441 17.7828 9.12586 16.6058 8.25864 15.7386C7.74244 15.2224 7.10923 14.8783 6.44161 14.72C5.16831 14.3965 3.75736 14.7337 2.75248 15.7386C2.05733 16.4338 1.67878 17.3216 1.6306 18.237C1.59619 18.6294 1.6306 19.0354 1.73385 19.4277C1.89215 20.0954 2.23628 20.7286 2.75248 21.2448C4.27356 22.7659 6.73756 22.7659 8.25864 21.2448ZM6.96469 17.7759C7.36389 17.7759 7.69426 18.1063 7.69426 18.5055C7.68738 18.9115 7.36389 19.235 6.95781 19.2419L6.23513 19.235L6.24201 19.9302C6.23513 20.3363 5.91164 20.6597 5.50556 20.6666C5.09948 20.6597 4.776 20.3363 4.76911 19.9302L4.776 19.235L4.05331 19.2419C3.64723 19.235 3.32375 18.9115 3.31686 18.5055C3.32375 18.3059 3.40634 18.1269 3.53711 17.9961C3.66788 17.8654 3.84683 17.7828 4.04643 17.7759L4.776 17.7759L4.776 17.0188C4.776 16.8123 4.85859 16.6334 4.98936 16.5026C5.12013 16.3718 5.29908 16.2892 5.50556 16.2892C5.90476 16.2892 6.23513 16.6196 6.23513 17.0188L6.23513 17.7759L6.96469 17.7759Z" fill="#FFC440" />
            <path d="M15.0942 3.84548V7.54425H13.6342V3.84548C13.6342 3.58267 13.4006 3.45613 13.2449 3.45613C13.1962 3.45613 13.1475 3.46587 13.0989 3.48533L5.38011 6.39568C4.86422 6.59035 4.53328 7.07703 4.53328 7.63185V8.284C3.64752 8.94589 3.07324 10.0068 3.07324 11.2041V7.63185C3.07324 6.47355 3.7838 5.44179 4.86422 5.03298L12.5927 2.1129C12.8068 2.03503 13.0307 1.99609 13.2449 1.99609C14.2182 1.99609 15.0942 2.78452 15.0942 3.84548Z" fill="#FFC440" />
            <path d="M21.5681 14.1151V15.0885C21.5681 15.3513 21.3637 15.5654 21.0911 15.5751H19.67C19.1542 15.5751 18.6869 15.1955 18.648 14.6894C18.6188 14.3876 18.7356 14.1054 18.9303 13.9107C19.1055 13.7258 19.3488 13.6284 19.6116 13.6284H21.0814C21.3637 13.6382 21.5681 13.8523 21.5681 14.1151Z" fill="#FFC440" />
            <path d="M19.6009 12.6049H20.5937C21.1291 12.6049 21.5671 12.1669 21.5671 11.6316V11.2033C21.5671 9.18844 19.9221 7.54346 17.9073 7.54346H6.73308C5.90572 7.54346 5.1465 7.816 4.53328 8.28321C3.64752 8.9451 3.07324 10.0061 3.07324 11.2033V12.9359C3.07324 13.3057 3.46259 13.5394 3.813 13.4226C4.35808 13.2376 4.93236 13.1403 5.50664 13.1403C8.45592 13.1403 10.8601 15.5445 10.8601 18.4938C10.8601 19.1946 10.6752 19.9635 10.3832 20.6449C10.2274 20.9953 10.4708 21.4138 10.8504 21.4138H17.9073C19.9221 21.4138 21.5671 19.7689 21.5671 17.754V17.5691C21.5671 17.0337 21.1291 16.5957 20.5937 16.5957H19.7469C18.8125 16.5957 17.917 16.0214 17.6736 15.1162C17.479 14.3764 17.7126 13.6562 18.1993 13.1889C18.5594 12.8191 19.0558 12.6049 19.6009 12.6049ZM14.2669 12.4103H9.40008C9.00101 12.4103 8.67006 12.0793 8.67006 11.6802C8.67006 11.2812 9.00101 10.9502 9.40008 10.9502H14.2669C14.666 10.9502 14.9969 11.2812 14.9969 11.6802C14.9969 12.0793 14.666 12.4103 14.2669 12.4103Z" fill="#FFC440" />
          </svg><span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Deposit</span>
        </DialogTitle>
        <DialogContent className={classes.cryptos} dividers>
          <Box
            open={openn}
            onClose={() => setAnchorEl(null)}
            display="flex"
            className={classes.BoxAll}
          >
            <div>
              <div className={classes.ferzBz}>
              <div className={classes.bHNrGF} onClick={() => setCrypto("growtopia")}>
                  <div className={classes.iconHold}><img width="32px" height="32px" src={growtopia} alt="Diamond Lock" /></div>
                  <div className={classes.info}><div className={classes.title}>Diamond Lock</div></div>
                </div>
                
              </div>
              <br />
              {/*<div style={{ borderBottom: "1px solid #161D26", }}></div>
              <br />
              <div>Game Items</div>
              <div className={classes.ferzBz}>
                <div className={classes.bHNrGF} onClick={onClickSkinsBack} onClose={() => setAnchorEl(null)}>
                  <div className={classes.iconHold}><svg width="26" height="16" viewBox="0 0 26 16" fill="none" style={{ width: "32px", height: "unset", }}><path d="M18.5805 0.651121C18.1256 0.883585 17.8413 1.55585 18.0056 2.02706C18.094 2.28465 18.0498 2.3412 17.835 2.25952C17.3675 2.0836 16.8179 2.46057 16.5588 3.12655C16.4514 3.40927 16.4135 3.62917 16.4135 4.07525L16.4072 4.65955H16.1798C15.8765 4.65955 15.8007 4.7538 15.8007 5.13076C15.8007 5.31297 15.7691 5.62082 15.7249 5.81559C15.6491 6.21141 15.687 6.29308 15.9776 6.29308C16.1545 6.29308 16.1545 6.33706 15.9776 6.47529C15.8513 6.58209 15.8449 6.60722 15.9018 7.29205C15.9523 7.92033 15.946 8.00829 15.8576 8.05855C15.7502 8.1151 15.6554 8.41039 15.7312 8.45437C15.7565 8.47322 15.7691 8.59259 15.7628 8.72453C15.7565 8.85647 15.7755 8.99469 15.807 9.03239C15.8386 9.07009 15.826 9.31511 15.7691 9.62925C15.7186 9.91826 15.6744 10.3266 15.6744 10.534C15.6681 10.8104 15.6302 10.9738 15.5291 11.1434C15.4533 11.2691 15.308 11.5015 15.2132 11.6649C15.1121 11.822 15.0173 12.0607 14.9984 12.1864C14.9794 12.312 14.891 12.557 14.8025 12.733C14.6762 12.9843 14.6572 13.1036 14.6825 13.3738C14.7078 13.6188 14.6762 13.8639 14.5625 14.2848C14.474 14.6178 14.4108 14.9885 14.4235 15.1518L14.4424 15.4346H14.9794H15.5164L15.4975 15.2147C15.4912 15.0953 15.4659 14.8503 15.4469 14.6806C15.409 14.3225 15.6175 13.644 15.7691 13.644C15.8134 13.644 15.9144 13.4869 15.9839 13.2984C16.0597 13.1036 16.1798 12.8335 16.2493 12.689C16.3251 12.5445 16.3883 12.2994 16.4009 12.1424C16.4199 11.8031 16.4767 11.646 16.6347 11.4764C16.9505 11.1371 17.1274 10.8795 17.1274 10.7602C17.1274 10.5465 17.4938 9.65439 17.6328 9.52873C17.7023 9.4659 17.7592 9.37794 17.7592 9.32768C17.7592 9.19574 17.8603 9.23344 17.9361 9.39679C17.974 9.47847 18.0751 9.56014 18.1825 9.57899C18.3151 9.60412 18.4415 9.73606 18.7068 10.1319C19.1427 10.779 19.1807 10.8167 19.4018 10.8167C19.5029 10.8167 19.6039 10.8481 19.6292 10.8921C19.6987 10.9989 19.6608 11.4576 19.5787 11.5518C19.4839 11.6649 19.5597 12.5696 19.6924 13.0157C19.8187 13.4304 19.8314 14.1026 19.7176 14.6304C19.6671 14.8503 19.6482 15.0388 19.6734 15.0639C19.6924 15.089 19.8756 15.1141 20.0778 15.1204C20.2799 15.1267 20.6274 15.1644 20.8548 15.2084C21.0823 15.2461 21.4171 15.2587 21.6003 15.2398C21.8909 15.2021 21.9288 15.1833 21.9288 15.0576C21.9288 14.888 21.8341 14.8 21.5371 14.6932C21.4108 14.6555 21.196 14.4796 21.0507 14.3099L20.7853 14.0021L20.8169 13.4932C20.9243 11.9099 20.9433 11.5455 20.9433 10.9612C20.9496 10.4272 20.9306 10.3015 20.8422 10.2387C20.7853 10.1947 20.6653 9.97481 20.5832 9.74863C20.3557 9.14548 20.0778 8.62401 19.7808 8.24704C19.3575 7.71928 19.3007 7.31718 19.6608 7.39258C19.8187 7.43027 19.8503 7.40514 19.964 7.18524C20.0588 6.99676 20.0904 6.78943 20.1093 6.26795C20.1283 5.60826 20.122 5.58941 19.9704 5.46375C19.8377 5.35695 19.7871 5.14333 19.8756 5.04909C19.8819 5.03652 20.0714 5.13076 20.2926 5.25014C20.8232 5.53915 21.3097 5.64595 21.5055 5.5203C21.872 5.28155 22.0362 5.06794 22.0804 4.76008C22.1183 4.5339 22.1626 4.44594 22.251 4.42709C22.3584 4.39568 22.3647 4.3517 22.3331 3.97473C22.3016 3.56634 22.3016 3.56006 22.529 3.32131L22.7564 3.08885H23.4135C23.881 3.08885 24.0768 3.06372 24.0958 3.00717C24.1147 2.95063 24.3548 2.93178 25.0434 2.93806C25.9089 2.94435 25.9721 2.93178 25.9721 2.82497C25.9721 2.71188 25.9279 2.71188 25.2456 2.74958C24.5317 2.79356 24.519 2.79356 24.519 2.65534C24.519 2.57994 24.4811 2.5234 24.4243 2.5234C24.3548 2.5234 24.3295 2.45429 24.3295 2.27209C24.3295 2.13386 24.3042 2.02077 24.2663 2.02077C24.2347 2.02077 24.2032 2.14643 24.2032 2.3035C24.2032 2.46057 24.1779 2.58623 24.14 2.58623C24.1084 2.58623 24.0768 2.55481 24.0768 2.5234C24.0768 2.4857 23.5082 2.46057 22.4974 2.46057C21.4866 2.46057 20.918 2.43544 20.918 2.39774C20.918 2.36005 20.8738 2.33491 20.8232 2.33491C20.7727 2.33491 20.7285 2.27837 20.7285 2.20926C20.7285 2.14015 20.7032 2.0836 20.6653 2.0836C20.6337 2.0836 20.6021 2.14643 20.6021 2.22811C20.6021 2.34748 20.5516 2.38518 20.3178 2.448C19.8819 2.5611 19.844 2.55481 19.844 2.3035C19.844 2.15271 19.8756 2.0836 19.9324 2.0836C20.2041 2.0836 20.2926 1.71292 20.1472 1.17888C20.0841 0.927565 20.0398 0.883585 19.6924 0.707666C19.2312 0.475203 18.9595 0.462637 18.5805 0.651121Z" fill="#33C16C"></path><path d="M1.5982 2.37234C1.33918 2.498 1.22546 2.60481 1.08015 2.8624L0.890625 3.18283V4.85406V6.53157L1.06752 6.86455C1.21282 7.13472 1.30759 7.23524 1.58556 7.37975L1.92672 7.55566L3.8915 7.53682L5.8626 7.51797L6.1153 7.34833C6.3996 7.15985 6.62071 6.85199 6.67757 6.55041L6.71548 6.35565H4.52958H2.34368V4.87919V3.40273H4.52958H6.71548L6.67757 3.19539C6.62071 2.9001 6.3301 2.52313 6.03949 2.37234C5.79942 2.24669 5.67307 2.24041 3.85991 2.22156L1.93303 2.20271L1.5982 2.37234Z" fill="#33C16C"></path><path d="M8.50305 2.32879C7.91551 2.60523 7.71967 2.9822 7.71335 3.84295C7.71335 4.54662 7.8397 4.87333 8.23771 5.18747L8.4841 5.38224L10.4362 5.40108L12.3884 5.41993V5.91627V6.4189H10.0446H7.70703L7.75125 6.55712C7.87761 6.97179 8.1619 7.29221 8.54728 7.44928C8.74312 7.53096 9.10323 7.5498 10.6637 7.5498C11.8451 7.5498 12.6411 7.52467 12.799 7.48069C13.1276 7.38645 13.5508 6.9655 13.6456 6.6388C13.6835 6.50058 13.7151 6.14874 13.7151 5.85345C13.7151 5.2503 13.6014 4.92987 13.2981 4.64715C12.9254 4.30159 12.8054 4.28274 10.8406 4.28274H9.04005V3.81153V3.34032H11.3207H13.6014L13.5572 3.1644C13.4877 2.88168 13.2729 2.58639 13.0012 2.41047L12.7485 2.24083L10.7521 2.22198C8.90738 2.20942 8.7368 2.2157 8.50305 2.32879Z" fill="#33C16C"></path><path d="M1.74982 8.96382C1.38972 9.08947 1.20019 9.24654 1.03593 9.56068C0.896943 9.82456 0.890625 9.88111 0.890625 11.5209C0.890625 12.9031 0.909578 13.2487 0.985389 13.4435C1.11174 13.7388 1.30127 13.9398 1.5982 14.0906C1.813 14.2037 1.98989 14.21 3.90413 14.21C6.2227 14.21 6.3301 14.1911 6.65862 13.7639C6.88606 13.4623 6.90501 13.3304 6.91764 12.168L6.92396 11.1314H4.95286C2.73537 11.1314 2.82382 11.1125 3.18392 11.5837C3.46822 11.9544 3.65143 12.0047 4.79492 12.0047L5.7552 12.011V12.5764V13.1419H3.8915H2.0278V11.5398V9.93765H4.46009C6.6144 9.93765 6.89237 9.92509 6.89237 9.84341C6.89237 9.53555 6.41855 9.04549 6.02686 8.93869C5.64148 8.83188 2.05939 8.85073 1.74982 8.96382Z" fill="#33C16C"></path><path d="M8.91323 8.92612C8.57208 9.03293 8.33833 9.19628 8.16775 9.44759L7.99717 9.70519L7.97822 11.4078C7.95295 13.2424 7.97822 13.4372 8.26251 13.7764C8.6163 14.1911 8.7237 14.21 10.8906 14.21C12.6975 14.21 12.8554 14.2037 13.0765 14.0843C13.3798 13.9335 13.6262 13.6445 13.7146 13.3429C13.7652 13.1921 13.7778 12.5199 13.7652 11.4141C13.7462 9.76173 13.7399 9.71147 13.6009 9.47901C13.5188 9.35335 13.3166 9.16487 13.1587 9.07062L12.8617 8.90099L10.9665 8.88842C9.92405 8.88214 9.00168 8.90099 8.91323 8.92612ZM12.6406 11.5398V13.2047H10.8717H9.10276V11.5398V9.87482H10.8717H12.6406V11.5398Z" fill="#33C16C"></path></svg></div>
                  <div className={classes.info}><div className={classes.title}>CS:GO</div></div>
                </div>
                <div className={classes.bHNrGF} onClick={onClickSkinsBack} onClose={() => setAnchorEl(null)}>
                  <div className={classes.iconHold}><img width="26px" height="26px" src={rust} alt="Rust" /></div>
                  <div className={classes.info}><div className={classes.title}>RUST</div></div>
                </div>
                <div className={classes.bHNrGF} onClick={onClickSkinsBack} onClose={() => setAnchorEl(null)}>
                  <div className={classes.iconHold}><img width="27px" height="27px" src={dota2} alt="Dota2" /></div>
                  <div className={classes.info}><div className={classes.title}>DOTA2</div></div>
                </div>
              </div>
              <br />*/}
              <div style={{ borderBottom: "1px solid #161D26", }}></div>
              <br />
              <div>Coupons & Gift Cards</div>
              <div className={classes.ferzBz}>
                <div className={classes.bHNrGF} onClick={onClickCoupon} onClose={() => setAnchorEl(null)}>
                  <div className={classes.iconHold}><svg style={{ width: "24px", height: "unset", }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.3 10.8399C21.69 10.8399 22 10.5299 22 10.1399V9.20986C22 5.10986 20.75 3.85986 16.65 3.85986H7.35C3.25 3.85986 2 5.10986 2 9.20986V9.67986C2 10.0699 2.31 10.3799 2.7 10.3799C3.6 10.3799 4.33 11.1099 4.33 12.0099C4.33 12.9099 3.6 13.6299 2.7 13.6299C2.31 13.6299 2 13.9399 2 14.3299V14.7999C2 18.8999 3.25 20.1499 7.35 20.1499H16.65C20.75 20.1499 22 18.8999 22 14.7999C22 14.4099 21.69 14.0999 21.3 14.0999C20.4 14.0999 19.67 13.3699 19.67 12.4699C19.67 11.5699 20.4 10.8399 21.3 10.8399ZM9 8.87986C9.55 8.87986 10 9.32986 10 9.87986C10 10.4299 9.56 10.8799 9 10.8799C8.45 10.8799 8 10.4299 8 9.87986C8 9.32986 8.44 8.87986 9 8.87986ZM15 15.8799C14.44 15.8799 13.99 15.4299 13.99 14.8799C13.99 14.3299 14.44 13.8799 14.99 13.8799C15.54 13.8799 15.99 14.3299 15.99 14.8799C15.99 15.4299 15.56 15.8799 15 15.8799ZM15.9 9.47986L9.17 16.2099C9.02 16.3599 8.83 16.4299 8.64 16.4299C8.45 16.4299 8.26 16.3599 8.11 16.2099C7.82 15.9199 7.82 15.4399 8.11 15.1499L14.84 8.41986C15.13 8.12986 15.61 8.12986 15.9 8.41986C16.19 8.70986 16.19 9.18986 15.9 9.47986Z" fill="#FFC440" />
                  </svg></div>
                  <div className={classes.info}><div className={classes.title}>Coupon</div></div>
                </div>
              </div>
            </div>
          </Box>
        </DialogContent> 
        <DialogActions>
          <Button
            onClick={handleClose}
            className={classes.buttontest}
            color="primary"
          >
            CLOSE
          </Button>
        </DialogActions>
      </div>
      ) : (
        <Box display="flex" flexDirection="column">
          {crypto === "growtopia" ? (
            <Fragment>
              <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
                <img style={{ marginRight: "10px", marginBottom: "-3px", }} width="24px" height="24px" src={growtopia} alt="dls" />
                <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>How to deposit?


</span>
              </DialogTitle>
              <ol>
        <li>Type in your Growtopia GrowID that you would like to deposit with, then press 'Start Deposit'.</li>
        <li>Wait for the loading to complete (it may take up to 30 seconds).</li>
        <li>Enter the generated world in Growtopia. (make sure that the world owner is in the world before dropping your locks).</li>
        <li>Drop the amount of <img src="https://growdice.co/assets/wl-b3d08b52.webp" width="18" height="18" className="sc-x7t9ms-0 dnLnNz" /> / <img src="https://growdice.co/assets/dl-2a39d38a.webp" width="18" height="18" className="sc-x7t9ms-0 dnLnNz" /> / <img src="https://growdice.co/assets/bgl-e2c76d7e.webp" width="18" height="18" className="sc-x7t9ms-0 dnLnNz" /> you wish to deposit next to the white door.</li>
        <li>You should see your balance update on the site within a few seconds (If it did not update, message <a target="_blank" className="text-white" href="/discord">support</a>).</li>
      </ol>
      
              <Growtopia deposit={true} />
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => setCrypto(null)}
                  className={classes.buttontest}
                  color="primary"
                >
                  Back
                </Button>
              </DialogActions>
            </Fragment>
          ) : crypto === "eth" ? (
            <Fragment>
              <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
                <img style={{ marginRight: "10px", marginBottom: "-3px", }} width="24px" height="24px" src={ethereum} alt="ETH" />
                <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Ethereum</span>
                
              </DialogTitle>
              <Ethereum deposit={true} />
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => setCrypto(null)}
                  className={classes.buttontest}
                  color="primary"
                >
                  Back
                </Button>
              </DialogActions>
            </Fragment>
          ) : crypto === "ltc" ? (
            <Fragment>
              <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
                <img style={{ marginRight: "10px", marginBottom: "-3px", }} width="24px" height="24px" src={litecoin} alt="ETH" />
                <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>Litecoin</span>
              </DialogTitle>
              <Litecoin deposit={true} />
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => setCrypto(null)}
                  className={classes.buttontest}
                  color="primary"
                >
                  Back
                </Button>
              </DialogActions>
            </Fragment>
          ) : crypto === "doge" ? (
            <Fragment>
              <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
                <img style={{ marginRight: "10px", marginBottom: "-3px", }} width="24px" height="24px" src={doge} alt="ETH" />
                <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>DOGE</span>
              </DialogTitle>
              <Dogecoin deposit={true} />
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => setCrypto(null)}
                  className={classes.buttontest}
                  color="primary"
                >
                  Back
                </Button>
              </DialogActions>
            </Fragment>
          ) : crypto === "usdt" ? (
            <Fragment>
              <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
                <img style={{ marginRight: "10px", marginBottom: "-3px", }} width="24px" height="24px" src={usdt} alt="ETH" />
                <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>USDT (ERC 20)</span>
              </DialogTitle>
              <Usdt deposit={true} />
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => setCrypto(null)}
                  className={classes.buttontest}
                  color="primary"
                >
                  Back
                </Button>
              </DialogActions>
            </Fragment>
          ) : crypto === "usdc" ? (
            <Fragment>
              <DialogTitle className={classes.titlerubik} onClose={handleClose} style={{ fontFamily: "Rubik", }}>
                <img style={{ marginRight: "10px", marginBottom: "-3px", }} width="24px" height="24px" src={usdc} alt="ETH" />
                <span style={{ fontFamily: "Rubik", fontWeight: "300", }}>USDC</span>
              </DialogTitle>
              <Usdc deposit={true} />
              <DialogActions>
                <Button
                  autoFocus
                  onClick={() => setCrypto(null)}
                  className={classes.buttontest}
                  color="primary"
                >
                  Back
                </Button>
              </DialogActions>
            </Fragment>
          ) : null}
        </Box>
      )}
    </Dialog>
  );
};

export default Deposit;