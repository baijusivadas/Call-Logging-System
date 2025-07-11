const { createLogger } = require("logger");
const { sendResponse } = require("../lib/utils");
const officerService = require("../services/officerService");

const logger = createLogger("logs/controller.log");
logger.setLevel("debug");

// Get all officers
exports.getOfficers = async (req, res) => {
  logger.debug("Fetching all officers");

  try {
    const officers = await officerService.getAllOfficers();
    return sendResponse(res, 200, true, "Officers fetched successfully", officers);
  } catch (error) {
    logger.error("Error fetching officers:", error);
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Get a single officer by ID
exports.getOfficerById = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Fetching officer by ID: ${id}`);

  try {
    const officer = await officerService.getOfficerById(id);
    if (!officer) {
      return sendResponse(res, 404, false, "Officer not found");
    }
    return sendResponse(res, 200, true, "Officer fetched successfully", officer);
  } catch (error) {
    logger.error("Error fetching officer:", error);
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Update an officer
exports.updateOfficer = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Updating officer with ID: ${id}`);

  try {
    const updatedOfficer = await officerService.updateOfficer(id, req.body);
    return sendResponse(res, 200, true, "Officer updated successfully", updatedOfficer);
  } catch (error) {
    logger.error("Error updating officer:", error);
    if (error.code === "EMAIL_IN_USE") {
      return sendResponse(res, 400, false, "Email already in use");
    }
    if (error.message === "Officer not found") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Delete an officer
exports.deleteOfficer = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Deleting officer with ID: ${id}`);

  try {
    await officerService.deleteOfficer(id);
    return sendResponse(res, 200, true, "Officer deleted successfully");
  } catch (error) {
    logger.error("Error deleting officer:", error);
    if (error.message === "Officer not found") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};
