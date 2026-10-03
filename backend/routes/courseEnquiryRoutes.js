const express = require("express");

const {
  createCourseEnquiry,
  getCourseEnquiries,
  updateCourseEnquiryStatus,
} = require(
  "../controllers/courseEnquiryController"
);

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

// PUBLIC
router.post(
  "/",
  createCourseEnquiry
);

// ADMIN
router.get(
  "/",
  adminMiddleware,
  getCourseEnquiries
);

router.patch(
  "/:id/status",
  adminMiddleware,
  updateCourseEnquiryStatus
);

module.exports = router;