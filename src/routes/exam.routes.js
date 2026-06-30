import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { getExamByLesson, createExam, addQuestion, submitExamResult } from '../controllers/exam.controller.js';
const router = express.Router();


// حماية عامة (لازم يكون مسجل دخول)
router.use(protect);

// مسار جلب الامتحان (متاح للطالب والأدمن)
router.get('/lesson/:lessonId', getExamByLesson);

// حماية إضافية (المسارات اللي تحت دي للأدمن فقط)
router.use(restrictTo('admin'));

router.post('/', createExam); // مسار إنشاء الامتحان
router.use(protect, restrictTo('admin', 'teacher'));
router.post('/:id/questions', addQuestion); // مسار إضافة سؤال
router.post('/:id/submit', protect, submitExamResult);
export default router;