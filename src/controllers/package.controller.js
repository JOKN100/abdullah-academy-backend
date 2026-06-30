import Package from '../models/Package.js';

// 1. جلب جميع الباقات (للعرض للطلاب)
export const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true }).populate('courses', 'title thumbnail price teacherName');
    res.status(200).json({ status: 'success', data: packages });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. إنشاء باقة جديدة (للأدمن)
export const createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    res.status(201).json({ status: 'success', message: 'تم إنشاء الباقة بنجاح', data: newPackage });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. حذف باقة (للأدمن)
export const deletePackage = async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'success', message: 'تم حذف الباقة بنجاح' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};