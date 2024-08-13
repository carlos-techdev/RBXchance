import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Popup from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import PlusIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import ExIcon from "@material-ui/icons/Close";
import { useToasts } from "react-toast-notifications";
import { getActiveCases } from "../services/api.service";
import { battlesSocket } from "../services/websocket.service";
import FormControl from "@material-ui/core/FormControl";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import placebet from "../assets/placebet.wav";
import error from "../assets/error.wav";
import { TextField } from "@material-ui/core";

const mm2 = require("./items.json");

const mm2Items = [];

// Iterate over the original JSON object
for (const itemName in mm2) {
  if (mm2.hasOwnProperty(itemName)) {
    const item = mm2[itemName];

    if(item.value == 0) continue;
    
    const rearrangedItem = {
      slug: itemName,
      name: item.display_name,
      value: item.value,
      unstable: item.unstable,
      thumbnail: item.thumbnail,
      color: "blue",
      percent: 0.00,
    };

    mm2Items.push(rearrangedItem);
  }
}

const errorAudio = new Audio(error);
const placebetAudio = new Audio(placebet);

const playSound = audioFile => {
  audioFile.play();
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    width: "90%",
    margin: "0 5%",
    paddingTop: 25,
    paddingBottom: 120,
    [theme.breakpoints.down("xs")]: {
      paddingTop: 25,
    },
  },
  container: {
    maxWidth: 1500,
  },
  topRow: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  cancelButton: {
    textTransform: "none",
    height: "50px",
    display: "flex",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 18,
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: 500,
    color: "#effafb",
    background: "linear-gradient(0deg,#12171D,#12171D),#12171D",
    fontFamily: "Rubik",
  },
  roundsBox: {
    width: "128px",
    height: "48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: "12px",
    marginLeft: "12px",
    padding: "0 20px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: 500,
    color: "rgba(239,250,251,.5)",
    background: "#12171D",
    fontFamily: "Rubik",
  },
  totalCostBox: {
    height: "48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: "16px",
    padding: "0 23px",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: 500,
    color: "rgba(239,250,251,.5)",
    background: "hsla(0,0%,100%,.04)",
    border: "2px dashed #FFC440",
    fontFamily: "Rubik",
  },
  priceWrapper: {
    marginLeft: "13px",
    fontSize: "16px",
    fontWeight: 500,
    color: "#FFFFFF !important",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "24px",
  },
  createBattleButton: {
    textTransform: "none",
    height: "48px",
    padding: "0 30px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 600,
    color:" #fff",
    background: "#FFC440",
    border: "none",
    color: "#000000",
    transition: "opacity .3s ease",
    fontFamily: "Rubik",
    "&:hover": {
      opacity: 0.8,
      background: "#FFC440"
    }
  },
  disabled: {  
    cursor: "not-allowed",
    opacity: .25,
  },
  battleCreatorControl: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    width: "100%",
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "2px dashed #12171D",
    borderBottom: "2px dashed #12171D",
    fontFamily: "Rubik",
  },
  battleControlSettings: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: "18px",
    fontFamily: "Rubik",
  },
  battleCreatorType: {
    width: "153px",
    position: "relative",
    marginLeft: "16px",
    zIndex: 6,
    fontFamily: "Rubik",
    "& .button-toggle": {
      width: "100%",
      height: "48px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 11px 0 20px",
      borderRadius: "4px",
      fontSize: "15px",
      fontWeight: "500",
      color: "#effafb",
      background: "#12171D",
      border: "none",
      fontFamily: "Rubik",
    },
    "& .type-menu": {
      width: "100%",
      height: 0,
      position: "absolute",
      top: "53px",
      left: 0,
      overflow: "hidden",
      transition: "height .3s ease",
      "& .menu-inner": {
        width: "100%",
        padding: "3px",
        borderRadius: "5px",
        background: "#2a2a38",
        fontFamily: "Rubik",
        "& .item": {
          width: "100%",
          height: "30px",
          display: "flex",
          alignItems: "center",
          padding: "20px",
          borderRadius: "4px",
          fontSize: "15px",
          fontWeight: 600,
          color: "rgba(239,250,251,.5)",
          background: "0 0",
          border: "none",
          transition: "background .3s ease",
          fontFamily: "Rubik",
        },
      },
    },
  },
  boxContainer: {
    display: "flex",
  },
  box: {
    backgroundColor: "#323232",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    display: "inline-block",
    marginRight: theme.spacing(2),
    fontFamily: "Rubik",
  },
  addCaseContainer: {
    display: "flex",
    alignItems: "center",
  },
  buttonAdd: {
    //background: "linear-gradient(225deg,rgba(99,88,55,0) 50%,rgba(99,88,55,.56)),rgba(56,53,42,.6901960784313725)",
    height: "100px",
    display: "flex !important",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 500,
    color: "#effafb",
    background: "linear-gradient(225deg,#1C2344 30%,#12171D),#2a2a38",
    border: "none",
    boxShadow: "0 2px 16px rgba(0,0,0,.1)",
    fontFamily: "Rubik",
    transition: "all .3s ease",
    "&:hover": {
      transform: "scale(1.03)",
    },
  },
  addIcon: {
    width: "54px",
    height: "54px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    marginRight: "35px",
    ["-webkit-transform"]:" rotate(45deg)",
    transform: "rotate(45deg)",
    background: "linear-gradient(225deg,rgba(77,55,99,0) 50%,rgba(77,55,99,.56)),hsla(0,0%,100%,.08)",
    boxShadow: "0 2px 16px rgba(0,0,0,.24)",
    boxSizing: "border-box",
  },
  creatorList: {
    width: "100%",
    marginTop: "32px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    fontFamily: "Rubik",
  },
  leftMode: {
    width: "100%",
    display: "flex",
    marginTop: "12px",
    marginLeft: 0,
    paddingLeft: 0,
    fontFamily: "Rubik",
    "&::before": {
      content: "",
      width: "2px",
      height: "24px",
      position: "absolute",
      top: "50%",
      left: 0,
      ["-webkit-transform"]: "translateY(-50%)",
      transform: "translateY(-50%)",
      background: "#12171D",
    },
  },
  button: {  
    textTransform: "none",
    width: "100px",
    height: "48px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "8px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    color: "rgba(239,250,251,.72)",
    background: "#12171D",
    //border: "2px solid #2a2a38",
    transition: "all .3s ease",
    fontFamily: "Rubik",
  },
  selected: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
  selectedCrazy: {
    color: "#FF5353",
    background: "#2a2a38",
    border: "2px solid #FF5353 !important",
  },
  modalContent: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    pointerEvents: "auto",
    backgroundColor: "#12171D",
    backgroundClip: "padding-box",
    borderRadius: "4px",
    outline: 0,
    fontFamily: "Rubik",
    maxWidth: "800px"
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem",
    borderTopLeftRadius: "calc(.3rem - 1px)",
    borderTopRightRadius: "calc(.3rem - 1px)",
    fontFamily: "Rubik",
  },
  headerTitle: {
    marginRight: 0,
    fontSize: "20px",
    fontWeight: 600,
    fontFamily: "Rubik",
    color: "#effafb",
  },
  modalBody: {
    padding: "1.5rem !important",
    background: "#0D1116 !important",
    borderLeft: "6px solid #12171D !important",
    borderRight: "6px solid #12171D !important",
    borderBottom: "6px solid #12171D !important",
    position: "relative",
    flex: "1 1 auto",
    fontFamily: "Rubik",
    padding: "1rem",
  },
  inputSearch: {
    width: "100%",
    height: "56px",
    padding: "0 15px 0 49px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    fontFamily: "Rubik",
    color: "#effafb",
    background: "#12171D",
    border: "1px solid #2a2a38",
    outline: "none",
    marginRight: "1rem"
  },
  searchSvg: {
    position: "absolute",
    top: "6.9%",
    left: "30px",
    ["-webkit-transform"]: "translateY(-50%)",
    transform: "translateY(-50%)",
    fill: "rgba(239,250,251,.2)",
    fontFamily: "Rubik",
  },
  modalFilter: {
    display: "flex",
    alignItems: "center",
    fontFamily: "Rubik",
    boxSizing: "border-box",
  },
  buttonToggle: {
    width: "100%",
    height: "48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 11px 0 20px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 600,
    fontFamily: "Rubik",
    color: "#effafb",
    background: "#2a2a38",
    border: "none",
  },
  modalList: {
    width: "100%",
    height: "550px",
    display: "flex",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginTop: "16px",
    padding: "2px",
    fontFamily: "Rubik",
    overflowY: "scroll",
  },
  battleCreatorCase: {
    width: "calc(17.5% - 12px)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: "12px",
    marginBottom: "10px",
    fontFamily: "Rubik",
    padding: "8px 18px 12px",
    borderRadius: "8px",
    background: "#12171D",
    boxShadow: "0 2px 16px rgba(0,0,0,.1)",
    transition: "all .3s ease",
    "@media (max-width: 1200px)": {
      width: "calc(50% - 12px)",
    },
    "@media (max-width: 1600px)": {
      width: "calc(33.33% - 12px)"
    },
  },
  caseImage: {
    
        transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
    transitionDuration: '.15s',
    maxWidth: '110px',

    imageRendering: 'pixelated',
    width: '100%',
    height: '132px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Rubik',
  },
  caseName: {
    height: "40px",
    marginTop: "4px",
    textAlign: "center",
    fontSize: "15px",
    fontFamily: "Rubik",
    fontWeight: 500,
    color: "#effafb",
  },
  casePrice: {
    height: "38px",
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
    fontFamily: "Rubik",
    padding: "0 16px",
    borderRadius: "4px",
    background: "linear-gradient(225deg,rgba(77,55,99,0) 50%,rgba(77,55,99,.56)),hsla(0,0%,100%,.04)",
    boxShadow: "0 2px 16px rgba(0,0,0,.24)",
  },
  casePriceWrapper: {
    fontSize: "15px",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "baseline",
    color: "#eee !important",
  },
  priceWarpperImage: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    height: "1rem",
    width: "1rem",
    marginRight: "6px",
  },
  addCaseButton: {
    textTransform: "none",
    width: "100%",
    height: "46px",
    marginTop: "8px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#222",
    fontFamily: "Rubik",
    background: "#FFC440",
    border: "none",
    outline: "none",
    transition: "all .3s ease",
    "&:hover": {
      background: "#FFC440",
      transform: "scale(1.02)"
    }
  },
  selectedCase: {

  },
  caseCount: {
    marginTop: "8px",
    padding: "0 10px",
    display: "grid",
    gridGap: "0.5rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(calc(50% - 0.5rem), 1fr))",
  },
  specialWidth: {
    width: "calc(20% - 9.6px)",
    "@media (max-width: 1300px)": {
      width: "calc(33.33% - 8px)",
    },
    "@media (max-width: 1500px)": {
      width: "calc(25% - 9px)",
    },
  },
  popup: {
    maWidth: "800px",
    "@media (max-width: 1300px)": {
      flexBasis: "calc(33.33% - 9.6px)",
    },
  },
  linkBox: {
    borderWidth: "1px",
    borderColor: "transparent",
    letterSpacing: "0.05em",
    position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    height: "1.5rem",
    width: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.25rem",
    fontSize: "0.8rem",
    lineHeight: "1.75rem",
    backgroundColor: "#0D1116",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.8
    },
    "&:active": {
      opacity: 0.6
    }
  },
  searchInput: {
    backgroundRepeat: "no-repeat",
    maxWidth: "406px",
    border: "1px solid #161D26",
    width: "80px",
    background: "#12171D",
    borderRadius: "8px",
    padding: "0 16px",
    height: "42px",
    fontWeight: 400,
    outline: "none",
    lineHeight: "130%",
    letterSpacing: ".1px",
    color: "#fff",
    overflow: "visible",
  },
  searchInput2: {
    backgroundRepeat: "no-repeat",
    maxWidth: "406px",
    border: "1px solid #161D26",
    width: "calc(25% - 0.75rem)",
    background: "#12171D",
    borderRadius: "8px",
    padding: "0 16px",
    height: "42px",
    fontWeight: 400,
    outline: "none",
    lineHeight: "130%",
    letterSpacing: ".1px",
    color: "#fff",
    overflow: "visible",
    marginRight: "0.75rem"
  },
  value: {
    position: "relative",
    color: "#fff",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      color: "#fff",
    },
    "& label": {
      color: "#fff",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 500,
      letterSpacing: ".1em",
    },
    "& .MuiInput-border": {
      borderBottom: "2px solid #fff",
    },
    "& > div": {
      width: "100%",
      color: "#fff",
      "& > div": {
        background: "#0D1116 !important",
        color: "#fff",
      },
      "& > div > input": {
        color: "#fff",
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
  },
  button: {  
    textTransform: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "8px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 500,
    color: "rgba(239,250,251,.72)",
    background: "#12171D",
    //border: "2px solid #2a2a38",
    transition: "all .3s ease",
    fontFamily: "Rubik",
  },
  selected: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
}));

const CaseBuilder = ({ user, isAuthenticated }) => {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [cost, setCost] = useState(0);
  const [houseEdge, setHouseEdge] = useState(null);
  const [caseName, setCaseName] = useState("");
  const [caseSlug, setCaseSlug] = useState("");
  const [caseImgUrl, setCaseImageUrl] = useState("");
  const [addItemsDialogOpen, setAddItemsDialogOpen] = useState(false);
  const [searchInputState, setSearchInputState] = useState("");
  const [sortType, setSortType] = useState("highest");

  const calculateNew = () => {

  };

  const getBackgroundForItem = (item) => {
  
    let background = "";
    if (item.color === "blue") {
      background = "linear-gradient(160.31deg, rgba(54, 86, 255, 0.2), rgba(54, 86, 255, 0) 51.78%, rgba(54, 86, 255, 0.2) 104.36%), #12171D"; // blue
    } else if (item.color === "purple") {
      background = "linear-gradient(160.31deg, rgba(124, 46, 223, 0.2), rgba(124, 46, 223, 0) 51.78%, rgba(124, 46, 223, 0.2) 104.36%), #12171D"; // purple
    } else if (item.color === "pink") {
      background = "linear-gradient(160.31deg, rgba(188, 0, 255, 0.2), rgba(188, 0, 255, 0) 51.78%, rgba(188, 0, 255, 0.2) 104.36%), #12171D"; // pink
    } else if (item.color === "gold") {
      background = "linear-gradient(160.31deg, rgba(252, 177, 34, 0.2), rgba(252, 177, 34, 0) 51.78%, rgba(252, 177, 34, 0.2) 104.36%), #12171D"; // gold
    } else if (item.color === "orange") {
      background = "linear-gradient(160.31deg, rgba(255, 119, 76, 0.2), rgba(255, 119, 76, 0) 51.78%, rgba(255, 119, 76, 0.2) 104.36%), #12171D"; // orange
    } else {
      background = "linear-gradient(160.31deg, rgba(240, 50, 118, 0.2), rgba(240, 50, 118, 0) 51.78%, rgba(240, 50, 118, 0.2) 104.36%), #12171D"; // red
    }
  
    return background;
  };

  const percentInputChange = (event, item) => {
    const newValue = event.target.value;

    const itemIndex = selectedItems.findIndex((Item) => Item.slug === item.slug);

    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];

      updatedItems[itemIndex].percent = newValue;

      setSelectedItems(updatedItems);
    }
  };

  const valueChange = (event, item) => {
    const newValue = event.target.value;

    const itemIndex = selectedItems.findIndex((Item) => Item.slug === item.slug);

    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];

      updatedItems[itemIndex].value = newValue;

      setSelectedItems(updatedItems);
    }
  };

  const colorChange = (color, item) => {
    const newValue = color;

    const itemIndex = selectedItems.findIndex((Item) => Item.slug === item.slug);

    if (itemIndex !== -1) {
      const updatedItems = [...selectedItems];

      updatedItems[itemIndex].color = newValue;

      setSelectedItems(updatedItems);
    }
  };

  const handleSearchInputChange = event => {
    setSearchInputState(event.target.value);
  };
  
  const handleRemoveOne = async (item) => {
    let arr = [...selectedItems];
  
    const index = selectedItems.findIndex((obj) => obj.slug === item.slug);
  
    if (index !== -1) {
      arr.splice(index, 1);
  
      arr.sort((a, b) => b.value - a.value);
  
      setSelectedItems(arr);
    }
  };
  
  const handleAddOne = async (item) => {
    let newarr = [...selectedItems];
  
    newarr.push(item);
  
    newarr.sort((a, b) => b.value - a.value);
  
    setSelectedItems(newarr);
  };

  const renderItemOptions = () => {
    let filteredItems = mm2Items.filter(item => item.name.toLowerCase().includes(searchInputState.toLowerCase()));

    if (sortType === "highest") {
      filteredItems.sort((a, b) => b.value - a.value);
    } else if (sortType === "lowest") {
      filteredItems.sort((a, b) => a.value - b.value);
    }

    let allBoxes = [];
    try {
      filteredItems.map((item, i) => {
        allBoxes.push(
        <div className={`${classes.battleCreatorCase} ${selectedItems.find(selectedItem => selectedItem.slug === item.slug) ? classes.selectedCase : ""}`} key={item.slug} >
          <div className={classes.caseImage}>
            <img src={item.thumbnail} style={{ height: "110px" }}/>
          </div>
          <div className={classes.caseName}>{item.name}</div>
          <div className={classes.casePrice}>
            <div className={classes.casePriceWrapper}>
              ${parseFloat((item.value).toFixed(2))}
            </div>
          </div>
          {selectedItems.find(selectedItem => selectedItem.slug === item.slug) ? (
            <Button
              variant="contained"
              className={classes.addCaseButton}
              onClick={() => handleRemoveOne(item)}
            >
              Added
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.addCaseButton}
              onClick={() => handleAddOne(item)}
            >
              Add item
            </Button>
          )}
        </div>
        )
      });
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };  
 
  const renderSelectedItems = () => {
    let allBoxes = [];
      try { 
      selectedItems.map((item, i) => { 
        allBoxes.push(
          <div style={{background: getBackgroundForItem(item)}} className={`${classes.battleCreatorCase} ${classes.selectedCase}`} key={item.slug} >
            <div onClick={() => handleRemoveOne(item)}>
              <div className={classes.linkBox}>
                <svg width="12" height="12" fill="#7D8587" xmlns="http://www.w3.org/2000/svg"><path d="M9.563 2.2H7.25a1.15 1.15 0 0 0-.384-.849A1.378 1.378 0 0 0 5.938 1h-.875c-.349 0-.682.126-.929.351a1.15 1.15 0 0 0-.384.849H1.437a.46.46 0 0 0-.309.117A.383.383 0 0 0 1 2.6c0 .106.046.208.128.283a.46.46 0 0 0 .31.117h8.124a.46.46 0 0 0 .31-.117A.383.383 0 0 0 10 2.6a.383.383 0 0 0-.128-.283.46.46 0 0 0-.31-.117ZM8.5 4h-6a.617.617 0 0 0-.354.104c-.093.067-.146.158-.146.252v5.576c0 .283.158.555.44.755.28.2.662.313 1.06.313h4c.398 0 .78-.113 1.06-.313.282-.2.44-.472.44-.755V4.356c0-.094-.053-.185-.146-.252A.617.617 0 0 0 8.5 4Z"></path></svg>              
              </div>
            </div>
            <div className={classes.caseImage}>
              <img src={item.thumbnail} style={{ height: "110px" }}/>
            </div>
            <div className={classes.caseName}>{item.name}</div>
            <div className={classes.caseCount}>
              <TextField
                className={classes.value}
                label="Price"
                type="text"
                placeholder="0"
                value={parseFloat((item.value).toFixed(2))}
                onChange={(event) => valueChange(event, item)}
              />
              <TextField
                className={classes.value}
                label="%"
                type="text"
                placeholder="0.00%"
                value={item.percent} 
                onChange={(event) => percentInputChange(event, item)}
              />
              <Button className={`${classes.button} ${item.color === "red" ? classes.selected : ""}`} onClick={() => colorChange("red", item)} style={{background: getBackgroundForItem({ color: "red" })}}>red</Button>
              <Button className={`${classes.button} ${item.color === "orange" ? classes.selected : ""}`} onClick={() => colorChange("orange", item)} style={{background: getBackgroundForItem({ color: "orange" })}}>orange</Button>
              <Button className={`${classes.button} ${item.color === "gold" ? classes.selected : ""}`} onClick={() => colorChange("gold", item)} style={{background: getBackgroundForItem({ color: "gold" })}}>gold</Button>
              <Button className={`${classes.button} ${item.color === "pink" ? classes.selected : ""}`} onClick={() => colorChange("pink", item)} style={{background: getBackgroundForItem({ color: "pink" })}}>pink</Button>
              <Button className={`${classes.button} ${item.color === "purple" ? classes.selected : ""}`} onClick={() => colorChange("purple", item)} style={{background: getBackgroundForItem({ color: "purple" })}}>purple</Button>
              <Button className={`${classes.button} ${item.color === "blue" ? classes.selected : ""}`} onClick={() => colorChange("blue", item)} style={{background: getBackgroundForItem({ color: "blue" })}}>blue</Button>
            </div>
          </div>
        );
      });
    } catch (error) {
      console.log(error);
    }
  
    return allBoxes;
  }

  const boxes = renderItemOptions();
  const selectedBoxes = renderSelectedItems();
  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <div className={classes.topRow}>
              <Button
                variant="outlined"
                color="primary"
                className={classes.cancelButton}
                component={Link}
                to="/home"
              >
                <ExIcon style={{ height: 20, marginRight: "12px", fill: "rgba(239,250,251,.2)" }} /> Cancel
              </Button>
              <div variant="h4" className={classes.title}>
                Create Custom Case
              </div>
              <div className={classes.boxContainer}>
                <div className={classes.darkBox}>
                  <Typography variant="body1" className={classes.roundsBox}>
                    Items <div style={{ fontWeight: 600, color: "#effafb"}}>{selectedItems.length}</div>
                  </Typography>
                </div>
                <div className={classes.darkBox}>
                  <Typography variant="body1" className={classes.totalCostBox}>
                    Total Cost <div className={classes.priceWrapper}>${cost}</div>
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.createBattleButton}
                  onClick={() => console.log("yay")}
                >
                  Create Case
                </Button>
              </div>
            </div>
            <div className={classes.battleCreatorControl}>
              <div className={classes.battleControlSettings}>
                <input
                  className={classes.searchInput2}
                  type="text"
                  placeholder="Name of the case..."
                  value={caseName}
                  onChange={(event) => setCaseName(event.target.value)}
                />
                <input
                  className={classes.searchInput2}
                  type="text"
                  placeholder="Case identifier (slug)..."
                  value={caseSlug}
                  onChange={(event) => setCaseSlug(event.target.value)}
                />
                <input
                  className={classes.searchInput2}
                  type="text"
                  placeholder="Case image url..."
                  value={caseImgUrl}
                  onChange={(event) => setCaseImageUrl(event.target.value)}
                />
                <input
                  className={classes.searchInput2}
                  type="text"
                  placeholder="House edge percent..."
                  value={houseEdge}
                  onChange={(event) => setHouseEdge(event.target.value)}
                />
              </div>
            </div>
        <div >
          <div className={classes.buttonAdd} onClick={() => setAddItemsDialogOpen(!addItemsDialogOpen)} >
            <div className={classes.addIcon}>
              <svg style={{["-webkit-transform"]: "rotate(-45deg)", transform: "rotate(-45deg)", fill: "#fff"}} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.2354 0.96109C10.6831 0.96109 10.2354 1.4088 10.2354 1.96109V10.7429H1.23535C0.683067 10.7429 0.235352 11.1906 0.235352 11.7429V13.6556C0.235352 14.2079 0.683067 14.6556 1.23535 14.6556H10.2354V23.4375C10.2354 23.9897 10.6831 24.4375 11.2354 24.4375H13.2354C13.7876 24.4375 14.2354 23.9897 14.2354 23.4375V14.6556H23.2354C23.7876 14.6556 24.2354 14.2079 24.2354 13.6556V11.7429C24.2354 11.1906 23.7876 10.7429 23.2354 10.7429H14.2354V1.96109C14.2354 1.40881 13.7876 0.96109 13.2354 0.96109H11.2354Z"></path></svg>
            </div>
            <div style={{ display: "flex" }}>
              Add item
            </div>
          </div>
        </div>
        <div className={classes.creatorList}>
          <Dialog 
            classes={{ paperWidthSm: 'custom-dialog' }} 
            open={addItemsDialogOpen} 
            onClose={() => setAddItemsDialogOpen(true)}
          >
            <div className={classes.modalContent}>
              <header className={classes.modalHeader}>
                <div className={classes.headerTitle}>Select items</div>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.cancelButton}
                  style={{ padding: "0px" }}
                  onClick={() => setAddItemsDialogOpen(false)}
                >
                  <ExIcon style={{ fill: "rgba(239,250,251,.2)" }} />
                </Button>
              </header>
              <div className={classes.modalBody}>
                <div className={classes.modalFilter}>
                  <div>
                    <SearchIcon className={classes.searchSvg}/>
                    <input
                      className={classes.inputSearch}
                      type="text"
                      placeholder="Search items..."
                      value={searchInputState}
                      onChange={handleSearchInputChange}
                    />
                  </div>
                  <div style={{ marginLeft: "0.7rem", color: "#838b8d" }}>Price:</div>
                  <Button className={`${classes.button} ${
                    sortType === "highest" ? classes.selected : ""
                  }`} style={{ width: "80px", marginLeft: "0.5rem ", fontSize: "0.7rem" }}
                  onClick={() => setSortType("highest")}>Highest</Button>
                  <Button className={`${classes.button} ${
                    sortType === "lowest" ? classes.selected : ""
                  }`} style={{ width: "80px", fontSize: "0.7rem" }}
                  onClick={() => setSortType("lowest")}>Lowest</Button>
                </div>
                <div className={classes.modalList}>
                  {boxes}
                </div>
              </div>
            </div>
          </Dialog>
          {selectedBoxes}
        </div>
      </Container>
    </div>
  );
};

CaseBuilder.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(CaseBuilder);