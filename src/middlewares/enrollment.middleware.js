import Enrollment from '../models/Enrollment.js';

/**
 * Middleware جوهري للتحقق مما إذا كان الطالب مشتركاً بالفعل في الكورس وحسابه فعال.
 * يمنع الوصول لأي درس، امتحان، أو واجب إذا لم يكن الاشتراك 'active' وصالحاً زمنيًا.
 */
export const verifyEnrollment = async (req, res, next) => {
  try {
    // إذا كان المستخدم أدمن، نسمح له بالمرور مباشرة لرؤية كل المحتوى
    if (req.user.role === 'admin') {
      return next();
    }

    // البحث عن الـ courseId في الـ Params أو الـ Query أو الـ Body
    const courseId = req.params.courseId || req.query.courseId || req.body.courseId;

    if (!courseId) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'Course ID is required to verify enrollment.' 
      });
    }

    // البحث عن اشتراك الطالب في هذا الكورس
    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: courseId
    });

    if (!enrollment) {
      return res.status(403).json({ 
        status: 'fail', 
        message: 'You are not enrolled in this course.' 
      });
    }

    // التحقق من حالة الاشتراك
    if (enrollment.status !== 'active') {
      return res.status(403).json({ 
        status: 'fail', 
        message: `Your enrollment status is ${enrollment.status}. You cannot access this content.` 
      });
    }

    // التحقق من تاريخ انتهاء الاشتراك
    if (new Date() > new Date(enrollment.endDate)) {
      // (اختياري) يمكننا هنا تحديث الحالة إلى 'expired' في قاعدة البيانات تلقائياً
      enrollment.status = 'expired';
      await enrollment.save();

      return res.status(403).json({ 
        status: 'fail', 
        message: 'Your enrollment has expired. Please renew your subscription.' 
      });
    }

    // إذا كان كل شيء سليم، نمرر الطلب للمسار التالي
    next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error verifying enrollment status.' });
  }
};