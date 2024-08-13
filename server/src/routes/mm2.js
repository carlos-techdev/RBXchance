// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const {validateJWT } = require("../middleware/auth");
const config = require("../config");

const User = require("../models/User");
const mm2Withdrawl = require("../models/mm2Withdrawl");
const item_values = require("../config/items.json");

/**
 * @route   GET /api/mm2/ValidateUser
 * @desc    Confrims a user with that roblox username exists
 * @access  Public`
 */
router.post('/ValidateUser', async (req, res) => {
  try {
    const userid = req.body.Data.UserId;
    User.findOne({ robloxUsername: userid }, (err, user) => {
      if (user) {
        res.status(200).json({ Valid: true });
      } else {
        res.status(200).json({ Valid: false });
      }
    });
  } catch (err) {
    res.status(500).json({ Valid: false });
  }
});

/**
 * @route   GET /api/mm2/GetUserData
 * @desc    idk same as above
 * @access  Public`
 */
router.post('/GetUserData', (req, res) => {
  try {
    const userid = req.body.Data.UserId;
    User.findOne({ robloxUsername: userid }, (err, userdata) => {
      if (userdata) {
        res.status(200).json({
          Exists: true,
          Valid: true,
          Blacklisted: false,
          Blacklist: false,
        });
      } else {
        res.status(200).json({ Exists: false });
      }
    });
  } catch (err) {
    res.status(500).json({ Valid: false });
  }
});

/**
 * @route   GET /api/mm2/MurderMystery2/Trading/Withdraw/GetSession
 * @desc    Starts a withdraw session I think
 * @access  Public`
 */
router.post('/MurderMystery2/Trading/Withdraw/GetSession', async (req, res) => {
  const userid = req.body.Data.UserId;
  mm2Withdrawl.findOne({ robloxUsername: userid }, (err, withdrawals) => {
    if (withdrawals) {
      const withdrawal = {};
      withdrawals.items.forEach((item) => {
        withdrawal[item] = (withdrawal[item] || 0) + 1;
      });
      res.status(200).json({ Exists: true, Items: withdrawal });
    } else {
      res.status(200).json({ Exists: false, Items: {} });
    }
  });
});

/**
 * @route   GET /api/mm2/MurderMystery2/Trading/Withdraw/ConfirmSession
 * @desc    idk tbh
 * @access  Public`
 */
router.post('/MurderMystery2/Trading/Withdraw/ConfirmSession', async (req, res) => {
  const userid = req.body.Data.UserId;
  mm2Withdrawl.findOneAndDelete({ robloxUsername: userid }, (err, result) => {
    if (result.value) {
      res.status(200).json({});
    } else {
      res.status(500).json({});
    }
  });
});

/**
 * @route   GET /api/mm2/MurderMystery2/Trading/Withdraw/CancelSession
 * @desc    Cancel deposit session
 * @access  Public`
 */
router.post('/MurderMystery2/Trading/Withdraw/CancelSession', async (req, res) => {
  const userid = req.body.Data.UserId;
  mm2Withdrawl.findOneAndDelete({ robloxUsername: userid }, (err, result) => {
    if (result.value) {
      const torefund = [];
      let value = 0;
      result.value.items.forEach((item) => {
        value = item_values[item] ? item_values[item].value : 0;
        /*const thumbnail = item_values[item] ? item_values[item].thumbnail : 'https://www.seekpng.com/png/full/149-1490962_10kib-420x420-chill-face.png';
        const display_name = item_values[item] ? item_values[item].display_name : item;
        torefund.push({
          game_name: item,
          uid: require('crypto').createHash('md5').update(`${item}${Date.now()}${Math.random()}`).digest('hex'),
          value,
          thumbnail,
          display_name,
        });*/
      });
      User.updateOne({ robloxUsername: userid }, { $set: { wallet: +value } }, (err) => {
        if (!err) {
          res.status(200).json([]);
        } else {
          res.status(500).json([]);
        }
      });
    } else {
      res.status(500).json([]);
    }
  });
});

/**
 * @route   GET /api/mm2/MurderMystery2/Trading/Deposit
 * @desc    Deposit post
 * @access  Public`
 */
router.post('/MurderMystery2/Trading/Deposit', async (req, res) => {
  try {
    const data = req.body.Data;
    const userid = data.UserId;
    const items = data.Items;
    const hashdeposit = req.body.SecurityKey;

    const hashsecurity = require('crypto').createHash('md5').update('!').digest('hex');
    if (hashdeposit === hashsecurity) {
      let total = 0;
      for (const item in items) {
        if (items.hasOwnProperty(item)) {
          total += items[item] * (item_values[item] ? item_values[item].value : 0);
        }
      }

      User.updateOne({ robloxUsername: userid }, { $inc: { wallet: total } }, (err) => {
        if (!err) {
          res.status(200).json({});
        } else {
          res.status(500).json({});
        }
      });
    } else {
      res.status(403).json({});
    }
  } catch (err) {
    res.status(500).json({ ResponseMessage: 'Invalid body', ReponseCode: 4 });
  }
});