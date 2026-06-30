import Enrollment from '../models/Enrollment.js';

// @desc    Get logged in student's enrollments (My Courses)
// @route   GET /api/enrollments/me
// @access  Private (Student)
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      studentId: req.user._id,
      status: 'active' 
    })
    .populate('courseId', 'title thumbnail description price')
    .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/enrollments
// @access  Private/Admin
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('studentId', 'name email phone')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};