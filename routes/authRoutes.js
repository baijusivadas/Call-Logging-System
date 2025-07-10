const express = require("express");
const {  registerOfficer, 
  loginOfficer, 
  getOfficerProfile 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerOfficer);
router.post("/login", loginOfficer);
router.get("/profile", protect, getOfficerProfile); // Protected route

module.exports = router;
