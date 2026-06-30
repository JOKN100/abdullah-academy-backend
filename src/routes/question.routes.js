import express from 'express';
import { addQuestion, deleteQuestion } from '../controllers/question.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// فقط الأدمن يمكنه التحكم المباشر بالأسئلة (الطلاب يرونها عبر مسار startExam)
router.use(protect, restrictTo('admin'));

router.post('/', addQuestion);
router.delete('/:id', deleteQuestion);

export default router;