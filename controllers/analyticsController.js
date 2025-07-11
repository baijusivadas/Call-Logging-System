const { createLogger } = require("logger");
const { sendResponse } = require("../lib/utils");
const callAnalyticsService = require("../services/analyticsService");
const { CACHE_EXPIRATION_MEDIUM } = require("../config/cacheConfig");

const logger = createLogger("logs/controller.log");
logger.setLevel("debug");

// Get daily and monthly call volumes
exports.getCallVolumes = async (req, res) => {
  logger.debug("Fetching daily and monthly call volumes");
  const cacheKey = "analytics:callVolumes"; // Unique cache key for this data

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving call volumes from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const result = await callAnalyticsService.getCallVolumes();
    await redisClient.setex(
      cacheKey,
      CACHE_EXPIRATION_MEDIUM,
      JSON.stringify(result)
    );
    return sendResponse(
      res,
      200,
      true,
      "Call volumes fetched successfully",
      result
    );
  } catch (error) {
    logger.error("Error fetching call volumes:", error);
    return sendResponse(res, 500, false, "Server error fetching call volumes", {
      error: error.message,
    });
  }
};

// Get total call time per officer
exports.getTotalCallTimePerOfficer = async (req, res) => {
  logger.debug("Fetching total call time per officer");
  const cacheKey = "analytics:totalCallTimePerOfficer";
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving total call time from Redis cache");
      return res.json(JSON.parse(cachedData));
    }

    const result = await callAnalyticsService.getTotalCallTimePerOfficer();
    await redisClient.setex(
      cacheKey,
      CACHE_EXPIRATION_MEDIUM,
      JSON.stringify(result)
    );
    console.log("Total call time per officer cached in Redis");
    return sendResponse(
      res,
      200,
      true,
      "Total call time per officer fetched successfully",
      result
    );
  } catch (error) {
    logger.error("Error fetching total call time per officer:", error);
    return sendResponse(
      res,
      500,
      false,
      "Server error fetching call time per officer",
      { error: error.message }
    );
  }
};

// Get calls per officer per day
exports.getCallsPerOfficerPerDay = async (req, res) => {
  logger.debug("Fetching calls per officer per day");
  const cacheKey = "analytics:callsPerOfficerPerDay";
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Serving calls per officer per day from Redis cache");
      return res.json(JSON.parse(cachedData));
    }
    const result = await callAnalyticsService.getCallsPerOfficerPerDay();
    await redisClient.setex(
      cacheKey,
      CACHE_EXPIRATION_MEDIUM,
      JSON.stringify(result)
    );
    console.log("Calls per officer per day cached in Redis");
    return sendResponse(
      res,
      200,
      true,
      "Calls per officer per day fetched successfully",
      result
    );
  } catch (error) {
    logger.error("Error fetching calls per officer per day:", error);
    return sendResponse(
      res,
      500,
      false,
      "Server error fetching calls per officer per day",
      { error: error.message }
    );
  }
};
