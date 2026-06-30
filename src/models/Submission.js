import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['exam', 'homework'],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // إما ExamID أو HomeworkID
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam', // ⚡ لتحسين الأداء وتسريع الاستعلامات الخاصة بالامتحانات
    },
    attemptNumber: {
      type: Number,
      default: 1, // رقم المحاولة الحالية
    },
    timeSpent: {
      type: Number, // الوقت المستغرق في حل الامتحان (بالثواني)
    },
    isLate: {
      type: Boolean,
      default: false, // هل تم تسليم الواجب بعد الـ Deadline؟
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Question',
        },
        studentAnswer: String,
      },
    ],
    fileUrls: [
      {
        type: String, // روابط الملفات المرفوعة للواجب (Cloudinary)
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'graded'],
      default: 'pending', // يكون graded تلقائياً لو كان الامتحان لا يحتوي على مقالي
    },
    teacherFeedback: {
      type: String, // ملاحظات المدرس
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes قوية للبحث في التسليمات (سواء للطالب أو للمدرس الذي يبحث عن الواجبات التي تحتاج تصحيح)
submissionSchema.index({ studentId: 1, referenceId: 1 });
submissionSchema.index({ status: 1 });
submissionSchema.index({ examId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission;