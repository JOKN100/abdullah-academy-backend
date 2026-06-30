import express from 'express';
import { getAllPackages, createPackage, deletePackage } from '../controllers/package.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = express.Router();

// مسار عام للطلاب يشوفوا الباقات
router.get('/', getAllPackages);

// مسارات محمية للأدمن فقط
router.use(protect, restrictTo('admin'));
router.post('/', createPackage);
router.delete('/:id', deletePackage);

export default router;