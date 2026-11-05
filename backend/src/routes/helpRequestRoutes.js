import express from 'express';
import {
  createHelpRequest,
  getAllHelpRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
  addProgressNote,
  deleteHelpRequest,
} from '../controllers/helpRequestController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getAllHelpRequests)
  .post(protect, upload.single('image'), createHelpRequest);

router.get('/my', protect, getMyRequests);

router.route('/:id')
  .get(getRequestById)
  .delete(protect, deleteHelpRequest);

router.put('/:id/status', protect, updateRequestStatus);
router.post('/:id/progress', protect, addProgressNote);

export default router;
