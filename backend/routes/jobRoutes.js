const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// ADMIN ROUTES
router.post("/", adminMiddleware, createJob);
router.put("/:id", adminMiddleware, updateJob);
router.delete("/:id", adminMiddleware, deleteJob);

module.exports = router;