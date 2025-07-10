// config/redis.js
const Redis = require("ioredis");
const dotenv = require("dotenv").config();

const redisClient = new Redis(process.env.REDIS_URI, {
  connectTimeout: 10000,
  maxRetriesPerRequest: null,
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

exports.redisClient = redisClient;
