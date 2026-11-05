const reviewService = require("../services/review.service");

const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(
      req.params.courseId,
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

const getCourseReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getCourseReviews(
      req.params.courseId
    );

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: { reviews },
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: { review },
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(
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
  createReview,
  getCourseReviews,
  updateReview,
  deleteReview,
};