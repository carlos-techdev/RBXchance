const config = {
  site: {
    enableMaintenanceOnStart: false,
    enableLoginOnStart: false,
    manualWithdrawsEnabled: false,
    backend: {
      developmentUrl: "http://localhost:5000",
      productionUrl: "https://api.roblox.com",
    },
    frontend: {
      developmentUrl: "http://localhost:3000",
      productionUrl: "https://roblox.com",
    },
    adminFrontend: {
      developmentUrl: "http://localhost:8080",
      productionUrl: "https://admin.roblox.com",
    },
  },
  authentication: {
    jwtSecret: "61509923453430857341378198063588",
    jwtExpirationTime: 60 * 60 * 1000 * 24, // 24 hours
    reCaptcha: {
      secretKey: process.env.RECAPTCHA_SECRET_KEY, // google recaptcha
    },
    googleOauth: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    oaxpay: {
      merchant_id: process.env.OAXPAY_MERCHANT_ID,
      callback_url: process.env.OAXPAY_CALLBACK_URL,
    },
    steam: {
      apiKey: "ACe0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u0v0w0x0y0z0",
    },
    skinsback: {
      shop_id: process.env.SKINSBACK_SHOP_ID,
      secret_key: process.env.SKINSBACK_SECRET_KEY,
      withdrawFee: process.env.SKINSBACK_WITHDRAW_FEE,
      withdrawMinItemPrice: process.env.SKINSBACK_WITHDRAW_MIN_ITEM_PRICE,
    },
    twilio: {
      verifyServiceSid:
        "ACe0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u0v0w0x0y0z0",
      accountSid: "ACe0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u0v0w0x0y0z0",
      authToken: "ACe0a0b0c0d0e0f0g0h0i0j0k0l0m0n0o0p0q0r0s0t0u0v0w0x0y0z0",
    },
  },
  games: {
    affiliates: {
      earningPercentage: 5,
    },
    race: {
      prizeDistribution: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
    crash: {
      houseEdge: 0.5,
      maxProfit: 9999,
      minBetAmount: 0.01,
      maxBetAmount: 100,
    },
    jackpot: {
      feePercentage: 0.5,
      waitingTime: 60000, // in ms?
      minBetAmountLow: 0.01,
      maxBetAmountLow: 100,
      minBetAmountMid: 0.01,
      maxBetAmountMid: 100,
      minBetAmountHigh: 0.01,
      maxBetAmountHigh: 100,
    },
    roulette: {
      feePercentage: 0.5,
      waitingTime: 30000,
      minBetAmount: 0.01,
      maxBetAmount: 100,
    },
    battles: {
      houseEdge: 0.5,
    },
    coinflip: {
      minBetAmount: 0.01,
      maxBetAmount: 100,
      feePercentage: 0.5,
    },
    vip: {
      levelToChat: 1,
      levelToTip: 5,
      levelToRain: 10,
      wagerToJoinRain: 10,
      numLevels: 11,
      minWager: 0.01,
      maxWager: 100,
      rakeback: 0.1,
      minWithdrawAmount: 5,
      minDepositForWithdraw: 0,
      minRakebackClaim: 10,
      vipLevelNAME: [
        "Bronze",
        "Silver",
        "Gold",
        "Platinum",
        "Diamond",
        "Master",
        "Grand Master",
        "Legendary",
        "Mythical",
        "Ultimate",
      ],
      vipLevelCOLORS: [
        "#e6b422",
        "#f1c40f",
        "#9c27b0",
        "#673ab7",
        "#3f51b5",
        "#2196f3",
        "#03a9f4",
        "#00bcd4",
        "#009688",
        "#4caf50",
      ],
    },
  },
  blochain: {
    httpProviderApi: "https://eos.greymass.com",
  },
};

module.exports = config;
