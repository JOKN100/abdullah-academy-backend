import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  stage: { type: String, default: 'ثانوي' },
  grade: { type: String, default: 'الصف الأول' },
  educationSystem: { type: String, default: 'أساسي' },
  track: { type: String, default: 'عام' },
  
  // 💡 ربط الكورس بحساب المدرس (بدل ما كنا بنكتب اسمه وصورته بإيدينا)
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  isActive: { type: Boolean, default: true },
  lessons: [{
    title: String,
    videoUrl: String,
    pdfUrl: String
  }]
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', courseSchema);