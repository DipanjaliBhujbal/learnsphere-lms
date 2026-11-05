const Progress = require("../models/progress.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");

// Mark a lesson as completed
const markLessonComplete = async (courseId, lessonId, studentId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: "published",
  });

  if (!course) {
    const error = new Error("Published course not found");
    error.statusCode = 404;
    throw error;
  }

  const lesson = await Lesson.findOne({
    _id: lessonId,
    course: courseId,
    isPublished: true,
  });

  if (!lesson) {
    const error = new Error("Published lesson not found in this course");
    error.statusCode = 404;
    throw error;
  }

  const enrollment = await require("../models/enrollment.model").findOne({
    student: studentId,
    course: courseId,
    status: "active",
  });

  if (!enrollment) {
    const error = new Error("You must be enrolled in this course");
    error.statusCode = 403;
    throw error;
  }

  let progress = await Progress.findOne({
    student: studentId,
    course: courseId,
  });

  if (!progress) {
    progress = new Progress({
      student: studentId,
      course: courseId,
      completedLessons: [],
    });
  }

  if (!progress.completedLessons.some(
    (id) => id.toString() === lessonId
  )) {
    progress.completedLessons.push(lessonId);
  }

  progress.lastAccessedLesson = lessonId;

  const totalLessons = await Lesson.countDocuments({
    course: courseId,
    isPublished: true,
  });

  progress.progressPercentage = totalLessons
    ? Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      )
    : 0;

  progress.completedAt =
    progress.progressPercentage === 100 ? new Date() : null;

  await progress.save();

  return progress;
};

// Get student course progress
const getCourseProgress = async (courseId, studentId) => {
  const enrollment = await require("../models/enrollment.model").findOne({
    student: studentId,
    course: courseId,
    status: "active",
  });

  if (!enrollment) {
    const error = new Error("You must be enrolled in this course");
    error.statusCode = 403;
    throw error;
  }

  const progress = await Progress.findOne({
    student: studentId,
    course: courseId,
  })
    .populate("course", "title")
    .populate("completedLessons", "title moduleTitle durationMinutes")
    .populate("lastAccessedLesson", "title moduleTitle");

  if (!progress) {
    return {
      course: courseId,
      completedLessons: [],
      progressPercentage: 0,
      lastAccessedLesson: null,
      completedAt: null,
    };
  }

  return progress;
};

module.exports = {
  markLessonComplete,
  getCourseProgress,
};
