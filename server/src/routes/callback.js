// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const crypto = require("crypto");
const colors = require("colors");
const config = require("../config");

const User = require("../models/User");
const CryptoTransaction = require("../models/CryptoTransaction");
const insertNewWalletTransaction = require("../utils/insertNewWalletTransaction");
const axios = require("axios");

/**
 * @route   POST /api/callback/
 * @desc   
 * @access  Public`
 */
router.post("/", async (req, res, next) => {
  let data = req.body;

  const apiSecretKey = config.authentication.oaxpay.merchant_id;
  const hmacHeader = req.headers['hmac'];
  const calculatedHmac = crypto.createHmac('sha512', apiSecretKey).update(JSON.stringify(data)).digest('hex');

  if (calculatedHmac === hmacHeader) {
      // HMAC signature is valid
      // Process the callback data based on the type
      if (data.type === 'staticaddress') {
          console.log('Received staticaddress callback');
      }

      if(data.status == "Paid") {
        const address = data.address;
        const currency = data.currency;
        const amount = data.amount;
        const txid = data.txID;
        const usdAmount = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${currency.toUpperCase()}&tsyms=USD`).then(res => {return res.data.USD * amount});
        const siteValue = usdAmount.toFixed(2);
        const user = await User.findOne({[`crypto.${currency.toLowerCase()}.address`]: address});
  
        const newTransaction = new CryptoTransaction({
          type: "deposit",
  
          currency, 
          siteValue: siteValue, 
          cryptoValue: amount, 
          address: address, 
  
          txid: txid, 
          state: 3, 
  
          _user: user._id, 
        });
  
        await newTransaction.save();
  
        insertNewWalletTransaction(user._id, siteValue, `${currency} Deposit`);
  
        // Log debug info
        console.log(
          colors.blue("0xapay >> Deposit verified! Gave"),
          colors.cyan(`${siteValue}`),
          colors.blue("coins to"),
          colors.cyan(user.username)
        );
  
        await User.updateOne({ _id: user._id }, { $inc: { wallet: siteValue, totalDeposited: siteValue }});  
      } else {
        console.log(
          colors.blue("0xapay >> Deposit pending! " + data.amount + " " + data.currency + "."),
        );
      }

      res.statusCode = 200;
      res.end('OK');
  } else {
      // HMAC signature is not valid
      // Handle the error accordingly
      res.statusCode = 400;
      res.end('Invalid HMAC signature');
  }
});