import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // من قام بالفعل
    },
    action: {
      type: String,
      required: true, // مثلاً: 'UPDATE_PAYMENT_STATUS', 'CREATE_COURSE'
    },
    entityType: {
      type: String,
      required: true, // مثلاً: 'Payment', 'Course', 'User'
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // الـ ID الخاص بالعنصر الذي تم تعديله
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed, // البيانات القديمة قبل التعديل
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed, // البيانات الجديدة بعد التعديل
    },
  },
  {
    timestamps: { createdAt: 'timestamp', updatedAt: false }, 
  }
);

// ⚡ Index لتسريع البحث عن السجلات الخاصة بكيان معين أو أدمن معين
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;