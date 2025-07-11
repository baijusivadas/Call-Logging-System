const { createLogger } = require("logger");
const { sendResponse } = require("../lib/utils");
const callService = require("../services/callService");

// Create a logger instance
const logger = createLogger("logs/controller.log");
logger.setLevel("debug");

// Log a new call
exports.logCall = async (req, res) => {
  logger.debug("Logging a new call");
  const officerId = req.officer.id;

  try {
    const call = await callService.logCall(officerId, req.body);
    return sendResponse(res, 201, true, "Call logged successfully", call);
  } catch (error) {
    logger.error("Error logging call:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", {
      error: error.message,
    });
  }
};

// Get all calls
exports.getCalls = async (req, res) => {
  logger.debug("Fetching all calls with optional filters");

  try {
    const calls = await callService.getCalls(req.query);
    return sendResponse(res, 200, true, "Calls fetched successfully", calls);
  } catch (error) {
    logger.error("Error fetching calls:", error);
    return sendResponse(res, 500, false, "Server error", {
      error: error.message,
    });
  }
};

// Get a call by ID
exports.getCallById = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Fetching call by ID: ${id}`);

  try {
    const call = await callService.getCallById(id);
    return sendResponse(res, 200, true, "Call fetched successfully", call);
  } catch (error) {
    logger.error("Error fetching call:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", {
      error: error.message,
    });
  }
};

// Update a call
exports.updateCall = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Updating call with ID: ${id}`);

  try {
    const updatedCall = await callService.updateCall(id, req.body);
    return sendResponse(
      res,
      200,
      true,
      "Call updated successfully",
      updatedCall
    );
  } catch (error) {
    logger.error("Error updating call:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", {
      error: error.message,
    });
  }
};

// Delete a call
exports.deleteCall = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Deleting call with ID: ${id}`);

  try {
    await callService.deleteCall(id);
    return sendResponse(res, 200, true, "Call deleted successfully");
  } catch (error) {
    logger.error("Error deleting call:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", {
      error: error.message,
    });
  }
};
