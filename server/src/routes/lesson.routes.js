const express = require("express");

const router = express.Router();

const lessonController = require("../controllers/lesson.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management and course content
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - moduleTitle
 *               - title
 *               - order
 *             properties:
 *               course:
 *                 type: string
 *               moduleTitle:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               durationMinutes:
 *                 type: number
 *               order:
 *                 type: number
 *               isPreview:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Instructor access required
 */
router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  lessonController.createLesson
);

/**
 * @swagger
 * /api/lessons/course/{courseId}:
 *   get:
 *     summary: Get all published lessons for a course
 *     tags: [Lessons]
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
 *         description: Course lessons retrieved successfully
 *       404:
 *         description: Course not found
 */
router.get(
  "/course/:courseId",
  protect,
  lessonController.getCourseLessons
);

/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               moduleTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *               durationMinutes:
 *                 type: number
 *               order:
 *                 type: number
 *               isPreview:
 *                 type: boolean
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Lesson not found
 *
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Lesson not found
 */
router.put(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  lessonController.updateLesson
);

router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  lessonController.deleteLesson
);

module.exports = router;
