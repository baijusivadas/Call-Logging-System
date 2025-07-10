const db = require("../models");

const { Call, Officer, Client } = db;

/**
 * Log a new call
 */
exports.logCall = async (officerId, callData) => {
  try {
    const { clientId, duration, callType, callOutcome, comment, timestamp } = callData;

    if (clientId) {
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        const error = new Error("Client not found");
        error.code = "NOT_FOUND";
        throw error;
      }
    }

    const call = await Call.create({
      officerId,
      clientId,
      duration,
      callType,
      callOutcome,
      comment,
      timestamp: timestamp ?? new Date(),
    });

    return {
      id: call.id,
      officerId: call.officerId,
      clientId: call.clientId,
      duration: call.duration,
      callType: call.callType,
      callOutcome: call.callOutcome,
      comment: call.comment,
      timestamp: call.timestamp,
    };
  } catch (error) {
    throw new Error(error.message || "Error logging call");
  }
};

/**
 * Fetch all calls with optional filters
 */
exports.getCalls = async (filters) => {
  try {
    const { officerId, clientId } = filters;
    const whereClause = {};

    if (officerId) whereClause.officerId = officerId;
    if (clientId) whereClause.clientId = clientId;

    const calls = await Call.findAll({
      where: whereClause,
      include: [
        { model: Officer, as: "officer", attributes: ["id", "name", "email"] },
        { model: Client, as: "client", attributes: ["id", "name", "region"], required: false },
      ],
      order: [["timestamp", "DESC"]],
    });

    return calls;
  } catch (error) {
    throw new Error(error.message || "Error fetching calls");
  }
};

/**
 * Fetch a single call by ID
 */
exports.getCallById = async (id) => {
  try {
    const call = await Call.findByPk(id, {
      include: [
        { model: Officer, as: "officer", attributes: ["id", "name", "email"] },
        { model: Client, as: "client", attributes: ["id", "name", "region"], required: false },
      ],
    });

    if (!call) {
      const error = new Error("Call not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    return call;
  } catch (error) {
    throw new Error(error.message || "Error fetching call");
  }
};

/**
 * Update a call
 */
exports.updateCall = async (id, updateData) => {
  try {
    const call = await Call.findByPk(id);

    if (!call) {
      const error = new Error("Call not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    const { duration, callType, callOutcome, comment, timestamp } = updateData;

    call.duration = duration ?? call.duration;
    call.callType = callType ?? call.callType;
    call.callOutcome = callOutcome ?? call.callOutcome;
    call.comment = comment ?? call.comment;
    call.timestamp = timestamp ?? call.timestamp;

    await call.save();

    return {
      id: call.id,
      officerId: call.officerId,
      clientId: call.clientId,
      duration: call.duration,
      callType: call.callType,
      callOutcome: call.callOutcome,
      comment: call.comment,
      timestamp: call.timestamp,
    };
  } catch (error) {
    throw new Error(error.message || "Error updating call");
  }
};

/**
 * Delete a call
 */
exports.deleteCall = async (id) => {
  try {
    const call = await Call.findByPk(id);

    if (!call) {
      const error = new Error("Call not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    await call.destroy();
    return true;
  } catch (error) {
    throw new Error(error.message || "Error deleting call");
  }
};
