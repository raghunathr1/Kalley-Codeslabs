import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api/api";

import StudentFooter from "../components/StudentFooter";

import {
  FiArrowLeft,
  FiMapPin,
  FiBookOpen,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiSend,
  FiRefreshCw,
} from "react-icons/fi";

import "./InternshipDetails.css";


function InternshipDetails() {
  const { id } = useParams();

  const [
    internship,
    setInternship,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  // =====================================================
  // FETCH INTERNSHIP
  // =====================================================

  const fetchInternship =
    async () => {
      try {
        setLoading(true);
        setError("");
        setInternship(null);

        const response =
          await api.get(
            `/internships/${id}`
          );

        // Updated backend directly returns internship
        setInternship(
          response.data
        );
      } catch (error) {
        console.error(
          "Fetch internship details error:",
          error
        );

        if (
          error.response?.status ===
          410
        ) {
          setError(
            "This internship opportunity has expired and is no longer available."
          );
        } else if (
          error.response?.status ===
          404
        ) {
          setError(
            error.response?.data?.message ||
              "This internship opportunity is no longer available."
          );
        } else {
          setError(
            error.response?.data?.message ||
              "Failed to load internship details. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchInternship();
  }, [id]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="internship-details-state">

        <FiBookOpen />

        <h2>
          Loading internship details...
        </h2>

        <p>
          Please wait while we fetch the
          latest internship information.
        </p>

      </div>
    );
  }


  // =====================================================
  // ERROR / EXPIRED
  // =====================================================

  if (
    error ||
    !internship
  ) {
    const isExpired =
      error
        ?.toLowerCase()
        .includes("expired");

    return (
      <div className="internship-details-state">

        <FiBookOpen />

        <h1>
          {isExpired
            ? "Internship Opportunity Expired"
            : "Internship Not Found"}
        </h1>

        <p>
          {error ||
            "The internship opportunity you are looking for does not exist."}
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

          <Link to="/internships">
            <FiArrowLeft />
            Back to Internships
          </Link>

          <button
            type="button"
            onClick={
              fetchInternship
            }
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

  if (
    internship.status !==
    "Published"
  ) {
    return (
      <div className="internship-details-state">

        <FiBookOpen />

        <h1>
          Internship Not Available
        </h1>

        <p>
          This internship opportunity
          is currently not available.
        </p>

        <Link to="/internships">
          <FiArrowLeft />
          Back to Internships
        </Link>

      </div>
    );
  }


  // =====================================================
  // FORMAT EXPIRY DATE
  // =====================================================

  const formattedExpiryDate =
    internship.expiryDate
      ? new Date(
          internship.expiryDate
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
    <div className="internship-details-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="internship-details-header">

        <div className="internship-details-header-container">

          <Link
            to="/internships"
            className="internship-details-back-btn"
          >
            <FiArrowLeft />

            <span>
              All Internships
            </span>
          </Link>


          <div className="internship-details-heading">

            <div className="internship-details-icon">
              <FiBookOpen />
            </div>

            <div>

              <span>
                ACTIVE INTERNSHIP OPPORTUNITY
              </span>

              <h1>
                {internship.role}
              </h1>

              <p>
                {internship.company}
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =========================
          MAIN
          ========================= */}

      <main className="internship-details-content">

        <div className="internship-details-layout">

          {/* =========================
              LEFT
              ========================= */}

          <section className="internship-details-main">

            {/* INFORMATION */}

            <div className="internship-info-row">

              <div className="internship-info-item">

                <FiMapPin />

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {
                      internship.location
                    }
                  </strong>

                </div>

              </div>


              <div className="internship-info-item">

                <span className="job-rupee-icon">
                  ₹
                </span>

                <div>

                  <span>
                    Stipend
                  </span>

                  <strong>
                    {
                      internship.stipend
                    }
                  </strong>

                </div>

              </div>


              <div className="internship-info-item">

                <FiClock />

                <div>

                  <span>
                    Duration
                  </span>

                  <strong>
                    {
                      internship.duration
                    }
                  </strong>

                </div>

              </div>


              <div className="internship-info-item">

                <FiUsers />

                <div>

                  <span>
                    Openings
                  </span>

                  <strong>
                    {
                      internship.openings
                    }
                  </strong>

                </div>

              </div>

            </div>


            {/* ABOUT */}

            <div className="internship-detail-section">

              <span className="section-label">
                ABOUT THE INTERNSHIP
              </span>

              <h2>
                Learn through
                <strong>
                  {" "}real experience.
                </strong>
              </h2>

              <p>
                {internship.aboutRole ||
                  "This internship provides practical industry experience through hands-on development work and real-world projects."}
              </p>

              <p>
                Interns will get an
                opportunity to work with
                modern technologies, solve
                practical development
                problems and understand
                real-world software
                development practices.
              </p>

            </div>


            {/* SKILLS */}

            <div className="internship-detail-section">

              <span className="section-label">
                REQUIRED SKILLS
              </span>

              <h2>
                Skills &
                <strong>
                  {" "}technologies.
                </strong>
              </h2>

              <div className="internship-detail-skills">

                {internship.skills &&
                internship.skills.length >
                  0 ? (
                  internship.skills.map(
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

            <div className="internship-detail-section">

              <span className="section-label">
                RESPONSIBILITIES
              </span>

              <h2>
                What you will
                <strong>
                  {" "}work on.
                </strong>
              </h2>

              {internship.responsibilities &&
              internship.responsibilities
                .length > 0 ? (

                <div className="internship-responsibilities">

                  {internship.responsibilities.map(
                    (item) => (

                      <div
                        className="internship-responsibility-item"
                        key={item}
                      >

                        <FiCheckCircle />

                        <span>
                          {item}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  Responsibilities will
                  be discussed during the
                  internship selection
                  process.
                </p>

              )}

            </div>


            {/* EDUCATION */}

            <div className="internship-detail-section">

              <span className="section-label">
                EDUCATION
              </span>

              <h2>
                Educational
                <strong>
                  {" "}requirements.
                </strong>
              </h2>

              <div className="internship-education-box">

                <FiBookOpen />

                <span>
                  {
                    internship.education
                  }
                </span>

              </div>

            </div>


            {/* EXPERIENCE */}

            <div className="internship-detail-section">

              <span className="section-label">
                EXPERIENCE
              </span>

              <h2>
                Who can
                <strong>
                  {" "}apply?
                </strong>
              </h2>

              <p>
                {
                  internship.experience ||
                  "Fresher"
                }
              </p>

            </div>


            {/* APPLICATION INFO */}

            <div className="internship-detail-section">

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
                  {
                    formattedExpiryDate
                  }
                </strong>.
              </p>

            </div>

          </section>


          {/* =========================
              RIGHT
              ========================= */}

          <aside className="internship-apply-card">

            <div className="internship-apply-header">

              <span>
                INTERESTED?
              </span>

              <h2>
                Apply for this
                <strong>
                  {" "}internship.
                </strong>
              </h2>

              <p>
                Take the next step in your
                career and gain practical
                industry experience.
              </p>

            </div>


            <div className="internship-apply-summary">

              <div>

                <FiBookOpen />

                <div>

                  <span>
                    Position
                  </span>

                  <strong>
                    {
                      internship.role
                    }
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
                    {
                      internship.location
                    }
                  </strong>

                </div>

              </div>


              <div>

                <span className="job-rupee-icon">
                  ₹
                </span>

                <div>

                  <span>
                    Stipend
                  </span>

                  <strong>
                    {
                      internship.stipend
                    }
                  </strong>

                </div>

              </div>


              <div>

                <FiClock />

                <div>

                  <span>
                    Duration
                  </span>

                  <strong>
                    {
                      internship.duration
                    }
                  </strong>

                </div>

              </div>

            </div>


            <button
              type="button"
              className="internship-apply-btn"
              onClick={() =>
                alert(
                  "Internship application feature will be connected soon."
                )
              }
            >
              Apply Now
              <FiSend />
            </button>


            <p className="internship-apply-note">
              Our team will review your
              application and contact you
              if your profile matches the
              opportunity.
            </p>

          </aside>

        </div>

      </main>

      <StudentFooter />

    </div>
  );
}

export default InternshipDetails;