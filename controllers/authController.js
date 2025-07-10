import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
// import { createLogger } from "logger";

// const logger = createLogger("logs/controller.log");
// logger.setLevel("debug");

const { Officer } = db;

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};

const registerOfficer = async (req, res) => {
  const { name, email, password, contactInfo, region, status } = req.body;

  try {
    // Check if officer already exists
    const officerExists = await Officer.findOne({ where: { email } });
    if (officerExists) {
      return res
        .status(400)
        .json({ message: "Officer with this email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new officer
    const officer = await Officer.create({
      name,
      email,
      password: hashedPassword,
      contactInfo,
      region,
      status,
    });

    res.status(201).json({
      id: officer.id,
      name: officer.name,
      email: officer.email,
      token: generateToken(officer.id),
      message: "Officer registered successfully",
    });
  } catch (error) {
    console.error("Error registering officer:", error);
    res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
};

const loginOfficer = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for officer email
    const officer = await Officer.findOne({ where: { email } });

    // Check password
    if (officer && (await bcrypt.compare(password, officer.password))) {
      res.json({
        id: officer.id,
        name: officer.name,
        email: officer.email,
        token: generateToken(officer.id),
        message: "Logged in successfully",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in officer:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

// Get current officer's profile (protected route)
const getOfficerProfile = async (req, res) => {
  // req.officer is set by the protect middleware
  if (req.officer) {
    res.json(req.officer);
  } else {
    res.status(404).json({ message: "Officer not found" });
  }
};

export { registerOfficer, loginOfficer, getOfficerProfile };
