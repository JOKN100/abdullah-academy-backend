import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { getExamByLesson, createExam, addQuestion, submitExamResult } from '../controllers/exam.controller.js';
const router = express.Router();


// حماية عامة (لازم يكون مسجل دخول)
router.use(protect);

// مسار جلب الامتحان (متاح للطالب والأدمن)
router.get('/lesson/:lessonId', getExamByLesson);

router.post('/', protect, restrictTo('admin', 'teacher'), createExam);
router.post('/:examId/questions', protect, restrictTo('admin', 'teacher'), addQuestion);

// حماية إضافية (المسارات اللي تحت دي للأدمن فقط)
router.use(restrictTo('admin'));

router.use(protect, restrictTo('admin', 'teacher'));
router.post('/:id/submit', protect, submitExamResult);
export default router;