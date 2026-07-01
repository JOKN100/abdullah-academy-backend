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
<<<<<<< HEAD
  markLessonComplete,
=======
  markLessonComplete, // 💡 ضفنا دي هنا
>>>>>>> d45b57fc7bdf94ae488659ffc2a40755fbe8c14b
  toggleCourseVisibility
} from '../controllers/course.controller.js';

const router = express.Router();

// عملنا متغير بيسمح للأدمن والمدرس مع بعض عشان نستخدمه بسهولة
const allowAdminAndTeacher = restrictTo('admin', 'teacher');


// ==========================================
// 1. المسارات العامة (بدون تسجيل دخول)
// ==========================================
router.get('/', getAllCourses); 

<<<<<<< HEAD

// ==========================================
// 2. مسارات الطلاب (تحتاج تسجيل دخول فقط)
// ==========================================
=======
router.use(protect, restrictTo('admin', 'teacher'));
// ضيف السطر ده
router.patch('/:id/toggle-visibility', toggleCourseVisibility);
// 2. مسارات الطلاب (تحتاج تسجيل دخول)
// جلب بيانات الكورس والدروس للطالب عشان يتفرج عليها
router.get('/:id/play', protect, playCourse); 
// جلب كورسات الطالب المسجل
>>>>>>> d45b57fc7bdf94ae488659ffc2a40755fbe8c14b
router.get('/my-courses', protect, getMyCourses);
router.get('/enrolled', protect, getMyCourses);
router.get('/:id/play', protect, playCourse); 
// 💡 المسار ده كان مقفول على الطلاب في الكود القديم، دلوقتي رجع يشتغل صح
router.post('/:courseId/lessons/:lessonId/complete', protect, markLessonComplete);
<<<<<<< HEAD


// ==========================================
// 3. مسارات المدرسين والأدمن (إدارة الكورسات)
// ==========================================
// جلب الكورسات للوحة الإدارة
router.get('/admin/all', protect, allowAdminAndTeacher, getAllAdminCourses); 

// إضافة وتعديل وحذف الكورسات
router.post('/', protect, allowAdminAndTeacher, createCourse); 
router.patch('/:id', protect, allowAdminAndTeacher, updateCourse); 
router.delete('/:id', protect, allowAdminAndTeacher, deleteCourse); 
router.patch('/:id/toggle-visibility', protect, allowAdminAndTeacher, toggleCourseVisibility);

// إضافة وتعديل وحذف الدروس
router.post('/admin/:id/lessons', protect, allowAdminAndTeacher, addLesson); 
router.patch('/admin/:courseId/lessons/:lessonId', protect, allowAdminAndTeacher, updateLesson);
router.delete('/admin/:courseId/lessons/:lessonId', protect, allowAdminAndTeacher, deleteLesson);


// ==========================================
// 4. مسارات التفعيل (Enrollment)
// ==========================================
// 💡 خليت المدرس كمان يقدر يفعل الكورس لطلابه، لو عايزها للأدمن بس، خليها restrictTo('admin')
router.post('/admin/enroll', protect, allowAdminAndTeacher, enrollStudent); 

export default router;
=======
// مسارات إدارة درس معين
router.patch('/admin/:courseId/lessons/:lessonId', updateLesson);
router.delete('/admin/:courseId/lessons/:lessonId', deleteLesson);
export default router;
>>>>>>> d45b57fc7bdf94ae488659ffc2a40755fbe8c14b
