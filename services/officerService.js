const db = require("../models");
const bcrypt = require("bcryptjs");
const { createLogger } = require("logger");

const { Officer, Call } = db;
const logger = createLogger("logs/service.log");
logger.setLevel("debug");

exports.getAllOfficers = async () => {
  try {
    logger.debug("Fetching all officers");
    const officers = await Officer.findAll({
      attributes: { exclude: ["password"] },
    });
    logger.debug(`Fetched ${officers.length} officers`);
    return officers;
  } catch (error) {
    logger.error(`Error fetching officers: ${error.message}`);
    throw new Error(error.message || "Error fetching officers");
  }
};

exports.getOfficerById = async (id) => {
  try {
    logger.debug(`Fetching officer with id: ${id}`);

    const officer = await Officer.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Call,
          as: "calls",
          attributes: [
            "id",
            "clientId",
            "duration",
            "callType",
            "callOutcome",
            "comment",
            "timestamp",
          ],
        },
      ],
    });

    if (!officer) {
      logger.debug(`Officer not found with id: ${id}`);
      const error = new Error("Officer not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    logger.debug(`Fetched officer with id: ${id}`);
    return officer;
  } catch (error) {
    logger.error(`Error fetching officer: ${error.message}`);
    throw new Error(error.message || "Error fetching officer");
  }
};

exports.updateOfficer = async (id, updateData) => {
  try {
    logger.debug(`Updating officer with id: ${id}`);

    const { name, email, password, contactInfo, region, status } = updateData;

    const officer = await Officer.findByPk(id);
    if (!officer) {
      logger.debug(`Officer not found for update with id: ${id}`);
      const error = new Error("Officer not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    officer.name = name ?? officer.name;
    officer.email = email ?? officer.email;
    officer.contactInfo = contactInfo ?? officer.contactInfo;
    officer.region = region ?? officer.region;
    officer.status = status ?? officer.status;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      officer.password = await bcrypt.hash(password, salt);
    }

    try {
      await officer.save();
      logger.debug(`Officer updated successfully with id: ${id}`);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        logger.debug(`Email already in use for officer update id: ${id}`);
        const customError = new Error("Email already in use");
        customError.code = "EMAIL_IN_USE";
        throw customError;
      }
      throw error;
    }

    return {
      id: officer.id,
      name: officer.name,
      email: officer.email,
      contactInfo: officer.contactInfo,
      region: officer.region,
      status: officer.status,
    };
  } catch (error) {
    logger.error(`Error updating officer: ${error.message}`);
    throw new Error(error.message || "Error updating officer");
  }
};

exports.deleteOfficer = async (id) => {
  try {
    logger.debug(`Deleting officer with id: ${id}`);

    const officer = await Officer.findByPk(id);
    if (!officer) {
      logger.debug(`Officer not found for deletion with id: ${id}`);
      const error = new Error("Officer not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    await officer.destroy();

    logger.debug(`Officer deleted successfully with id: ${id}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting officer: ${error.message}`);
    throw new Error(error.message || "Error deleting officer");
  }
};
