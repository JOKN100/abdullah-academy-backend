import User from '../models/User.js';
import Course from '../models/Course.js';
import Homework from '../models/Homework.js';
import Exam from '../models/Exam.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalCourses, pendingHomeworks, totalExams] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Homework.countDocuments({ status: 'pending' }),
      Exam.countDocuments()
    ]);

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const activityAgg = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }
    ]);
    
    const activityMap = new Map(activityAgg.map(i => [i._id, i.count]));
    const weeklyActivity = last7Days.map(date => {
      const dayName = new Date(date).toLocaleDateString('ar-EG', { weekday: 'long' });
      return { day: dayName, count: activityMap.get(date) || 0 };
    });

    // 💡 الإحصائيات التفصيلية لكل كورس (المرحلة الثالثة)
    const courses = await Course.find().select('title').lean();
    const advancedCourseStats = await Promise.all(courses.map(async (course) => {
      // عدد الطلاب
      const studentsCount = await User.countDocuments({ role: 'student', enrolledCourses: course._id });
      // عدد الواجبات المرفوعة
      const homeworksCount = await Homework.countDocuments({ courseId: course._id });
      // الامتحانات ومتوسط النجاح
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
        counters: { totalStudents, totalCourses, pendingHomeworks, totalExams }, 
        weeklyActivity,
        advancedCourseStats // 💡 إرسال الداتا للفرونت إند
      } 
    });
  } catch (error) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedCourse) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });
    res.status(200).json({ status: 'success', data: updatedCourse });
  } catch (error) { res.status(500).json({ status: 'error', message: error.message }); }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ status: 'fail', message: 'الكورس غير موجود' });
    res.status(200).json({ status: 'success', message: 'تم حذف الكورس بنجاح' });
  } catch (error) { res.status(500).json({ status: 'error', message: error.message }); }
};