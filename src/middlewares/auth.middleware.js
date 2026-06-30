import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'المستخدم غير موجود' });
      }

      // 💡 الحماية الصارمة: التأكد من عدم الدخول من جهازين
      // يتم استثناء الأدمن من هذا الشرط (عشان تقدر تفتح لوحتك من أي مكان)
      if (user.role === 'student' && user.activeDeviceToken !== token) {
        return res.status(401).json({ message: 'تم تسجيل الدخول من جهاز آخر. يرجى تسجيل الدخول مجدداً من هذا الجهاز.' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'جلسة غير صالحة أو منتهية' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'غير مصرح لك بالدخول، يرجى تسجيل الدخول أولاً' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'ليس لديك صلاحية لإجراء هذا الإجراء' });
    }
    next();
  };
};