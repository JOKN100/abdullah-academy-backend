import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// 1. ربط السيرفر بحسابك على Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. إعداد محرك الرفع (Multer)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'abdullah_academy', // هيعمل فولدر بالاسم ده في حسابك يحط فيه كل الملفات
    resource_type: 'auto', // عشان يقبل (صور، PDF، فيديوهات)
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'mp4']
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

// 3. المسار اللي الفرونت إند هيبعت عليه الملف
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'لم يتم استلام أي ملف' });
    }
    
    // Cloudinary بيرجع الرابط السحابي الجاهز في req.file.path
    res.status(200).json({ 
      status: 'success', 
      message: 'تم رفع الملف بنجاح!',
      url: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;