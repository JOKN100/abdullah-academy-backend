import express from 'express';
import {
  createChapter,
  getCourseChapters,
  updateChapter,
} from '../controllers/chapter.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// جلب فصول كورس معين (عام)
router.get('/course/:courseId', getCourseChapters);

// مسارات الإدارة (Admin Only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createChapter);
router.patch('/:id', updateChapter);

export default router;