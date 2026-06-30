import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // إنشاء التوكن بمدة صلاحية 30 يوماً
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;