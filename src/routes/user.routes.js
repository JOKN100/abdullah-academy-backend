import express from 'express';
import {getAllUsers,
  toggleStudentStatus, 
  updateUserByAdmin, 
  adminCreateUser, 
  resetStudentPasswordByAdmin, 
  updateProfileImage,
  updateMyProfile
} from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import User from '../models/User.js';

const router = express.Router();

// 💡 تطبيق حماية الأدمن على جميع مسارات إدارة الطلاب اللي تحت
router.use(protect, restrictTo('admin'));
// مسار إعادة ضبط كلمة المرور
// تحديث الصورة الشخصية للمستخدم الحالي
router.patch('/profile/image', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { profileImage: req.body.profileImage }, { new: true });
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});// جلب كل الطلاب
router.get('/', getAllUsers);

// إنشاء طالب جديد (باسم رباعي)
router.post('/admin-create', adminCreateUser);

// حظر أو تفعيل الطالب
router.patch('/:id/status', toggleStudentStatus);
router.patch('/profile', protect, updateMyProfile);
router.patch('/profile-image', protect, updateProfileImage);
// تعديل بيانات الطالب من لوحة الإدارة
router.patch('/admin/:id', updateUserByAdmin);

// 👇 السطر ده هو قلب المشكلة اللي كان ناقص!
export default router;