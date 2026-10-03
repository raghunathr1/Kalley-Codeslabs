const Consultation = require("../models/Consultation");

// =========================
// CREATE CONSULTATION
// =========================

const createConsultation = async (req, res) => {
  try {
    const {
      name,
      companyName,
      contactNumber,
      email,
      requirement,
    } = req.body;

    if (
      !name ||
      !companyName ||
      !contactNumber ||
      !email ||
      !requirement
    ) {
      return res.status(400).json({
        message:
          "Please fill all consultation fields",
      });
    }

    const consultation =
      await Consultation.create({
        name: name.trim(),
        companyName: companyName.trim(),
        contactNumber: contactNumber.trim(),
        email: email.toLowerCase().trim(),
        requirement: requirement.trim(),
      });

    return res.status(201).json({
      message:
        "Consultation submitted successfully",
      consultation,
    });
  } catch (error) {
    console.error(
      "Create consultation error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to submit consultation",
    });
  }
};

// =========================
// GET ALL CONSULTATIONS
// =========================

const getAllConsultations = async (req, res) => {
  try {
    const consultations =
      await Consultation.find().sort({
        createdAt: -1,
      });

    return res.status(200).json(
      consultations
    );
  } catch (error) {
    console.error(
      "Get consultations error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch consultations",
    });
  }
};

// =========================
// UPDATE CONSULTATION STATUS
// =========================

const updateConsultationStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "New",
      "Contacted",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid consultation status",
      });
    }

    const consultation =
      await Consultation.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!consultation) {
      return res.status(404).json({
        message:
          "Consultation not found",
      });
    }

    return res.status(200).json({
      message:
        "Consultation status updated successfully",
      consultation,
    });
  } catch (error) {
    console.error(
      "Update consultation error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update consultation status",
    });
  }
};

module.exports = {
  createConsultation,
  getAllConsultations,
  updateConsultationStatus,
};