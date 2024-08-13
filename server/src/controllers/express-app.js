// Require Dependencies
const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const {
  errorHandler,
  notFoundHandler,
} = require("@bountyscripts/express-middleware");
const { checkMaintenance } = require("../middleware/maintenance");
const rateLimit = require("express-rate-limit");
const { spawn } = require('child_process');
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express App
const app = express();

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set("trust proxy", 1);

// Create request limiter
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 600, // limit each IP to 100 requests per windowMs ----- changed to 500
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, "../", "../", "faviconoo.svg")));

// Use logger if not in production
if (!process.env.NODE_ENV === "production") {
  app.use(morgan("dev"));
}

/**
 * @route   GET /
 * @desc    Show message and return status 200
 * @access  Public
 */
app.get("/", async (req, res) => {
  return res.json({
    response: "rbxchancecom JSON REST API v.2.0.0",
    uptimeMinutes: Math.floor(process.uptime() / 60),
  });
});

// Global middleware for internal routes
const middleware = [limiter, checkMaintenance];

// Routes
app.use("/api/site", [limiter, require("../routes/site")]);
app.use("/api/user", [limiter, require("../routes/user")]);
app.use("/api/auth", [...middleware, require("../routes/auth")]);
app.use("/api/chat", [...middleware, require("../routes/chat")]);
app.use("/api/images", [...middleware, require("../routes/images")]);
app.use("/api/cashier", [...middleware, require("../routes/cashier")]);
app.use("/api/coupon", [...middleware, require("../routes/coupon")]);
app.use("/api/coinflip", [...middleware, require("../routes/coinflip")]);
app.use("/api/battles", [...middleware, require("../routes/battles")]);
app.use("/api/jackpot", [...middleware, require("../routes/jackpot")]);
app.use("/api/roulette", [...middleware, require("../routes/roulette")]);
app.use("/api/crash", [...middleware, require("../routes/crash")]);
app.use("/api/race", [...middleware, require("../routes/race")]);
app.use("/api/vip", [...middleware, require("../routes/vip")]);
app.use("/api/roblox", [...middleware, require("../routes/roblox")]);
app.use("/api/mm2", [...middleware, require("../routes/mm2")]);
app.use("/api/external", require("../routes/external"));
app.use("/api/callback", require("../routes/callback"));
app.use("/api/skinsback", require("../routes/skinsback"));

// Final Handlers
app.use(notFoundHandler);
app.use(errorHandler);


module.exports = app;
