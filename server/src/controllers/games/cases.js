// Require Dependencies
const jwt = require("jsonwebtoken");
const { parallelLimit } = require("async");
const _ = require("lodash");
const throttlerController = require("../throttler");
const config = require("../../config");
const colors = require("colors");
const {
  generatePrivateSeedHashPair,
} = require("../random");
const { checkAndEnterRace, checkAndApplyRakeToRace } = require("../race");
const { checkAndApplyRakeback } = require("../vip");
const { checkAndApplyAffiliatorCut } = require("../affiliates");
const insertNewWalletTransaction = require("../../utils/insertNewWalletTransaction");
const fs = require('fs');

const User = require("../../models/User");
const CaseSolo = require("../../models/CaseSolo");
const seedrandom = require("seedrandom");
const caseList = require("./cases.json")

// Get socket.io instance
const listen = async (io) => { 

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  

  // Listen for new websocket connections
  io.of("/cases").on("connection", socket => {
    let loggedIn = false;
    let user = null;

    socket.join("cases");

    // Throttle connnections
    socket.use(throttlerController(socket));

    const getResult = (hash, caseData) => {
      const seed = `${hash}`;
      const rollNumber = seedrandom(seed)()
      const ticket = ~~(rollNumber * 100_000)

      const item = caseData.items.find(
        (item) => ticket >= item.ticketsStart && ticket <= item.ticketsEnd
      );

      const drop = {
        item: {
          name: item.name,
          color: item.color,
          image: item.image,
          price: item.price,
          ticketsStart: item.ticketsStart,
          ticketsEnd: item.ticketsEnd,
        },
        result: ticket,
        seed: `${hash}`,
      };

      return drop;
    }

    // Authenticate websocket connection
    socket.on("auth", async token => {
      if (!token) {
        loggedIn = false;
        user = null;
        return socket.emit(
          "error",
          "No authentication token provided, authorization declined"
        );
      }

      try {
        // Verify token
        const decoded = jwt.verify(token, config.authentication.jwtSecret);

        user = await User.findOne({ _id: decoded.user.id });
        if (user) {
          if (parseInt(user.banExpires) > new Date().getTime()) {
            // console.log("banned");
            loggedIn = false;
            user = null;
            return socket.emit("user banned");
          } else {
            loggedIn = true;
            socket.join(String(user._id));
            // socket.emit("notify:success", "Successfully authenticated!");
          }
        }
        // return socket.emit("alert success", "Socket Authenticated!");
      } catch (error) {
        loggedIn = false;
        user = null;
        return socket.emit("notify:error", "Authentication token is not valid");
      }
    });

    // Check for users ban status
    socket.use(async (packet, next) => {
      if (loggedIn && user) {
        try {
          const dbUser = await User.findOne({ _id: user.id });

          // Check if user is banned
          if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
            return socket.emit("user banned");
          } else {
            return next();
          }
        } catch (error) {
          return socket.emit("user banned");
        }
      } else {
        return next();
      }
    });

    socket.on("cases:reqdata", async (slug) => {
      try {
        if(!slug)
          return socket.emit("cases:error", "Not a valid case slug! 1");
        
        const caseData = caseList.find(object => object.slug === slug);

        if(!caseData)
          return socket.emit("cases:error", "Not a valid case slug! 2");

        return socket.emit("cases:data", caseData);
      } catch (error) {
        console.error(error);

        return socket.emit(
          "cases:error",
          "There was an error while getting case data!"
        );
      }
    });

    socket.on("cases:open", async (slug) => {
      try {
        if (!loggedIn)
          return socket.emit("cases:error", "You are not logged in!");
        
        if(!slug)
          return socket.emit("cases:error", "Not a valid case slug!");
        
        const caseData = caseList.find(object => object.slug === slug);

        if(!caseData)
          return socket.emit("cases:error", "Not a valid case slug!");

        const dbUser = await User.findOne({ _id: user._id });

        // If user has restricted bets
        if (dbUser.betsLocked) {
          return socket.emit(
            "cases:error",
            "Your account has an betting restriction. Please contact support for more information."
          );
        }

        // If user can afford this bet
        if (dbUser.wallet < parseFloat(caseData.price.toFixed(2))) {
          return socket.emit("cases:error", "You can't afford to open this case!");
        }
        
         // Remove bet amount from user's balance
         await User.updateOne(
          { _id: user.id },
          {
            $inc: {
              wallet: -Math.abs(parseFloat(caseData.price.toFixed(2))),
              wager: Math.abs(parseFloat(caseData.price.toFixed(2))),
            },
          }
        );

        socket.emit("update-wallet", -Math.abs(caseData.price));
        insertNewWalletTransaction(user._id, -Math.abs(parseFloat(caseData.price.toFixed(2))), "Cases open", { SoloCaseSlug: caseData.slug });

        const battleHash = await generatePrivateSeedHashPair();
        const newGame = CaseSolo({
          _user: user._id,
          privateHash: battleHash.hash,
          case: caseData,
          caseResult: await getResult(battleHash.hash, caseData)
        });

        await newGame.save();
        
        // add winnings amount from user's balance
        await User.updateOne(
          { _id: user.id },
          {
            $inc: {
              wallet: +Math.abs(parseFloat(newGame.caseResult.item.price.toFixed(2))),
            },
          }
        );
        insertNewWalletTransaction(user._id, +Math.abs(parseFloat(newGame.caseResult.item.price.toFixed(2))), "Cases win", { SoloCase: newGame._id });

        socket.emit("cases:opened", {
          case: caseData,
          caseResult: newGame.caseResult.item
        });

        await delay(4250);

        socket.emit("update-wallet", +Math.abs(newGame.caseResult.item.price));

      } catch (error) {
        console.error(error);

        return socket.emit(
          "cases:error",
          "There was an error while opening this case!"
        );
      }
    });
  });
};

// Export functions
module.exports = {
  listen,
};