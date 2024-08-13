import axios from "axios";

// Switch API url depending on environment
export const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "http://154.53.40.99:5000/api";

// Declare useful endpoints
export const STEAM_ASSET_CDN_EDGE_URL =
  "http://cdn.steamcommunity.com/economy/image/";

// Export public ReCAPTCHA site key
export const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // local - 6Ldw--0nAAAAADtstlbkunOC2kbAFfzdSMewOcAX

// Create axios client
export const API = axios.create({
  baseURL: API_URL,
  headers: axios.defaults.headers.common,
});

/**
 * API Methods
 */

// Retrieve site schema
export const getSiteSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/site");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Exchange auth tokens from idToken to JWT
export const exchangeAuthTokens = async (idToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/auth/exchange-token", {
        token: idToken,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Retrieve user data using a auth token
export const getAuthUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Test authentication using a auth token
export const testAuth = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/auth/isAuthenticated");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Fetch chat schema from API state
export const getChatData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/chat/history");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user profile information
export const getUserProfileData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/profile");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user crypto deposit information
export const getUserCryptoInformation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/cashier/crypto/addresses");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
export const getUserDepositInformation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/cashier/crypto/wallet");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Withdraw crypto to personal wallet
export const withdrawCrypto = async (currency, address, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/cashier/crypto/withdraw", {
        currency,
        address,
        amount,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user affiliates information
export const getUserAffiliatesData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/affiliates");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Update user current affiliate code
export const updateUserAffiliateCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/affiliates/update-code", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Redeem an affiliate code
export const redeemAffiliateCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/affiliates/redeem", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Claim avalailable affiliate balance
export const claimUserAffiliateEarnings = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/affiliates/claim", {});
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Claim an social media coupon code
export const claimCouponCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/coupon/redeem", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active coinflip games
export const getActiveCoinflipGames = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/coinflip");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active coinflip games history
export const getActiveCoinflipGamesHistory = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/coinflip/history");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user private coinflip games
export const getUserPrivateCoinflipGames = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/coinflip/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get private coinflip game
export const getCoinflipPrivateGame = async (inviteCode) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get(`/coinflip/private/${inviteCode}`);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user private coinflip games
export const getUserPrivateCoinflipGamesJoinable = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/coinflip/joinable");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active race information
export const getRaceInformation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/race");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get active race information
export const getLastRaceInformation = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/race/last");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get personal race information
export const getRacePosition = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/race/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user vip level data
export const getUserVipData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/vip");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Claim user rakeback balance
export const claimRakebackBalance = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/vip/claim");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get data needed for account verification
export const getUserVerificationData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/verify");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Send account verification code to user phone number
export const sendVerificationCode = async (number, recaptchaResponse) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/verify/send", {
        number,
        recaptchaResponse,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Submit a verification code
export const submitVerificationCode = async (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/verify/submit", {
        code,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Check user's inventory for loyalty badge
export const checkAndVerifyUser = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/user/verify/check");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get current roulette game and history
export const getRouletteSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/roulette");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get current crash game and history
export const getCrashSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/crash");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user crash data
export const getUserCrashData = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/crash/me");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get current jackpot game and history
export const getJackpotSchema = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/jackpot");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Get user playing history
export const getUserHistory = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/user/history");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Registration page

// Login api
export const tryLoginUser = async (email, password, recaptcha) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/auth/registration/login", {
        email,
        password,
        recaptcha,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Register api
export const tryRegisterUser = async (username, password, email, recaptcha) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/auth/registration/register", {
        username,
        password,
        email,
        recaptcha,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// Forgot password
export const tryForgotPassword = async (email, recaptcha) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/auth/registration/forgot_password", {
        email,
        recaptcha,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const tryResetPassword = async (email, code, password, recaptcha) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/auth/registration/reset_password", {
        email,
        code,
        password,
        recaptcha,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

// SkinsBack try to create order
export const tryCreateOrderSkinsBack = async (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.post("/skinsback/create_order", {
        user_id,
      });
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

// SkinsBack get CS:GO market items
export const tryGetMarketItemsCSGO = async (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.get(`/skinsback/market/items/csgo/${user_id}`);
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

// SkinsBack get RUST market items
export const tryGetMarketItemsRUST = async (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.get(`/skinsback/market/items/rust/${user_id}`);
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

// SkinsBack get DOTA2 market items
export const tryGetMarketItemsDOTA2 = async (user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.get(`/skinsback/market/items/dota2/${user_id}`);
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

// SkinsBack withdraw csgo items
export const tryToWithdrawItemsCSGO = async (items, tradelink) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.post("/skinsback/withdraw/items/csgo", {
        items,
        tradelink,
      });
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

// SkinsBack withdraw rust items
export const tryToWithdrawItemsRUST = async (items, tradelink) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.post("/skinsback/withdraw/items/rust", {
        items,
        tradelink,
      });
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

// SkinsBack withdraw dota2 items
export const tryToWithdrawItemsDOTA2 = async (items, tradelink) => {
  return new Promise(async (resolve, reject) => {
    try {
      const resp = await API.post("/skinsback/withdraw/items/dota2", {
        items,
        tradelink,
      });
      resolve(resp.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const getActiveBattlesGame = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/battles");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getActiveCases = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/battles/cases");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const createDepositSession = async (
  username,
  user_id,
  gameCode,
  token
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/roblox/deposit", {
        username,
        user_id,
        gameCode,
        token,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const checkPhrase = async (username, user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/roblox/check", {
        username,
        user_id,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const unlinkRobloxUsername = async (username, user_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/roblox/unlink", {
        username,
        user_id,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getStock = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.get("/roblox/stock");
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

export const makeWithdraw = async (
  username,
  user_id,
  token,
  items,
  gameCode
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await API.post("/roblox/withdraw", {
        username,
        user_id,
        token,
        items,
        gameCode,
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};
