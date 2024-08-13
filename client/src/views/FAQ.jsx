import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import HelpOutlineOutlined from '@material-ui/icons/HelpOutlineOutlined';

// Custom Styles
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    padding: "4rem 8rem 4rem 8rem",
    [theme.breakpoints.down("xs")]: {
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("sm")]: {
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
    [theme.breakpoints.down("md")]: {
      padding: "2rem 1.5rem 2rem 1.5rem",
    },
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "#5f6368",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "100px",
    },
    fontFamily: "Rubik",
    fontSize: "14px",
    fontWeight: 400,
    letterSpacing: ".005em",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      margin: "0 0 2rem 0",
      color: "#b9b9b9",
      fontFamily: "Rubik",
      fontSize: "19px",
      fontWeight: 500,
    },
    "& b": {
      color: "#9d9d9d",
      fontFamily: "Rubik",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".005em",
    },
  },
  openBtn: {
    color: "white",
    border: "none",
    fontFamily: "inherit",
    padding: ".4rem .6rem",
    borderRadius: ".2rem",
    marginLeft: "1rem",
    backgroundColor: "#1987cb",
    cursor: "pointer",
    transition: "all .3s ease",
    "&:hover": {
      background: "#1987cb",
    },
  },
  a: {
    color: "#FFC440 !important",
    textDecoration: "none",
    "&:hover": {
      color: "#333",
      textDecoration: "none",
    },
  },
}));

const FAQ = () => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <br />
        <h1><HelpOutlineOutlined style={{ marginBottom: "-5px", }} /> Frequenty Asked Questions</h1>
        <br />
        <section>
          <b>1. Which deposit methods do you accept?</b>
          <p>
            Bitcoin, Ethereum, Litecoin, Dogecoin, USDT, USDC, MM2 Items, and Adopt Me Items.
          </p>
        </section>
        <br />
        <section>
          <b>2. How to contact the support team?</b>
          <p>
            You can join our <a className={classes.a} href="https://discord.gg/rbxchance" target="_blank" rel="noreferrer">
              Discord
            </a> server and open a support ticket, or contact us at support@rbxchance.com
          </p>
        </section>
        <br />
        <section>
          <b>3. What is the house edge?</b>
          <p>
            The house edge is between 5-6%.
          </p>
        </section>
        <br />
        <section>
          <b>4. My winnings are missing</b>
          <p>
            If your winnings are missing try to refresh the page, if it didn't fix
            the issue, please contact support.
          </p>
        </section>
        <br />
        <section>
          <b>5. How long does it take to process a withdrawal?</b>
          <p>
            Withdrawals are usually processed withing minutes. Sometimes it can take longer due to high traffic.
            If you experience any issues, please contact us.
          </p>
        </section>
        <br />
        <section>
          <b>6. How does the affiliates work?</b>
          <p>
            When using affiliator's code while betting, the affiliator gets 10% of
            every bet's house edge.
          </p>
          <p>
            Once you refer a new user to the site, they can use your affiliate code and claim the free $0.1
          </p>
          <p>
            The affiliates are dynamic and the user can support any user they
            want, but the free money can be only claimed once.
          </p>
        </section>
        <br />
        <section>
          <b>7. What is VIP?</b>
          <p>
            Once you reach a certain amount of wager, you will be welcomed in our
            vip program which includes:
          </p>
          <p>- Custom Rank in chat<br />- Rakeback<br />- Weekly coupon codes<br />- Monthly promotion</p>

          <p>The higher your vip rank is the higher rewards you will receive.</p>
          <p>Current VIP Ranks:</p>
          <p>- Beginner<br />
            - Professional<br />
            - Silver<br />
            - Elite<br />
            - Master<br />
            - Expert<br />
            - Champion<br />
            - Veteran<br />
            - Ace<br />
            - Prodigy<br />
            - Legend<br />
            - Crown<br />
          </p>
        </section>
        <br />
        <section>
          <b>8. What is Race?</b>
          <p>
            It's a way to earn money by playing on the site! You need to battle
            your friends and the rest of the community to win.
          </p>
          <p>
            Simply wager and play on rbxchance.com! Once you have wagered, you have
            directly entered to the active race!
          </p>
        </section>
        <br />
        <section>
          <b>9. Can I deposit and withdraw directly?</b>
          <p>
            To prevent trading on site deposited funds must be wagered once before withdrawing.
          </p>
        </section>
      </Container>
    </Box >
  );
};

export default FAQ;
