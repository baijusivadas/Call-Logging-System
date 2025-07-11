//express router 
const express = require("express");
// Import the analytics controller functions
const {
  getCallVolumes,
  getTotalCallTimePerOfficer,
  getCallsPerOfficerPerDay,
} = require("../controllers/analyticsController");
// Import the authentication middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All analytics routes are protected

// volume of calls route
router.get("/volumes", protect, getCallVolumes);
// total call time per officer route
router.get("/call-time-per-officer", protect, getTotalCallTimePerOfficer);
// calls per officer per day route
router.get("/calls-per-officer-per-day", protect, getCallsPerOfficerPerDay);

module.exports = router;
