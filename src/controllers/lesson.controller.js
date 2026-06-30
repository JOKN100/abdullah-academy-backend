import Lesson from '../models/Lesson.js';
import Chapter from '../models/Chapter.js';

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private/Admin
export const createLesson = async (req, res) => {
  try {
    const { chapterId, title, contentType, videoId, attachments, order } = req.body;

    const lesson = await Lesson.create({
      chapterId,
      title,
      contentType,
      videoId,
      attachments,
      order,
    });

    res.status(201).json({
      status: 'success',
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all lessons for a chapter (Metadata only, no video URLs for public)
// @route   GET /api/lessons/chapter/:chapterId
// @access  Public
export const getChapterLessons = async (req, res) => {
  try {
    // نجلب الدروس لكن نخفي الـ videoId والمرفقات إذا كان المستخدم يتصفح الكورس من الخارج
    const lessons = await Lesson.find({ chapterId: req.params.chapterId })
      .select('-videoId -attachments')
      .sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      results: lessons.length,
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get single lesson content (Video & Attachments)
// @route   GET /api/lessons/:id
// @access  Private (Requires active enrollment)
export const getLessonById = async (req, res) => {
  try {
    // req.query.courseId قادم من الـ Frontend لاجتياز verifyEnrollment middleware
    const providedCourseId = req.query.courseId;

    // جلب الدرس مع عمل populate للفصل لمعرفة الـ courseId الحقيقي للدرس
    const lesson = await Lesson.findById(req.params.id).populate({
      path: 'chapterId',
      select: 'courseId title'
    });

    if (!lesson) {
      return res.status(404).json({ status: 'fail', message: 'Lesson not found' });
    }

    // ⚡ فحص أمني: التأكد من أن الدرس المطلوب ينتمي فعلاً للكورس الذي اشترك فيه الطالب
    // لمنع ثغرة إرسال courseId صالح مع lessonId لكورس غير مشترك فيه
    if (req.user.role !== 'admin' && lesson.chapterId.courseId.toString() !== providedCourseId) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'Security breach detected: This lesson does not belong to the requested course.' 
      });
    }

    res.status(200).json({
      status: 'success',
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};