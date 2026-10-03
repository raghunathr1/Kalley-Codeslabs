const express = require("express");

const {
  createConsultation,
  getAllConsultations,
  updateConsultationStatus,
} = require(
  "../controllers/consultationController"
);

const adminMiddleware =
  require("../middleware/adminMiddleware");

const router = express.Router();

// PUBLIC
router.post(
  "/",
  createConsultation
);

// ADMIN
router.get(
  "/",
  adminMiddleware,
  getAllConsultations
);

router.patch(
  "/:id/status",
  adminMiddleware,
  updateConsultationStatus
);

module.exports = router;