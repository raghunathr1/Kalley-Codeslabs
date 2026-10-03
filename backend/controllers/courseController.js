const Course = require("../models/Course");

// CREATE COURSE
const createCourse = async (req, res) => {
  try {
    const {
      name,
      duration,
      location,
      description,
      skills,
      highlights,
      status,
    } = req.body;

    if (
      !name ||
      !duration ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required course fields",
      });
    }

    const course = await Course.create({
      name: name.trim(),
      duration: duration.trim(),
      location: location.trim(),
      description: description.trim(),
      skills: skills || [],
      highlights: highlights || [],
      status: status || "Published",
    });

    return res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      message: "Failed to create course",
    });
  }
};

// GET ALL COURSES
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
};

// GET SINGLE COURSE
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error("Get course by id error:", error);

    return res.status(500).json({
      message: "Failed to fetch course",
    });
  }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const {
      name,
      duration,
      location,
      description,
      skills,
      highlights,
      status,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (duration !== undefined) {
      updateData.duration = duration.trim();
    }

    if (location !== undefined) {
      updateData.location = location.trim();
    }

    if (description !== undefined) {
      updateData.description = description.trim();
    }

    if (skills !== undefined) {
      updateData.skills = skills;
    }

    if (highlights !== undefined) {
      updateData.highlights = highlights;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    const updatedCourse =
      await Course.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedCourse) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      message: "Failed to update course",
    });
  }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(
      req.params.id
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.status(200).json({
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      message: "Failed to delete course",
    });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};