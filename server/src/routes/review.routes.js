const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/reviews/courses/{courseId}:
 *   post:
 *     summary: Submit a course review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/courses/:courseId",
  protect,
  authorize("student"),
  reviewController.createReview
);

/**
 * @swagger
 * /api/reviews/courses/{courseId}:
 *   get:
 *     summary: Get all reviews for a course
 *     tags: [Reviews]
 */
router.get(
  "/courses/:courseId",
  reviewController.getCourseReviews
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update your course review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  protect,
  authorize("student"),
  reviewController.updateReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete your course review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  protect,
  authorize("student"),
  reviewController.deleteReview
);

module.exports = router;