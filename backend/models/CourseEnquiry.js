const mongoose = require("mongoose");

const courseEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    query: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CourseEnquiry",
  courseEnquirySchema
);