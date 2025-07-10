// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const db = require("../models"); // Adjust the path as necessary to import your models

const { Officer } = db;

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach officer to the request object (excluding password)
      req.officer = await Officer.findByPk(decoded.id, {
        attributes: { exclude: ["password"] }, // Exclude password from the returned object
      });

      if (!req.officer) {
        return res
          .status(401)
          .json({ message: "Not authorized, officer not found" });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = {
  protect, // Export the protect middleware
};
