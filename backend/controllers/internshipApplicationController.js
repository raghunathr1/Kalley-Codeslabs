const InternshipApplication = require(
  "../models/InternshipApplication"
);

const emailTransporter = require(
  "../config/email"
);

// =========================
// CREATE INTERNSHIP APPLICATION
// =========================

const createInternshipApplication =
  async (req, res) => {
    try {
      const {
        fullName,
        email,
        mobileNumber,
        qualification,
        city,
        internshipRole,
        internshipId,
        resume,
        message,
      } = req.body;

      if (
        !fullName ||
        !email ||
        !mobileNumber ||
        !qualification ||
        !city ||
        !internshipRole ||
        !internshipId
      ) {
        return res.status(400).json({
          message:
            "Please fill all required application fields",
        });
      }

      const application =
        await InternshipApplication.create({
          fullName:
            fullName.trim(),

          email:
            email.toLowerCase().trim(),

          mobileNumber:
            mobileNumber.trim(),

          qualification:
            qualification.trim(),

          city:
            city.trim(),

          internshipRole:
            internshipRole.trim(),

          internshipId:
            internshipId.trim(),

          resume:
            resume
              ? resume.trim()
              : "",

          message:
            message
              ? message.trim()
              : "",
        });

      // =========================
      // ADMIN EMAIL NOTIFICATION
      // =========================

      const adminEmail =
        (
          process.env.EMAIL_USER ||
          ""
        ).trim();

      if (adminEmail) {
        try {
          await emailTransporter.sendMail({
            to: adminEmail,

            subject:
              `New Internship Application - ${internshipRole}`,

            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
                <h2 style="color: #4f46e5;">
                  New Internship Application
                </h2>

                <p>
                  A new internship application has been submitted on
                  <strong>Kalley CodeLabs</strong>.
                </p>

                <hr />

                <h3>Candidate Details</h3>

                <p>
                  <strong>Name:</strong>
                  ${fullName}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${email}
                </p>

                <p>
                  <strong>Mobile:</strong>
                  ${mobileNumber}
                </p>

                <p>
                  <strong>Qualification:</strong>
                  ${qualification}
                </p>

                <p>
                  <strong>City:</strong>
                  ${city}
                </p>

                <p>
                  <strong>Internship Role:</strong>
                  ${internshipRole}
                </p>

                <p>
                  <strong>Internship ID:</strong>
                  ${internshipId}
                </p>

                ${
                  resume
                    ? `
                      <p>
                        <strong>Resume:</strong>
                        ${resume}
                      </p>
                    `
                    : ""
                }

                ${
                  message
                    ? `
                      <p>
                        <strong>Message:</strong>
                        ${message}
                      </p>
                    `
                    : ""
                }

                <hr />

                <p>
                  <strong>Application ID:</strong>
                  ${application._id}
                </p>

                <p>
                  <strong>Status:</strong>
                  New
                </p>

                <br />

                <p>
                  Please login to the
                  <strong>Kalley CodeLabs Admin Dashboard</strong>
                  to review this application.
                </p>
              </div>
            `,

            replyTo: {
              email:
                email,
            },
          });

          console.log(
            "Internship application email sent successfully"
          );
        } catch (emailError) {
          console.error(
            "Internship application email error:",
            emailError.message
          );
        }
      }

      return res.status(201).json({
        message:
          "Internship application submitted successfully",

        application,
      });
    } catch (error) {
      console.error(
        "Create internship application error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to submit internship application",
      });
    }
  };

// =========================
// GET ALL APPLICATIONS
// =========================

const getAllInternshipApplications =
  async (req, res) => {
    try {
      const applications =
        await InternshipApplication.find().sort({
          createdAt: -1,
        });

      return res.status(200).json(
        applications
      );
    } catch (error) {
      console.error(
        "Get internship applications error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch internship applications",
      });
    }
  };

// =========================
// UPDATE APPLICATION STATUS
// =========================

const updateInternshipApplicationStatus =
  async (req, res) => {
    try {
      const { status } =
        req.body;

      const allowedStatuses = [
        "New",
        "Shortlisted",
        "Contacted",
        "Rejected",
        "Selected",
      ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid internship application status",
        });
      }

      const application =
        await InternshipApplication.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!application) {
        return res.status(404).json({
          message:
            "Internship application not found",
        });
      }

      return res.status(200).json({
        message:
          "Internship application status updated successfully",

        application,
      });
    } catch (error) {
      console.error(
        "Update internship application status error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update internship application status",
      });
    }
  };

module.exports = {
  createInternshipApplication,
  getAllInternshipApplications,
  updateInternshipApplicationStatus,
};