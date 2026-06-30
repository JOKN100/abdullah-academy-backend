import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  parentPhone: { type: String },
  // 💡 إضافة دور "مدرس" ضمن الصلاحيات
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  activeDeviceToken: { type: String, default: '' },
  
  // 💡 للمدرسين فقط: صورة البروفايل اللي هتظهر على كورساتهم
  profileImage: { type: String, default: '' },
  
  // للطلاب فقط: تقدمهم في الكورسات
  courseProgress: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }]
  }],
  // للطلاب فقط: الكورسات المفعلة
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);