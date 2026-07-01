import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // 💡 السر هنا: لو الملف PDF هنرفعه كـ Raw عشان يفتح ويتحمل صح
    if (file.mimetype === 'application/pdf') {
      return {
        folder: 'abdullah_academy',
        resource_type: 'raw' 
      };
    }
    // أما لو صور أو فيديو هنمشيها زي ما إنت عاملها
    return {
      folder: 'abdullah_academy',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'png', 'jpeg', 'mp4']
    };
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'fail', message: 'لم يتم استلام أي ملف' });
    
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