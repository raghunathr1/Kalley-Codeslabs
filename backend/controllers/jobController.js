const Job = require("../models/Job");

// =====================================================
// SYNC EXPIRED JOBS
// =====================================================

const syncExpiredJobs = async () => {
  try {
    await Job.updateMany(
      {
        expiryDate: {
          $lte: new Date(),
        },

        status: "Published",
      },
      {
        $set: {
          status: "Expired",
        },
      }
    );
  } catch (error) {
    console.error(
      "Sync expired jobs error:",
      error.message
    );
  }
};

// =====================================================
// CREATE JOB
// =====================================================

const createJob = async (req, res) => {
  try {
    const {
      role,
      company,
      skills,
      salary,
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
      !salary ||
      !education ||
      !location ||
      !openings ||
      !expiryDate
    ) {
      return res.status(400).json({
        message:
          "Please fill all required job fields",
      });
    }

    const expiry = new Date(
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

    const job =
      await Job.create({
        role:
          role.trim(),

        company:
          company.trim(),

        skills,

        salary:
          salary.trim(),

        education:
          education.trim(),

        responsibilities:
          responsibilities || [],

        location:
          location.trim(),

        openings,

        experience:
          experience ||
          "Fresher",

        aboutRole:
          aboutRole || "",

        expiryDate:
          expiry,

        status:
          status || "Published",
      });

    return res.status(201).json({
      message:
        "Job created successfully",

      job,
    });
  } catch (error) {
    console.error(
      "Create job error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create job",
    });
  }
};

// =====================================================
// GET ALL JOBS
// =====================================================

const getAllJobs = async (
  req,
  res
) => {
  try {
    // Update expired published jobs
    await syncExpiredJobs();

    const jobs =
      await Job.find().sort({
        createdAt: -1,
      });

    return res.status(200).json(
      jobs
    );
  } catch (error) {
    console.error(
      "Get jobs error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch jobs",
    });
  }
};

// =====================================================
// GET SINGLE JOB
// =====================================================

const getJobById = async (
  req,
  res
) => {
  try {
    await syncExpiredJobs();

    const job =
      await Job.findById(
        req.params.id
      );

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found",
      });
    }

    // Expired jobs should not be
    // accessible on the public side
    if (
      job.status ===
      "Expired"
    ) {
      return res.status(410).json({
        message:
          "This job opportunity has expired",
      });
    }

    if (
      job.status !==
      "Published"
    ) {
      return res.status(404).json({
        message:
          "Job is not currently available",
      });
    }

    return res.status(200).json(
      job
    );
  } catch (error) {
    console.error(
      "Get job by id error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch job",
    });
  }
};

// =====================================================
// UPDATE JOB
// =====================================================

const updateJob = async (
  req,
  res
) => {
  try {
    const {
      role,
      company,
      skills,
      salary,
      education,
      responsibilities,
      location,
      openings,
      experience,
      aboutRole,
      expiryDate,
      status,
    } = req.body;

    const updateData = {};

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
      salary !== undefined
    ) {
      updateData.salary =
        salary.trim();
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

    // Validate updated expiry date
    if (
      expiryDate !== undefined
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

      // If admin sets a future
      // expiry date and does not
      // explicitly choose status,
      // publish the job again.
      if (
        status === undefined &&
        expiry > new Date()
      ) {
        updateData.status =
          "Published";
      }

      if (
        expiry <= new Date()
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

    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedJob) {
      return res.status(404).json({
        message:
          "Job not found",
      });
    }

    return res.status(200).json({
      message:
        "Job updated successfully",

      job:
        updatedJob,
    });
  } catch (error) {
    console.error(
      "Update job error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to update job",
    });
  }
};

// =====================================================
// DELETE JOB
// =====================================================

const deleteJob = async (
  req,
  res
) => {
  try {
    const job =
      await Job.findByIdAndDelete(
        req.params.id
      );

    if (!job) {
      return res.status(404).json({
        message:
          "Job not found",
      });
    }

    return res.status(200).json({
      message:
        "Job deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete job error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to delete job",
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};