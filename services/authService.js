const bcrypt = require("bcryptjs");
const db = require("../models");
const { generateToken } = require("../lib/utils");

const { Officer } = db;

/**
 * Register a new officer
 */
exports.registerOfficer = async (officerData) => {
  try {
    const { name, email, password, contactInfo, region, status } = officerData;

    const officerExists = await Officer.findOne({ where: { email } });
    if (officerExists) {
      const error = new Error("Officer with this email already exists");
      error.code = "DUPLICATE";
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const officer = await Officer.create({
      name,
      email,
      password: hashedPassword,
      contactInfo,
      region,
      status,
    });

    return {
      id: officer.id,
      name: officer.name,
      email: officer.email,
      contactInfo: officer.contactInfo,
      region: officer.region,
      status: officer.status,
      token: generateToken(officer.id),
    };
  } catch (error) {
    throw new Error(error.message || "Error registering officer");
  }
};

/**
 * Login an officer
 */
exports.loginOfficer = async (email, password) => {
  try {
    const officer = await Officer.findOne({ where: { email } });

    if (officer && (await bcrypt.compare(password, officer.password))) {
      return {
        id: officer.id,
        name: officer.name,
        email: officer.email,
        contactInfo: officer.contactInfo,
        region: officer.region,
        status: officer.status,
        token: generateToken(officer.id),
      };
    } else {
      const error = new Error("Invalid email or password");
      error.code = "UNAUTHORIZED";
      throw error;
    }
  } catch (error) {
    throw new Error(error.message || "Error logging in officer");
  }
};


