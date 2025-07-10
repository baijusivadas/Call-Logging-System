import db from "../models/index.js";

// import { createLogger } from "logger";

// const logger = createLogger("logs/controller.log");
// logger.setLevel("debug");

const { Call, Officer, Client } = db;

// Log a new call
const logCall = async (req, res) => {
  const { clientId, duration, callType, callOutcome, comment, timestamp } =
    req.body;
  const officerId = req.officer.id; // Get officerId from authenticated user

  try {
    // Optional: Validate if clientId exists if provided
    if (clientId) {
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        return res.status(404).json({ message: "Client not found" });
      }
    }

    const call = await Call.create({
      officerId,
      clientId,
      duration,
      callType,
      callOutcome,
      comment,
      timestamp: timestamp || new Date(), // Use provided timestamp or current time
    });

    res.status(201).json({
      id: call.id,
      message: "Call logged successfully",
      callDetails: {
        officerId: call.officerId,
        clientId: call.clientId,
        duration: call.duration,
        callType: call.callType,
        callOutcome: call.callOutcome,
        timestamp: call.timestamp,
      },
    });
  } catch (error) {
    console.error("Error logging call:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all calls (can be filtered by officerId or clientId)
const getCalls = async (req, res) => {
  const { officerId, clientId } = req.query; // Get filters from query parameters
  const whereClause = {};

  if (officerId) {
    whereClause.officerId = officerId;
  }
  if (clientId) {
    whereClause.clientId = clientId;
  }

  try {
    const calls = await Call.findAll({
      where: whereClause,
      include: [
        { model: Officer, as: "officer", attributes: ["id", "name", "email"] },
        {
          model: Client,
          as: "client",
          attributes: ["id", "name", "region"],
          required: false,
        }, // Client is optional
      ],
      order: [["timestamp", "DESC"]], // Order by most recent calls
    });
    res.json(calls);
  } catch (error) {
    console.error("Error fetching calls:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single call by ID
const getCallById = async (req, res) => {
  try {
    const call = await Call.findByPk(req.params.id, {
      include: [
        { model: Officer, as: "officer", attributes: ["id", "name", "email"] },
        {
          model: Client,
          as: "client",
          attributes: ["id", "name", "region"],
          required: false,
        },
      ],
    });

    if (call) {
      res.json(call);
    } else {
      res.status(404).json({ message: "Call not found" });
    }
  } catch (error) {
    console.error("Error fetching call:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a call
const updateCall = async (req, res) => {
  const { duration, callType, callOutcome, comment, timestamp } = req.body;
  try {
    const call = await Call.findByPk(req.params.id);

    if (call) {
      call.duration = duration !== undefined ? duration : call.duration;
      call.callType = callType || call.callType;
      call.callOutcome = callOutcome || call.callOutcome;
      call.comment = comment || call.comment;
      call.timestamp = timestamp || call.timestamp;

      await call.save();
      res.json({
        id: call.id,
        message: "Call updated successfully",
        callDetails: {
          duration: call.duration,
          callType: call.callType,
          callOutcome: call.callOutcome,
          comment: call.comment,
          timestamp: call.timestamp,
        },
      });
    } else {
      res.status(404).json({ message: "Call not found" });
    }
  } catch (error) {
    console.error("Error updating call:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a call
const deleteCall = async (req, res) => {
  try {
    const call = await Call.findByPk(req.params.id);

    if (call) {
      await call.destroy();
      res.json({ message: "Call removed" });
    } else {
      res.status(404).json({ message: "Call not found" });
    }
  } catch (error) {
    console.error("Error deleting call:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { logCall, getCalls, getCallById, updateCall, deleteCall };
