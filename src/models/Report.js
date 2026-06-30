import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    examsTaken: {
      type: Number,
      default: 0,
    },
    homeworkSubmitted: {
      type: Number,
      default: 0,
    },
    courseProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100, // نسبة مئوية لتقدم الطالب في الكورس
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// منع تكرار التقرير لنفس الطالب في نفس الكورس
reportSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;