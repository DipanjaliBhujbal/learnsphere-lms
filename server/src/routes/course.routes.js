const express = require("express");

const router = express.Router();

const courseController = require("../controllers/course.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

// Public: Get all published courses
router.get("/", courseController.getAllCourses);

// Instructor/Admin: Get own courses
router.get(
  "/instructor/my-courses",
  protect,
  authorize("instructor", "admin"),
  courseController.getInstructorCourses
);

// Instructor/Admin: Create course
router.post(
  "/",
  protect,
  authorize("instructor", "admin"),
  courseController.createCourse
);

// Instructor/Admin: Update course
router.put(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  courseController.updateCourse
);

// Instructor/Admin: Delete course
router.delete(
  "/:id",
  protect,
  authorize("instructor", "admin"),
  courseController.deleteCourse
);

// Public: Get a single published course
router.get("/:id", courseController.getCourseById);

module.exports = router;
