import express from "express";
import {
  getOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
} from "../controllers/officerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All officer routes are protected
router.route("/").get(protect, getOfficers);
router
  .route("/:id")
  .get(protect, getOfficerById)
  .put(protect, updateOfficer)
  .delete(protect, deleteOfficer);

export default router;
