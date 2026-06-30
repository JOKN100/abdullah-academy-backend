import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// 1. جلب جميع المستخدمين (الطلاب والمعلمين) للوحة الإدارة
export const getAllUsers = async (req, res) => {
  try {
    // 💡 السر هنا: جلب الطلاب والمدرسين معاً
    const users = await User.find({ role: { $in: ['student', 'teacher'] } }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. حظر أو تفعيل حساب الطالب (تغيير الحالة)
export const toggleStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ status: 'fail', message: 'المستخدم غير موجود' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ status: 'success', message: `تم ${user.isActive ? 'تفعيل' : 'حظر'} الحساب بنجاح`, data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. تعديل بيانات المستخدم الشخصية من لوحة الإدارة
export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, parentPhone } = req.body;

    if (name) {
      const words = name.trim().split(/\s+/);
      if (words.length < 3) return res.status(400).json({ status: 'fail', message: 'يجب أن يكون الاسم ثلاثياً على الأقل' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name, phone, parentPhone }, { new: true, runValidators: true });
    if (!updatedUser) return res.status(404).json({ status: 'error', message: 'المستخدم غير موجود' });

    res.status(200).json({ status: 'success', message: 'تم تحديث البيانات بنجاح', data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. إنشاء مستخدم جديد من خلال الأدمن (طالب أو مدرس)
export const adminCreateUser = async (req, res) => {
  try {
    const { name, email, phone, parentPhone, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ status: 'error', message: 'هذا الإيميل مسجل مسبقاً' });

    const generatedPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const user = await User.create({
      name, email, password: hashedPassword, phone, parentPhone, 
      role: role || 'student' 
    });

    res.status(201).json({ status: 'success', message: `تم إنشاء حساب الـ ${role === 'teacher' ? 'مدرس' : 'طالب'} بنجاح`, generatedPassword });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. إعادة ضبط كلمة مرور المستخدم من لوحة الإدارة
export const resetStudentPasswordByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const newPassword = Math.random().toString(36).slice(-8);

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ status: 'error', message: 'المستخدم غير موجود' });

    // 💡 تشفير كلمة المرور قبل حفظها لتفادي مشاكل تسجيل الدخول
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ status: 'success', message: 'تم تغيير كلمة المرور بنجاح', newPassword });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// تعديل بيانات المستخدم الشخصية (البروفايل بتاعه هو)
export const updateMyProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      req.body, 
      { new: true }
    ).select('-password');
    
    res.status(200).json({ status: 'success', data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// تحديث الصورة الشخصية للمستخدم (سواء كان مدرس أو طالب)
export const updateProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;
    const userId = req.user._id; // بنجيب الآي دي من التوكن (protect middleware)

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'المستخدم غير موجود' });
    }

    res.status(200).json({ 
      status: 'success', 
      message: 'تم تحديث الصورة الشخصية بنجاح', 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};