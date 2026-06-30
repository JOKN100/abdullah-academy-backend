import Submission from '../models/Submission.js';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';

// @desc    Submit an exam (Auto-grading included)
// @route   POST /api/submissions/exam/:examId
// @access  Private (Student)
export const submitExam = async (req, res) => {
  try {
    const { answers, timeSpent } = req.body; // answers: [{ questionId, studentAnswer }]
    const examId = req.params.examId;
    const studentId = req.user._id;

    // 1. فحص عدد المحاولات السابقة للطالب
    const exam = await Exam.findById(examId);
    const previousAttemptsCount = await Submission.countDocuments({
      studentId, referenceId: examId, type: 'exam'
    });

    if (previousAttemptsCount >= exam.attemptsAllowed) {
      return res.status(403).json({ status: 'fail', message: 'Maximum attempts reached for this exam.' });
    }

    // 2. التصحيح الآلي (Auto-grading)
    const questions = await Question.find({ examId });
    let totalScore = 0;
    let hasEssayQuestions = false;

    const processedAnswers = answers.map(ans => {
      const q = questions.find(q => q._id.toString() === ans.questionId);
      let isCorrect = false;

      if (!q) return ans;

      if (q.type === 'mcq' || q.type === 'tf') {
        if (q.correctAnswer === ans.studentAnswer) {
          isCorrect = true;
          totalScore += q.marks;
        }
      } else if (q.type === 'essay') {
        hasEssayQuestions = true; // يحتاج تصحيح يدوي من المدرس
      }

      return { ...ans, isCorrect };
    });

    // 3. حفظ التسليم
    const submission = await Submission.create({
      studentId,
      type: 'exam',
      referenceId: examId,
      examId: examId,
      attemptNumber: previousAttemptsCount + 1,
      timeSpent,
      answers: processedAnswers,
      score: totalScore,
      status: hasEssayQuestions ? 'pending' : 'graded', // إذا كان في مقالي يبقي pending
    });

    res.status(201).json({ status: 'success', data: submission });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Grade a submission manually (Admin)
// @route   PATCH /api/submissions/:id/grade
// @access  Private/Admin
export const gradeSubmission = async (req, res) => {
  try {
    const { score, teacherFeedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { score, teacherFeedback, status: 'graded' },
      { new: true }
    );

    if (!submission) return res.status(404).json({ status: 'fail', message: 'Submission not found' });

    res.status(200).json({ status: 'success', data: submission });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};