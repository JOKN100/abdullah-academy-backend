import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// حماية المسار: للأدمن فقط
router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);

export default router;