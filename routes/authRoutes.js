import express from "express";
import {
  registerOfficer,
  loginOfficer,
  getOfficerProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerOfficer);
router.post("/login", loginOfficer);
router.get("/profile", protect, getOfficerProfile); // Protected route

export default router;
