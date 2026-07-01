import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import { 
  getAllCourses, 
  getAllAdminCourses, 
  createCourse, 
  enrollStudent, 
  addLesson, 
  playCourse, 
  updateCourse, 
  deleteCourse,
  getMyCourses,
  updateLesson,
  deleteLesson,
  markLessonComplete, // 💡 ضفنا دي هنا
  toggleCourseVisibility
} from '../controllers/course.controller.js';

const router = express.Router();

// عملنا متغير بيسمح للأدمن والمدرس مع بعض عشان نستخدمه بسهولة
const allowAdminAndTeacher = restrictTo('admin', 'teacher');


// ==========================================
// 1. المسارات العامة (بدون تسجيل دخول)
// ==========================================
router.get('/', getAllCourses); 

router.use(protect, restrictTo('admin', 'teacher'));
// ضيف السطر ده
router.patch('/:id/toggle-visibility', toggleCourseVisibility);
// 2. مسارات الطلاب (تحتاج تسجيل دخول)
// جلب بيانات الكورس والدروس للطالب عشان يتفرج عليها
router.get('/:id/play', protect, playCourse); 
// جلب كورسات الطالب المسجل
router.get('/my-courses', protect, getMyCourses);
router.get('/enrolled', protect, getMyCourses);
router.get('/:id/play', protect, playCourse); 
// 💡 المسار ده كان مقفول على الطلاب في الكود القديم، دلوقتي رجع يشتغل صح
router.post('/:courseId/lessons/:lessonId/complete', protect, markLessonComplete);
// مسارات إدارة درس معين
router.patch('/admin/:courseId/lessons/:lessonId', updateLesson);
router.delete('/admin/:courseId/lessons/:lessonId', deleteLesson);
export default router;
>>>>>>> d45b57fc7bdf94ae488659ffc2a40755fbe8c14b
