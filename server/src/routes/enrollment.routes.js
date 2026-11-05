const express = require("express");

const router = express.Router();

const enrollmentController = require("../controllers/enrollment.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Student: Enroll in a course
router.post(
  "/courses/:courseId",
  protect,
  authorize("student"),
  enrollmentController.enrollInCourse
);

// Student: Get my enrollments
router.get(
  "/my-enrollments",
  protect,
  authorize("student"),
  enrollmentController.getMyEnrollments
);

// Student: Get enrollment details
router.get(
  "/:id",
  protect,
  authorize("student"),
  enrollmentController.getEnrollmentById
);

module.exports = router;