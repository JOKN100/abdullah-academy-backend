import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileUrl: { type: String, required: true }, // رابط ملف الواجب أو الصورة
    status: { type: String, enum: ['pending', 'graded'], default: 'pending' }, // حالة الواجب
    grade: { type: Number, default: 0 }, // الدرجة من 100 مثلاً
    feedback: { type: String, default: '' } // ملاحظات المصحح
  },
  { timestamps: true }
);

const Homework = mongoose.model('Homework', homeworkSchema);
export default Homework;