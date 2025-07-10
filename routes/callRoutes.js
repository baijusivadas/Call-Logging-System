import express from 'express';
import {
  logCall,
  getCalls,
  getCallById,
  updateCall,
  deleteCall,
} from '../controllers/callController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All call routes are protected
router.route('/')
  .post(protect, logCall)
  .get(protect, getCalls);

router.route('/:id')
  .get(protect, getCallById)
  .put(protect, updateCall)
  .delete(protect, deleteCall);

export default router;