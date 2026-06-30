import Course from '../models/Course.js';
import User from '../models/User.js';
import Homework from '../models/Homework.js';
import Exam from '../models/Exam.js';

export const getTeacherDashboardData = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1. جلب كورسات هذا المدرس فقط
    const myCourses = await Course.find({ teacher: teacherId }).lean();
    const courseIds = myCourses.map(c => c._id);

    // 2. جلب الطلاب المشتركين في كورساته
    const myStudents = await User.find({ 
      role: 'student',
      enrolledCourses: { $in: courseIds } 
    }).select('-password').lean();

    // 3. جلب الواجبات المعلقة لكورساته فقط
    const pendingHomeworks = await Homework.find({
      courseId: { $in: courseIds },
      status: 'pending'
    }).populate('studentId', 'name phone').populate('courseId', 'title').lean();

    // 4. حساب الإحصائيات العامة والتفصيلية الخاصة بالمدرس فقط
    const totalExams = await Exam.countDocuments({ courseId: { $in: courseIds } });

    const advancedCourseStats = await Promise.all(myCourses.map(async (course) => {
      const studentsCount = await User.countDocuments({ role: 'student', enrolledCourses: course._id });
      const homeworksCount = await Homework.countDocuments({ courseId: course._id });
      const exams = await Exam.find({ courseId: course._id }).select('results');
      const examsCount = exams.length;
      
      let totalPercentages = 0;
      let totalAttempts = 0;
      exams.forEach(exam => {
        if(exam.results && exam.results.length > 0) {
            exam.results.forEach(result => {
            totalPercentages += result.percentage;
            totalAttempts += 1;
            });
        }
      });
      
      const avgSuccessRate = totalAttempts > 0 ? Math.round(totalPercentages / totalAttempts) : 0;

      return {
        courseId: course._id,
        title: course.title,
        studentsCount,
        homeworksCount,
        examsCount,
        avgSuccessRate
      };
    }));

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          counters: {
            totalStudents: myStudents.length,
            totalCourses: myCourses.length,
            pendingHomeworks: pendingHomeworks.length,
            totalExams: totalExams
          },
          advancedCourseStats
        },
        courses: myCourses,
        students: myStudents,
        homeworks: pendingHomeworks
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};