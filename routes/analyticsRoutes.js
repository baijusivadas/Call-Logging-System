const express = require("express");
// Import the analytics controller functions
const {
  getCallVolumes,
  getTotalCallTimePerOfficer,
  getCallsPerOfficerPerDay,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All analytics routes are protected
router.get("/volumes", protect, getCallVolumes);
router.get("/call-time-per-officer", protect, getTotalCallTimePerOfficer);
router.get("/calls-per-officer-per-day", protect, getCallsPerOfficerPerDay);

module.exports = router;
