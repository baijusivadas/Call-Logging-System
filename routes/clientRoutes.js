const express = require("express");
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clientController.js");

const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// All client routes are protected
router.route("/").post(protect, createClient).get(protect, getClients);

// Specific client routes
router
  .route("/:id")
  .get(protect, getClientById)
  .put(protect, updateClient)
  .delete(protect, deleteClient);

module.exports = router;
