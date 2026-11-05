const lessonService = require("../services/lesson.service");

// Create lesson
const createLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.createLesson(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      data: { lesson },
    });
  } catch (error) {
    next(error);
  }
};

// Get course lessons
const getCourseLessons = async (req, res, next) => {
  try {
    const lessons = await lessonService.getCourseLessons(
      req.params.courseId
    );

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: { lessons },
    });
  } catch (error) {
    next(error);
  }
};

// Update lesson
const updateLesson = async (req, res, next) => {
  try {
    const lesson = await lessonService.updateLesson(
      req.params.id,
      req.body,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: { lesson },
    });
  } catch (error) {
    next(error);
  }
};

// Delete lesson
const deleteLesson = async (req, res, next) => {
  try {
    const result = await lessonService.deleteLesson(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLesson,
  getCourseLessons,
  updateLesson,
  deleteLesson,
};
