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

  // Button onClick reload items
  const fetchData = async () => {
    setLoading(true);
    try {
      setItems([
        {
          "_id": "64e790c0290917bf372a2bc2", 
          "game_name": "frost_dragon", 
          "display_name": "FR Frost Dragon", 
          "thumbnail": "https://static.starpets.gg/images/103.png?v=2", 
          "attributes": {
            "ride": true,
            "fly": true,
            "neon": false,
            "mega": true
           },
           "priceUSD": 21.2,
           "selected": false
        },
      
        {
          "_id": "64e790c0290917bf372a2bc2", 
          "game_name": "ZombieBat", 
          "display_name": "Bat", 
          "thumbnail": "https://tr.rbxcdn.com/ae5f9155d0f98d29ff67aaeca52c1d3a/420/420/Model/Png", 
          "priceUSD": 21.2,
          "selected": false
        },
    
        {
          "_id": "64e790c0290917bf372a2bc2", 
          "game_name": 123, 
          "display_name": "Rainbow Comet Agony", 
          "thumbnail": "https://tr.rbxcdn.com/ae5f9155d0f98d29ff67aaeca52c1d3a/420/420/Model/Png", 
          "attributes": {
            "rainbow": true,
            "shiny": false,
            "golden": true
          }, 
          "priceUSD": 21.2,
          "selected": false
        },
        {
          "_id": "64e790c0290917bf372a2bc2", 
          "game_name": "luck_gun", 
          "display_name": "Luck", 
          "thumbnail": "https://dahoodtrades.com/storage/items/zzI9btSxQdbILXajozoNXkOb7JKaqwSaNCFx0maB.png", 
          "priceUSD": 21.2,
          "selected": false
        }
      ]);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }

  const handleWithdrawItems = async () => {

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
      >        
        <span>
          Withdraw via Items
        </span>
        <br /><br />
       
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
                ? items.sort((a, b) => b.priceUSD - a.priceUSD).map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      let currItems = items;
                      let indexItem = currItems
                        .map(i => {
                          return i.display_name;
                        })
                        .indexOf(item.display_name);

                      currItems[indexItem].selected = currItems[indexItem]
                        .selected
                        ? false
                        : true;

                      setItems([...currItems]);
                    }}
                    className="item"
                    style={item.selected ? { backgroundColor: "rgb(30 39 52)", border: "1px solid rgb(43, 82, 119)", } : null}
                  >
                    <img src={item.thumbnail} alt={item.thumbnail} />
                    <span>{item.display_name}</span><br /><br />
                    <div className="price">$ {item.priceUSD}</div>
                  </div>
                ))
                : null}

            </div>}
        </Grow>
      </DialogContent>
      <DialogActions>
        <div className={classes.withdrawLeft}>
          <span style={{ fontSize: "15px", fontFamily: "Rubik", color: "#FFC440", fontWeight: 800, }}>$</span> {items.filter(item => item.selected).reduce((acc, item) => acc + item.priceUSD, 0).toFixed(2)} <br />
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