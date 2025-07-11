//express router
const express = require("express");
// Import the call controller functions
const {
  logCall,
  getCalls,
  getCallById,
  updateCall,
  deleteCall,
} = require("../controllers/callController");
// Import the authentication middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All call routes are protected
router.route("/").post(protect, logCall).get(protect, getCalls);

// Specific call routes
router
  .route("/:id")
  .get(protect, getCallById)
  .put(protect, updateCall)
  .delete(protect, deleteCall);

module.exports = router;
