const { createLogger } = require("logger");
const { sendResponse } = require("../lib/utils");
const clientService = require("../services/clientService");

const logger = createLogger("logs/controller.log");
logger.setLevel("debug");

// Create a new client
exports.createClient = async (req, res) => {
  logger.debug("Creating a new client");

  try {
    const newClient = await clientService.createClient(req.body);
    return sendResponse(res, 201, true, "Client created successfully", newClient);
  } catch (error) {
    logger.error("Error creating client:", error);
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Get all clients
exports.getClients = async (req, res) => {
  logger.debug("Fetching all clients");

  try {
    const clients = await clientService.getAllClients();
    return sendResponse(res, 200, true, "Clients fetched successfully", clients);
  } catch (error) {
    logger.error("Error fetching clients:", error);
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Fetching client by ID: ${id}`);

  try {
    const client = await clientService.getClientById(id);
    return sendResponse(res, 200, true, "Client fetched successfully", client);
  } catch (error) {
    logger.error("Error fetching client:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Updating client with ID: ${id}`);

  try {
    const updatedClient = await clientService.updateClient(id, req.body);
    return sendResponse(res, 200, true, "Client updated successfully", updatedClient);
  } catch (error) {
    logger.error("Error updating client:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const { id } = req.params;
  logger.debug(`Deleting client with ID: ${id}`);

  try {
    await clientService.deleteClient(id);
    return sendResponse(res, 200, true, "Client deleted successfully");
  } catch (error) {
    logger.error("Error deleting client:", error);
    if (error.code === "NOT_FOUND") {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, "Server error", { error: error.message });
  }
};
