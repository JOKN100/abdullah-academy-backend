import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import uploadRoutes from './routes/upload.routes.js';
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import userRoutes from './routes/user.routes.js'; 
import examRoutes from './routes/exam.routes.js'; 
import homeworkRoutes from './routes/homework.routes.js'; // 👈 مسار الواجبات
import adminRoutes from './routes/admin.routes.js';
import packageRoutes from './routes/package.routes.js';
import teacherRoutes from './routes/teacher.routes.js';
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// إعدادات الـ CORS للسماح بالطلبات من دومين المنصة فقط
const allowedOrigins = [
  'http://localhost:3000', // عشان الفرونت إند يشتغل وإنت بتجرب على جهازك
  'https://minasatjahez.online', // الدومين الرسمي بتاعك
  'https://www.minasatjahez.online'
];

app.use(cors({
  origin: function (origin, callback) {
    // السماح للطلبات اللي جاية من الدومينات المسموحة، أو الطلبات اللي من غير origin (زي Postman للتجربة)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS - غير مصرح لك بالوصول للسيرفر'));
    }
  },
  credentials: true, // مهمة لو بتستخدم Cookies أو Sessions
}));

// 2. إعدادات الحماية والـ CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(helmet());

// ⚠️ 3. أهم سطرين (لازم يكونوا قبل المسارات عشان السيرفر يقدر يقرأ الـ req.body) ⚠️
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 4. ربط المسارات بالـ API
// ==========================================
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/exams', examRoutes); 
app.use('/api/homeworks', homeworkRoutes); // 👈 ربط الواجبات في المكان الصح
app.use('/api/packages', packageRoutes);
app.use('/api/teacher', teacherRoutes);
// مسار فحص صحة السيرفر
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly! 🚀' });
});

// التعامل مع المسارات غير الموجودة (404)
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
