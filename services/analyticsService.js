const db = require("../models");
const { fn, col } = require("sequelize");
const { createLogger } = require("logger");

const { Call, Officer } = db;

const logger = createLogger("logs/service.log");
logger.setLevel("debug");

exports.getCallVolumes = async () => {
  try {
    logger.debug("Fetching daily call volumes");

    const dailyCalls = await Call.findAll({
      attributes: [
        [fn("date_trunc", "day", col("timestamp")), "date"],
        [fn("count", col("id")), "totalCalls"],
      ],
      group: [fn("date_trunc", "day", col("timestamp"))],
      order: [[fn("date_trunc", "day", col("timestamp")), "ASC"]],
      raw: true,
    });

    logger.debug(`Fetched ${dailyCalls.length} daily call volume records`);

    logger.debug("Fetching monthly call volumes");

    const monthlyCalls = await Call.findAll({
      attributes: [
        [fn("date_trunc", "month", col("timestamp")), "month"],
        [fn("count", col("id")), "totalCalls"],
      ],
      group: [fn("date_trunc", "month", col("timestamp"))],
      order: [[fn("date_trunc", "month", col("timestamp")), "ASC"]],
      raw: true,
    });

    logger.debug(`Fetched ${monthlyCalls.length} monthly call volume records`);

    return { dailyCalls, monthlyCalls };
  } catch (error) {
    logger.error(`Error fetching call volumes: ${error.message}`);
    throw new Error(error.message || "Error fetching call volumes");
  }
};

exports.getTotalCallTimePerOfficer = async () => {
  try {
    logger.debug("Fetching total call time per officer");

    const callTimePerOfficer = await Call.findAll({
      attributes: [
        "officerId",
        [fn("sum", col("duration")), "totalCallDuration"],
      ],
      include: [
        {
          model: Officer,
          as: "officer",
          attributes: ["id", "name", "email"],
        },
      ],
      group: ["officer.id", "Call.officerId"],
      order: [[fn("sum", col("duration")), "DESC"]],
      raw: true,
    });

    logger.debug(
      `Fetched call time data for ${callTimePerOfficer.length} officers`
    );

    return callTimePerOfficer;
  } catch (error) {
    logger.error(
      `Error fetching total call time per officer: ${error.message}`
    );
    throw new Error(
      error.message || "Error fetching total call time per officer"
    );
  }
};

exports.getCallsPerOfficerPerDay = async () => {
  try {
    logger.debug("Fetching calls per officer per day");

    const callsPerOfficerPerDay = await Call.findAll({
      attributes: [
        "officerId",
        [fn("date_trunc", "day", col("timestamp")), "date"],
        [fn("count", col("id")), "totalCalls"],
      ],
      include: [
        {
          model: Officer,
          as: "officer",
          attributes: ["id", "name", "email"],
        },
      ],
      group: [
        "officer.id",
        fn("date_trunc", "day", col("timestamp")),
        "Call.officerId",
      ],
      order: [
        [fn("date_trunc", "day", col("timestamp")), "ASC"],
        ["officerId", "ASC"],
      ],
      raw: true,
    });

    logger.debug(
      `Fetched ${callsPerOfficerPerDay.length} records for calls per officer per day`
    );

    return callsPerOfficerPerDay;
  } catch (error) {
    logger.error(`Error fetching calls per officer per day: ${error.message}`);
    throw new Error(
      error.message || "Error fetching calls per officer per day"
    );
  }
};
