const mongoose = require("mongoose");

const internshipApplicationSchema =
  new mongoose.Schema(
    {
      fullName: {
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

      mobileNumber: {
        type: String,
        required: true,
        trim: true,
      },

      qualification: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      internshipRole: {
        type: String,
        required: true,
        trim: true,
      },

      internshipId: {
        type: String,
        required: true,
        trim: true,
      },

      resume: {
        type: String,
        default: "",
        trim: true,
      },

      message: {
        type: String,
        default: "",
        trim: true,
      },

      status: {
        type: String,
        enum: [
          "New",
          "Shortlisted",
          "Contacted",
          "Rejected",
          "Selected",
        ],
        default: "New",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "InternshipApplication",
    internshipApplicationSchema
  );