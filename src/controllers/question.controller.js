import Question from '../models/Question.js';
import Exam from '../models/Exam.js';

// @desc    Add a question to an exam
// @route   POST /api/questions
// @access  Private/Admin
export const addQuestion = async (req, res) => {
  try {
    const { examId, type, text, options, correctAnswer, marks } = req.body;

    const question = await Question.create({
      examId,
      type,
      text,
      options: type === 'mcq' ? options : [],
      correctAnswer,
      marks
    });

    res.status(201).json({ status: 'success', data: question });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};