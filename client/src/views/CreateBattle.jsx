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
    width: "calc(20% - 9.6px)",
    flexBasis: "calc(20% - 9.6px)",
    height: "300px",
    display: "flex !important",
    flexDirection: "column",
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
    "@media (max-width: 1300px)": {
      flexBasis: "calc(33.33% - 9.6px)",
    },
    "@media (max-width: 1500px)": {
        flexBasis: "calc(25% - 9px)",
    },
  },
  addIcon: {
    width: "54px",
    height: "54px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "27px",
    borderRadius: "4px",
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
    width: "calc(25% - 12px)",
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
    imageRendering: 'pixelated',

    width: "100%",
    height: "132px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Rubik",
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
    background: "linear-gradient(225deg,#12171D 30%,#1C2344),#2a2a38",
    boxShadow: "0 0 16px rgba(0,0,0,.24),0 0 0 1px #FFC440",
  },
  caseCount: {
    width: "100%",
    marginTop: "8px",
    padding: "0 10px",
  },
  countInner: {
    width: "100%",
    height: "46px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    fontSize: "20px",
    fontWeight: 600,
    color: "#effafb",
    background: "#0D1116",
    boxShadow: "inset 0 0 12px rgba(0,0,0,.48)",
    zIndex: 1,
    "&::before": {
      
    }
  },
  countInnerBefore:{
    content: "",
    width: "35px",
    height: "35px",
    position: "absolute",
    top: "50%",
    ["-webkit-transform"]: "translateY(-51%) rotate(45deg)",
    transform: "translateY(-51%) rotate(45deg)",
    borderRadius: "5px",
    background: "#0D1116",
    zIndex: -1,
    left: "-13.5px",
    boxShadow: "inset 7px 0 12px -7px rgba(0,0,0,.48),inset 0 -7px 12px -7px rgba(0,0,0,.48)",
  },
  countInnerAfter: {
    content: "",
    width: "35px",
    height: "35px",
    position: "absolute",
    top: "50%",
    ["-webkit-transform"]: "translateY(-51%) rotate(45deg)",
    transform: "translateY(-51%) rotate(45deg)",
    borderRadius: "5px",
    background: "#0D1116",
    zIndex: -1,
    right: "-13.5px",
    boxShadow: "inset 0 7px 12px -7px rgba(0,0,0,.48),inset -7px 0 12px -7px rgba(0,0,0,.48)",
  },
  buttonDecrease: {
    cursor: "pointer",
    left: "-8.5px",
    width: "25px",
    height: "25px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    ["-webkit-transform"]: "translateY(-50%) rotate(45deg)",
    transform: "translateY(-50%) rotate(45deg)",
    borderRadius: "5px",
    background: "#23242c",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,.48)",
  },
  buttonIncrease: {
    cursor: "pointer",
    right: "-8.5px",
    width: "25px",
    height: "25px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    ["-webkit-transform"]: "translateY(-50%) rotate(45deg)",
    transform: "translateY(-50%) rotate(45deg)",
    borderRadius: "5px",
    background: "#23242c",
    border: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,.48)",
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
  }
}));

  /*buttonRemove: {
    width: "22px",
    height: "22px",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "11px",
    right: "11px",
    ["-webkit-transform"]: "rotate(45deg)",
    transform: "rotate(45deg",
    borderRadius: "4px",
    background: "#23242c",
    border: "2px solid var(--sitePrimary)",
  },
  buttonRemoveSvg: {
    width: "20px",
    height: "20px",
    ["-webkit-transform"]: "rotate(-45deg)",
    transform: "rotate(-45deg)",
    fill: "#fff",
  }*/

const CreateBattle = ({ user, isAuthenticated }) => {
  const classes = useStyles();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [availableCases, setAvailableCases] = useState([]);
  const [selectedCases, setSelectedCases] = useState([]);
  const [totalCaseCount, setTotalCaseCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMode, setSelectedMode] = useState("1v1");
  const [selectedBox, setSelectedBox] = useState("standard");
  const [addCasesDialogOpen, setAddCasesDialogOpen] = useState(false);
  const [sortType, setSortType] = useState("highest");
  const [searchInputState, setSearchInputState] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const cases = await getActiveCases();
      setAvailableCases(cases);      
      setLoading(false)
    } catch (error) {
      console.log("There was an error while loading active case data:", error);
    }
  };

  const history = useHistory();

  useEffect(() => {
    fetchData();

    const error = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const fwd = (battleId) => {
      playSound(placebetAudio);
      history.push(`/battles/${battleId}`);
    }
    
    battlesSocket.on("battles:error", error);
    battlesSocket.on("battles:success", success);
    battlesSocket.on("battles:created", fwd);

    return () => {
      battlesSocket.off("battles:error", error);
      battlesSocket.off("battles:success", success);
      battlesSocket.off("battles:created", fwd);
    };
  }, []);

  const handleCreateBattle = () => {
    battlesSocket.emit(
      "battles:create",
      selectedCases,
      selectedBox,
      selectedMode,
      totalCost,
      totalCaseCount,
    )
  };

  const handleModeChange = event => {
    setSelectedMode(event.target.value);
  };

  const handleClick = async (item) => {
    let newarr = selectedCases;
    newarr.push(item);
    newarr.sort((a, b) => a.price - b.price)
    setSelectedCases(newarr);
    setTotalCaseCount(totalCaseCount+1);
    setTotalCost(parseFloat((totalCost).toFixed(2))+parseFloat((item.price).toFixed(2)));
  };

  const handleRemoveOne = async (item) => {
    const arr = selectedCases;
    const index = selectedCases.findIndex(obj => obj.id === item.id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    setSelectedCases(arr);
    setTotalCaseCount(totalCaseCount-1);
    setTotalCost(parseFloat((totalCost).toFixed(2))-parseFloat((item.price).toFixed(2)));
  };

  const handleAddOne = async (item) => {
    let newarr = selectedCases;
    newarr.push(item);
    newarr.sort((a, b) => a.price - b.price);
    setSelectedCases(newarr);
    setTotalCaseCount(totalCaseCount+1);
    setTotalCost(parseFloat((totalCost).toFixed(2))+parseFloat((item.price).toFixed(2)));
  };

  const handleSearchInputChange = event => {
    setSearchInputState(event.target.value);
  };

  const renderCaseOptions = () => {
    let sortedCases = [...availableCases]; 

    const searchInput = searchInputState; 
    const filteredCases = sortedCases.filter(item =>
      item.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    if (sortType === "highest") {
      filteredCases.sort((a, b) => b.price - a.price);
    } else if (sortType === "lowest") {
      filteredCases.sort((a, b) => a.price - b.price);
    }

    let allBoxes = [];
    try {
      allBoxes.push(
        filteredCases.map((item, i) => (
          <div className={`${classes.battleCreatorCase} ${selectedCases.find(e => e.id === item.id) ? classes.selectedCase : ""}`} key={item.id} >
            <a href={'https://rbxchance.com/cases/' + item.slug} target="_blank" rel="noopener noreferrer">
              <div className={classes.linkBox}>
                <svg stroke="#7D8587" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
              </div>
            </a>
            <div className={classes.caseImage}>
              <img src={item.image} style={{ height: "110px" }}/>
            </div>
            <div className={classes.caseName}>{item.name}</div>
            <div className={classes.casePrice}>
              <div className={classes.casePriceWrapper}>
                ${parseFloat((item.price).toFixed(2))}
              </div>
            </div>
            {selectedCases.find(e => e.id === item.id) ? (
              <div className={classes.caseCount}>
                <div className={classes.countInner}>
                  <div className={classes.countInnerBefore} />
                  <div
                    variant="contained"
                    className={classes.buttonDecrease}
                    onClick={() => handleRemoveOne(item)}
                  >
                    <span style={{ ["-webkit-transform"]: "rotate(-45deg)", transform: "rotate(-45deg)", fontSize: "24px", fontWeight: 500 }}>-</span>
                  </div>
                  {selectedCases.filter((caseItem) => caseItem.id === item.id).length}
                  <div
                    variant="contained"
                    className={classes.buttonIncrease}
                    onClick={() => handleAddOne(item)}
                  >
                    <span style={{ ["-webkit-transform"]: "rotate(-45deg)", transform: "rotate(-45deg)", fontSize: "24px", fontWeight: 500 }}>+</span>
                  </div>
                  <div className={classes.countInnerAfter} />
                </div>
              </div>
            ) : (
              <Button
                variant="contained"
                className={classes.addCaseButton}
                onClick={() => handleClick(item)}
              >
                Add Case
              </Button>
            )}
          </div>
        ))
      );
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };  

  const renderSelectedCases = () => {
    let allBoxes = [];
      try {
      const uniqueCases = [...new Set(selectedCases.map((item) => item.id))];
  
      uniqueCases.forEach((id) => {
        const item = selectedCases.find((item) => item.id === id);
  
        allBoxes.push(
          <div className={`${classes.battleCreatorCase} ${classes.selectedCase} ${classes.specialWidth}`} key={item.id} >
            <div className={classes.caseImage}>
              <img src={item.image} style={{ height: "110px" }}/>
            </div>
            <div className={classes.caseName}>{item.name}</div>
            <div className={classes.casePrice}>
              <div className={classes.casePriceWrapper}>
                ${parseFloat((item.price).toFixed(2))}
              </div>
            </div>
            <div className={classes.caseCount}>
              <div className={classes.countInner}>
                <div className={classes.countInnerBefore} />
                <div
                  variant="contained"
                  className={classes.buttonDecrease}
                  onClick={() => handleRemoveOne(item)}
                >
                  <span style={{ ["-webkit-transform"]: "rotate(-45deg)", transform: "rotate(-45deg)", fontSize: "24px", fontWeight: 500 }}>-</span>
                </div>
                {selectedCases.filter((caseItem) => caseItem.id === item.id).length}
                <div
                  variant="contained"
                  className={classes.buttonIncrease}
                  onClick={() => handleAddOne(item)}
                >
                  <span style={{ ["-webkit-transform"]: "rotate(-45deg)", transform: "rotate(-45deg)", fontSize: "24px", fontWeight: 500 }}>+</span>
                </div>
                <div className={classes.countInnerAfter} />
              </div>
            </div>
          </div>
        );
      });
    } catch (error) {
      console.log(error);
    }
  
    return allBoxes;
  }

  const boxes = renderCaseOptions();
  const selectedBoxes = renderSelectedCases();
  
  return (
    <div>
      <Box className={classes.root}>
        <Container className={classes.container}>
          <div className={classes.topRow}>
            <Button
              color="primary"
              className={classes.cancelButton}
              component={Link}
              to="/battles"
            >
              <ExIcon style={{ height: 20, marginRight: "12px", fill: "rgba(239,250,251,.2)" }} /> Cancel Battle
            </Button>
            <div variant="h4" className={classes.title}>
              Create Case Battle
            </div>
            <div className={classes.boxContainer}>
              <div className={classes.darkBox}>
                <Typography variant="body1" className={classes.roundsBox}>
                  Rounds <div style={{ fontWeight: 600, color: "#effafb"}}>{totalCaseCount}</div>
                </Typography>
              </div>
              <div className={classes.darkBox}>
                <Typography variant="body1" className={classes.totalCostBox}>
                  Total Cost <div className={classes.priceWrapper}>${totalCost}</div>
                </Typography>
              </div>
              <Button
                variant="contained"
                color="primary"
                className={classes.createBattleButton}
                onClick={handleCreateBattle}
              >
                Create Battle
              </Button>
            </div>
          </div>
          <div className={classes.battleCreatorControl}>
            <div className={classes.battleControlSettings}>
              <div className={classes.battleCreatorType}>
                <FormControl>
                  <Select
                    value={selectedMode}
                    onChange={handleModeChange}
                    className="button-toggle"
                  >
                    <MenuItem value="1v1">1v1</MenuItem>
                    <MenuItem value="1v1v1">1v1v1</MenuItem>
                    <MenuItem value="1v1v1v1">1v1v1v1</MenuItem>
                    <MenuItem value="2v2" >2v2</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <Button className={`${classes.button} ${selectedBox === "standard" ? classes.selected : ""}`} onClick={() => setSelectedBox("standard")}>Standard</Button>
              <Button className={`${classes.button} ${ selectedBox === "crazy" ? classes.selectedCrazy : ""}`} onClick={() => setSelectedBox("crazy")}>Crazy</Button>
            </div>
          </div>
          <div className={classes.creatorList}>
            <Dialog 
              classes={{ paperWidthSm: 'custom-dialog' }} 
              open={addCasesDialogOpen} 
              onClose={() => setAddCasesDialogOpen(true)}
            >
              <div className={classes.modalContent}>
                <header className={classes.modalHeader}>
                  <div className={classes.headerTitle}>Select Cases</div>
                  <Typography className={classes.roundsBox}>
                    Rounds <div style={{ fontWeight: 600, color: "#effafb"}}>{totalCaseCount}</div>
                  </Typography>
                  <Typography className={classes.totalCostBox}>
                    Total Cost <div className={classes.priceWrapper}>${totalCost}</div>
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.cancelButton}
                    style={{ padding: "0px" }}
                    onClick={() => setAddCasesDialogOpen(false)}
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
                        placeholder="Search cases..."
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
            <div className={classes.buttonAdd} onClick={() => setAddCasesDialogOpen(!addCasesDialogOpen)} >
              <div className={classes.addIcon}>
                <svg style={{["-webkit-transform"]: "rotate(-45deg)", transform: "rotate(-45deg)", fill: "#fff"}} width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.2354 0.96109C10.6831 0.96109 10.2354 1.4088 10.2354 1.96109V10.7429H1.23535C0.683067 10.7429 0.235352 11.1906 0.235352 11.7429V13.6556C0.235352 14.2079 0.683067 14.6556 1.23535 14.6556H10.2354V23.4375C10.2354 23.9897 10.6831 24.4375 11.2354 24.4375H13.2354C13.7876 24.4375 14.2354 23.9897 14.2354 23.4375V14.6556H23.2354C23.7876 14.6556 24.2354 14.2079 24.2354 13.6556V11.7429C24.2354 11.1906 23.7876 10.7429 23.2354 10.7429H14.2354V1.96109C14.2354 1.40881 13.7876 0.96109 13.2354 0.96109H11.2354Z"></path></svg>
              </div>
              <div style={{ display: "flex" }}>
                Add Case
              </div>
            </div>
            {selectedBoxes}
          </div>
        </Container>
      </Box>
    </div>
  );
};

CreateBattle.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(CreateBattle);