const express = require("express");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// ADMIN ROUTES
router.post("/", adminMiddleware, createCourse);
router.put("/:id", adminMiddleware, updateCourse);
router.delete("/:id", adminMiddleware, deleteCourse);

module.exports = router;