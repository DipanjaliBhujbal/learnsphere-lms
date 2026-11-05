const Course = require("../models/course.model");

// Create a new course
const createCourse = async (courseData, instructorId) => {
  const course = await Course.create({
    ...courseData,
    instructor: instructorId,
  });

  return course;
};

// Get all published courses
const getAllCourses = async (filters = {}) => {
  const query = {
    status: "published",
  };

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.level) {
    query.level = filters.level;
  }

  if (filters.search) {
    query.$text = {
      $search: filters.search,
    };
  }

  const courses = await Course.find(query)
    .populate("instructor", "firstName lastName profileImage")
    .sort({ createdAt: -1 });

  return courses;
};

// Get a single published course
const getCourseById = async (courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: "published",
  }).populate("instructor", "firstName lastName profileImage");

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  return course;
};

// Get courses created by an instructor
const getInstructorCourses = async (instructorId) => {
  return Course.find({
    instructor: instructorId,
  }).sort({ createdAt: -1 });
};

// Update a course
const updateCourse = async (courseId, updateData, user) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    user.role !== "admin" &&
    course.instructor.toString() !== user._id.toString()
  ) {
    const error = new Error("You cannot update this course");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = [
    "title",
    "description",
    "category",
    "thumbnail",
    "price",
    "level",
    "requirements",
    "whatYouWillLearn",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      course[field] = updateData[field];
    }
  });

  await course.save();

  return course;
};

// Delete a course
const deleteCourse = async (courseId, user) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    user.role !== "admin" &&
    course.instructor.toString() !== user._id.toString()
  ) {
    const error = new Error("You cannot delete this course");
    error.statusCode = 403;
    throw error;
  }

  await course.deleteOne();

  return {
    message: "Course deleted successfully",
  };
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  updateCourse,
  deleteCourse,
};
