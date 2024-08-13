import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";

//assets
import logo from "./../assets/small-logo.png";

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '40rem',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#9d9d9d",
        fontFamily: "Rubik",
        fontSize: "14px",
        fontWeight: 400,
        letterSpacing: ".005em",
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: "#9d9d9d",
        fontFamily: "Rubik",
        fontSize: "15px",
        fontWeight: 400,
        letterSpacing: ".005em",
        '& img': {
            width: '10rem',
            marginBottom: '1rem',
        },
        '& h1': {
            color: "#b9b9b9",
            fontFamily: "Rubik",
            fontSize: "50px",
            fontWeight: 500,
            letterSpacing: ".1em",
            margin: 0,
        }
    }
});

const Err = () => {

    const classes = useStyles();

    return (
        <Box className={classes.root}>
            <Container className={classes.container}>
                <img src={logo} alt="rbxchance.com" />
                <h1>ERROR 404</h1>
                <span>Nothing to see here :/</span>
            </Container>
        </Box>
    );
};

export default Err;