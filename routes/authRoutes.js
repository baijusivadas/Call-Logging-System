// express router for authentication routes
const express = require("express");

// Importing the controller functions and middleware
const {
  registerOfficer,
  loginOfficer,
  getOfficerProfile,
} = require("../controllers/authController");

// Importing the authentication middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Define the registration routes
router.post("/register", registerOfficer);
// Define the login and profile routes
router.post("/login", loginOfficer);
// Define the protected route for getting officer profile
router.get("/profile", protect, getOfficerProfile); // Protected route

module.exports = router;
