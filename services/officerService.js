const db = require("../models");
const bcrypt = require("bcryptjs");

const { Officer, Call } = db;

// Get all officers (excluding passwords)
exports.getAllOfficers = async () => {
  const officers = await Officer.findAll({
    attributes: { exclude: ["password"] },
  });
  return officers;
};

// Get a single officer by ID with associated calls
exports.getOfficerById = async (id) => {
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
  return officer;
};

// Update officer details
exports.updateOfficer = async (id, updateData) => {
  const { name, email, password, contactInfo, region, status } = updateData;

  const officer = await Officer.findByPk(id);
  if (!officer) {
    throw new Error("Officer not found");
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
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
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
};

// Delete officer by ID
exports.deleteOfficer = async (id) => {
  const officer = await Officer.findByPk(id);
  if (!officer) {
    throw new Error("Officer not found");
  }
  await officer.destroy();
  return true;
};
