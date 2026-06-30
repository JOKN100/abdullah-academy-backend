import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true,
    },
    type: {
      type: String,
      enum: ['mcq', 'tf', 'essay'],
      required: true,
    },
    text: {
      type: String,
      required: true, // نص السؤال
    },
    options: [
      {
        type: String, // الخيارات (يستخدم في حالة mcq)
      },
    ],
    correctAnswer: {
      type: String, // الإجابة الصحيحة (لـ mcq أو tf)
    },
    marks: {
      type: Number,
      required: true, // درجة هذا السؤال
    },
  },
  {
    timestamps: true,
  }
);

// Index لتسريع جلب أسئلة امتحان معين
questionSchema.index({ examId: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;