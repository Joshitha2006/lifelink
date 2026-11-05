import express from 'express';
import {
  getAllSupportCenters,
  createSupportCenter,
  updateSupportCenter,
  deleteSupportCenter,
} from '../controllers/supportCenterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllSupportCenters)
  .post(protect, authorize('admin'), createSupportCenter);

router.route('/:id')
  .put(protect, authorize('admin'), updateSupportCenter)
  .delete(protect, authorize('admin'), deleteSupportCenter);

export default router;
