const { createLogger } = require("logger");
const { sendResponse } = require("../lib/utils");
const callAnalyticsService = require("../services/analyticsService");

const logger = createLogger("logs/controller.log");
logger.setLevel("debug");

// Get daily and monthly call volumes
exports.getCallVolumes = async (req, res) => {
  logger.debug("Fetching daily and monthly call volumes");

  try {
    const result = await callAnalyticsService.getCallVolumes();
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

  try {
    const result = await callAnalyticsService.getTotalCallTimePerOfficer();
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

  try {
    const result = await callAnalyticsService.getCallsPerOfficerPerDay();
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
