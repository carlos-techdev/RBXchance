import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { changeWallet } from "../actions/auth";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useEffect } from "react";
import { getStock } from "../services/api.service";

import MarketWithdraw from "../components/modals/MarketWithdraw";

import Preloader from "../Preloader2";

const useStyles = makeStyles(theme => ({
  root: {
    height: "92vh",
    display: "flex",
    flexDirection: "row",
    color: "#fff",
    margin: "3.8vh auto",
  },
  root2: {
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
  topBar: {
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    width: "100%",
    maxWidth: "72rem",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexFlow: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignTtems: "center",
  },
  rightBar: {
    width: "18rem",
    padding: "1.25rem",
    margin: "1rem",
    backgroundColor: "#12171D",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "0.4rem",
    border: "1px solid #161D26",
  },
  header: {
    fontSize: "2.25rem",
    lineHeight: "2.5rem",
    fontWeight: 700,
    marginBottom: "1.25rem",
    display: "flex",
  },
  topRight: {
    display: "flex",
    flexFlow: "wrap",
    gap: "0.5rem",
    alignContent: "center"

  },
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    padding: "0.75rem 0.5rem",
    borderRadius: "0.375rem",
    outline: "transparent solid 2px",
    outlineOffset: "2px",
    backgroundColor: "rgba(0, 0, 0, 0)",
    border: "none",
    color: "#29323E",
  },
  sortButton: {
    textShadow: "rgba(0, 0, 0, 0.12) 0px 4px 8px",
    borderStyle: "none",
    transitionDuration: "150ms",
    padding: "0.75rem 0px",
    borderRadius: "0.375rem",
    fontWeight: 400,
    letterSpacing: "0.05em",
    color: "rgba(105, 117, 137, 1)",
    backgroundColor: "rgba(0, 0, 0, 0)",
    cursor: "pointer",
    width: "min-content",
  },
  itemsContainer: {
    maxWidth: "100%",
    height: "100%",
    overflow: "scroll",
    outline: "transparent solid 2px",
    outlineOffset: "2px",
  },
  reactive: {
    boxSizing: "border-box",
    direction: "ltr",
    height: "797px",
    position: "relative",
    width: "885px",
    willChange: "transform",
    overflow: "hidden",
    flex: "1 1 0%",
  },
  element: {
    overflow: "hidden",
    position: "relative",
    display: "grid",
    gap: ".5rem",
    gridTemplateColumns: "repeat(auto-fit,10rem)",
  },
  dd: {
    height: "170px",
    left: "0px",
    top: "0px",
    width: "179px",
  },
  itemBox: {
    height: "10rem",
    width: "10rem",
    padding: "1.25rem 0.5rem",
    backgroundColor: "#12171D",
    display: "flex",
    alignItems: "center",
    borderRadius: "0.375rem",
    border: "1px solid #161D26",
    cursor: "pointer",
    flexFlow: "column",
    "&:hover": {
      filter: "brightness(120%)"
    }
  },
  itemImg: {
    width: "4.5rem",
    filter: "drop-shadow(rgba(112, 171, 255, 0.133) 0px 0px 20px)",
    maxWidth: "100%",
    height: "auto",
  },
  itemName: {
    color: "rgba(158, 169, 186, 1)",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },
  priceContainer: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    color: "rgba(255, 255, 255, 1)",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    gap: "6px",
    letterSpacing: "0.025em",
  },
  selectedContainer: {
    flexDirection: "column",
    flex: "1 1 0%",
    display: "flex",
    gap: "0.75rem",
    minWidth: "0px",
    overflowX: "auto",
  },
  selectedItemBox: {
    width: "auto",
    maxWidth: "none",
    padding: "0.5rem",
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    alignItems: "center",
    borderRadius: "0.375rem",
    gap: "0.75rem",
    backgroundColor: "#0D1116",
    border: "1.5px solid #161D26",
    cursor: "pointer",
    "&:hover": {
      filter: "brightness(120%)"
    }
  },
  selectedRight: {
    marginRight: "0.5rem",
    overflow: "hidden",
  },
  selectedItemName: {
    color: "rgba(158, 169, 186, 1)",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: "0.25rem",
  },
  withdrawButton: {
    textShadow: "rgba(0, 0, 0, 0.12) 0px 4px 8px",
    borderStyle: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    fontWeight: 400,
    letterSpacing: "0.05em",
    backgroundColor: "#FFC440",
    color: "rgba(255, 255, 255, 1)",
    width: "100%",
    cursor: "pointer",
    textAlign: "center",
  },
  right: {
    display: "flex",
    height: "100%",
    marginTop: "2rem"
  },
  counterWhite: {
    color: "#fff",
    borderRight: "2px solid hsla(0,0%,100%,.5)",
    paddingRight: "1rem",
    fontWeight: 500,
  },
  counterGreen: {
    paddingLeft: "1rem",
    marginRight: ".5rem",
    color: "#FFC440",
    fontWeight: 500,
  },
  button: {  
    textTransform: "none",
    width: "75px",
    padding: "0 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.4rem",
    fontSize: "10px",
    fontWeight: 400,
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
}));

const MarketPage = ({ user, open, handleClose}) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [searchInputState, setSearchInputState] = useState("");
  const [sortType, setSortType] = useState("mm2");
  const [items, setItems] = useState([]);
  const [openMarket, setOpenMarket] = useState(false);
  const [sortHigh, setSortHigh] = useState(false);
  const [mm2, setMm2] = useState([]);
  const [amp, setAmp] = useState([]);

  const fetchDataMm2 = async () => {
    setLoading(true);
    try {
      const res = await getStock();
      setItems([...res.mm2]);
    } catch (error) {
      addToast("There was an error getting site item stock!", { appearance: "error" });
    }    
    setLoading(false);
  };

  const fetchDataAmp = async () => {
    setLoading(true);
    try {
      const res = await getStock();
      setItems([...res.amp]);
    } catch (error) {
      addToast("There was an error getting site item stock!", { appearance: "error" });
    }    
    setLoading(false);
  };

  useEffect(() => {
    fetchDataMm2();
  }, [])

  const switchSortType = async (type) => {
    setSortType(type);

    if(type == "mm2") {
      await fetchDataMm2();
    } else {
      await fetchDataAmp();
    }
  }


  return (
    !user ? (
      <div className={classes.root2}>
        <div style={{color: "#fff", left: "50%"}}>Please login to view market.</div>
      </div>
      ) : (
      <div className={classes.root}>
        <MarketWithdraw handleClose={() => setOpenMarket(!openMarket)} open={openMarket} items={items.filter(item => item.selected == true)} user={user} type={sortType}/>
        <div className={classes.rightBar}>
          <div style={{paddingBottom: "1.25rem"}}>{items.filter(item => item.selected == true).length}/100 items selected - ${items.filter(item => item.selected == true).reduce((total, item) => total + item.priceUSD, 0).toFixed(2)}</div>
          <div className={classes.selectedContainer}>
            {items.filter(item => item.selected == true).length > 0 ? (
              items.filter(item => item.selected == true).sort((a, b) => b.priceUSD - a.priceUSD).map((item) => {
                return (
                  <div 
                    className={classes.selectedItemBox}
                    style={!item.selected ? { filter: "brightness(120%)" } : null}
                    onClick={() => {
                      let currItems = items;
                      let indexItem = currItems
                        .map(i => {
                          return i._id;
                        })
                        .indexOf(item._id);
        
                      currItems[indexItem].selected = currItems[indexItem]
                        .selected
                        ? false
                        : true;
        
                      setItems([...currItems]);
                    }}
                  >
                    <img style={{width: "2.5rem",height: "auto",maxWidth: "100%"}} src={item.thumbnail} />
                    <div className={classes.selectedRight}>
                      <div className={classes.selectedItemName}>{item.display_name}</div>
                      <div className={classes.priceContainer}>
                        {/*<svg style={{width: "1rem",height: "1rem"}} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="css-13htjwu"><path d="M16.25 32C25.0866 32 32.25 24.8366 32.25 16C32.25 7.16344 25.0866 0 16.25 0C7.41344 0 0.25 7.16344 0.25 16C0.25 24.8366 7.41344 32 16.25 32Z" fill="url(#paint0_linear_0_3)"></path><path d="M16.25 3.83998C23.45 3.83998 29.37 9.59998 29.85 16.64C29.85 16.32 29.85 16.16 29.85 15.84C29.85 8.31998 23.77 2.23998 16.25 2.23998C8.73 2.23998 2.65 8.31998 2.65 15.84C2.65 16.16 2.65 16.32 2.65 16.64C3.13 9.59998 9.05 3.83998 16.25 3.83998Z" fill="#CD8103"></path><path d="M21.85 16.48C21.69 16.32 21.69 16.16 21.53 16.16L20.89 15.68C22.17 9.12002 16.89 6.08002 16.73 5.92002C16.57 5.92002 11.29 8.96002 12.57 15.68L11.93 16.16C11.77 16.32 11.61 16.32 11.61 16.48C10.49 17.92 12.09 19.84 12.09 19.84C12.09 19.84 14.33 17.92 16.73 17.92C19.13 17.92 21.37 19.84 21.37 19.84C21.37 19.84 22.97 17.92 21.85 16.48ZM18.33 14.72C18.33 14.72 17.37 14.4 16.57 14.4C15.77 14.4 14.81 14.72 14.81 14.72C14.33 11.2 16.41 9.44002 16.57 9.44002C16.73 9.44002 18.81 11.2 18.33 14.72ZM17.69 20C17.69 20 17.21 21.6 16.73 22.56C16.25 21.6 15.77 20 15.77 20C14.65 20.32 14.01 20.96 14.01 20.96C14.97 24.32 16.73 27.84 16.73 27.84C16.73 27.84 18.49 24.32 19.45 20.96C19.45 20.96 18.65 20.16 17.69 20Z" fill="#CD8103"></path><path d="M16.25 2.4C23.77 2.4 29.85 8.48 29.85 16C29.85 23.52 23.77 29.6 16.25 29.6C8.73 29.6 2.65 23.52 2.65 16C2.65 8.48 8.73 2.4 16.25 2.4ZM16.25 0C7.45 0 0.25 7.2 0.25 16C0.25 24.8 7.45 32 16.25 32C25.05 32 32.25 24.8 32.25 16C32.25 7.2 25.05 0 16.25 0Z" fill="#FAFF00"></path><path d="M16.25 4.96002C16.09 4.96002 10.81 8.00002 12.09 14.72L11.45 15.2C11.29 15.36 11.13 15.36 11.13 15.52C10.01 16.96 11.61 18.88 11.61 18.88C11.61 18.88 13.85 16.96 16.25 16.96C18.65 16.96 20.89 18.88 20.89 18.88C20.89 18.88 22.49 17.12 21.37 15.52C21.21 15.36 21.21 15.2 21.05 15.2L20.41 14.72C21.69 8.00002 16.41 4.96002 16.25 4.96002ZM14.49 13.92C14.01 10.4 16.09 8.64002 16.25 8.64002C16.41 8.64002 18.49 10.56 18.01 13.92C18.01 13.92 17.05 13.6 16.25 13.6C15.45 13.6 14.49 13.92 14.49 13.92ZM17.21 19.04C17.21 19.04 16.73 20.64 16.25 21.6C15.77 20.64 15.29 19.04 15.29 19.04C14.17 19.36 13.53 20 13.53 20C14.49 23.36 16.25 26.88 16.25 26.88C16.25 26.88 18.01 23.36 18.97 20C18.97 20 18.17 19.36 17.21 19.04Z" fill="#FAFF00"></path><path d="M7.45002 12.8C7.45002 9.76002 4.89002 7.20002 1.85002 7.20002C4.89002 7.20002 7.45002 4.64002 7.45002 1.60002C7.45002 4.64002 10.01 7.20002 13.05 7.20002C10.01 7.20002 7.45002 9.76002 7.45002 12.8Z" fill="white"></path><defs><linearGradient id="paint0_linear_0_3" x1="0.25" y1="0" x2="32.25" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#EFE726"></stop><stop offset="0.83281" stop-color="#DF9D07"></stop></linearGradient></defs></svg>*/}
                        <span>${item.priceUSD}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div style={{marginTop: "2.5rem",marginBottom: "2.5rem",margin: "1rem auto"}}>No items selected</div>
            )}
          </div>
          <div style={items.filter(item => item.selected == true).length > 0 ? {} : {opacity: 0.5, cursor: "not-allowed", pointerEvents: "none"}}>
            <div className={classes.withdrawButton} onClick={() => setOpenMarket(!openMarket)}>Withdraw</div>
          </div>
        </div>
        <div style={{flex: "1 1 0%",overflow: "hidden"}}>
          <div className={classes.topBar}>
            <h1 className={classes.header}>Marketplace</h1>
            <div className={classes.right}>
              <div className={classes.counterWhite}>
                {items.length} Total Items
              </div>
              <div className={classes.counterGreen}>
                ${items.reduce((total, item) => total + item.priceUSD, 0).toFixed(2)} Total Value
              </div>
            </div>
            <div className={classes.topRight}>
              <div className={classes.searchContainer}>
                <svg style={{height: "1.2rem",fill: "#697589"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"></path></svg>
                <input
                  type="text"
                  className={classes.input}
                  placeholder="Search for an item..."
                  value={searchInputState}
                  onChange={(event) => setSearchInputState(event.target.value)}
                />
              </div>
              <div className={classes.sortButton} onClick={() => setSortHigh(!sortHigh)}>
                {sortHigh ? (
                  <svg style={{height: "1.2rem",fill: "#697589"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="css-1tomezm"><path d="M416 288h-95.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H416c17.67 0 32-14.33 32-32S433.7 288 416 288zM544 32h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 32 544 32zM352 416h-32c-17.67 0-32 14.33-32 32s14.33 32 32 32h32c17.67 0 31.1-14.33 31.1-32S369.7 416 352 416zM480 160h-159.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H480c17.67 0 32-14.33 32-32S497.7 160 480 160zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path></svg>
                ) : (
                  <svg style={{height: "1.2rem",fill: "#697589"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="css-1tomezm"><path d="M320 224H416c17.67 0 32-14.33 32-32s-14.33-32-32-32h-95.1c-17.67 0-32 14.33-32 32S302.3 224 320 224zM320 352H480c17.67 0 32-14.33 32-32s-14.33-32-32-32h-159.1c-17.67 0-32 14.33-32 32S302.3 352 320 352zM320 96h32c17.67 0 31.1-14.33 31.1-32s-14.33-32-31.1-32h-32c-17.67 0-32 14.33-32 32S302.3 96 320 96zM544 416h-223.1c-17.67 0-32 14.33-32 32s14.33 32 32 32H544c17.67 0 32-14.33 32-32S561.7 416 544 416zM192.4 330.7L160 366.1V64.03C160 46.33 145.7 32 128 32S96 46.33 96 64.03v302L63.6 330.7c-6.312-6.883-14.94-10.38-23.61-10.38c-7.719 0-15.47 2.781-21.61 8.414c-13.03 11.95-13.9 32.22-1.969 45.27l87.1 96.09c12.12 13.26 35.06 13.26 47.19 0l87.1-96.09c11.94-13.05 11.06-33.31-1.969-45.27C224.6 316.8 204.4 317.7 192.4 330.7z"></path></svg>
                )}
              </div>
              <div className={classes.sortButton} onClick={fetchDataMm2}>
                <svg style={{height: "1.2rem",fill: "#697589"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="css-1bl8579"><path d="M464 16c-17.67 0-32 14.31-32 32v74.09C392.1 66.52 327.4 32 256 32C161.5 32 78.59 92.34 49.58 182.2c-5.438 16.81 3.797 34.88 20.61 40.28c16.89 5.5 34.88-3.812 40.3-20.59C130.9 138.5 189.4 96 256 96c50.5 0 96.26 24.55 124.4 64H336c-17.67 0-32 14.31-32 32s14.33 32 32 32h128c17.67 0 32-14.31 32-32V48C496 30.31 481.7 16 464 16zM441.8 289.6c-16.92-5.438-34.88 3.812-40.3 20.59C381.1 373.5 322.6 416 256 416c-50.5 0-96.25-24.55-124.4-64H176c17.67 0 32-14.31 32-32s-14.33-32-32-32h-128c-17.67 0-32 14.31-32 32v144c0 17.69 14.33 32 32 32s32-14.31 32-32v-74.09C119.9 445.5 184.6 480 255.1 480c94.45 0 177.4-60.34 206.4-150.2C467.9 313 458.6 294.1 441.8 289.6z"></path></svg>
              </div>
              <Button className={`${classes.button} ${
                  sortType === "mm2" ? classes.selected : ""
                }`} style={{ fontSize: "0.7rem", marginLeft: "0.5rem" }}
              onClick={() => switchSortType("mm2")}>MM2</Button>
              <Button className={`${classes.button} ${
                sortType === "adptme" ? classes.selected : ""
              }`} style={{ fontSize: "0.7rem" }}
              onClick={() => switchSortType("adptme")}>Adopt Me</Button>
            </div>
          </div>
          <div className={classes.itemsContainer}>
            {loading ? (
              <Preloader />
            ) : (
            <div style={{paddingLeft: "1.5rem",paddingRight: "1.5rem"}}>
              <div className={classes.element}>
                {items.filter(item => item.display_name.toLowerCase().includes(searchInputState.toLowerCase())).sort((a, b) => sortHigh ? a.priceUSD - b.priceUSD : b.priceUSD - a.priceUSD).map((item, index) => {
                  return ( 
                    <div 
                      className={classes.dd}
                      style={item.selected ? { filter: "brightness(120%)" } : null }
                      onClick={() => {
                        let currItems = items;
                        let indexItem = currItems
                          .map(i => {
                            return i._id;
                          })
                          .indexOf(item._id);
          
                        currItems[indexItem].selected = currItems[indexItem]
                          .selected
                          ? false
                          : true;
          
                        setItems([...currItems]);
                      }}
                    >
                      <div className={classes.itemBox}>
                        <img className={classes.itemImg} src={item.thumbnail} />
                        <div className={classes.itemName}>{item.display_name}</div>
                        <div className={classes.priceContainer}>
                          {/*<svg style={{width: "1rem",height: "1rem"}} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="css-13htjwu"><path d="M16.25 32C25.0866 32 32.25 24.8366 32.25 16C32.25 7.16344 25.0866 0 16.25 0C7.41344 0 0.25 7.16344 0.25 16C0.25 24.8366 7.41344 32 16.25 32Z" fill="url(#paint0_linear_0_3)"></path><path d="M16.25 3.83998C23.45 3.83998 29.37 9.59998 29.85 16.64C29.85 16.32 29.85 16.16 29.85 15.84C29.85 8.31998 23.77 2.23998 16.25 2.23998C8.73 2.23998 2.65 8.31998 2.65 15.84C2.65 16.16 2.65 16.32 2.65 16.64C3.13 9.59998 9.05 3.83998 16.25 3.83998Z" fill="#CD8103"></path><path d="M21.85 16.48C21.69 16.32 21.69 16.16 21.53 16.16L20.89 15.68C22.17 9.12002 16.89 6.08002 16.73 5.92002C16.57 5.92002 11.29 8.96002 12.57 15.68L11.93 16.16C11.77 16.32 11.61 16.32 11.61 16.48C10.49 17.92 12.09 19.84 12.09 19.84C12.09 19.84 14.33 17.92 16.73 17.92C19.13 17.92 21.37 19.84 21.37 19.84C21.37 19.84 22.97 17.92 21.85 16.48ZM18.33 14.72C18.33 14.72 17.37 14.4 16.57 14.4C15.77 14.4 14.81 14.72 14.81 14.72C14.33 11.2 16.41 9.44002 16.57 9.44002C16.73 9.44002 18.81 11.2 18.33 14.72ZM17.69 20C17.69 20 17.21 21.6 16.73 22.56C16.25 21.6 15.77 20 15.77 20C14.65 20.32 14.01 20.96 14.01 20.96C14.97 24.32 16.73 27.84 16.73 27.84C16.73 27.84 18.49 24.32 19.45 20.96C19.45 20.96 18.65 20.16 17.69 20Z" fill="#CD8103"></path><path d="M16.25 2.4C23.77 2.4 29.85 8.48 29.85 16C29.85 23.52 23.77 29.6 16.25 29.6C8.73 29.6 2.65 23.52 2.65 16C2.65 8.48 8.73 2.4 16.25 2.4ZM16.25 0C7.45 0 0.25 7.2 0.25 16C0.25 24.8 7.45 32 16.25 32C25.05 32 32.25 24.8 32.25 16C32.25 7.2 25.05 0 16.25 0Z" fill="#FAFF00"></path><path d="M16.25 4.96002C16.09 4.96002 10.81 8.00002 12.09 14.72L11.45 15.2C11.29 15.36 11.13 15.36 11.13 15.52C10.01 16.96 11.61 18.88 11.61 18.88C11.61 18.88 13.85 16.96 16.25 16.96C18.65 16.96 20.89 18.88 20.89 18.88C20.89 18.88 22.49 17.12 21.37 15.52C21.21 15.36 21.21 15.2 21.05 15.2L20.41 14.72C21.69 8.00002 16.41 4.96002 16.25 4.96002ZM14.49 13.92C14.01 10.4 16.09 8.64002 16.25 8.64002C16.41 8.64002 18.49 10.56 18.01 13.92C18.01 13.92 17.05 13.6 16.25 13.6C15.45 13.6 14.49 13.92 14.49 13.92ZM17.21 19.04C17.21 19.04 16.73 20.64 16.25 21.6C15.77 20.64 15.29 19.04 15.29 19.04C14.17 19.36 13.53 20 13.53 20C14.49 23.36 16.25 26.88 16.25 26.88C16.25 26.88 18.01 23.36 18.97 20C18.97 20 18.17 19.36 17.21 19.04Z" fill="#FAFF00"></path><path d="M7.45002 12.8C7.45002 9.76002 4.89002 7.20002 1.85002 7.20002C4.89002 7.20002 7.45002 4.64002 7.45002 1.60002C7.45002 4.64002 10.01 7.20002 13.05 7.20002C10.01 7.20002 7.45002 9.76002 7.45002 12.8Z" fill="white"></path><defs><linearGradient id="paint0_linear_0_3" x1="0.25" y1="0" x2="32.25" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#EFE726"></stop><stop offset="0.83281" stop-color="#DF9D07"></stop></linearGradient></defs></svg>*/}
                          <span>${item.priceUSD}</span>
                        </div>
                      </div>  
                    </div> 
                  )
                })}
              </div>
            </div>
            )}
          </div>     
        </div>
      </div>
    )
  );
};

MarketPage.propTypes = {
  user: PropTypes.object,
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {})(MarketPage);