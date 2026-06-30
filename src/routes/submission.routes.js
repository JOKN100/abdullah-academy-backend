import express from 'express';
import { submitExam, gradeSubmission } from '../controllers/submission.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

// الطالب يسلم الامتحان
router.post('/exam/:examId', submitExam);

// الأدمن يصحح مقالي أو واجبات
router.patch('/:id/grade', restrictTo('admin'), gradeSubmission);

export default router;