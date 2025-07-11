const db = require("../models");
const { createLogger } = require("logger");

const { Call, Officer, Client } = db;
const logger = createLogger("logs/service.log");
logger.setLevel("debug");


exports.logCall = async (officerId, callData) => {
  try {
    logger.debug(`Logging call for officerId: ${officerId}`);

    const { clientId, duration, callType, callOutcome, comment, timestamp } = callData;

    if (clientId) {
      const clientExists = await Client.findByPk(clientId);
      if (!clientExists) {
        logger.debug(`Client not found: ${clientId}`);
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

    logger.debug(`Call logged successfully with id: ${call.id}`);

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
    logger.error(`Error logging call: ${error.message}`);
    throw new Error(error.message || "Error logging call");
  }
};


exports.getCalls = async (filters) => {
  try {
    logger.debug("Fetching calls with filters:", filters);

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

    logger.debug(`Fetched ${calls.length} calls`);

    return calls;
  } catch (error) {
    logger.error(`Error fetching calls: ${error.message}`);
    throw new Error(error.message || "Error fetching calls");
  }
};


exports.getCallById = async (id) => {
  try {
    logger.debug(`Fetching call with id: ${id}`);

    const call = await Call.findByPk(id, {
      include: [
        { model: Officer, as: "officer", attributes: ["id", "name", "email"] },
        { model: Client, as: "client", attributes: ["id", "name", "region"], required: false },
      ],
    });

    if (!call) {
      logger.debug(`Call not found with id: ${id}`);
      const error = new Error("Call not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    logger.debug(`Fetched call with id: ${id}`);
    return call;
  } catch (error) {
    logger.error(`Error fetching call: ${error.message}`);
    throw new Error(error.message || "Error fetching call");
  }
};


exports.updateCall = async (id, updateData) => {
  try {
    logger.debug(`Updating call with id: ${id}`);

    const call = await Call.findByPk(id);

    if (!call) {
      logger.debug(`Call not found for update with id: ${id}`);
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

    logger.debug(`Call updated successfully with id: ${id}`);

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
    logger.error(`Error updating call: ${error.message}`);
    throw new Error(error.message || "Error updating call");
  }
};


exports.deleteCall = async (id) => {
  try {
    logger.debug(`Deleting call with id: ${id}`);

    const call = await Call.findByPk(id);

    if (!call) {
      logger.debug(`Call not found for deletion with id: ${id}`);
      const error = new Error("Call not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    await call.destroy();
    logger.debug(`Call deleted successfully with id: ${id}`);

    return true;
  } catch (error) {
    logger.error(`Error deleting call: ${error.message}`);
    throw new Error(error.message || "Error deleting call");
  }
};
