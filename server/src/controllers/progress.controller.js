const progressService = require("../services/progress.service");

// Mark lesson as completed
const markLessonComplete = async (req, res, next) => {
  try {
    const progress = await progressService.markLessonComplete(
      req.params.courseId,
      req.params.lessonId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Lesson marked as completed",
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

// Get course progress
const getCourseProgress = async (req, res, next) => {
  try {
    const progress = await progressService.getCourseProgress(
      req.params.courseId,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: { progress },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markLessonComplete,
  getCourseProgress,
};
