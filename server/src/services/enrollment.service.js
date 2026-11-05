const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");

// Enroll a student in a course
const enrollInCourse = async (courseId, studentId) => {
  const course = await Course.findOne({
    _id: courseId,
    status: "published",
  });

  if (!course) {
    const error = new Error("Published course not found");
    error.statusCode = 404;
    throw error;
  }

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    const error = new Error("You are already enrolled in this course");
    error.statusCode = 409;
    throw error;
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });

  await Course.findByIdAndUpdate(courseId, {
    $inc: { enrollmentCount: 1 },
  });

  return enrollment;
};

// Get all courses enrolled by a student
const getMyEnrollments = async (studentId) => {
  return Enrollment.find({
    student: studentId,
    status: { $ne: "cancelled" },
  })
    .populate({
      path: "course",
      populate: {
        path: "instructor",
        select: "firstName lastName profileImage",
      },
    })
    .sort({ enrolledAt: -1 });
};

// Get one enrollment by ID
const getEnrollmentById = async (enrollmentId, studentId) => {
  const enrollment = await Enrollment.findOne({
    _id: enrollmentId,
    student: studentId,
  }).populate({
    path: "course",
    populate: {
      path: "instructor",
      select: "firstName lastName profileImage",
    },
  });

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  return enrollment;
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  getEnrollmentById,
};