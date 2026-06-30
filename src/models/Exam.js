import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true }
});

// 💡 مصفوفة جديدة لحفظ درجات الطلاب بعد الامتحان
const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  isPassed: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const examSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  durationInMinutes: { type: Number, default: 30 },
  passMark: { type: Number, default: 50 },
  questions: [questionSchema],
  results: [resultSchema] // 💡 ربط النتائج بالامتحان
}, { timestamps: true });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;