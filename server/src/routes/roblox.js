// Require Dependencies
const express = require("express");
const router = (module.exports = express.Router());
const { validateJWT } = require("../middleware/auth");
const config = require("../config");
const axios = require("axios");
const fetch = require('node-fetch');

const User = require("../models/User");



/**
 * @route   POST /api/roblox/check
 * @desc    Check's if a thing is verified to their name
 * @access  Public`
 */

router.post('/:user_id/world/:world', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const world = req.params.world;

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).send('Kullanıcı bulunamadı');
    }

    await User.findOneAndUpdate({ _id: user_id }, { $set: { world: world } });

    res.send(`Kullanıcının Worldu güncellendi: ${user.user_id}, Yeni World: ${world}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
});


router.get('/:user_id/balance/:wallet', async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const wallet = parseFloat(req.params.wallet);

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).send('Kullanıcı bulunamadı');
    }


     await User.findOneAndUpdate({ _id: user_id }, { $set: { wallet: wallet + user.wallet} });

    res.send(`Kullanıcının bakiyesi güncellendi: ${user.user_id}, Yeni Bakiye: ${user.wallet}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
});


router.post("/deposit", async (req, res, next) => {
  try {
    const { username, user_id } = req.body;

    // Find the user in the database using robloxUsername or _id
    let user;
    if (username) {
      user = await User.findOne({ robloxUsername: username });
    } else if (user_id) {
      user = await User.findOne({ _id: user_id });
    }

    if (user) {
      // Retrieve the current wallet value from the found user
      const currentWallet = user.wallet;
      console.log(user.wallet)
      // Update the wallet value to 6000
      await User.findOneAndUpdate({ _id: user_id }, { $set: { wallet: 2500 } });

      // Rest of your code...

      let depositData;
      let retryCount = 0;
      const maxRetries = 50;

      while (retryCount < maxRetries) {
        // Prepare data for the POST request to http://127.0.0.1:8080/bot/deposit
        const postData = new URLSearchParams();
        postData.append('secret', 'byte');
        postData.append('username', user_id);
        postData.append('balance', user.wallet);
        postData.append('name', 'kweetioo');
        postData.append('password', '@rizkitio123');

        // Send the POST request
        const depositResponse = await fetch('http://127.0.0.1:8080/bot/deposit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: postData.toString(), // Convert URLSearchParams to a string
        });

        // Check the response from the deposit endpoint
        depositData = await depositResponse.text(); // Assuming the response is plain text

        if (depositData.trim() !== "Invalid Key.") {
          // Exit the loop if the response is not "Invalid Key."
          break;
        }

        retryCount++;
      }

      if (retryCount === maxRetries) {
        // Handle the case where the maximum number of retries is reached
        return res.status(400).json({ error: 'Max retries reached' });
      }

      return res.status(200).json({ depositData });
    } else {
      return res.status(200).json({ mnemonicPhrase: true });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});









/**
 * @route   POST /api/roblox/check
 * @desc    Check's if a thing is verified to their name
 * @access  Public`
 */
router.post("/check", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { user_id } = req.body;

    let user = await User.findOne({ robloxUsername: username });
    if (user) return res.status(200).json({ taken: true });
    user = await User.findOne({ _id: user_id });

    fetch(`https://www.roblox.com/users/profile?username=${username}`)
      .then(response => response.text())
      .then(async (data) => {
        if (data.includes(user.mnemonicPhrase)) {
          await User.findOneAndUpdate({ _id: user_id }, { $set: { robloxUsername: username } });
          return res.status(200).json({ success: true });
        } else {
          return res.status(200).json({ mnemonicPhrase: true });
        }
      })
      .catch(error => {
        console.error('An error occurred:', error);
      });
  } catch (error) {
    return next(error);
  }
});


/**
 * @route   POST /api/roblox/check
 * @desc    Check's if a thing is verified to their name
 * @access  Public`
 */
router.post("/unlink", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { user_id } = req.body;

    await User.findOneAndUpdate({ _id: user_id }, { $set: { robloxUsername: "" }});
    return res.status(200).json({ success: true });

  } catch (error) {
    return next(error);
  }
});

/**
 * @route   GET /api/roblox/stock
 * @desc    Get's avaible items on bot trader accounts
 * @access  Public`
 */
router.get("/stock", async (req, res, next) => {
  try {

    const ress = await axios.get("https://hook.rbxcat.com/mm2/site_stock");
    const ressAdmp = await axios.get("https://hook.rbxcat.com/adoptme/site_stock");
      
    if (!ress.data.mm2stock && !Array.isArray(ress.data.mm2stock)) throw "Error validating data from outside server!"
    if (!ressAdmp.data.mm2stock && !Array.isArray(ressAdmp.data.mm2stock)) throw "Error validating data from outside server!"


    return res.status(200).json({ 
      mm2: ress.data.mm2stock,
      amp: ressAdmp.data.mm2stock,
    });

  } catch (error) {
    return next(error);
  }
});

/**
 * @route   POST /api/roblox/withdraw
 * @desc    Create a withdraw request
 * @access  Public`
 */
router.post("/withdraw", async (req, res, next) => {
  try {
    const { username } = req.body;
    const { user_id } = req.body;
    const { token } = req.body;
    const { items } = req.body;
    const { gameCode } = req.body;

    const headers = {
      'Content-Type': 'application/json',
      'x-auth-token': token
    };

    const data = {
      username: username,
      session_type: gameCode,
      items: items
    };

    console.log(req)
    const ress = await axios.post("https://hook.rbxcat.com/withdraw/create_session", data, { headers: headers });
    console.log(ress)

    let error = false, reason = null;
    if (ress.status != 200) {
      error = true;
      reason = ress.data.status;
    }

    let link, botUsername;
    if (gameCode == "mm2") {
      link = "https://www.roblox.com/games/142823291?privateServerLinkCode=67604789860287160138119263971729";
      botUsername = "chanceholder1";
    } else if (gameCode == "adoptme") {
      link = "https://www.roblox.com/games/920587237?privateServerLinkCode=52794204607978306416180650763588";
      botUsername = "chanceamp1";
    }
    
    return res.status(200).json({ 
      link: link,
      botName: botUsername,
      error: error,
      reason: reason
    });

  } catch (error) {
    return next(error);
  }
});