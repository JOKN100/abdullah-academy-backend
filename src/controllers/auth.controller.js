import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, parentPhone, governorate } = req.body;

    // التحقق من أن المستخدم غير مسجل مسبقاً
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ status: 'fail', message: 'User already exists' });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء المستخدم الجديد (النوع الافتراضي: student)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      parentPhone,
      governorate,
    });

    if (user) {
      res.status(201).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        return res.status(403).json({ status: 'fail', message: 'الحساب محظور، تواصل مع الإدارة' });
      }

      // 💡 إنشاء التوكن
      const token = generateToken(user._id);

      // 💡 حفظ التوكن في الداتابيز لربطه بهذا الجهاز فقط
      user.activeDeviceToken = token;
      await user.save();

      res.status(200).json({
        status: 'success',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: token,
        },
      });
    } else {
      res.status(401).json({ status: 'fail', message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Admin Create User (Teacher or Student)
// @route   POST /api/users/admin-create
// @access  Private (Admin)
// إنشاء مستخدم جديد من خلال الأدمن (طالب أو مدرس)
export const adminCreateUser = async (req, res) => {
  try {
    // 💡 هنا بنستقبل نوع الحساب (role) من الفرونت إند
    const { name, email, phone, parentPhone, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ status: 'error', message: 'هذا الإيميل مسجل مسبقاً' });

    // توليد باسوورد عشوائي وتشفيره
    const generatedPassword = Math.random().toString(36).slice(-8);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const user = await User.create({
      name, 
      email, 
      password: hashedPassword, 
      phone, 
      parentPhone, 
      // 💡 لو الفرونت إند باعت مدرس هيحفظه مدرس، لو مبعتش هيحفظه طالب
      role: role || 'student' 
    });

    res.status(201).json({ 
      status: 'success', 
      message: `تم إنشاء حساب الـ ${role === 'teacher' ? 'مدرس' : 'طالب'} بنجاح`, 
      generatedPassword 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};