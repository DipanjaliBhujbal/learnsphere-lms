const Lesson = require("../models/lesson.model");
const Course = require("../models/course.model");

// Create a lesson
const createLesson = async (lessonData, instructorId) => {
  const course = await Course.findOne({
    _id: lessonData.course,
    instructor: instructorId,
  });

  if (!course) {
    const error = new Error("Course not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  return Lesson.create(lessonData);
};

// Get published lessons for a course
const getCourseLessons = async (courseId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: "published",
  });

  if (!course) {
    const error = new Error("Published course not found");
    error.statusCode = 404;
    throw error;
  }

  return Lesson.find({
    course: courseId,
    isPublished: true,
  }).sort({ order: 1 });
};

// Update a lesson
const updateLesson = async (lessonId, updateData, instructorId) => {
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    const error = new Error("Lesson not found");
    error.statusCode = 404;
    throw error;
  }

  const course = await Course.findOne({
    _id: lesson.course,
    instructor: instructorId,
  });

  if (!course) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = [
    "moduleTitle",
    "title",
    "description",
    "content",
    "videoUrl",
    "durationMinutes",
    "order",
    "isPreview",
    "isPublished",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      lesson[field] = updateData[field];
    }
  });

  await lesson.save();

  return lesson;
};

// Delete a lesson
const deleteLesson = async (lessonId, instructorId) => {
  const lesson = await Lesson.findById(lessonId);

  if (!lesson) {
    const error = new Error("Lesson not found");
    error.statusCode = 404;
    throw error;
  }

  const course = await Course.findOne({
    _id: lesson.course,
    instructor: instructorId,
  });

  if (!course) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  await lesson.deleteOne();

  return { message: "Lesson deleted successfully" };
};

module.exports = {
  createLesson,
  getCourseLessons,
  updateLesson,
  deleteLesson,
};
