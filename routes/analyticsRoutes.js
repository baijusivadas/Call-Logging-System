import express from "express";
import {
  getCallVolumes,
  getTotalCallTimePerOfficer,
  getCallsPerOfficerPerDay,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes are protected
router.get("/volumes", protect, getCallVolumes);
router.get("/call-time-per-officer", protect, getTotalCallTimePerOfficer);
router.get("/calls-per-officer-per-day", protect, getCallsPerOfficerPerDay);

export default router;
