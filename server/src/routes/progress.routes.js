const express = require("express");
const router = express.Router();

const progressController = require("../controllers/progress.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/progress/courses/{courseId}/lessons/{lessonId}/complete:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson marked as completed
 *       403:
 *         description: Student is not enrolled
 */
router.post(
  "/courses/:courseId/lessons/:lessonId/complete",
  protect,
  authorize("student"),
  progressController.markLessonComplete
);

/**
 * @swagger
 * /api/progress/courses/{courseId}:
 *   get:
 *     summary: Get student course progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course progress retrieved successfully
 *       403:
 *         description: Student is not enrolled
 */
router.get(
  "/courses/:courseId",
  protect,
  authorize("student"),
  progressController.getCourseProgress
);

module.exports = router;
