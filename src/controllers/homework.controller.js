import Homework from '../models/Homework.js';

// 1. إرسال الواجب (بواسطة الطالب)
export const submitHomework = async (req, res) => {
  try {
    const { courseId, lessonId, fileUrl } = req.body;
    const studentId = req.user._id; // هنجيبه من الـ protect middleware

    // التأكد إذا كان الطالب سلم الواجب ده قبل كده عشان نحدثه أو نمنع التكرار
    let homework = await Homework.findOne({ lessonId, studentId });

    if (homework) {
      // لو سلم قبل كده، بنحدث الرابط وبنرجع الحالة لـ pending عشان يتصحح من جديد
      homework.fileUrl = fileUrl;
      homework.status = 'pending';
      await homework.save();
      return res.status(200).json({ status: 'success', message: 'تم تحديث الواجب بنجاح!', data: homework });
    }

    // لو أول مرة يسلم
    homework = await Homework.create({
      courseId,
      lessonId,
      studentId,
      fileUrl
    });

    res.status(201).json({ status: 'success', message: 'تم تسليم الواجب بنجاح!', data: homework });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. جلب الواجبات المعلقة (للأدمن عشان يصححها)
export const getPendingHomeworks = async (req, res) => {
  try {
    // هنجيب الواجبات الـ pending ونعمل populate لبيانات الطالب وبيانات الكورس عشان نعرف مين اللي باعت
    const homeworks = await Homework.find({ status: 'pending' })
      .populate('studentId', 'name email phone')
      .populate('courseId', 'title')
      .sort({ createdAt: 1 }); // الأقدم أولاً

    res.status(200).json({ status: 'success', data: homeworks });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. تصحيح الواجب ورصد الدرجة (بواسطة الأدمن)
export const gradeHomework = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const homeworkId = req.params.id;

    const homework = await Homework.findById(homeworkId);
    if (!homework) {
      return res.status(404).json({ status: 'fail', message: 'الواجب غير موجود' });
    }

    homework.grade = grade;
    homework.feedback = feedback;
    homework.status = 'graded'; // تحويل الحالة لمصحح
    await homework.save();

    res.status(200).json({ status: 'success', message: 'تم رصد الدرجة وإرسال التقييم للطالب بنجاح!' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. جلب حالة واجب معين لطالب (عشان نعرضاله درجته تحت الفيديو)
export const getHomeworkStatus = async (req, res) => {
  try {
    const homework = await Homework.findOne({ 
      lessonId: req.params.lessonId, 
      studentId: req.user._id 
    });
    
    res.status(200).json({ status: 'success', data: homework });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};