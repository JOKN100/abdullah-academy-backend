import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
// استدعاء كل الدوال من الكنترولر (تأكد إن الأسماء دي مطابقة للي جوه الكنترولر عندك)
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

// استدعاء ميدل وير الحماية
const router = express.Router();

// 1. المسارات العامة (بدون تسجيل دخول)
// جلب الكورسات لعرضها في الصفحة الرئيسية (Landing Page)
router.get('/', getAllCourses); 

router.use(protect, restrictTo('admin', 'teacher'));
// ضيف السطر ده
router.patch('/:id/toggle-visibility', toggleCourseVisibility);
// 2. مسارات الطلاب (تحتاج تسجيل دخول)
// جلب بيانات الكورس والدروس للطالب عشان يتفرج عليها
router.get('/:id/play', protect, playCourse); 
// جلب كورسات الطالب المسجل
router.get('/my-courses', protect, getMyCourses);
router.get('/enrolled', protect, getMyCourses); // ضفتلك الاسمين احتياطي عشان يشتغل مع شاشة الطالب عندك
// 3. مسارات الأدمن (تحتاج تسجيل دخول + صلاحية أدمن)
// تطبيق حماية الأدمن على كل المسارات اللي تحت السطر ده
router.use(protect, restrictTo('admin'));
// جلب كل الكورسات للوحة الإدارة
router.get('/admin/all', getAllAdminCourses); 
// تفعيل كورس لطالب
router.post('/admin/enroll', enrollStudent); 
// إضافة كورس جديد
router.post('/', createCourse); 
// إضافة درس جديد لكورس معين
router.post('/admin/:id/lessons', addLesson); 
// 🚀 مسارات التعديل والحذف اللي لسه ضايفينها 🚀
// تعديل بيانات كورس
router.patch('/:id', updateCourse); 
// حذف كورس نهائياً
router.delete('/:id', deleteCourse); 
// تسجيل درس كمكتمل للطالب
router.post('/:courseId/lessons/:lessonId/complete', protect, markLessonComplete);
// مسارات إدارة درس معين
router.patch('/admin/:courseId/lessons/:lessonId', updateLesson);
router.delete('/admin/:courseId/lessons/:lessonId', deleteLesson);
export default router;
