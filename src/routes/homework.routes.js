import express from 'express';
import { submitHomework, getPendingHomeworks, gradeHomework, getHomeworkStatus } from '../controllers/homework.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// جميع المسارات تحتاج تسجيل دخول
router.use(protect);

router.post('/submit', submitHomework); // تسليم الواجب (طالب)
router.get('/status/:lessonId', getHomeworkStatus); // معرفة درجة الواجب (طالب)

// مسارات الأدمن فقط
router.use(restrictTo('admin'));
router.get('/pending', getPendingHomeworks); // عرض الواجبات المنتظرة التصحيح
router.patch('/:id/grade', gradeHomework);
export default router;