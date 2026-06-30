import express from 'express';
import {
  getMyEnrollments,
  getAllEnrollments,
} from '../controllers/enrollment.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// الطالب يرى كورساته المشترك بها
router.get('/me', getMyEnrollments);

// الأدمن يرى كل الاشتراكات
router.get('/', restrictTo('admin'), getAllEnrollments);

export default router;