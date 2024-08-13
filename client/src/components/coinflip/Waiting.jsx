import React from "react";
import { makeStyles } from "@material-ui/core";

import Box from "@material-ui/core/Box";

//import akskin from "../../assets/akskin.png";
//import knifeskin from "../../assets/knifeskin.png";
//import knifeskin2 from "../../assets/knifeskin2.png";
//import shadowskin from "../../assets/shadowskin.png";
//import howlskin from "../../assets/howlskin.png";

// Custom Styles
const useStyles = makeStyles(theme => ({
    waitingResult: {
        color: "#fff",
        fontFamily: "Rubik",
        fontWeight: 500,
        "& :after": {
            content: ' .',
            animation: "dots 1s steps(5, end) infinite",
        },
    },
    loading: {

        "&:after": {
            content: "' .'",
            animation: "dots 1s steps(5, end) infinite",
        },
    },
}));

const Round = ({ players }) => {

    const classes = useStyles();

    return (
        <Box>
            {players === 2
                ?
                <Box>
                    <h1 className={classes.waitingResult}><p className={classes.loading}>Waiting for player</p></h1>
                </Box>
                : players === 3
                    ?
                    <Box>
                        <h1 className={classes.waitingResult}><p className={classes.loading}>Waiting for players</p></h1>
                    </Box>
                    : players === 4
                        ?
                        <Box className={classes.waitingResult}>
                            <h1 className={classes.waitingResult}><p className={classes.loading}>Waiting for players</p></h1>
                        </Box>
                        : null}
        </Box>
    );
};

export default Round;