import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { createDepositSession, unlinkRobloxUsername, getUserCryptoInformation, getUserDepositInformation, tryCreateOrderSkinsBack } from "../../../services/api.service";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// MUI Components
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { ClipLoader } from 'react-spinners';

// Custom Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh', // Eğer sayfa yüksekliğini tamamen kaplamak istiyorsanız
  marginTop: '-50px', // Veya istediğiniz miktarı belirleyin
};

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: "0rem",
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 10,
    },
  },
  inputs: {
    display: "flex",
    flexDirection: "column",
  height: "3rem",

    justifyContent: "space-around",
    marginTop: "25px",
    padding: "3rem",

    "& > div": {
      "& label": {
        color: "#e4e4e4",
        fontFamily: "Rubik",
        fontSize: "15px",
        fontWeight: 300,

      },
      "& label.Mui-focused": {
        color: "#e4e4e4",
      },
      "& .MuiInput-underline:after": {
        borderRadius: "6px",
        borderColor: "#2f3947",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderRadius: "6px",
          borderColor: "#2f3947",
        },
        "&:hover fieldset": {
          borderRadius: "6px",
          borderColor: "#2f3947",
        },
        "&.Mui-focused fieldset": {
          borderRadius: "6px",
          borderColor: "#2f3947",
        },
      },
      "& > div > input": {
      },
    },
    "& > div > div": {
    },
  },
  value: {
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
      },
      "& > div > input": {
        width: "70%",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "13px",
      fontWeight: 300,
      backgroundColor: "#1d76bd !important",
      position: "absolute",
      right: 0,
      top: "0.65rem",
      width: "6rem",
    },
  },
  Depvalue: {
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    "& > div": {
      width: "100%",
      "& > div": {
      },
      "& > div > input": {
        width: "70%",
        color: "#fff",
        fontSize: "14px",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
    },
    "& button": {
      color: "#e4e4e4",
      fontFamily: "Rubik",
      fontSize: "14px",
      fontWeight: 300,
    //  position: "absolute",
     // right: "0.65rem",
    //  top: "0.65rem",
    //  width: "6rem",
    },
  },
  withdraw: {
    color: "#e4e4e4",
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: ".1em",
    backgroundColor: "#6b00ff !important",
    width: "100%",
  //  marginTop: "1rem",
    height: "3rem",
  },

  qr: {
    position: "absolute",
    width: 140,
    marginRight: "1rem",
    right: 0,
    top: 0,
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  qrcopy: {
    height: 140,
    width: 140,
    marginLeft: "2em",
    background: "white",
    borderRadius: 5,
    padding: "0.5rem",
  },
  flexbox: {
    alignItems: "center",
    "& img": {
      margin: "0 0 0 2em",
      marginTop: "25px",
      marginLeft: "-5px",
    },
  },
  cryptocolor: {
    color: "#f8931a",
  },
}));

const Bitcoin = ({ user }) => {
  // Declare State
  const classes = useStyles();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showTextField, setShowTextField] = useState(false);

  const [cryptoData, setCryptoData] = useState(null);
  const [username, setUsername] = useState(user?.robloxUsername);

  const [copied, setCopied] = useState(false);
  const handleStartDeposit = async () => {
    setLoading(true);
    let gameCode = "mm2";
  
    // Get the token from local storage
    const token = localStorage.getItem('token');
  
    if (!token) {
      // Handle case where token is not present
      addToast("Session Expired. Refresh Page or Please log in.", { appearance: "error" });
      setLoading(false); // Set loading to false in case of an error
      return;
    }
  
    try {
      // Decode the user ID from the token
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.user.id;
  
      // Call createDepositSession with the extracted user ID
      const res = await createDepositSession(username, userId, gameCode, token);
  
      console.log(res);
  
      if (res.success) {
        const data = await getUserDepositInformation();

        // Update state
        setCryptoData(data);

        setShowTextField(true);

        // Handle the success case here, e.g., update UI, navigate to another page, etc.
        // Example: navigate to the deposit success page
  
        // Additional actions or UI updates can be performed here
  
      } else {
        // Handle the case where res.success is falsy
        throw new Error(res.reason);
      }
  
    } catch (error) {
      // Handle any errors that occur during the process
      const data = await getUserDepositInformation();

      // Update state
      setCryptoData(data);

      setShowTextField(true);
      setShowTextField(true);

    addToast("Successfully Created Deposit Address ", { appearance: "success" });
    } finally {
      setLoading(false); // Set loading to false after handling the request
    }
  };
  


  return (
    <Box className={classes.root}>
      <Fragment>
        <Box className={classes.flexbox}>
          <Box className={classes.inputs}>
            <Box className={classes.cryptocolor}>
            </Box>


            {loading ? (
        <div style={containerStyle}>
          <div className="flex flex-col items-center gap-4 py-2">
            <ClipLoader size={30} color="white" />
          </div>
          <div className="flex flex-col items-center py-2">
            <span>Loading... This may take up to 30 seconds.</span>
          </div>
        </div>
      ) : showForm ? (
        <>
      {showTextField && (
        <TextField
          label="World"
          variant="outlined"
          value={cryptoData}
          style={{ marginBottom: '10px' }}
        />
      )}
<Button
  className={classes.withdraw}
  style={{ fontFamily: 'Rubik', padding: '15px' }}
  variant="contained"
  onClick={handleStartDeposit}
  disabled={showTextField}
>
  {showTextField ? "Bot waiting you in world" : "Start Deposit"}
</Button>


        </>
      ) : null}






          </Box>
        </Box>
      </Fragment>
    </Box>
  );
};

export default Bitcoin;
