const express = require("express");
const {
  getOfficers,
  getOfficerById,
  updateOfficer,
  deleteOfficer,
} = require("../controllers/officerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All officer routes are protected
router.route("/").get(protect, getOfficers);
router
  .route("/:id")
  .get(protect, getOfficerById)
  .put(protect, updateOfficer)
  .delete(protect, deleteOfficer);

module.exports = router;
