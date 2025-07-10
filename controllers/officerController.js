import db from "../models/index.js";
import bcrypt from "bcrypt";
// import { createLogger } from "logger";

// const logger = createLogger("logs/controller.log");
// logger.setLevel("debug");

const { Officer, Call } = db;

// Get all officers
const getOfficers = async (req, res) => {
  try {
    const officers = await Officer.findAll({
      attributes: { exclude: ["password"] }, // Exclude passwords
    });
    res.json(officers);
  } catch (error) {
    console.error("Error fetching officers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single officer by ID
const getOfficerById = async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id, {
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

    if (officer) {
      res.json(officer);
    } else {
      res.status(404).json({ message: "Officer not found" });
    }
  } catch (error) {
    console.error("Error fetching officer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an officer
const updateOfficer = async (req, res) => {
  const { name, email, password, contactInfo, region, status } = req.body;
  try {
    const officer = await Officer.findByPk(req.params.id);

    if (officer) {
      officer.name = name || officer.name;
      officer.email = email || officer.email;
      officer.contactInfo = contactInfo || officer.contactInfo;
      officer.region = region || officer.region;
      officer.status = status || officer.status;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        officer.password = await bcrypt.hash(password, salt);
      }

      await officer.save();
      res.json({
        id: officer.id,
        name: officer.name,
        email: officer.email,
        contactInfo: officer.contactInfo,
        region: officer.region,
        status: officer.status,
        message: "Officer updated successfully",
      });
    } else {
      res.status(404).json({ message: "Officer not found" });
    }
  } catch (error) {
    console.error("Error updating officer:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an officer
const deleteOfficer = async (req, res) => {
  try {
    const officer = await Officer.findByPk(req.params.id);

    if (officer) {
      await officer.destroy();
      res.json({ message: "Officer removed" });
    } else {
      res.status(404).json({ message: "Officer not found" });
    }
  } catch (error) {
    console.error("Error deleting officer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export { getOfficers, getOfficerById, updateOfficer, deleteOfficer };
