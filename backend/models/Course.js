const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    highlights: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Course",
  courseSchema
);