import express from 'express';
import {
  assignVolunteer,
  acceptAssignment,
  declineAssignment,
  completeAssignment,
  getMyAssignments,
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'volunteer'), assignVolunteer);
router.get('/my', protect, authorize('volunteer', 'admin'), getMyAssignments);
router.post('/:id/accept', protect, authorize('volunteer', 'admin'), acceptAssignment);
router.post('/:id/decline', protect, authorize('volunteer'), declineAssignment);
router.post('/:id/complete', protect, authorize('volunteer', 'admin'), completeAssignment);

export default router;
