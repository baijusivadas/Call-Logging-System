const express = require("express");
const {
  logCall,
  getCalls,
  getCallById,
  updateCall,
  deleteCall,
} = require("../controllers/callController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All call routes are protected
router.route("/").post(protect, logCall).get(protect, getCalls);

router
  .route("/:id")
  .get(protect, getCallById)
  .put(protect, updateCall)
  .delete(protect, deleteCall);

module.exports = router;
