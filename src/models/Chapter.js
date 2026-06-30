import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      // لترتيب الفصول داخل الكورس (مثال: 1, 2, 3...)
    },
  },
  {
    timestamps: true,
  }
);

// Index لتسريع جلب الفصول الخاصة بكورس معين مرتبة
chapterSchema.index({ courseId: 1, order: 1 });

const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;