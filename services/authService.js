const bcrypt = require("bcryptjs");
const db = require("../models");
const { generateToken } = require("../lib/utils");
const { createLogger } = require("logger");

const logger = createLogger("logs/service.log");
logger.setLevel("debug");

const { Officer } = db;

exports.registerOfficer = async (officerData) => {
  try {
    const { name, email, password, contactInfo, region, status } = officerData;
    logger.debug(`Attempting to register officer with email: ${email}`);

    const officerExists = await Officer.findOne({ where: { email } });
    if (officerExists) {
      logger.debug(
        `Registration failed: Officer with email ${email} already exists`
      );
      const error = new Error("Officer with this email already exists");
      error.code = "DUPLICATE";
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    logger.debug(`Password hashed successfully for officer: ${email}`);

    const officer = await Officer.create({
      name,
      email,
      password: hashedPassword,
      contactInfo,
      region,
      status,
    });

    logger.debug(`Officer registered successfully with ID: ${officer.id}`);

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
    logger.error(`Error registering officer: ${error.message}`);
    throw new Error(error.message || "Error registering officer");
  }
};

exports.loginOfficer = async (email, password) => {
  try {
    logger.debug(`Attempting login for officer with email: ${email}`);

    const officer = await Officer.findOne({ where: { email } });

    if (officer && (await bcrypt.compare(password, officer.password))) {
      logger.debug(`Officer login successful for ID: ${officer.id}`);

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
      logger.debug(`Invalid login attempt for email: ${email}`);
      const error = new Error("Invalid email or password");
      error.code = "UNAUTHORIZED";
      throw error;
    }
  } catch (error) {
    logger.error(`Error logging in officer: ${error.message}`);
    throw new Error(error.message || "Error logging in officer");
  }
};
