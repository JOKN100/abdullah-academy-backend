import Exam from '../models/Exam.js';

// 1. جلب امتحان الدرس (للطالب والأدمن)
export const getExamByLesson = async (req, res) => {
  try {
    const exam = await Exam.findOne({ lessonId: req.params.lessonId });
    if (!exam) {
      return res.status(404).json({ status: 'fail', message: 'لا يوجد امتحان لهذا الدرس' });
    }
    res.status(200).json({ status: 'success', data: exam });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. إنشاء امتحان جديد (للأدمن)
export const createExam = async (req, res) => {
  try {
    const newExam = await Exam.create(req.body);
    res.status(201).json({ status: 'success', data: newExam });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. إضافة سؤال للامتحان (للأدمن)
export const addQuestion = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId);
    if (!exam) return res.status(404).json({ status: 'fail', message: 'الامتحان غير موجود' });

    exam.questions.push(req.body);
    await exam.save();

    res.status(200).json({ status: 'success', data: exam });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. حفظ نتيجة الطالب بعد أداء الامتحان
export const submitExamResult = async (req, res) => {
  try {
    const { id } = req.params; // ID بتاع الامتحان
    const { score, percentage, isPassed } = req.body;
    const studentId = req.user._id;

    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ status: 'fail', message: 'الامتحان غير موجود' });

    // التأكد إن الطالب ممتحنش قبل كده (عشان الإحصائيات متتكررش لنفس الطالب)
    const alreadyTaken = exam.results.find(r => r.studentId.toString() === studentId.toString());
    
    if (alreadyTaken) {
      // لو امتحن قبل كده، هنحدث درجته لأحدث محاولة
      alreadyTaken.score = score;
      alreadyTaken.percentage = percentage;
      alreadyTaken.isPassed = isPassed;
      alreadyTaken.submittedAt = Date.now();
    } else {
      // لو أول مرة يمتحن
      exam.results.push({ studentId, score, percentage, isPassed });
    }

    await exam.save();
    res.status(200).json({ status: 'success', message: 'تم حفظ النتيجة بنجاح للتقييم' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};