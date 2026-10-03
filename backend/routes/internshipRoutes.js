const express = require("express");

const {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
} = require("../controllers/internshipController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllInternships);
router.get("/:id", getInternshipById);

// ADMIN ROUTES
router.post("/", adminMiddleware, createInternship);
router.put("/:id", adminMiddleware, updateInternship);
router.delete("/:id", adminMiddleware, deleteInternship);

module.exports = router;