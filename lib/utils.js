require('dotenv').config();
const jwt = require('jsonwebtoken');

exports.sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({ success, message, data });
};

// Helper function to generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
};
