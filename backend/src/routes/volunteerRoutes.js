import express from 'express';
import {
  getMyVolunteerProfile,
  updateVolunteerProfile,
  getAllVolunteers,
  getRecommendedVolunteers,
  getAvailableHelpRequests,
} from '../controllers/volunteerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getAllVolunteers);
router.get('/profile', protect, authorize('volunteer'), getMyVolunteerProfile);
router.put('/profile', protect, authorize('volunteer'), updateVolunteerProfile);
router.get('/recommendations/:requestId', protect, getRecommendedVolunteers);
router.get('/available-requests', protect, authorize('volunteer', 'admin'), getAvailableHelpRequests);

export default router;
