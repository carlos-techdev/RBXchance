import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { connect } from "react-redux";
import { changeWallet } from "../../../actions/auth";
import PropTypes from "prop-types";

// MUI Components
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
//import CircularProgress from "@material-ui/core/CircularProgress";
import ReloadIcon from '@material-ui/icons/Cached';
import Grow from '@material-ui/core/Grow';

import { useEffect } from "react";
import { tryGetMarketItemsCSGO, tryToWithdrawItemsCSGO } from "../../../services/api.service";

import RoundSkeleton from "../../RoundSkeleton";

const useStyles = makeStyles(theme => ({
  withdrawitems: {
    display: "flex",
    flexWrap: "wrap",
    "& > .item": {
      width: "22%",
      margin: "10px",
      padding: "15px",
      textAlign: "center",
      border: "1px solid #2f3947",
      borderRadius: "20px",
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        width: "43%",
      },
      [theme.breakpoints.down("sm")]: {
        width: "43%",
      },
      [theme.breakpoints.down("md")]: {
        width: "43%",
      },
      "& > .price": {
        fontSize: "12px",
        color: "#FFC440",
        height: "25px",
      },
      "& > img": {
        maxWidth: "70%",
      },
      "& > span": {
        fontSize: "11px",
        display: "block",
      },
      "&:hover": {
        "& > img": {
          transform: "scale(1.1)",
          transition: "all 0.5s ease"
        },
      },
    },
  },
  modal: {
    "& div > div": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      "&::-webkit-scrollbar": {
        width: "6px",
        height: "0px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#3e4a59",
        borderRadius: "14px",
      },
      "&::-webkit-scrollbar-track": {
        borderRadius: "14px",
        background: "#0D1116",
      },
    },
    "& .MuiDialog-paperWidthSm": {
      minWidth: "50%",
      maxHeight: "82%",
      background: "#12171D",
      // border: "2px solid #2f3947",
      borderRadius: "20px",
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        margin: "15px",
        marginTop: "75px",
      },
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "15px",
        marginTop: "75px",
      },
      [theme.breakpoints.down("md")]: {
        width: "100%",
        margin: "15px",
        marginTop: "75px",
      },
    },
  },
  vipTitle: {
    fontFamily: "Rubik",
    fontSize: 20,
    textAlign: "right",
    marginTop: "2rem",
    marginRight: "1rem",
    "& > span": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
    },
  },
  vipDesc: {
    width: "90%",
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".05em",
    marginTop: "30px",
    marginLeft: "20px",
    "& > a": {
      color: "#FFC440",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".05em",
      textDecoration: "none",
    },
  },
  tradeurlinput: {
    borderRadius: "7px",
    marginLeft: "15px",
    padding: "7px",
    fontFamily: "Rubik",
    fontSize: "14px",
    color: "#fff",
    minWidth: "50%",
    fontWeight: 300,
    // border: "2px solid #2f3947",
    background: "#0D1116",
    outline: "none",
  },
  buttonwithdraw: {
    color: "#fff",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    background: "#FFC440",
    "&:hover": {
      background: "#3888c8",
    },
  },
  withdrawLeft: {
    marginRight: "auto",
    marginLeft: "30px",
    [theme.breakpoints.down("xs")]: {
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10px",
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "10px",
    },
  },
  buttontest: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: ".1em",
  },
  titlerubik: {
    fontFamily: "Rubik",
  },
  getTradeUrl: {
    fontSize: "13px",
    cursor: "pointer",
    fontWeight: 300,
    fontFamily: "Rubik",
    padding: "7px 9px",
    color: "#fff",
    background: "#FFC440",
    borderRadius: "5px",
    [theme.breakpoints.down("xs")]: {
      fontSize: "11px",
      padding: "8px 7px",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "11px",
      padding: "8px 7px"
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "11px",
      padding: "8px 7px"
    },
  },
  progressbox: {
    margin: "0 1rem",
    position: "relative",
    "& > div > .MuiOutlinedInput-root": {
      "& > input": {},
    },
    "& > div": {
      width: "100%",
      "& label": {
        color: "#5f6368",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: ".1em",
      },
      "& label.Mui-focused": {
        color: "#5f6368",
      },
      "& .MuiInput-underline:after": {
        border: "1px solid #2f3947",
        borderRadius: "6px",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
        "&:hover fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
        "&.Mui-focused fieldset": {
          border: "1px solid #2f3947",
          borderRadius: "6px",
        },
      },
    },
    "& > button": {
      position: "absolute",
      right: 10,
      top: 10,
      width: "7rem",
      background: "#FFC440",
      color: "#ffffff",
      "&:hover": {
        background: "#FFC440",
      },
      "& .MuiButton-label": {},
    },
    "& > img": {
      position: "absolute",
      top: -10,
      zIndex: 1000,
    },
  },
}));

const SkinsBackDeposit = ({ open, handleClose, changeWallet, withItems, user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [tradeUrl, setTradeUrl] = useState("");
  const [lastPressTime, setLastPressTime] = useState(
    Number(localStorage.getItem("lastPressTime")) || null
  );

  // Button onClick reload items
  const fetchData = async () => {
    const currentTime = new Date().getTime();
    if (lastPressTime && currentTime - lastPressTime < 15000) {
      const remainingTime = 15000 - (currentTime - lastPressTime);
      return addToast(`Slow down.. Please wait ${Math.ceil(remainingTime / 1000)} seconds before refreshing the inventory again.`, {
        appearance: "error",
      });
    }
    setLoading(true);
    try {
      let items = await tryGetMarketItemsCSGO(user._id);
      setItems(items);
      setLastPressTime(currentTime);
      localStorage.setItem("lastPressTime", currentTime);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (withItems && withItems.length > 0) {
      setItems(withItems);
      setLoading(false);
    }
  }, [withItems]);

  const handleWithdrawItems = async () => {
    if (!tradeUrl)
      return addToast("Please set your trade link to withdraw!", {
        appearance: "error",
      });

    if (!(tradeUrl.includes("token=") && tradeUrl.includes("partner=")))
      return addToast("Invalid trade link!", {
        appearance: "error",
      });

    let withItems = items.filter(i => { return i.selected ? true : false; }).map(i => { return i.name; });

    if (withItems.length < 0)
      return addToast("You need to select at least one item to withdraw!", {
        appearance: "error",
      });

    let resp = await tryToWithdrawItemsCSGO(withItems, tradeUrl);

    if (resp.success)
      return addToast(resp.msg, {
        appearance: "success",
      });

    addToast(resp.error, {
      appearance: "error",
    });
  };

  const onChangeTradeUrl = e => {
    setTradeUrl(e.target.value);
  };

  return (
    <Dialog
      className={classes.modal}
      onClose={handleClose}
      style={{ fontFamily: "Rubik" }}
      open={open}
    >
      <DialogTitle
        className={classes.titlerubik}
        onClose={handleClose}
        style={{ fontFamily: "Rubik" }}
      >        <svg width="26" height="16" viewBox="0 0 26 16" fill="none" style={{ width: "34px", height: "unset", marginRight: "10px", marginBottom: "-3px", }}><path d="M18.5805 0.651121C18.1256 0.883585 17.8413 1.55585 18.0056 2.02706C18.094 2.28465 18.0498 2.3412 17.835 2.25952C17.3675 2.0836 16.8179 2.46057 16.5588 3.12655C16.4514 3.40927 16.4135 3.62917 16.4135 4.07525L16.4072 4.65955H16.1798C15.8765 4.65955 15.8007 4.7538 15.8007 5.13076C15.8007 5.31297 15.7691 5.62082 15.7249 5.81559C15.6491 6.21141 15.687 6.29308 15.9776 6.29308C16.1545 6.29308 16.1545 6.33706 15.9776 6.47529C15.8513 6.58209 15.8449 6.60722 15.9018 7.29205C15.9523 7.92033 15.946 8.00829 15.8576 8.05855C15.7502 8.1151 15.6554 8.41039 15.7312 8.45437C15.7565 8.47322 15.7691 8.59259 15.7628 8.72453C15.7565 8.85647 15.7755 8.99469 15.807 9.03239C15.8386 9.07009 15.826 9.31511 15.7691 9.62925C15.7186 9.91826 15.6744 10.3266 15.6744 10.534C15.6681 10.8104 15.6302 10.9738 15.5291 11.1434C15.4533 11.2691 15.308 11.5015 15.2132 11.6649C15.1121 11.822 15.0173 12.0607 14.9984 12.1864C14.9794 12.312 14.891 12.557 14.8025 12.733C14.6762 12.9843 14.6572 13.1036 14.6825 13.3738C14.7078 13.6188 14.6762 13.8639 14.5625 14.2848C14.474 14.6178 14.4108 14.9885 14.4235 15.1518L14.4424 15.4346H14.9794H15.5164L15.4975 15.2147C15.4912 15.0953 15.4659 14.8503 15.4469 14.6806C15.409 14.3225 15.6175 13.644 15.7691 13.644C15.8134 13.644 15.9144 13.4869 15.9839 13.2984C16.0597 13.1036 16.1798 12.8335 16.2493 12.689C16.3251 12.5445 16.3883 12.2994 16.4009 12.1424C16.4199 11.8031 16.4767 11.646 16.6347 11.4764C16.9505 11.1371 17.1274 10.8795 17.1274 10.7602C17.1274 10.5465 17.4938 9.65439 17.6328 9.52873C17.7023 9.4659 17.7592 9.37794 17.7592 9.32768C17.7592 9.19574 17.8603 9.23344 17.9361 9.39679C17.974 9.47847 18.0751 9.56014 18.1825 9.57899C18.3151 9.60412 18.4415 9.73606 18.7068 10.1319C19.1427 10.779 19.1807 10.8167 19.4018 10.8167C19.5029 10.8167 19.6039 10.8481 19.6292 10.8921C19.6987 10.9989 19.6608 11.4576 19.5787 11.5518C19.4839 11.6649 19.5597 12.5696 19.6924 13.0157C19.8187 13.4304 19.8314 14.1026 19.7176 14.6304C19.6671 14.8503 19.6482 15.0388 19.6734 15.0639C19.6924 15.089 19.8756 15.1141 20.0778 15.1204C20.2799 15.1267 20.6274 15.1644 20.8548 15.2084C21.0823 15.2461 21.4171 15.2587 21.6003 15.2398C21.8909 15.2021 21.9288 15.1833 21.9288 15.0576C21.9288 14.888 21.8341 14.8 21.5371 14.6932C21.4108 14.6555 21.196 14.4796 21.0507 14.3099L20.7853 14.0021L20.8169 13.4932C20.9243 11.9099 20.9433 11.5455 20.9433 10.9612C20.9496 10.4272 20.9306 10.3015 20.8422 10.2387C20.7853 10.1947 20.6653 9.97481 20.5832 9.74863C20.3557 9.14548 20.0778 8.62401 19.7808 8.24704C19.3575 7.71928 19.3007 7.31718 19.6608 7.39258C19.8187 7.43027 19.8503 7.40514 19.964 7.18524C20.0588 6.99676 20.0904 6.78943 20.1093 6.26795C20.1283 5.60826 20.122 5.58941 19.9704 5.46375C19.8377 5.35695 19.7871 5.14333 19.8756 5.04909C19.8819 5.03652 20.0714 5.13076 20.2926 5.25014C20.8232 5.53915 21.3097 5.64595 21.5055 5.5203C21.872 5.28155 22.0362 5.06794 22.0804 4.76008C22.1183 4.5339 22.1626 4.44594 22.251 4.42709C22.3584 4.39568 22.3647 4.3517 22.3331 3.97473C22.3016 3.56634 22.3016 3.56006 22.529 3.32131L22.7564 3.08885H23.4135C23.881 3.08885 24.0768 3.06372 24.0958 3.00717C24.1147 2.95063 24.3548 2.93178 25.0434 2.93806C25.9089 2.94435 25.9721 2.93178 25.9721 2.82497C25.9721 2.71188 25.9279 2.71188 25.2456 2.74958C24.5317 2.79356 24.519 2.79356 24.519 2.65534C24.519 2.57994 24.4811 2.5234 24.4243 2.5234C24.3548 2.5234 24.3295 2.45429 24.3295 2.27209C24.3295 2.13386 24.3042 2.02077 24.2663 2.02077C24.2347 2.02077 24.2032 2.14643 24.2032 2.3035C24.2032 2.46057 24.1779 2.58623 24.14 2.58623C24.1084 2.58623 24.0768 2.55481 24.0768 2.5234C24.0768 2.4857 23.5082 2.46057 22.4974 2.46057C21.4866 2.46057 20.918 2.43544 20.918 2.39774C20.918 2.36005 20.8738 2.33491 20.8232 2.33491C20.7727 2.33491 20.7285 2.27837 20.7285 2.20926C20.7285 2.14015 20.7032 2.0836 20.6653 2.0836C20.6337 2.0836 20.6021 2.14643 20.6021 2.22811C20.6021 2.34748 20.5516 2.38518 20.3178 2.448C19.8819 2.5611 19.844 2.55481 19.844 2.3035C19.844 2.15271 19.8756 2.0836 19.9324 2.0836C20.2041 2.0836 20.2926 1.71292 20.1472 1.17888C20.0841 0.927565 20.0398 0.883585 19.6924 0.707666C19.2312 0.475203 18.9595 0.462637 18.5805 0.651121Z" fill="#33C16C"></path><path d="M1.5982 2.37234C1.33918 2.498 1.22546 2.60481 1.08015 2.8624L0.890625 3.18283V4.85406V6.53157L1.06752 6.86455C1.21282 7.13472 1.30759 7.23524 1.58556 7.37975L1.92672 7.55566L3.8915 7.53682L5.8626 7.51797L6.1153 7.34833C6.3996 7.15985 6.62071 6.85199 6.67757 6.55041L6.71548 6.35565H4.52958H2.34368V4.87919V3.40273H4.52958H6.71548L6.67757 3.19539C6.62071 2.9001 6.3301 2.52313 6.03949 2.37234C5.79942 2.24669 5.67307 2.24041 3.85991 2.22156L1.93303 2.20271L1.5982 2.37234Z" fill="#33C16C"></path><path d="M8.50305 2.32879C7.91551 2.60523 7.71967 2.9822 7.71335 3.84295C7.71335 4.54662 7.8397 4.87333 8.23771 5.18747L8.4841 5.38224L10.4362 5.40108L12.3884 5.41993V5.91627V6.4189H10.0446H7.70703L7.75125 6.55712C7.87761 6.97179 8.1619 7.29221 8.54728 7.44928C8.74312 7.53096 9.10323 7.5498 10.6637 7.5498C11.8451 7.5498 12.6411 7.52467 12.799 7.48069C13.1276 7.38645 13.5508 6.9655 13.6456 6.6388C13.6835 6.50058 13.7151 6.14874 13.7151 5.85345C13.7151 5.2503 13.6014 4.92987 13.2981 4.64715C12.9254 4.30159 12.8054 4.28274 10.8406 4.28274H9.04005V3.81153V3.34032H11.3207H13.6014L13.5572 3.1644C13.4877 2.88168 13.2729 2.58639 13.0012 2.41047L12.7485 2.24083L10.7521 2.22198C8.90738 2.20942 8.7368 2.2157 8.50305 2.32879Z" fill="#33C16C"></path><path d="M1.74982 8.96382C1.38972 9.08947 1.20019 9.24654 1.03593 9.56068C0.896943 9.82456 0.890625 9.88111 0.890625 11.5209C0.890625 12.9031 0.909578 13.2487 0.985389 13.4435C1.11174 13.7388 1.30127 13.9398 1.5982 14.0906C1.813 14.2037 1.98989 14.21 3.90413 14.21C6.2227 14.21 6.3301 14.1911 6.65862 13.7639C6.88606 13.4623 6.90501 13.3304 6.91764 12.168L6.92396 11.1314H4.95286C2.73537 11.1314 2.82382 11.1125 3.18392 11.5837C3.46822 11.9544 3.65143 12.0047 4.79492 12.0047L5.7552 12.011V12.5764V13.1419H3.8915H2.0278V11.5398V9.93765H4.46009C6.6144 9.93765 6.89237 9.92509 6.89237 9.84341C6.89237 9.53555 6.41855 9.04549 6.02686 8.93869C5.64148 8.83188 2.05939 8.85073 1.74982 8.96382Z" fill="#33C16C"></path><path d="M8.91323 8.92612C8.57208 9.03293 8.33833 9.19628 8.16775 9.44759L7.99717 9.70519L7.97822 11.4078C7.95295 13.2424 7.97822 13.4372 8.26251 13.7764C8.6163 14.1911 8.7237 14.21 10.8906 14.21C12.6975 14.21 12.8554 14.2037 13.0765 14.0843C13.3798 13.9335 13.6262 13.6445 13.7146 13.3429C13.7652 13.1921 13.7778 12.5199 13.7652 11.4141C13.7462 9.76173 13.7399 9.71147 13.6009 9.47901C13.5188 9.35335 13.3166 9.16487 13.1587 9.07062L12.8617 8.90099L10.9665 8.88842C9.92405 8.88214 9.00168 8.90099 8.91323 8.92612ZM12.6406 11.5398V13.2047H10.8717H9.10276V11.5398V9.87482H10.8717H12.6406V11.5398Z" fill="#33C16C"></path></svg>

        <span>
          Withdraw via SkinsBack
        </span>
        <br /><br />
        <div style={{ fontSize: "15px", fontFamily: "Rubik", fontWeight: 300, }}>Your balance <span style={{ fontSize: "15px", fontFamily: "Rubik", color: "#FFC440", fontWeight: 800, }}>$</span> <span style={{ fontWeight: 500, }}>{user.wallet.toFixed(2)}</span></div>
        <br />
        <div style={{ fontSize: "13px", }}>
          When purchasing, we request the lowest priced item available.<br /><br />The prices listed are estimates and the actual amount spent may be slightly different.</div><br />
        <div style={{ display: "flex", }}>
          <span
            className={classes.getTradeUrl}
            onClick={() => {
              window.open(
                `https://steamcommunity.com/id/mrechotm/tradeoffers/privacy#trade_offer_access_url`
              );
            }}
          >
            GET TRADE URL
          </span>
          <input
            className={classes.tradeurlinput}
            type="text"
            placeholder="Enter Trade URL*"
            onChange={onChangeTradeUrl}
          />
        </div>
        <div style={{ display: "grid", }}>
          <div style={{ marginLeft: "auto", marginRight: "90px", marginBottom: "-30px", marginTop: "30px", }}>{items.length} items loaded</div>
          <Button
            disableRipple
            onClick={fetchData}
            className={classes.buttonwithdraw}
            color="primary"
            style={{ marginLeft: "auto", marginRight: "0", marginBottom: "-30px", }}
          >
            <ReloadIcon style={{ fontSize: 18, }} />
          </Button>
        </div>
        <br />
      </DialogTitle>
      <DialogContent dividers style={{ background: "#181d24", }}>
        <Grow in timeout={420}>
          {loading ?
            <div className={classes.withdrawitems}><RoundSkeleton /></div> :
            <div className={classes.withdrawitems}>
              {items.length > 0
                ? items.sort((a, b) => b.price - a.price).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      let currItems = items;
                      let indexItem = currItems
                        .map(i => {
                          return i.name;
                        })
                        .indexOf(item.name);

                      currItems[indexItem].selected = currItems[indexItem]
                        .selected
                        ? false
                        : true;

                      setItems([...currItems]);
                    }}
                    className="item"
                    style={item.selected ? { backgroundColor: "rgb(30 39 52)", border: "1px solid rgb(43, 82, 119)", } : null}
                  >
                    <img src={item.image} alt={item.name} />
                    <span>{item.name}</span><br /><br />
                    <div className="price">$ {item.price}</div>
                  </div>
                ))
                : null}

            </div>}
        </Grow>
      </DialogContent>
      <DialogActions>
        <div className={classes.withdrawLeft}>
          <span style={{ fontSize: "15px", fontFamily: "Rubik", color: "#FFC440", fontWeight: 800, }}>$</span> {items.filter(item => item.selected).reduce((acc, item) => acc + item.price, 0).toFixed(2)} <br />
          {items.filter(item => item.selected).length} items selected
        </div>
        <Button
          disableRipple
          disabled={items.filter(item => item.selected).length <= 0 ? true : false}
          onClick={() => {
            handleWithdrawItems();
          }}
          className={classes.buttonwithdraw}
          color="primary"
        >
          WITHDRAW
        </Button>
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

SkinsBackDeposit.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  changeWallet: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { changeWallet })(SkinsBackDeposit);