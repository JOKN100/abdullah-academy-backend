import express from 'express';
import {
  submitPayment,
  getAllPayments,
  updatePaymentStatus,
} from '../controllers/payment.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// جميع مسارات الدفع تتطلب تسجيل دخول
router.use(protect);

// الطالب يرفع إيصال
router.post('/', submitPayment);

// الأدمن يرى ويدير طلبات الدفع
router.get('/', restrictTo('admin'), getAllPayments);
router.patch('/:id/status', restrictTo('admin'), updatePaymentStatus);

export default router;