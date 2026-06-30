import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['vodafone_cash', 'instapay', 'cash'],
      required: true,
    },
    transactionId: {
      type: String, // رقم التحويل أو العملية
      required: true,
    },
    receiptImage: {
      type: String, // رابط صورة الإيصال من Cloudinary
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String, // سبب الرفض أو ملاحظات الأدمن
    },
    receiptStatusHistory: [
      {
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
        },
        date: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // الأدمن الذي قام بتغيير الحالة
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes لتسريع استعلامات لوحة تحكم الإدارة (Admin Dashboard)
paymentSchema.index({ status: 1 });
paymentSchema.index({ studentId: 1, courseId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;