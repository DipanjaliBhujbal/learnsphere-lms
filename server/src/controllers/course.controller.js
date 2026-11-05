const courseService = require("../services/course.service");

// Create course
const createCourse = async (req, res, next) => {
  try {
    const course = await courseService.createCourse(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

// Get all published courses
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getAllCourses(req.query);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
};

// Get single course
const getCourseById = async (req, res, next) => {
  try {
    const course = await courseService.getCourseById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

// Get instructor courses
const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await courseService.getInstructorCourses(
      req.user._id
    );

    res.status(200).json({
      success: true,
      count: courses.length,
      data: { courses },
    });
  } catch (error) {
    next(error);
  }
};

// Update course
const updateCourse = async (req, res, next) => {
  try {
    const course = await courseService.updateCourse(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: { course },
    });
  } catch (error) {
    next(error);
  }
};

// Delete course
const deleteCourse = async (req, res, next) => {
  try {
    const result = await courseService.deleteCourse(
      req.params.id,
      req.user
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
  createCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
};
