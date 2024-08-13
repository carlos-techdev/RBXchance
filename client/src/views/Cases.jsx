import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core';
import { getActiveCases } from "../services/api.service";
import { useToasts } from "react-toast-notifications";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { useHistory } from 'react-router-dom';
import Button from "@material-ui/core/Button";

import error from "../assets/error.wav";

const errorAudio = new Audio(error);

const playSound = audioFile => {
  audioFile.play();
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: "32px",
    minHeight: "calc(100vh - 7rem)",
    color: "#fff",
    fontFamily: "Rubik",
    overflowY: "hidden"
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
  },
  topBarLeft:  {
    display: "flex",
    marginRight: "32px",
    flexShrink: 0,
  },
  topBarRight: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "flex-end",
  },
  optionButton: {
    padding: "11px 16px",
    fontWeight: 400,
    lineHeight: "130%",
    letterSpacing: ".1px",
    color: "#fff",
    transition: "all .2s ease",
    whiteSpace: "nowrap",
    cursor: "pointer",
    textDecoration: "none",
    border: "none",
    background: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      filter: "brightness(130%)",
    }
  },
  searchInput: {
    backgroundImage: "url(https://bloxflip.com/_next/static/media/search.0e434388.svg)",
    backgroundPosition: "calc(100% - 8px)",
    backgroundSize: "24px auto",
    backgroundRepeat: "no-repeat",
    maxWidth: "406px",
    paddingRight: "40px",
    border: "1px solid #161D26",
    width: "100%",
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
  button: {  
    textTransform: "none",
    width: "100px",
    padding: "0 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "8px",
    borderRadius: "4px",
    fontSize: "15px",
    fontWeight: 400,
    color: "rgba(239,250,251,.72)",
    background: "#12171D",
    transition: "all .3s ease",
    fontFamily: "Rubik",
    border: "1px solid #161D26",
  },
  selected: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
  caseListContainer: {
    gap: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(calc(15% - .5rem),1fr))",
    "@media (max-width: 1000px)": {
      gridTemplateColumns: "repeat(auto-fill,minmax(calc(20% - .5rem),1fr))",
    },
    "@media (max-width: 800px)": {
      gridTemplateColumns: "repeat(auto-fill,minmax(calc(30% - .5rem),1fr))",
    },
    gridGap: "30px",
  },
  caseContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "24px 12px",
    background: "#12171D",
    border: "1px solid #161D26",
    borderRadius: "16px",
    transition: "all .3s ease",
    willChange: "background",
    overflow: "hidden",
    position: "relative",
    "&:hover": {
      filter: "brightness(130%)",
      transform: "scale(1.02)"
    }
  },
  caseImageContainer: {
    width: "139px",
    height: "139px",
    margin: "0 auto",
    position: "relative",
        transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
    transitionDuration: '.15s',
    maxWidth: '110px',

    imageRendering: 'pixelated',

  },
  caseImage: {
    transitionProperty: 'all',
    transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
    transitionDuration: '.15s',
    maxWidth: '110px',

    imageRendering: 'pixelated',
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    margin: "0 auto",
    position: "relative",
  },
  caseName: {
    color: "#818ebb",
    marginBottom: "8px",
    textAlign: "center",
    fontWeight: 400,
    lineHeight: "1.2857142857",
    letterSpacing: ".1px",
    margin: 0
  },
  caseCost: {
    color: "#fff",
    textAlign: "center",
    lineHeight: 1.125,
    margin: 0,
    padding: 0,
    letterSpacing: ".1px",
    fontWeight: 600,
  }
}));


const CasesPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(false);
  const [availableCases, setAvailableCases] = useState([]);
  const [sortType, setSortType] = useState("highest");
  const [searchInputState, setSearchInputState] = useState("");


  useEffect(() => {
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

    fetchData();


    return () => {

    };
  }, [addToast]);

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
          <a onClick={() => history.push(`/cases/` + item?.slug)}>
            <div className={classes.caseContainer}>
              <div className={classes.caseImageContainer}>
                <img className={classes.caseImage} src={item?.image} />
              </div>
              <p className={classes.caseName}>{item?.name}</p>
              <h3 className={classes.caseCost}>${parseCommasToThousands(item?.price)}</h3>
            </div>
          </a>
        ))
      );
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };  

  const boxes = renderCaseOptions();
  
  return (
    <div className={classes.root}>
      <div className={classes.topBar}>
        <div className={classes.topBarLeft}>
          <a className={classes.optionButton} onClick={() => history.push(`/battles`)}>Case Battles</a>
          <a className={classes.optionButton} onClick={() => history.push(`/cases`)}>Open Single Case</a>
        </div>
        <div className={classes.topBarRight}>
          <input
            className={classes.searchInput}
            type="text"
            placeholder="Search name of case"
            value={searchInputState}
            onChange={handleSearchInputChange}
          />
          <Button
              className={`${classes.button} ${sortType === "highest" ? classes.selected : ""}`}
              style={{ width: "80px", marginLeft: "0.5rem ", fontSize: "0.7rem" }}
              onClick={() => setSortType("highest")}
          >
            Highest
          </Button>
          <Button
              className={`${classes.button} ${sortType === "lowest" ? classes.selected : ""}`}
              style={{ width: "80px", fontSize: "0.7rem" }}
              onClick={() => setSortType("lowest")}
          >
            Lowest
          </Button>
        </div>
      </div>
      <div className={classes.caseListContainer}>
        {boxes}
      </div>
    </div>
  );
};

export default CasesPage;