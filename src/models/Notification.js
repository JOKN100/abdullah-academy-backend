import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // إذا كان null، فهذا يعني أنه إشعار عام لكل الطلاب
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// لتسريع جلب الإشعارات غير المقروءة لمستخدم معين
notificationSchema.index({ userId: 1, isRead: 1 });
// لترتيب الإشعارات من الأحدث للأقدم
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;