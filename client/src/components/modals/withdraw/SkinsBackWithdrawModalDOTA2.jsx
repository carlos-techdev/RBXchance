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
import { tryGetMarketItemsDOTA2, tryToWithdrawItemsDOTA2 } from "../../../services/api.service";

import RoundSkeleton from "../../RoundSkeleton";

import dota2 from "../../../assets/dota2.png";

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
      let items = await tryGetMarketItemsDOTA2(user._id);
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

    let withItems = items
      .filter(i => {
        return i.selected ? true : false;
      })
      .map(i => {
        return i.name;
      });

    if (withItems.length < 0)
      return addToast("You need to select at least one item to withdraw!", {
        appearance: "error",
      });

    let resp = await tryToWithdrawItemsDOTA2(withItems, tradeUrl);

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
      ><img style={{ width: "27px", height: "unset", marginRight: "10px", marginBottom: "-3px", }} width="26px" height="26px" src={dota2} alt="Dota2" /><span>
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