const mongoose = require("mongoose");

const Review = require("../models/review.model");
const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");

const createReview = async (courseId, studentId, reviewData) => {
  const course = await Course.findOne({
    _id: courseId,
    status: "published",
  });

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  const enrollment = await Enrollment.findOne({
    course: courseId,
    student: studentId,
    status: "active",
  });

  if (!enrollment) {
    const error = new Error(
      "You must be enrolled in this course to review it"
    );
    error.statusCode = 403;
    throw error;
  }

  const existingReview = await Review.findOne({
    course: courseId,
    student: studentId,
  });

  if (existingReview) {
    const error = new Error("You have already reviewed this course");
    error.statusCode = 409;
    throw error;
  }

  const review = await Review.create({
    course: courseId,
    student: studentId,
    rating: reviewData.rating,
    comment: reviewData.comment,
  });

  await updateCourseRating(courseId);

  return review;
};

const getCourseReviews = async (courseId) => {
  const reviews = await Review.find({ course: courseId })
    .populate("student", "firstName lastName profileImage")
    .sort({ createdAt: -1 });

  return reviews;
};

const updateReview = async (reviewId, studentId, reviewData) => {
  const review = await Review.findOne({
    _id: reviewId,
    student: studentId,
  });

  if (!review) {
    const error = new Error("Review not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  if (reviewData.rating !== undefined) {
    review.rating = reviewData.rating;
  }

  if (reviewData.comment !== undefined) {
    review.comment = reviewData.comment;
  }

  await review.save();
  await updateCourseRating(review.course);

  return review;
};

const deleteReview = async (reviewId, studentId) => {
  const review = await Review.findOne({
    _id: reviewId,
    student: studentId,
  });

  if (!review) {
    const error = new Error("Review not found or access denied");
    error.statusCode = 404;
    throw error;
  }

  const courseId = review.course;

  await review.deleteOne();
  await updateCourseRating(courseId);

  return { message: "Review deleted successfully" };
};

const updateCourseRating = async (courseId) => {
  const result = await Review.aggregate([
    {
      $match: {
        course: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Course.findByIdAndUpdate(courseId, {
    averageRating: result.length
      ? Number(result[0].averageRating.toFixed(1))
      : 0,
  });
};

module.exports = {
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
};
