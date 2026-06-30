import express from 'express';
import {
  createLesson,
  getChapterLessons,
  getLessonById,
} from '../controllers/lesson.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { verifyEnrollment } from '../middlewares/enrollment.middleware.js';

const router = express.Router();

// جلب الدروس لفصل معين (معلومات عامة فقط بدون المحتوى السري)
router.get('/chapter/:chapterId', getChapterLessons);

// === مسار رؤية محتوى الدرس السري ===
// 1. يجب أن يكون مسجلاً للدخول (protect)
// 2. يجب أن يكون اشتراكه فعالاً في هذا الكورس (verifyEnrollment)
router.get('/:id', protect, verifyEnrollment, getLessonById);

// === مسارات الإدارة (Admin Only) ===
router.post('/', protect, restrictTo('admin'), createLesson);

export default router;