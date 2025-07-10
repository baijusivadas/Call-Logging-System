const db = require("../models");

const { Client, Call } = db;

/**
 * Create a new client
 */
exports.createClient = async (clientData) => {
  try {
    const { name, contactInfo, region, status } = clientData;
    const client = await Client.create({ name, contactInfo, region, status });

    return {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      region: client.region,
      status: client.status,
    };
  } catch (error) {
    throw new Error(error.message || "Error creating client");
  }
};

/**
 * Fetch all clients
 */
exports.getAllClients = async () => {
  try {
    const clients = await Client.findAll();
    return clients;
  } catch (error) {
    throw new Error(error.message || "Error fetching clients");
  }
};

/**
 * Fetch a client by ID, including calls
 */
exports.getClientById = async (id) => {
  try {
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
      const notFoundError = new Error("Client not found");
      notFoundError.code = "NOT_FOUND";
      throw notFoundError;
    }

    return client;
  } catch (error) {
    throw new Error(error.message || "Error fetching client");
  }
};

/**
 * Update a client by ID
 */
exports.updateClient = async (id, updateData) => {
  try {
    const client = await Client.findByPk(id);

    if (!client) {
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

    return {
      id: client.id,
      name: client.name,
      contactInfo: client.contactInfo,
      region: client.region,
      status: client.status,
    };
  } catch (error) {
    throw new Error(error.message || "Error updating client");
  }
};

/**
 * Delete a client by ID
 */
exports.deleteClient = async (id) => {
  try {
    const client = await Client.findByPk(id);

    if (!client) {
      const notFoundError = new Error("Client not found");
      notFoundError.code = "NOT_FOUND";
      throw notFoundError;
    }

    await client.destroy();
    return true;
  } catch (error) {
    throw new Error(error.message || "Error deleting client");
  }
};
