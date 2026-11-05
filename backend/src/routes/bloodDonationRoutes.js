import express from 'express';
import {
  createBloodRequest,
  getAllBloodRequests,
  approveBloodRequest,
  updateBloodRequestStatus,
  getRegisteredDonors,
} from '../controllers/bloodDonationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getAllBloodRequests)
  .post(protect, createBloodRequest);

router.get('/donors', protect, getRegisteredDonors);
router.put('/:id/approve', protect, authorize('admin'), approveBloodRequest);
router.put('/:id/status', protect, updateBloodRequestStatus);

export default router;
