const Internship =
  require("../models/Internship");

// =====================================================
// SYNC EXPIRED INTERNSHIPS
// =====================================================

const syncExpiredInternships =
  async () => {
    try {
      await Internship.updateMany(
        {
          expiryDate: {
            $lte: new Date(),
          },

          status: "Published",
        },
        {
          $set: {
            status:
              "Expired",
          },
        }
      );
    } catch (error) {
      console.error(
        "Sync expired internships error:",
        error.message
      );
    }
  };

// =====================================================
// CREATE INTERNSHIP
// =====================================================

const createInternship =
  async (
    req,
    res
  ) => {
    try {
      const {
        role,
        company,
        skills,
        stipend,
        duration,
        education,
        responsibilities,
        location,
        openings,
        experience,
        aboutRole,
        expiryDate,
        status,
      } = req.body;

      if (
        !role ||
        !company ||
        !skills ||
        !stipend ||
        !duration ||
        !education ||
        !location ||
        !openings ||
        !expiryDate
      ) {
        return res.status(400).json({
          message:
            "Please fill all required internship fields",
        });
      }

      const expiry =
        new Date(
          expiryDate
        );

      if (
        Number.isNaN(
          expiry.getTime()
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid expiry date",
        });
      }

      if (
        expiry <= new Date()
      ) {
        return res.status(400).json({
          message:
            "Expiry date must be in the future",
        });
      }

      const internship =
        await Internship.create(
          {
            role:
              role.trim(),

            company:
              company.trim(),

            skills,

            stipend:
              stipend.trim(),

            duration:
              duration.trim(),

            education:
              education.trim(),

            responsibilities:
              responsibilities ||
              [],

            location:
              location.trim(),

            openings,

            experience:
              experience ||
              "Fresher",

            aboutRole:
              aboutRole ||
              "",

            expiryDate:
              expiry,

            status:
              status ||
              "Published",
          }
        );

      return res.status(201).json({
        message:
          "Internship created successfully",

        internship,
      });
    } catch (error) {
      console.error(
        "Create internship error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to create internship",
      });
    }
  };

// =====================================================
// GET ALL INTERNSHIPS
// =====================================================

const getAllInternships =
  async (
    req,
    res
  ) => {
    try {
      await syncExpiredInternships();

      const internships =
        await Internship.find().sort(
          {
            createdAt: -1,
          }
        );

      return res.status(200).json(
        internships
      );
    } catch (error) {
      console.error(
        "Get internships error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch internships",
      });
    }
  };

// =====================================================
// GET SINGLE INTERNSHIP
// =====================================================

const getInternshipById =
  async (
    req,
    res
  ) => {
    try {
      await syncExpiredInternships();

      const internship =
        await Internship.findById(
          req.params.id
        );

      if (!internship) {
        return res.status(404).json({
          message:
            "Internship not found",
        });
      }

      if (
        internship.status ===
        "Expired"
      ) {
        return res.status(410).json({
          message:
            "This internship opportunity has expired",
        });
      }

      if (
        internship.status !==
        "Published"
      ) {
        return res.status(404).json({
          message:
            "Internship is not currently available",
        });
      }

      return res.status(200).json(
        internship
      );
    } catch (error) {
      console.error(
        "Get internship by id error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch internship",
      });
    }
  };

// =====================================================
// UPDATE INTERNSHIP
// =====================================================

const updateInternship =
  async (
    req,
    res
  ) => {
    try {
      const {
        role,
        company,
        skills,
        stipend,
        duration,
        education,
        responsibilities,
        location,
        openings,
        experience,
        aboutRole,
        expiryDate,
        status,
      } = req.body;

      const updateData =
        {};

      if (
        role !== undefined
      ) {
        updateData.role =
          role.trim();
      }

      if (
        company !== undefined
      ) {
        updateData.company =
          company.trim();
      }

      if (
        skills !== undefined
      ) {
        updateData.skills =
          skills;
      }

      if (
        stipend !== undefined
      ) {
        updateData.stipend =
          stipend.trim();
      }

      if (
        duration !== undefined
      ) {
        updateData.duration =
          duration.trim();
      }

      if (
        education !== undefined
      ) {
        updateData.education =
          education.trim();
      }

      if (
        responsibilities !==
        undefined
      ) {
        updateData.responsibilities =
          responsibilities;
      }

      if (
        location !== undefined
      ) {
        updateData.location =
          location.trim();
      }

      if (
        openings !== undefined
      ) {
        updateData.openings =
          openings;
      }

      if (
        experience !== undefined
      ) {
        updateData.experience =
          experience.trim();
      }

      if (
        aboutRole !== undefined
      ) {
        updateData.aboutRole =
          aboutRole.trim();
      }

      if (
        expiryDate !==
        undefined
      ) {
        const expiry =
          new Date(
            expiryDate
          );

        if (
          Number.isNaN(
            expiry.getTime()
          )
        ) {
          return res
            .status(400)
            .json({
              message:
                "Invalid expiry date",
            });
        }

        updateData.expiryDate =
          expiry;

        if (
          status ===
            undefined &&
          expiry >
            new Date()
        ) {
          updateData.status =
            "Published";
        }

        if (
          expiry <=
          new Date()
        ) {
          updateData.status =
            "Expired";
        }
      }

      if (
        status !== undefined
      ) {
        updateData.status =
          status;
      }

      const updatedInternship =
        await Internship.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
            runValidators:
              true,
          }
        );

      if (
        !updatedInternship
      ) {
        return res.status(404).json({
          message:
            "Internship not found",
        });
      }

      return res.status(200).json({
        message:
          "Internship updated successfully",

        internship:
          updatedInternship,
      });
    } catch (error) {
      console.error(
        "Update internship error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update internship",
      });
    }
  };

// =====================================================
// DELETE INTERNSHIP
// =====================================================

const deleteInternship =
  async (
    req,
    res
  ) => {
    try {
      const internship =
        await Internship.findByIdAndDelete(
          req.params.id
        );

      if (!internship) {
        return res.status(404).json({
          message:
            "Internship not found",
        });
      }

      return res.status(200).json({
        message:
          "Internship deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete internship error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete internship",
      });
    }
  };

module.exports = {
  createInternship,
  getAllInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
};