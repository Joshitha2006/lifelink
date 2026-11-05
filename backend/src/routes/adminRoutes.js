import express from 'express';
import {
  getAdminStats,
  getAllUsersAdmin,
  toggleUserVerification,
  deleteUserAdmin,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/verify', toggleUserVerification);
router.delete('/users/:id', deleteUserAdmin);

export default router;
