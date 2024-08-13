import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core';
import { casesSocket } from "../services/websocket.service";
import { useToasts } from "react-toast-notifications";
import parseCommasToThousands from "../utils/parseCommasToThousands";
import { useHistory } from 'react-router-dom';
import confetti from 'canvas-confetti';

import spinSound from "../assets/spin.wav";
import error from "../assets/error.wav";
import confettiSound1 from "../assets/win1.webm";
import confettiSound2 from "../assets/win2.webm";
import confettiSound3 from "../assets/win3.webm";

import tick1 from "../assets/tick1.webm";
import tick2 from "../assets/tick2.webm";
import tick3 from "../assets/tick3.webm";
import tick4 from "../assets/tick4.webm";

const tickAudio1 = new Audio(tick1);
tickAudio1.volume = 0.35;
const tickAudio2 = new Audio(tick2);
tickAudio2.volume = 0.35;
const tickAudio3 = new Audio(tick3);
tickAudio3.volume = 0.35;
const tickAudio4 = new Audio(tick4);
tickAudio4.volume = 0.35;

const tickAudioList = [tickAudio1, tickAudio2, tickAudio3, tickAudio4];

const confettiAudio1 = new Audio(confettiSound1);
confettiAudio1.volume = 0.075;
const confettiAudio2 = new Audio(confettiSound2);
confettiAudio2.volume = 0.075;
const confettiAudio3 = new Audio(confettiSound3);
confettiAudio3.volume = 0.075;

const confettiAudioList = [confettiAudio1, confettiAudio2, confettiAudio3];

const errorAudio = new Audio(error);

const spinAudio = new Audio(spinSound);
spinAudio.playbackRate = 1.3;


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
    backgroundColor: "#12171D",
    borderTopLeftRadius: "8px",
    borderTopRightRadius: "8px",
    position: "relative",
    alignItems: "center",
    border: "1px solid #161D26",
    justifyContent: "space-between",
    width: "100%",
    paddingBottom: ".75rem",
    paddingTop: ".75rem",
    marginBottom: ".5rem",
    display: "flex",
  },
  titleText: {
    textAlign: "center",
    display: "inline-block",
    lineHeight: "1em",
    margin: 0,
    fontSize: "1.5rem",
    color: "#fff",
    fontWeight: 400,
    letterSpacing: 0,
    lineHeight: "140%",
  },
  container: {
    margin: "0 auto",
    flexFlow: "column",
    width: "100%",
    display: "flex",
    position: "relative",
  },
  lootTableTitle: {
    fontWeight: 400,
    fontSize: "1.5rem",
    lineHeight: "140%",
    marginBottom: "1rem",
    marginTop: "2rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  lootTableItemsContainer: {
    gap: ".5rem",
    flexFlow: "row wrap",
    width: "100%",
    display: "flex",
    position: "relative",
  },
  lootBoxContainer: {
    borderRadius: "8px 8px 8px 8px",
    overflow: "hidden",
    width: "calc(20% - .5rem)",
    alignItems: "center",
    justifyContent: "flex-start",
    flexFlow: "column",
    padding: ".5rem",
    display: "flex",
    position: "relative",
  },
  itemImageContainer: {
    imageRendering: 'pixelated', // Add this line

    width: "65px",
    height: '0px',
    paddingTop: "65px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
  },
  itemImage: {
    imageRendering: 'pixelated', // Add this line

    height: "auto",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
  },
  priceContainer: {
    backdropFilter: "blur(7px)",
    background: "hsla(0,0%,100%,.2)",
    borderRadius: "8px",
    padding: ".3rem",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    position: "relative",
  },
  priceText: {
    fontSize: ".875rem",
    lineHeight: "145%",
    color: "#fff",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  itemNameText: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: 400,
    fontSize: ".75rem",
    lineHeight: "150%",
    color: "#b4b9de",
    marginTop: ".25rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  itemPercentContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: ".25rem",
    display: "flex",
    position: "relative",
  },
  itemPercentText: {
    fontSize: ".625rem",
    lineHeight: "150%",
    color: "#b4b9de",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  dropRateText: {
    fontSize: ".625rem",
    lineHeight: "150%",
    color: "#b4b9de",
    marginLeft: ".25rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  chestReelContainer: {
    height: "150px",
    overflowX: "clip",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "1rem",
    display: "flex",
    position: "relative",
  },
  faderLeft: {
    backgroundImage: "linear-gradient(to right,var(--background-color-3a1),var(--background-color-3a0))",
    left: "-1rem",
    height: "150px",
    position: "absolute",
    width: "25%",
    zIndex: 1,
    display: "flex",
    position: "relative",
  },
  faderRight: {
    backgroundImage: "linear-gradient(to left,var(--background-color-3a1),var(--background-color-3a0))",
    right: "-1rem",
    height: "150px",
    position: "absolute",
    width: "25%",
    zIndex: 1,
    display: "flex",
    position: "relative",
  },
  reelInner: {
    transform: "translateX(0px)",
    position: "absolute",
    gap: ".25rem",
    display: "flex",
  },
  reelSelector: {
    backgroundColor: "#fff",
    borderRadius: "0.4rem",
    height: "175px",
    left: "50%",
    position: "absolute",
    width: "4px",
    zIndex: 1,
    display: "flex",
  },
  reelItemContainer: {
    
    height: "145px",
     width: "160px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.4rem",
    paddingRight: ".15rem",
    paddingLeft: ".15rem",
    display: "flex",
    position: "relative",
  },
  reelTtemSecondContainer: {
    width: "100px",
    height: "0px",
    paddingTop: "100px",
    overflow: "hidden",
    position: "relative",
    display: "flex",
  },
  reelItemImage: {
        imageRendering: 'pixelated', // Add this line

    height: "auto",
    left: "50%",
    position: "absolute",
    right: 0,
    top: "50%",
    width: "70px",
    transform: "translate(-50%,-50%)",
  },
  interactionContainer: {
    alignItems: "flex-start",
    marginBottom: "3rem",
    position: "relative",
    gap: ".75rem",
    justifyContent: "space-between",
    borderTop: "1px solid #161D26",
    paddingTop: "1.5rem",
    marginTop: "2rem",
    display: "flex",
  },
  casePriceContainer: {
    height: "fit-content",
    gap: ".75rem",
    alignItems: "center",
    justifyContent: "flex-start",
    justifyContent: "center",
    display: "flex",
    position: "relative",
  },
  caseOpenContainer: {
    left: 0,
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "1.5rem",
    position: "absolute",
    right: 0,
    top: 0,
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    flexFlow: "column",
    marginBottom: ".25rem",
    display: "flex",
  },
  caseDemoContainer: {
    width: "25%",
    gap: ".5rem",
    alignItems: "center",
    justifyContent: "flex-end",
    display: "flex",
    position: "relative",
  },
  casePriceText: {
    color: "#fff",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  casePriceBox: {
    backgroundColor: "hsla(0,0%,100%,.2)",
    borderRadius: "0.4rem",
    border: "1px solid #161D26",
    display: "flex",
    position: "relative",
  },
  casePriceBoxSecondary:  {
    alignItems: "center",
    backgroundColor: "#12171D",
    display: "flex",
    justifyContent: "center",
    borderRadius: "0.4rem",
    border: "1px solid #161D26",
    paddingBottom: ".75rem",
    paddingTop: ".75rem",
    paddingRight: "1.5rem",
    paddingLeft: "1.5rem",
    display: "flex",
    position: "relative",
  },
  casePriceSpanText: {
    fontSize: ".9375rem",
    lineHeight: "140%",
    color: "#fff",
    margin: 0,
    padding: 0,
  },
  openButton: {
    cursor: "not-allowed",
    // opacity: 0.75,
    paddingBottom: "1.25rem",
    paddingTop: "1.25rem",
    width: "100%",
    backgroundColor: "#FCBB5B",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.4rem",
    border: "none",
    height: "2.15rem",
    outline: "none !important",
    padding: ".5rem 4.5rem",
    display: "flex",
    position: "relative",
    "&:hover": {
      // cursor: "not-allowed",
      cursor: "pointer",
      opacity: 0.75,
      // cursor: "pointer",
      filter: "brightness(120%)",
      backgroundColor: "#FCBB5B",
    }
  },
  openButtonText: {
    color: "#1d2545",
    fontSize: ".9375rem",
    lineHeight: "140%",
    margin: 0,
    padding: 0,
  },
  demoButton: {
    //cursor: "not-allowed",
    //opacity: 0.75,
    background: "hsla(0,0%,100%,.2)",
    width: "100px",
    height: "2.5rem",
    padding: ".5rem .75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.4rem",
    border: "none",
    outline: "none !important",
    display: "flex",
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.75
    }
  },
  demoButtonDisabled: {
    pointerEvents: "none",
    width: "25%",
    gap: ".5rem",
    alignItems: "center",
    justifyContent: "flex-end",
    display: "flex",
    position: "relative",
    cursor: "not-allowed",
    opacity: 0.5
  },
  caseButtonDisabled: {
    pointerEvents: "none",
    cursor: "not-allowed",
    opacity: 0.5,
  },
  demoButtonText: {
    fontSize: ".9375rem",
    lineHeight: "140%",
    color: "#fcbb5b",
    margin: 0,
    padding: 0,
  },
  canvas: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 10000,
  },
  itemNumber: {
    position: "absolute",
    top: "85%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#FFC440",
    fontSize: "1rem",
    fontWeight: 600,
    fontFamily: "Rubik",
  },
  winItem: {
    animation: 'float 2.5s ease-in-out infinite',
    padding: '.25rem',
    filter: 'drop-shadow(-6px 6px 0 rgba(0, 0, 0, .25))',
    opacity: 1,

    position: "relative",
    zIndex: 100000,
  },
  backButtonContainer: {
    border: "none",
    alignItems: "center",
    justifyContent: "center",
    height: "2.15rem",
    outline: "none !important",
    padding: ".5rem .75rem",
    display: "flex",
    position: "relative",
  },
  backButtonContainer2: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  backButtonSVG: {
    height: "2rem !important",
    width: "2rem !important",
    "&:hover": {
      filter: "brightness(120%)"
    }
  }
}));


const CasePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { caseSlug } = useParams();
  const { addToast } = useToasts();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState([]);
  const [demo, setDemo] = useState(false);
  const [itemWon, setItemWon] = useState(false);

  let items = [];
  let doors = document.querySelectorAll('#door');


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        casesSocket.emit("cases:reqdata", caseSlug);
      } catch (error) {
        console.log("There was an error while loading case data:", error);
      }
    };

    fetchData();

    const setCasesData = async (x) => {
      setCaseData(x);
      items = getRandomWeightedItems(x, 60);
      setLoading(false);
    };

    const error = msg => {
      addToast(msg, { appearance: "error" });
      playSound(errorAudio);
    };

    const success = msg => {
      addToast(msg, { appearance: "success" });
    };

    const open = async (x) => {
      setItemWon(false);
      setDemo(true);
      items = getRandomWeightedItems(x.case, 60);
      await spin({ item: x.caseResult });
      setDemo(false);
    };

    casesSocket.on("cases:data", setCasesData);
    casesSocket.on("cases:error", error);
    casesSocket.on("cases:success", success);
    casesSocket.on("cases:opened", open);
    return () => {
      casesSocket.off("cases:data", setCasesData);
      casesSocket.off("cases:error", error);
      casesSocket.off("cases:success", success);
      casesSocket.off("cases:opened", open);
    };
  }, [addToast]);

  async function init(firstInit = true, groups = 1, duration = 1, data) {
    let i = 0;

    doors = document.querySelectorAll('#door');

    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = '0';
      } else if (door.dataset.spinned === '1') {
        return;
      }

      const boxes = door.querySelector('#boxes');
      const boxesClone = boxes.cloneNode(false);
      let pool = ['❓'];

      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        let t = shuffle(arr);
        t.splice(15, 0, data.item);
        pool = t;
      }

      boxesClone.innerHTML = '';

      for (let i = pool.length - 1; i >= 0; i--) {
        const reelItemContainer = document.createElement('div');
        reelItemContainer.classList.add('box');
        reelItemContainer.classList.add(classes.reelItemContainer);
        reelItemContainer.dataset.index = i;
  
        const reelTtemSecondContainer = document.createElement('div');
        reelTtemSecondContainer.classList.add(classes.reelTtemSecondContainer);
  
        const image = document.createElement('img');
        image.classList.add(classes.reelItemImage);
        image.src = pool[i].image; 

        const rarityFilter = getFilterForItem(pool[i]); 
        image.style.filter = rarityFilter;

        reelTtemSecondContainer.appendChild(image);
        reelItemContainer.appendChild(reelTtemSecondContainer);
        boxesClone.appendChild(reelItemContainer);
      }
      
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateX(${(door.clientWidth / boxes.childElementCount) * 26}px)`;
      door.replaceChild(boxesClone, boxes);
      i++;
    }
  }

  async function spin(data) {
    init(false, 1, 2, data);
    playSound(spinAudio)
    let w = [];
    for (const door of doors) {
      const boxes = door.querySelector('#boxes');
      const duration = parseInt(boxes.style.transitionDuration);
      
      const widthPerBox = door.clientWidth / boxes.childElementCount;
      const targetPosition = 15 * widthPerBox;

      boxes.style.transform = `translateX(-${targetPosition}px)`;
      boxes.style.transition = `5s cubic-bezier(0.2, 0.4, 0.1, 1.0)`;
      boxes.style.transitionDuration = `${duration + 2}s`;
      const boxToScaleUp = door.querySelector('.box[data-index="15"]');
      w.push(boxToScaleUp);
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));

    let i = 0;
    for (const box of w) {
      if(!box) return;
      setItemWon(true);
      box.classList.add(classes.winItem);
      box.style.transition = 'all .25s ease-out'; // Added transition
      box.style.transform = 'scale(1.2)';
      box.style.animation = 'float 2.5s ease-in-out infinite';
      box.style.padding = '.25rem';
      box.style.filter = 'drop-shadow(-6px 6px 0 rgba(0, 0, 0, .25))';
      box.style.opacity = '1';
     // box.style.background = '#66b23350';
      box.style.border = 'solid #7e00ff';
      box.style.borderRadius = '.5rem';
      box.style.borderWidth = '2px 2px 4px';
      box.style.filter = 'drop-shadow(0 0 10px #7e00ff)';
      box.style.position = 'relative';
      box.style.top = '-1px';
      box.style.transform = 'scale(1.05)';
      box.style.transition = 'all .4s';
      box.style.zIndex = '1';
    
      const number = parseCommasToThousands(parseFloat(data.item.price));

      const numberElement = document.createElement('span');
      numberElement.classList.add('number');
      numberElement.classList.add(classes.itemNumber);
      numberElement.textContent = `$${number}`;

      if (data.item.color === 'gold' || data.item.color === 'orange' || data.item.color === 'red') {
        triggerConfetti();
      }
      box.appendChild(numberElement);
      i++;
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  const handleDemoButtonClick = async () => {
    setItemWon(false);
    setDemo(true);
    items = getRandomWeightedItems(caseData, 60);
    const ticket = ~~(Math.random() * 100_000)
    const item = caseData.items.find(
      (item) => ticket >= item.ticketsStart && ticket <= item.ticketsEnd
    );
    await spin({item: item });
    setDemo(false);
  };

  function getRandomWeightedItems(data, totalItems) {
    const itemList = data.items;
    let weightedList = [];

    for (const item of itemList) {
      const weight = item.ticketsEnd - item.ticketsStart + 1;
      for (let i = 0; i < weight; i++) {
        weightedList.push(item);
      }
    }

    for (let i = weightedList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedList[i], weightedList[j]] = [weightedList[j], weightedList[i]];
    }

    return weightedList.slice(0, totalItems);
  }

  const triggerConfetti = () => {
    const containerLeft = document.querySelector(`#canvas-left`);
    const containerRight = document.querySelector(`#canvas-right`);
  
    if (containerLeft && containerRight) {
      const confettiLeft = confetti.create(containerLeft, {
        resize: true,
      });
  
      const confettiRight = confetti.create(containerRight, {
        resize: true,
      });
  
      playSound(confettiAudioList[Math.floor(Math.random() * 3)]);

      confettiLeft({
        particleCount: 75,
        spread: 40,
        angle: 30, 
        origin: {
          x: 0,
          y: 1.2,
        },
      });
  
      confettiRight({
        particleCount: 75,
        spread: 40,
        angle: 150,  
        origin: {
          x: 1,
          y: 1.2,
        },
      });
    }
  };

  const getFilterForItem = (item) => {  
    let filter = "";
    if (item.color === "blue") {
    } else if (item.color === "purple") {
      filter = "drop-shadow(rgba(0, 0, 0, 0.3) -6px 6px 0px)"; // purple
    } else if (item.color === "pink") {
      filter = "drop-shadow(rgba(0, 0, 0, 0.3) -6px 6px 0px)"; // pink
    } else if (item.color === "gold") {
      filter = "drop-shadow(rgba(0, 0, 0, 0.3) -6px 6px 0px)"; // gold
    } else if (item.color === "orange") {
      filter = "drop-shadow(rgba(0, 0, 0, 0.3) -6px 6px 0px)"; // orange
    } else {
      filter = "drop-shadow(rgba(0, 0, 0, 0.3) -6px 6px 0px)"; // red
    }
    return filter;
  };

  const copyLinkAction = () => {
    const caseLink = `https://localhost/cases/${caseSlug}`;
    navigator.clipboard.writeText(caseLink)
      .then(() => {
        addToast("Successfully copied case link!", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Failed to copy case link.", { appearance: "error" });
        console.error("Error copying text to clipboard:", error);
      });
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

  const getBorderForItem = (item) => {
    let border = "";
    if (item.color === "blue") {
      border = "rgba(54, 86, 255, 1)"; // blue
    } else if (item.color === "purple") {
      border = "rgba(124, 46, 223, 1)"; // purple
    } else if (item.color === "pink") {
      border = "rgba(188, 0, 255, 1)"; // pink
    } else if (item.color === "gold") {
      border = "rgba(252, 177, 34, 1)"; // gold
    } else if (item.color === "orange") {
      border = "rgba(255, 119, 76, 1)"; // orange
    } else {
      border = "rgba(240, 50, 118, 1)"; // red
    }
  
    return border;
  };

  const getPercentForItem = (item) => {
    const totalTickets = item.ticketsEnd - (item.ticketsStart == 0 ? +1 : item.ticketsStart) + 1;
    const percentChance = totalTickets / 1000;
    return percentChance;
  };

  const renderLootTableBoxes = () => {
    let allBoxes = [];
    try {
      caseData?.items.map(item => {
        const background = getBackgroundForItem(item);
        const border = getBorderForItem(item);
        const percent = getPercentForItem(item);

        allBoxes.push(
          <div className={classes.lootBoxContainer} style={{background: background, borderBottom: "3px solid " + border,}}>
            <div className={classes.itemImageContainer}>
              <img className={classes.itemImage} src={item.image} />
            </div>
            <div className={classes.priceContainer}>
              <span className={classes.price}>${parseCommasToThousands(item?.price)}</span>
            </div>
            <span className={classes.itemNameText}>{item?.name}</span>
            <div className={classes.itemPercentContainer}>
              <span className={classes.itemPercentText}>{percent}%</span>
              <span className={classes.dropRateText}>Drop Rate</span>
            </div>
          </div>
        )
      })
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };

  const renderX = () => {
    let allBoxes = [];
    try {
      items = getRandomWeightedItems(caseData, 15);
      for(let i = 0; i < items.length; i++) {
        allBoxes.push(
          <div className={classes.reelItemContainer}>
            <div className={classes.reelTtemSecondContainer}>
              <img style={{filter:getFilterForItem(items[i])}} className={classes.reelItemImage} src={items[i]?.image} />
            </div>
          </div>
        )
      }
    } catch (error) {
      console.log(error)
    }
    return allBoxes;
  };

  const openCase = () => {
    try {
      casesSocket.emit("cases:open", caseSlug);
    } catch (error) {
      addToast("Request to open case failed!", { appearance: "error" });
    }
  };  

  const lootTableBoxes = renderLootTableBoxes();
  const x = renderX();
  
  return (
    loading ? (
      <div>

      </div>
    ) : (
    <div className={classes.root}> 
      <div className={classes.topBar}>
        <div className={classes.backButtonContainer} onClick={() => history.push(`/cases`)}>
          <div className={classes.backButtonContainer2}>
            <svg className={classes.backButtonSVG} width="75" height="78" viewBox="0 0 75 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44.9688 24.1324L31.0312 37.5L44.9688 50.8676" stroke="#FCBB5B" stroke-width="3"></path><rect x="1.5" y="1.5" width="72" height="72.1676" rx="25.5" stroke="#FCBB5B" stroke-width="3"></rect></svg>
          </div>
        </div>
        <h3 className={classes.titleText}>{caseData?.name}</h3>
        <div className={classes.backButtonContainer} style={{opacity:0}}>
          <div className={classes.backButtonContainer2}>
            <svg className={classes.backButtonSVG} width="75" height="78" viewBox="0 0 75 78" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M44.9688 24.1324L31.0312 37.5L44.9688 50.8676" stroke="#FCBB5B" stroke-width="3"></path><rect x="1.5" y="1.5" width="72" height="72.1676" rx="25.5" stroke="#FCBB5B" stroke-width="3"></rect></svg>
          </div>
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.chestReelContainer}>
          <canvas id={`canvas-left`} className={classes.canvas}></canvas>
          <div className={classes.faderLeft}></div>
          <div className={classes.reelInner}>
            <div id="door" style={{display: "flex", gap: ".25rem"}}>
              <div id="boxes" style={{display: "flex", gap: ".25rem"}}>
                {x}
              </div>
            </div>
          </div>
          <div className={classes.reelSelector} style={{display: itemWon ? "none" : ""}}></div>
          <div className={classes.faderRight}></div>
          <canvas id={`canvas-right`} className={classes.canvas}></canvas>
        </div>
        <div className={classes.interactionContainer}>
          <div className={classes.casePriceContainer}>
            <span className={classes.casePriceText}>Price</span> 
            <div className={classes.casePriceBox}>
              <div className={classes.casePriceBoxSecondary}>
                <span className={classes.casePriceSpanText}>${parseCommasToThousands(caseData?.price)}</span>
              </div> 
            </div>
          </div>
          <div className={`${demo ? classes.caseButtonDisabled : "" } ${classes.caseOpenContainer}`} onClick={() => openCase()}>
            <div className={classes.openButton}>
              <span className={classes.openButtonText}>Open</span>
            </div>
          </div>
          <div className={demo ? classes.demoButtonDisabled : classes.caseDemoContainer}>
            <div className={classes.demoButton} onClick={handleDemoButtonClick}>
              <span className={classes.demoButtonText}>Demo</span>
            </div>
          </div>
        </div>  
        <span className={classes.lootTableTitle}>Item Table</span>
        <div className={classes.lootTableItemsContainer}>
          {lootTableBoxes}
        </div>
      </div>
    </div>
    )
  );
};

export default CasePage;