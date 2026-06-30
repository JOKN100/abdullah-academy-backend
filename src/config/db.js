import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // الكود ده هيجرب يقرا MONGO_URI ولو ملقاهوش هيقرا MONGODB_URI كبديل
    const dbUrl = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!dbUrl) {
        throw new Error("لم يتم العثور على رابط قاعدة البيانات في ملف .env");
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // إيقاف السيرفر لو فشل الاتصال
  }
};

export default connectDB;