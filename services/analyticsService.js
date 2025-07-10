const db = require("../models");
const { fn, col } = require("sequelize");

const { Call, Officer } = db;

/**
 * Get daily and monthly call volumes
 */
exports.getCallVolumes = async () => {
  try {
    const dailyCalls = await Call.findAll({
      attributes: [
        [fn("date_trunc", "day", col("timestamp")), "date"],
        [fn("count", col("id")), "totalCalls"],
      ],
      group: [fn("date_trunc", "day", col("timestamp"))],
      order: [[fn("date_trunc", "day", col("timestamp")), "ASC"]],
      raw: true,
    });

    const monthlyCalls = await Call.findAll({
      attributes: [
        [fn("date_trunc", "month", col("timestamp")), "month"],
        [fn("count", col("id")), "totalCalls"],
      ],
      group: [fn("date_trunc", "month", col("timestamp"))],
      order: [[fn("date_trunc", "month", col("timestamp")), "ASC"]],
      raw: true,
    });

    return { dailyCalls, monthlyCalls };
  } catch (error) {
    throw new Error(error.message || "Error fetching call volumes");
  }
};

/**
 * Get total call time per officer
 */
exports.getTotalCallTimePerOfficer = async () => {
  try {
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

    return callTimePerOfficer;
  } catch (error) {
    throw new Error(error.message || "Error fetching total call time per officer");
  }
};

/**
 * Get calls per officer per day
 */
exports.getCallsPerOfficerPerDay = async () => {
  try {
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
      group: ["officer.id", fn("date_trunc", "day", col("timestamp")), "Call.officerId"],
      order: [
        [fn("date_trunc", "day", col("timestamp")), "ASC"],
        ["officerId", "ASC"],
      ],
      raw: true,
    });

    return callsPerOfficerPerDay;
  } catch (error) {
    throw new Error(error.message || "Error fetching calls per officer per day");
  }
};
