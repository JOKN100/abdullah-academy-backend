import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
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
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'expired', 'cancelled'],
      default: 'pending',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ⚡ 1. Unique Index: يمنع تكرار اشتراك نفس الطالب في نفس الكورس أكثر من مرة
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// ⚡ 2. Performance Index: لتسريع عمليات البحث عن الاشتراكات الفعالة في الـ Middleware
enrollmentSchema.index({ status: 1, endDate: 1 });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;