const express = require("express");

const {
  createInternshipApplication,
  getAllInternshipApplications,
  updateInternshipApplicationStatus,
} = require(
  "../controllers/internshipApplicationController"
);

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router =
  express.Router();

// =========================
// PUBLIC
// =========================

router.post(
  "/",
  createInternshipApplication
);

// =========================
// ADMIN
// =========================

router.get(
  "/",
  adminMiddleware,
  getAllInternshipApplications
);

router.patch(
  "/:id/status",
  adminMiddleware,
  updateInternshipApplicationStatus
);

module.exports = router;