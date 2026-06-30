import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true }, // مثال: "باقة الثانوية الشاملة"
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  
  // 💡 ربط الباقة بمجموعة من الكورسات
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Package || mongoose.model('Package', packageSchema);