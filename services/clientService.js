const db = require("../models");
const { createLogger } = require("logger");

const { Client, Call } = db;
const logger = createLogger("logs/service.log");
logger.setLevel("debug");

exports.createClient = async (clientData) => {
  try {
    const { name, contactInfo, region, status } = clientData;
    logger.debug(`Creating client with name: ${name}`);

    const client = await Client.create({ name, contactInfo, region, status });

    logger.debug(`Client created with id: ${client.id}`);

    return {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      region: client.region,
      status: client.status,
    };
  } catch (error) {
    logger.error(`Error creating client: ${error.message}`);
    throw new Error(error.message || "Error creating client");
  }
};

exports.getAllClients = async () => {
  try {
    logger.debug("Fetching all clients");

    const clients = await Client.findAll();

    logger.debug(`Fetched ${clients.length} clients`);

    return clients;
  } catch (error) {
    logger.error(`Error fetching clients: ${error.message}`);
    throw new Error(error.message || "Error fetching clients");
  }
};

exports.getClientById = async (id) => {
  try {
    logger.debug(`Fetching client with id: ${id}`);

    const client = await Client.findByPk(id, {
      include: [
        {
          model: Call,
          as: "calls",
          attributes: [
            "id",
            "officerId",
            "duration",
            "callType",
            "callOutcome",
            "comment",
            "timestamp",
          ],
        },
      ],
    });

    if (!client) {
      logger.debug(`Client not found with id: ${id}`);
      const notFoundError = new Error("Client not found");
      notFoundError.code = "NOT_FOUND";
      throw notFoundError;
    }

    logger.debug(`Fetched client with id: ${id}`);
    return client;
  } catch (error) {
    logger.error(`Error fetching client: ${error.message}`);
    throw new Error(error.message || "Error fetching client");
  }
};

exports.updateClient = async (id, updateData) => {
  try {
    logger.debug(`Updating client with id: ${id}`);

    const client = await Client.findByPk(id);

    if (!client) {
      logger.debug(`Client not found for update with id: ${id}`);
      const notFoundError = new Error("Client not found");
      notFoundError.code = "NOT_FOUND";
      throw notFoundError;
    }

    const { name, contactInfo, region, status } = updateData;

    client.name = name ?? client.name;
    client.contactInfo = contactInfo ?? client.contactInfo;
    client.region = region ?? client.region;
    client.status = status ?? client.status;

    await client.save();

    logger.debug(`Client updated successfully with id: ${id}`);

    return {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      region: client.region,
      status: client.status,
    };
  } catch (error) {
    logger.error(`Error updating client: ${error.message}`);
    throw new Error(error.message || "Error updating client");
  }
};

exports.deleteClient = async (id) => {
  try {
    logger.debug(`Deleting client with id: ${id}`);

    const client = await Client.findByPk(id);

    if (!client) {
      logger.debug(`Client not found for deletion with id: ${id}`);
      const notFoundError = new Error("Client not found");
      notFoundError.code = "NOT_FOUND";
      throw notFoundError;
    }

    await client.destroy();

    logger.debug(`Client deleted successfully with id: ${id}`);

    return true;
  } catch (error) {
    logger.error(`Error deleting client: ${error.message}`);
    throw new Error(error.message || "Error deleting client");
  }
};
