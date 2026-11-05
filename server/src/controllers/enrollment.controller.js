const enrollmentService = require("../services/enrollment.service");

// Enroll in a course
const enrollInCourse = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.enrollInCourse(
      req.params.courseId,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
};

// Get my enrollments
const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await enrollmentService.getMyEnrollments(
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: { enrollments },
    });
  } catch (error) {
    next(error);
  }
};

// Get enrollment details
const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await enrollmentService.getEnrollmentById(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      data: { enrollment },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
};