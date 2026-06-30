import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      // يمكن أن يكون null إذا كنا نريد عمل ترتيب عام (Global Leaderboard) على مستوى المنصة
    },
    totalScore: {
      type: Number,
      default: 0, // مجموع درجات الطالب في الامتحانات والواجبات
    },
    // ⚡ تم إزالة حقل rank بناءً على طلبك، وسيتم حسابه ديناميكياً باستخدام الـ Aggregation
  },
  {
    timestamps: true,
  }
);

// ⚡ Index مهم جداً: لتسريع ترتيب الطلاب تنازلياً حسب الكورس لحساب الـ Rank ديناميكياً بسرعة فائقة
leaderboardSchema.index({ courseId: 1, totalScore: -1 });

// منع تكرار نفس الطالب في نفس كورس الـ Leaderboard
leaderboardSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;