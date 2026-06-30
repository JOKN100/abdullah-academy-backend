import Chapter from '../models/Chapter.js';

// @desc    Create a new chapter
// @route   POST /api/chapters
// @access  Private/Admin
export const createChapter = async (req, res) => {
  try {
    const { courseId, title, order } = req.body;

    const chapter = await Chapter.create({
      courseId,
      title,
      order,
    });

    res.status(201).json({
      status: 'success',
      data: chapter,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all chapters for a specific course
// @route   GET /api/chapters/course/:courseId
// @access  Public (للسماح للطلاب برؤية منهج الكورس قبل الشراء)
export const getCourseChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find({ courseId: req.params.courseId }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      results: chapters.length,
      data: chapters,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update a chapter
// @route   PATCH /api/chapters/:id
// @access  Private/Admin
export const updateChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!chapter) {
      return res.status(404).json({ status: 'fail', message: 'Chapter not found' });
    }

    res.status(200).json({
      status: 'success',
      data: chapter,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};