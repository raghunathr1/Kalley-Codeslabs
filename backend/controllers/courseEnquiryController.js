const CourseEnquiry = require("../models/CourseEnquiry");

// =========================
// CREATE COURSE ENQUIRY
// =========================

const createCourseEnquiry = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      course,
      query,
    } = req.body;

    if (
      !name ||
      !mobile ||
      !email ||
      !course
    ) {
      return res.status(400).json({
        message:
          "Name, mobile, email and course are required",
      });
    }

    const enquiry =
      await CourseEnquiry.create({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email
          .toLowerCase()
          .trim(),
        course: course.trim(),
        query: query
          ? query.trim()
          : "",
      });

    return res.status(201).json({
      message:
        "Course enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error(
      "Create course enquiry error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to submit course enquiry",
    });
  }
};

// =========================
// GET ALL COURSE ENQUIRIES
// =========================

const getCourseEnquiries = async (
  req,
  res
) => {
  try {
    const enquiries =
      await CourseEnquiry.find().sort({
        createdAt: -1,
      });

    return res.status(200).json(
      enquiries
    );
  } catch (error) {
    console.error(
      "Get course enquiries error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch course enquiries",
    });
  }
};

// =========================
// UPDATE ENQUIRY STATUS
// =========================

const updateCourseEnquiryStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "New",
        "Contacted",
        "Closed",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid enquiry status",
        });
      }

      const enquiry =
        await CourseEnquiry.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!enquiry) {
        return res.status(404).json({
          message:
            "Course enquiry not found",
        });
      }

      return res.status(200).json({
        message:
          "Course enquiry status updated successfully",
        enquiry,
      });
    } catch (error) {
      console.error(
        "Update course enquiry status error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update enquiry status",
      });
    }
  };

module.exports = {
  createCourseEnquiry,
  getCourseEnquiries,
  updateCourseEnquiryStatus,
};