import React, { useState, useEffect, Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { getActiveBattlesGame } from "../services/api.service";
import { battlesSocket } from "../services/websocket.service";
import Countdown from "react-countdown";
import PropTypes from "prop-types";
import _, { findLastIndex } from "underscore";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import cutDecimalPoints from "../utils/cutDecimalPoints";
import { NavLink as Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';


// MUI Components
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

// Icons

// components
import Preloader from "../Preloader";

const useStyles = makeStyles(theme => ({
  root: {
    padding: "32px",
    minHeight: "calc(100vh - 7rem)",
    color: "#fff",
    fontFamily: "Rubik",
    overflowY: "hidden"
  },
  topBar: {
    width: "100%",
    margin: "1.5rem auto",
    marginTop: "2.3rem",
    // backgroundColor: "#25282c !important",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    alignItems: "center",
    gap: "12px",
  },
  left: {
  },
  right: {
    display: "flex",
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
  createBattle: {
    border: "1px solid #FFC440",
    background: "#FFC440",
    textTransform: "none",
    color: "#000",
    fontFamily: "Rubik",
    "&:hover": {
      boxShadow: "0px 0px 8px #FFC440",
      background: "#FFC440"
    }
  },
  rowBattleList: {

  },
  rowOverview: {
    color: "#fff",
    textAlign: "center",
    fontSize: ".9rem",
    letterSpacing: "1px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },  
  roundsCol: {
    display: "flex",
    width: "9.5rem"
  },
  casesCol: {
    width: "100%",
    padding: 0,
    margin: 0,
  },
  priceCol: {
    display: "flex",
    width: "8rem"
  },
  playersCol: {
    margin: "auto",
    marginRight: "3rem"
  },
  statusCol: {
    display: "flex",
    width: "10rem",
    marginRight: "1.25rem",
    justifyContent: "flex-end",
  },
  noGames: {
    display: "flex",
    flexDirection: "column",
    height: "40rem",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  container: {
    width: "100%",
    minHeight: "32.5rem",
    paddingTop: 50,
    paddingBottom: 120,
    [theme.breakpoints.down("sm")]: {
      paddingTop: 25,
    },
    "& > div": {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        margin: "auto",
      },
    },
  },
  a: {
    textDecoration: "none",
    color: "inherit",
    width: "100%",
    color: "#007bff",
    textDecoration: "none",
    backgroundColor: "initial",
  },
  rowBattleRunning: {
    display: "flex",
    flexWrap: "wrap",
    position: "relative",
    background: "#12171D",
    width: "100%",
    borderRadius: "4px",
    marginTop: "1rem",
    border: "1px solid #161D26",
    padding: "1rem 0",
    transition: "all .3s ease-in-out",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)"
    }
  },
  square: {
    border: "1px solid #0D1116",
    background: "#0D1116",
    borderRadius:" 4px",
    width: "4rem",
    height: "4rem",
    margin: "auto",
  },
  number: {
    color: "#fff",
    display: "block",
    margin: "auto 0",
    textAlign: "center",
    padding: "calc(1rem - 2px)",
    lineHeight: "2rem",
    fontSize: "1.4rem",
    fontWeight: 500,
  },
  text: {
    color: "#838b8d",
    display: "block",
    margin: "6px 0 auto",
    textAlign: "center",
  },
  svgDot: {
    position: "absolute",
    top: 0,
    right: "15%",
    width: "2rem",
    ["-webkit-animation"]: "blink-b4490708 1.25s infinite",
    animation: "blink-b4490708 1.25s infinite",
    transition: "all .25s ease-in-out",
  },
  caseDisplay: {
    background: "#0D1116",
    borderRadius: "4px",
    overflow: "hidden",
    gridArea: "cases",
    padding: "8px 0",
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: "100%",
    width: "100%"
  },
  caseRight: {
    background: "linear-gradient(90deg,rgba(21,23,25,.8),rgba(31,34,37,0))",
    borderRadius: "4px 0 0 4px",
    ["-webkit-transform"]: "matrix(-1,0,0,1,0,0)",
    transform: "matrix(-1,0,0,1,0,0)",
    height: "100%",
    width: "30%",
    right: "-1px",
    position: "absolute",
    zIndex: 1,
    top: 0,
  },
  scroller: {
    //overflowY: "scroll",
    height: "100%",
  },
  case: {
    flexGrow: 0,
    marginLeft: "1rem",
    backgroundSize: "100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50%",
    maxHeight: "110px"
  },
  caseList: {  
    display: "flex",
    height: "100%",
    width: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  newPrice: {
    display: "block",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "1.15rem",
    margin: "auto",
    marginLeft: "auto",
    marginLeft: "1rem",
  },
  newPriceWrapper: {
    display: "inline-flex",
    alignItems: "baseline",
    color: "#eee !important",
  },
  newPriceWrapperImg: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    height: "1rem",
    width: "1rem",
    marginRight: "6px",
  },
  squareWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "1rem 0",
    boxSizing: "border-box",
  },
  imageCol: {
    boxShadow: "0 0 0 1px #FFC440",
    background: "#fff",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    height: "24px",
    width: "24px",
    justifyContent: "center",
    alignItems: "center",
  },
  rowSquareShort: {
    display: "inline-grid",
    borderRadius: "4px",
    ["-webkit-transform"]: "rotate(-45deg)",
    transform: "rotate(-45deg)",
    gridTemplateRows: "1fr 1fr",
    gridTemplateColumns: "1fr 1fr",
    gap: ".4rem",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  img:{
    width: "100%",
    position: "absolute",
    height: "24px",
    width: "24px",
    ["-webkit-transform"]: "rotate(45deg) scale(1.5)",
    transform: "rotate(45deg) scale(1.5)",
  },
  buttonGreenStripe: {
    fontWeight: 600,
    textTransform: "uppercase",
    padding: ".5rem 1.75rem",
    border: "1px solid #4ea24d",
    background: "#4ea24d",
    backgroundImage: "none",
    backgroundSize: "auto",
    backgroundColor: "#4ea24d",
    color: "#fff",
    fontSize: ".95rem",
    borderRadius: "4px",
    letterSpacing: "1px",
    cursor: "pointer",
    marginLeft: "1.25rem",
    transition: "all .15s ease-in-out",
    verticalAlign: "middle",
    display: "inline-block",
    boxSizing: "border-box"
  },
  noOne: {
    background: "#1a1d20;",
    border: "1px dashed rgba(239,250,251,.2)",
    borderRadius: "4px",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    height: "24px",
    width: "24px",
    justifyContent: "center",
    alignItems: "center",
  },
  activeBattle: {
    background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.08) 0, rgba(0, 0, 0, 0.08) 20px), linear-gradient(90deg,rgba(255, 195, 64,.5),#12171D 50%,#12171D)",
    border: "none",
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
  topBar2: {
    display: "flex",
    alignItems: "center",
    marginBottom: "40px",
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
    backgroundSize: "24px auto",
    height: "42px",
  },
  selected: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
  selected2: {
    color: "#effafb",
    background: "#2a2a38",
    border: "2px solid #FFC440 !important",
  },
}));

const Battles = ({ user, isAuthenticated }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [spinningBattlesCount, setSpinningBattlesCount] = useState(0);
  const [joinableBattlesCount, setJoinableBattlesCount] = useState(0);
  const [sortType, setSortType] = useState("highest");
  const [sortType2, setSortType2] = useState("waiting");


  // componentDidMount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedGames = await getActiveBattlesGame();
        
        const sortedGames = fetchedGames.sort((a, b) => {
          if (a.status === 1 && b.status === 2) {
            return -1; 
          } else if (a.status === 2 && b.status === 1) {
            return 1; 
          }
          return 0; 
        });        
        
        setGames(fetchedGames);
    
        let jbc = 0;
        let sbc = 0;
        for (let i = 0; i < fetchedGames.length; i++) {
          if (fetchedGames[i].status === 1) {
            jbc++;
          } else {
            sbc++;
          }
        }
    
        setJoinableBattlesCount(jbc);
        setSpinningBattlesCount(sbc);
    
        setLoading(false);
      } catch (error) {
        console.log("There was an error while loading case battles data:", error);
      }
    };    

    // Initially, fetch data
    fetchData();

    // Error event handler
    const error = msg => {
      addToast(msg, { appearance: "error" });
    };

    // Error event handler
    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const newBattle = data => {
      setJoinableBattlesCount(prev => prev + 1);
      console.log(data)
      setGames(state => (state ? [data, ...state] : null));
    }

    const battlesStart = data => {
      setJoinableBattlesCount(prev => prev-1);
      setSpinningBattlesCount(prev => prev+1);

      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game.id === data.battleId) {
            return { ...game, status: 2 };
          }
          return game;
        });
        return updatedGames;
      });
    }

    const battlesRound = data => {

    }

    const battlesJoin = data => {
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game.id === data.battleId) {
            const updatedPlayers = [...game.players, data.user];
            return { ...game, players: updatedPlayers };
          }
          return game;
        });
        return updatedGames;
      });
    }

    const battlesFinised = data => {
      setGames(prevGames => prevGames.filter(game => game.id !== data.battleId));
      setSpinningBattlesCount(prev => prev-1);
    }

    // Listeners
    battlesSocket.on("battles:new", newBattle);
    battlesSocket.on("battles:start", battlesStart);
    battlesSocket.on("battles:round", battlesRound);
    battlesSocket.on("battles:join", battlesJoin);
    battlesSocket.on("battles:finished", battlesFinised);

    return () => {
      // Remove Listeners
      battlesSocket.off("battles:new", newBattle)
      battlesSocket.off("battles:start", battlesStart);
      battlesSocket.off("battles:round", battlesRound);
      battlesSocket.off("battles:join", battlesJoin);
      battlesSocket.off("battles:finished", battlesFinised);
    };
  }, [addToast]);

  const fwd = (item) => {
    history.push(`/battles/${item.id}`);
  }

  const renderGamesBoxes = () => {
    let sortedGames = [...games]; 

    if (sortType === "highest") {
      sortedGames.sort((a, b) => b.price - a.price);
    } else if (sortType === "lowest") {
      sortedGames.sort((a, b) => a.price - b.price);
    }

    if (sortType2 === "waiting") {
      sortedGames.sort((a, b) => {
        if (a.status === 1 && b.status !== 1) return -1; 
        if (a.status !== 1 && b.status === 1) return 1; 
        return 0; 
      });
    } else if (sortType2 === "running") {
      sortedGames.sort((a, b) => {
        if (a.status === 2 && b.status !== 2) return -1; 
        if (a.status !== 2 && b.status === 2) return 1; 
        return 0;
      });
    }
    

    let allBoxes = [];
    try {
      const boxes = sortedGames.map((item) => {
        const elements = [];
        for (let i = 1; i < item.playerCount; i++) {
          if (item.players[i]) {
            elements.push(
              <div className={classes.imageCol}>
                <img className={classes.img} src={item.players[i].pfp} />
              </div>
            );
          } else {
            elements.push(<div className={classes.noOne}></div>);
          }
        }

        return (
          <a className={`${classes.a}}`} key={item.id} >
            <div className={`${classes.rowBattleRunning} ${item.status == 2 ? classes.activeBattle : ""}`} onClick={() => fwd(item)}>
              <div className={classes.roundsCol}>
                <div style={{ margin: "auto "}}>
                  <div className={classes.square}>
                    <span className={classes.number}>{item.cases.length}</span>
                    <span className={classes.text}>{item.status == 2 ? "Running" : "Rounds"}</span>
                  </div>
                </div>
              </div>
              <div className={classes.caseDisplay}>
                <div className={classes.right} />
                <div className={classes.scroller}>
                  <div className={classes.caseList}>
                    {item.cases.map((caseItem) => (
                          <div className={classes.case}><img style={{ maxWidth: "6rem" }} src={caseItem.image} /></div>
                        ))}
                  </div>
                </div>
              </div>
              <div className={classes.priceCol}>
                <span className={classes.newPrice}>
                  <div className={classes.newPriceWrapper}>
                    ${item.price}
                  </div>
                </span>
              </div>
              <div className={classes.playersCol}>
                <div className={classes.squareWrapper}>
                  <div className={classes.rowSquareShort}>
                    <div className={classes.imageCol} ><img className={classes.img} src={item.players[0].pfp} /></div>
                    {elements}
                  </div>
                </div>
                <span className={classes.text}>{item.players.length}/{item.playerCount}</span>
              </div>
            </div>
          </a>
        );
      });
      allBoxes.push(boxes);
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  }

  const gamesBoxes = renderGamesBoxes();

  return (
    <div className={classes.root}>
      <div className={classes.topBar2}>
        <div className={classes.topBarLeft}>
          <a className={classes.optionButton} onClick={() => history.push(`/battles`)}>Case Battles</a>
          <a className={classes.optionButton} onClick={() => history.push(`/cases`)}>Open Single Case</a>
        </div>
        <div className={classes.topBarRight}>
          <Button className={`${classes.button} ${
            sortType2 === "waiting" ? classes.selected2 : ""
          }`} style={{ width: "80px", marginLeft: "0.5rem ", fontSize: "0.7rem" }}
          onClick={() => setSortType2("waiting")}>Waiting</Button>
          <Button className={`${classes.button} ${
            sortType2 === "running" ? classes.selected2 : ""
          }`} style={{ width: "80px", fontSize: "0.7rem" }}
          onClick={() => setSortType2("running")}>Running</Button>
          <Button className={`${classes.button} ${
            sortType === "highest" ? classes.selected : ""
          }`} style={{ width: "80px", marginLeft: "0.5rem ", fontSize: "0.7rem" }}
          onClick={() => setSortType("highest")}>Highest</Button>
          <Button className={`${classes.button} ${
            sortType === "lowest" ? classes.selected : ""
          }`} style={{ width: "80px", fontSize: "0.7rem" }}
          onClick={() => setSortType("lowest")}>Lowest</Button>
        </div>
      </div>
      <div className={classes.topBar}>
          <div className={classes.left}>
            <Link exact to="/battles/create">
              <Button
                size="medium"
                color="#2C3034"
                variant="contained"
                className={classes.createBattle}
              >
                <span>+ Create Battle</span>
              </Button>
            </Link>
          </div>
          <div className={classes.right}>
            <div className={classes.counterWhite}>
              {spinningBattlesCount} Active Battles
            </div>
            <div className={classes.counterGreen}>
              {joinableBattlesCount} Joinable Battles
            </div>
          </div>
        </div>
      <div maxWidth="lg" className={classes.rowBattleList}>
        {/*<div className={classes.rowOverview}>
          <div className={classes.roundsCol}>Rounds</div>
          <div className={classes.casesCol}></div>
          <div className={classes.priceCol}>Price</div>
          <div className={classes.playersCol}>Players</div>
          <div className={classes.statusCol}>Status</div>
        </div>*/}
        <div container spacing={3}>
          {loading ? (
            <Preloader />
          ) : games.length > 0 ? (
            <div>
              {gamesBoxes}
            </div>
          ) : (
            <div className={classes.noGames}>
              <p>No currently active games!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
  
Battles.propTypes = {
  user: PropTypes.object,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Battles);
