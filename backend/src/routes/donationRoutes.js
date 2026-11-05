import express from 'express';
import {
  createDonation,
  getAllDonations,
  getMyDonations,
  requestResource,
  getResourceRequests,
  updateResourceRequestStatus,
  deleteDonation,
} from '../controllers/donationController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getAllDonations)
  .post(protect, upload.single('image'), createDonation);

router.get('/my', protect, getMyDonations);
router.get('/requests', protect, getResourceRequests);
router.post('/:id/request', protect, requestResource);
router.put('/requests/:id', protect, updateResourceRequestStatus);
router.delete('/:id', protect, deleteDonation);

export default router;
