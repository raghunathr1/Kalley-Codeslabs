import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/api";

import StudentFooter from "../components/StudentFooter";

import {
  FiArrowLeft,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiBookOpen,
  FiSend,
  FiRefreshCw,
} from "react-icons/fi";

import "./JobDetails.css";


function JobDetails() {
  const { id } = useParams();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH JOB
  // =====================================================

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");
      setJob(null);

      const response =
        await api.get(
          `/jobs/${id}`
        );

      // Updated backend directly returns job
      setJob(response.data);
    } catch (error) {
      console.error(
        "Fetch job details error:",
        error
      );

      if (
        error.response?.status ===
        410
      ) {
        setError(
          "This job opportunity has expired and is no longer available."
        );
      } else if (
        error.response?.status ===
        404
      ) {
        setError(
          error.response?.data?.message ||
            "This job opportunity is no longer available."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load job details. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJob();
  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="job-details-state">

        <FiBriefcase />

        <h2>
          Loading job details...
        </h2>

        <p>
          Please wait while we fetch the
          latest job information.
        </p>

      </div>
    );
  }


  // =====================================================
  // ERROR / EXPIRED
  // =====================================================

  if (error || !job) {
    const isExpired =
      error
        ?.toLowerCase()
        .includes("expired");

    return (
      <div className="job-details-state">

        <FiBriefcase />

        <h1>
          {isExpired
            ? "Job Opportunity Expired"
            : "Job Not Found"}
        </h1>

        <p>
          {error ||
            "The job opportunity you are looking for does not exist."}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent:
              "center",
            flexWrap: "wrap",
          }}
        >

          <Link to="/jobs">
            <FiArrowLeft />
            Back to Jobs
          </Link>

          <button
            type="button"
            onClick={fetchJob}
            style={{
              border: "1px solid #d9dfe8",
              background: "#ffffff",
              color: "#27344b",
              minHeight: "42px",
              padding: "0 15px",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            <FiRefreshCw />
            Try Again
          </button>

        </div>

      </div>
    );
  }


  // =====================================================
  // SAFETY CHECK
  // =====================================================

  if (job.status !== "Published") {
    return (
      <div className="job-details-state">

        <FiBriefcase />

        <h1>
          Job Not Available
        </h1>

        <p>
          This job opportunity is
          currently not available.
        </p>

        <Link to="/jobs">
          <FiArrowLeft />
          Back to Jobs
        </Link>

      </div>
    );
  }


  // =====================================================
  // FORMAT EXPIRY DATE
  // =====================================================

  const formattedExpiryDate =
    job.expiryDate
      ? new Date(
          job.expiryDate
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        )
      : "the closing date";


  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="job-details-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="job-details-header">

        <div className="job-details-header-container">

          <Link
            to="/jobs"
            className="job-details-back-btn"
          >
            <FiArrowLeft />

            <span>
              All Jobs
            </span>
          </Link>


          <div className="job-details-heading">

            <div className="job-details-company-icon">
              <FiBriefcase />
            </div>

            <div>

              <span>
                ACTIVE JOB OPPORTUNITY
              </span>

              <h1>
                {job.role}
              </h1>

              <p>
                {job.company}
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
          ========================= */}

      <main className="job-details-content">

        <div className="job-details-layout">

          {/* =========================
              LEFT SIDE
              ========================= */}

          <section className="job-details-main">

            {/* JOB INFORMATION */}

            <div className="job-info-row">

              <div className="job-info-item">

                <FiMapPin />

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {job.location}
                  </strong>

                </div>

              </div>


              <div className="job-info-item">

                <span className="job-rupee-icon">
                  ₹
                </span>

                <div>

                  <span>
                    Salary
                  </span>

                  <strong>
                    {job.salary}
                  </strong>

                </div>

              </div>


              <div className="job-info-item">

                <FiClock />

                <div>

                  <span>
                    Experience
                  </span>

                  <strong>
                    {job.experience ||
                      "Fresher"}
                  </strong>

                </div>

              </div>


              <div className="job-info-item">

                <FiUsers />

                <div>

                  <span>
                    Openings
                  </span>

                  <strong>
                    {job.openings}
                  </strong>

                </div>

              </div>

            </div>


            {/* ABOUT ROLE */}

            <div className="job-detail-section">

              <span className="section-label">
                ABOUT THE ROLE
              </span>

              <h2>
                Build your career with
                <strong>
                  {" "}this opportunity.
                </strong>
              </h2>

              <p>
                {job.aboutRole ||
                  `We are looking for a motivated ${job.role} to join ${job.company} and contribute to real-world development projects.`}
              </p>

            </div>


            {/* EDUCATION */}

            <div className="job-detail-section">

              <span className="section-label">
                EDUCATION
              </span>

              <h2>
                Educational
                <strong>
                  {" "}requirements.
                </strong>
              </h2>

              <div className="job-education-box">

                <FiBookOpen />

                <span>
                  {job.education}
                </span>

              </div>

            </div>


            {/* SKILLS */}

            <div className="job-detail-section">

              <span className="section-label">
                REQUIRED SKILLS
              </span>

              <h2>
                Skills &amp;
                <strong>
                  {" "}technologies.
                </strong>
              </h2>

              <div className="job-detail-skills">

                {job.skills &&
                job.skills.length >
                  0 ? (
                  job.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                      >
                        {skill}
                      </span>
                    )
                  )
                ) : (
                  <p>
                    Skills information
                    is not available.
                  </p>
                )}

              </div>

            </div>


            {/* RESPONSIBILITIES */}

            <div className="job-detail-section">

              <span className="section-label">
                RESPONSIBILITIES
              </span>

              <h2>
                What you will
                <strong>
                  {" "}work on.
                </strong>
              </h2>

              {job.responsibilities &&
              job.responsibilities
                .length > 0 ? (

                <div className="job-responsibilities">

                  {job.responsibilities.map(
                    (
                      responsibility
                    ) => (

                      <div
                        className="job-responsibility-item"
                        key={
                          responsibility
                        }
                      >

                        <FiCheckCircle />

                        <span>
                          {
                            responsibility
                          }
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  Responsibilities will
                  be discussed during the
                  selection process.
                </p>

              )}

            </div>


            {/* APPLICATION INFORMATION */}

            <div className="job-detail-section">

              <span className="section-label">
                APPLICATION INFORMATION
              </span>

              <h2>
                Apply before
                <strong>
                  {" "}the deadline.
                </strong>
              </h2>

              <p>
                Applications are accepted
                until{" "}

                <strong>
                  {formattedExpiryDate}
                </strong>.
              </p>

            </div>

          </section>


          {/* =========================
              RIGHT SIDE
              ========================= */}

          <aside className="job-apply-card">

            <div className="job-apply-header">

              <span>
                INTERESTED?
              </span>

              <h2>
                Apply for this
                <strong>
                  {" "}position.
                </strong>
              </h2>

              <p>
                Take the next step and apply
                for this opportunity.
              </p>

            </div>


            <div className="job-apply-summary">

              <div>

                <FiBriefcase />

                <div>

                  <span>
                    Position
                  </span>

                  <strong>
                    {job.role}
                  </strong>

                </div>

              </div>


              <div>

                <FiMapPin />

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {job.location}
                  </strong>

                </div>

              </div>


              <div>

                <span className="job-rupee-icon">
                  ₹
                </span>

                <div>

                  <span>
                    Salary
                  </span>

                  <strong>
                    {job.salary}
                  </strong>

                </div>

              </div>


              <div>

                <FiUsers />

                <div>

                  <span>
                    Openings
                  </span>

                  <strong>
                    {job.openings}
                  </strong>

                </div>

              </div>

            </div>


            <button
              type="button"
              className="job-apply-btn"
              onClick={() =>
                alert(
                  "Job application feature will be connected soon."
                )
              }
            >
              Apply Now
              <FiSend />
            </button>


            <p className="job-apply-note">
              Our team will review the
              application process and contact
              eligible candidates.
            </p>

          </aside>

        </div>

      </main>

      <StudentFooter />

    </div>
  );
}

export default JobDetails;