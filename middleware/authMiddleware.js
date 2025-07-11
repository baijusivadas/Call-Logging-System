// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const db = require("../models");

const { Officer } = db;

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  try {
    // Check for Authorization header with Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      //  Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the officer by ID, excluding password
      const officer = await Officer.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!officer) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, officer not found",
        });
      }

      //  Attach officer to request object
      req.officer = officer;

      // Continue
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

module.exports = {
  protect,
};
