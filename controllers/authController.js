const { createLogger } = require("logger");
const { sendResponse } = require("../lib/utils");
const authService = require("../services/authService");

const logger = createLogger("logs/controller.log");
logger.setLevel("debug");

// Register a new officer
exports.registerOfficer = async (req, res) => {
  logger.debug("Registering new officer");

  try {
    const officer = await authService.registerOfficer(req.body);
    return sendResponse(
      res,
      201,
      true,
      "Officer registered successfully",
      officer
    );
  } catch (error) {
    logger.error("Error registering officer:", error);
    if (error.code === "DUPLICATE") {
      return sendResponse(res, 400, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error during registration", {
      error: error.message,
    });
  }
};

// Login an officer
exports.loginOfficer = async (req, res) => {
  logger.debug("Logging in officer");

  const { email, password } = req.body;

  try {
    const officer = await authService.loginOfficer(email, password);
    return sendResponse(res, 200, true, "Logged in successfully", officer);
  } catch (error) {
    logger.error("Error logging in officer:", error);
    if (error.code === "UNAUTHORIZED") {
      return sendResponse(res, 401, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error during login", {
      error: error.message,
    });
  }
};

// Get current officer's profile (protected)
exports.getOfficerProfile = async (req, res) => {
  logger.debug("Fetching officer profile");
  try {
    if (!req.officer) {
      return sendResponse(res, 404, false, "Officer not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "Officer profile fetched successfully",
      req.officer
    );
  } catch (error) {
    logger.error("Error fetching officer profile:", error);
    return sendResponse(res, 500, false, "Server error fetching profile", {
      error: error.message,
    });
  }
};
