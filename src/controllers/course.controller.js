import Course from '../models/Course.js';
import User from '../models/User.js';

// 1. جلب كل الكورسات (لعرضها في الصفحة الرئيسية للجميع)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isVisible: true }).populate('teacher', 'name profileImage').lean();
    // 💡 دمج بيانات المدرس عشان الفرونت إند القديم ميبُظش
    const formattedCourses = courses.map(c => ({
      ...c,
      teacherName: c.teacher?.name || 'مدرس عام',
      teacherImage: c.teacher?.profileImage || ''
    }));
    res.status(200).json({ status: 'success', data: formattedCourses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. جلب الكورسات للوحة الإدارة (للأدمن فقط)
export const getAllAdminCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).populate('teacher', 'name profileImage').lean();
    const formattedCourses = courses.map(c => ({
      ...c,
      teacherName: c.teacher?.name || 'مدرس عام',
      teacherImage: c.teacher?.profileImage || ''
    }));
    res.status(200).json({ status: 'success', data: formattedCourses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. إنشاء كورس جديد (للأدمن)
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ status: 'success', data: course });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. تفعيل كورس لطالب (للأدمن)
export const enrollStudent = async (req, res) => {
  try {
    const { email, courseId } = req.body;
    const student = await User.findOne({ email });
    
    if (!student) return res.status(404).json({ status: 'fail', message: 'الطالب غير موجود' });
    
    if (student.enrolledCourses.includes(courseId)) {
       return res.status(400).json({ status: 'fail', message: 'الطالب مسجل بالفعل في هذا الكورس' });
    }

    student.enrolledCourses.push(courseId);
    await student.save();
    
    res.status(200).json({ status: 'success', message: 'تم تفعيل الكورس للطالب بنجاح' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. إضافة درس لكورس (للأدمن)
export const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });

    course.lessons.push(req.body);
    await course.save();
    
    res.status(200).json({ status: 'success', message: 'تم إضافة الدرس بنجاح', data: course });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 6. تشغيل الكورس وجلب محتواه (للطالب المسجل)
export const playCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name profileImage').lean();
    if (!course) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });

    if (req.user.role === 'student' && !req.user.enrolledCourses.map(id => id.toString()).includes(course._id.toString())) {
       return res.status(403).json({ status: 'fail', message: 'غير مصرح لك بمشاهدة هذا الكورس، يرجى الاشتراك أولاً' });
    }

    course.teacherName = course.teacher?.name || 'مدرس عام';
    course.teacherImage = course.teacher?.profileImage || '';

    res.status(200).json({ status: 'success', data: course });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 7. تعديل الكورس (للأدمن)
export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCourse) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });
    res.status(200).json({ status: 'success', data: updatedCourse });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 8. حذف الكورس نهائياً (للأدمن)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });
    res.status(200).json({ status: 'success', message: 'تم حذف الكورس بنجاح' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 9. جلب الكورسات التي اشترك بها الطالب (للوحة الطالب)
export const getMyCourses = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate({
      path: 'enrolledCourses',
      populate: { path: 'teacher', select: 'name profileImage' }
    }).lean();

    const formattedCourses = student.enrolledCourses.map(c => ({
      ...c,
      teacherName: c.teacher?.name || 'مدرس عام',
      teacherImage: c.teacher?.profileImage || ''
    }));

    res.status(200).json({ status: 'success', data: formattedCourses });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 10. تسجيل الدرس كمكتمل للطالب
export const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const student = await User.findById(req.user._id);

    let progressIndex = student.courseProgress.findIndex(p => p.course.toString() === courseId);
    if (progressIndex > -1) {
      if (!student.courseProgress[progressIndex].completedLessons.includes(lessonId)) {
        student.courseProgress[progressIndex].completedLessons.push(lessonId);
      }
    } else {
      student.courseProgress.push({ course: courseId, completedLessons: [lessonId] });
    }
    await student.save();
    res.status(200).json({ status: 'success', data: student.courseProgress });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 11. تعديل درس معين جوه الكورس
export const updateLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });

    const lesson = course.lessons.id(lessonId);
    if (!lesson) return res.status(404).json({ status: 'fail', message: 'الدرس غير موجود' });

    if (req.body.title) lesson.title = req.body.title;
    if (req.body.videoUrl) lesson.videoUrl = req.body.videoUrl;
    if (req.body.pdfUrl) lesson.pdfUrl = req.body.pdfUrl;

    await course.save();
    res.status(200).json({ status: 'success', message: 'تم تعديل الدرس بنجاح', data: course });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 12. حذف درس معين من الكورس
export const deleteLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const course = await Course.findByIdAndUpdate(courseId, { $pull: { lessons: { _id: lessonId } } }, { new: true });
    if (!course) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });
    res.status(200).json({ status: 'success', message: 'تم حذف الدرس بنجاح', data: course });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// جلب قائمة الطلاب الذين شاهدوا الدرس
export const getLessonViewers = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const viewers = await User.find({
      courseProgress: { $elemMatch: { course: courseId, completedLessons: lessonId } }
    }).select('name email phone parentPhone');
    res.status(200).json({ status: 'success', count: viewers.length, data: viewers });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// دالة إخفاء وإظهار الكورس
exports.toggleCourseVisibility = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "الكورس غير موجود" });
    }
    
    // عكس الحالة (لو ظاهر نخليه مخفي والعكس)
    course.isVisible = !course.isVisible;
    await course.save();
    
    res.status(200).json({ message: "تم تعديل حالة الكورس بنجاح", course });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ في السيرفر", error });
  }
};