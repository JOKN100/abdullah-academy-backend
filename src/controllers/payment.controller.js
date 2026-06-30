import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import AuditLog from '../models/AuditLog.js';

// @desc    Submit a new payment receipt
// @route   POST /api/payments
// @access  Private (Student)
export const submitPayment = async (req, res) => {
  try {
    const { courseId, amount, paymentMethod, transactionId, receiptImage } = req.body;

    // التحقق مما إذا كان الطالب لديه طلب قيد الانتظار لنفس الكورس
    const existingPayment = await Payment.findOne({
      studentId: req.user._id,
      courseId,
      status: 'pending'
    });

    if (existingPayment) {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'You already have a pending payment request for this course.' 
      });
    }

    const payment = await Payment.create({
      studentId: req.user._id,
      courseId,
      amount,
      paymentMethod,
      transactionId,
      receiptImage,
      status: 'pending',
    });

    res.status(201).json({
      status: 'success',
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all payments (with filtering)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req, res) => {
  try {
    const { status } = req.query; // للبحث عن الـ pending مثلاً
    const filter = status ? { status } : {};

    const payments = await Payment.find(filter)
      .populate('studentId', 'name email phone')
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update payment status (Approve/Reject) & Handle Enrollment
// @route   PATCH /api/payments/:id/status
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body; // status: 'approved' أو 'rejected'
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ status: 'fail', message: 'Payment not found' });
    }

    const oldStatus = payment.status;

    // تحديث حالة الدفع وإضافة السجل للتاريخ
    payment.status = status;
    payment.notes = notes || payment.notes;
    payment.receiptStatusHistory.push({
      status,
      updatedBy: req.user._id,
      note: notes,
    });

    await payment.save();

    // ⚡ السحر هنا: إذا وافق الأدمن على الدفع، نقوم بإنشاء/تحديث اشتراك الطالب
    if (status === 'approved' && oldStatus !== 'approved') {
      const startDate = new Date();
      // افتراضياً: الاشتراك يستمر لمدة شهر (30 يوم) من تاريخ الموافقة
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 30);

      // استخدام findOneAndUpdate بـ upsert لإنشاء اشتراك جديد أو تحديثه إذا كان منتهي
      await Enrollment.findOneAndUpdate(
        { studentId: payment.studentId, courseId: payment.courseId },
        {
          studentId: payment.studentId,
          courseId: payment.courseId,
          paymentId: payment._id,
          status: 'active',
          startDate,
          endDate,
        },
        { new: true, upsert: true }
      );
    }

    // ⚡ تسجيل العملية في سجلات النظام (Audit Log)
    await AuditLog.create({
      userId: req.user._id,
      action: 'UPDATE_PAYMENT_STATUS',
      entityType: 'Payment',
      entityId: payment._id,
      oldValue: { status: oldStatus },
      newValue: { status },
    });

    res.status(200).json({
      status: 'success',
      message: `Payment ${status} successfully`,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};