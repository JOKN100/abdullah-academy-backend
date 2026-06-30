import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // إنشاء توكن صالح لمدة 30 يوم
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;