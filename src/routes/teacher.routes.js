import express from 'express';
import { getTeacherDashboardData } from '../controllers/teacher.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// مسار محمي للمدرسين فقط
router.use(protect, restrictTo('teacher'));

router.get('/dashboard', getTeacherDashboardData);

export default router;