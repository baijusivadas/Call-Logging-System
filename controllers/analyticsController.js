// import { createLogger } from "logger";
import db from "../models/index.js";
import { fn, col } from "sequelize";

// const logger = createLogger("logs/controller.log");
// logger.setLevel('debug');

const { Call, Officer } = db;

// Get daily and monthly call volumes
const getCallVolumes = async (req, res) => {
  try {
    // Daily Call Volumes
    const dailyCalls = await Call.findAll({
      attributes: [
        [fn("date_trunc", "day", col("timestamp")), "date"],
        [fn("count", col("id")), "totalCalls"],
      ],
      group: [fn("date_trunc", "day", col("timestamp"))],
      order: [[fn("date_trunc", "day", col("timestamp")), "ASC"]],
    });

    // Monthly Call Volumes
    const monthlyCalls = await Call.findAll({
      attributes: [
        [fn("date_trunc", "month", col("timestamp")), "month"],
        [fn("count", col("id")), "totalCalls"],
      ],
      group: [fn("date_trunc", "month", col("timestamp"))],
      order: [[fn("date_trunc", "month", col("timestamp")), "ASC"]],
    });

    res.json({ dailyCalls, monthlyCalls });
  } catch (error) {
    console.error("Error fetching call volumes:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get total call time per officer
const getTotalCallTimePerOfficer = async (req, res) => {
  try {
    const callTimePerOfficer = await Call.findAll({
      attributes: [
        "officerId",
        [fn("sum", col("duration")), "totalCallDuration"], // Sum of duration in seconds
      ],
      include: [
        {
          model: Officer,
          as: "officer",
          attributes: ["name", "email"],
        },
      ],
      group: ["officer.id", "officer.name", "officer.email", "Call.officerId"], // Group by officer details
      order: [[fn("sum", col("duration")), "DESC"]],
    });

    res.json(callTimePerOfficer);
  } catch (error) {
    console.error("Error fetching total call time per officer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get calls per officer, per day
const getCallsPerOfficerPerDay = async (req, res) => {
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
          attributes: ["name", "email"],
        },
      ],
      group: [
        "officer.id",
        "officer.name",
        "officer.email",
        fn("date_trunc", "day", col("timestamp")),
        "Call.officerId",
      ],
      order: [
        [fn("date_trunc", "day", col("timestamp")), "ASC"],
        ["officerId", "ASC"],
      ],
    });

    res.json(callsPerOfficerPerDay);
  } catch (error) {
    console.error("Error fetching calls per officer per day:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getCallVolumes, getTotalCallTimePerOfficer, getCallsPerOfficerPerDay };
