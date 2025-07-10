import express from 'express';
import {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All client routes are protected
router.route('/')
  .post(protect, createClient)
  .get(protect, getClients);

router.route('/:id')
  .get(protect, getClientById)
  .put(protect, updateClient)
  .delete(protect, deleteClient);

export default router;
