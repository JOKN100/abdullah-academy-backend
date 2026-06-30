import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentType: {
      type: String,
      enum: ['video', 'pdf', 'mixed'],
      required: true,
    },
    videoId: {
      type: String, // ID الخاص بفيديو يوتيوب (وليس الرابط بالكامل لسهولة التضمين)
    },
    attachments: [
      {
        title: String,
        url: String, // رابط الملف من Cloudinary
        type: { type: String }, // نوع الملف (pdf, image, etc)
      },
    ],
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index لتسريع جلب الدروس داخل الفصل بترتيبها
lessonSchema.index({ chapterId: 1, order: 1 });

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;