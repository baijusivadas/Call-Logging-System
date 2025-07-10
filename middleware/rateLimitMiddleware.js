const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const { redisClient } = require("../config/redis");

// Store for apiLimiter with its unique prefix
const apiLimiterStore = new RedisStore({
  sendCommand: (...args) => redisClient.call(...args),
  prefix: "ratelimit:api:", // unique prefix for apiLimiter
});

// Store for authLimiter with its unique prefix
const authLimiterStore = new RedisStore({
  sendCommand: (...args) => redisClient.call(...args),
  prefix: "ratelimit:auth:", // unique prefix for authLimiter
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: apiLimiterStore,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: authLimiterStore,
  message:
    "Too many authentication attempts from this IP, please try again after 5 minutes",
});

module.exports = {
  apiLimiter,
  authLimiter,
};
