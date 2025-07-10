import db from '../models/index.js';

// import { createLogger } from "logger";

// const logger = createLogger("logs/controller.log");
// logger.setLevel("debug");

const { Client, Call } = db;

// Create a new client
const createClient = async (req, res) => {
  const { name, contactInfo, region, status } = req.body;
  try {
    const client = await Client.create({ name, contactInfo, region, status });
    res.status(201).json({
      id: client.id,
      name: client.name,
      message: 'Client created successfully',
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single client by ID
const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{
        model: Call,
        as: 'calls',
        attributes: ['id', 'officerId', 'duration', 'callType', 'callOutcome', 'comment', 'timestamp'],
      }],
    });

    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a client
const updateClient = async (req, res) => {
  const { name, contactInfo, region, status } = req.body;
  try {
    const client = await Client.findByPk(req.params.id);

    if (client) {
      client.name = name || client.name;
      client.contactInfo = contactInfo || client.contactInfo;
      client.region = region || client.region;
      client.status = status || client.status;

      await client.save();
      res.json({
        id: client.id,
        name: client.name,
        message: 'Client updated successfully',
      });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (client) {
      await client.destroy();
      res.json({ message: 'Client removed' });
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
};
