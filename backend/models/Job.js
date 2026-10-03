const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      required: true,
    },

    salary: {
      type: String,
      required: true,
      trim: true,
    },

    education: {
      type: String,
      required: true,
      trim: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    openings: {
      type: Number,
      required: true,
      min: 1,
    },

    experience: {
      type: String,
      default: "Fresher",
      trim: true,
    },

    aboutRole: {
      type: String,
      default: "",
      trim: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Published", "Expired", "Draft"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);