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
  // APPLICATION STATES
  // =====================================================

  const [
    showApplicationForm,
    setShowApplicationForm,
  ] = useState(false);

  const [
    applicationLoading,
    setApplicationLoading,
  ] = useState(false);

  const [
    applicationSuccess,
    setApplicationSuccess,
  ] = useState(false);

  const [
    applicationError,
    setApplicationError,
  ] = useState("");

  const [
    applicationForm,
    setApplicationForm,
  ] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    qualification: "",
    city: "",
    resume: "",
    message: "",
  });


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
  // APPLICATION INPUT CHANGE
  // =====================================================

  const handleApplicationChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setApplicationForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };


  // =====================================================
  // OPEN APPLICATION FORM
  // =====================================================

  const handleApplyClick = () => {
    setApplicationError("");
    setApplicationSuccess(false);
    setShowApplicationForm(true);

    setTimeout(() => {
      document
        .querySelector(
          ".internship-application-form"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };


  // =====================================================
  // CLOSE APPLICATION FORM
  // =====================================================

  const handleCloseApplication = () => {
    if (applicationLoading) {
      return;
    }

    setShowApplicationForm(false);
    setApplicationError("");
  };


  // =====================================================
  // SUBMIT APPLICATION
  // =====================================================

  const handleApplicationSubmit =
    async (event) => {
      event.preventDefault();

      setApplicationError("");
      setApplicationSuccess(false);

      const {
        fullName,
        email,
        mobileNumber,
        qualification,
        city,
        resume,
        message,
      } = applicationForm;

      if (
        !fullName.trim() ||
        !email.trim() ||
        !mobileNumber.trim() ||
        !qualification.trim() ||
        !city.trim()
      ) {
        setApplicationError(
          "Please fill all required fields."
        );

        return;
      }

      try {
        setApplicationLoading(true);

        const response =
          await api.post(
            "/internship-applications",
            {
              fullName:
                fullName.trim(),

              email:
                email
                  .toLowerCase()
                  .trim(),

              mobileNumber:
                mobileNumber.trim(),

              qualification:
                qualification.trim(),

              city:
                city.trim(),

              internshipRole:
                internship.role,

              internshipId:
                internship._id,

              resume:
                resume.trim(),

              message:
                message.trim(),
            }
          );

        console.log(
          "Internship application submitted:",
          response.data
        );

        setApplicationSuccess(true);

        setApplicationForm({
          fullName: "",
          email: "",
          mobileNumber: "",
          qualification: "",
          city: "",
          resume: "",
          message: "",
        });
      } catch (error) {
        console.error(
          "Internship application submit error:",
          error
        );

        setApplicationError(
          error.response?.data?.message ||
            "Failed to submit your application. Please try again."
        );
      } finally {
        setApplicationLoading(false);
      }
    };


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
                Skills &amp;
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


            {/* =========================
                APPLICATION FORM
                ========================= */}

            {!showApplicationForm &&
            !applicationSuccess ? (

              <button
                type="button"
                className="internship-apply-btn"
                onClick={
                  handleApplyClick
                }
              >
                Apply Now
                <FiSend />
              </button>

            ) : null}


            {showApplicationForm &&
            !applicationSuccess && (

              <form
                className="internship-application-form"
                onSubmit={
                  handleApplicationSubmit
                }
              >

                <div className="internship-application-form-header">

                  <h3>
                    Internship Application
                  </h3>

                  <p>
                    Please provide your details
                    to apply for this internship.
                  </p>

                </div>


                {applicationError && (

                  <div className="internship-application-error">
                    {applicationError}
                  </div>

                )}


                <div className="internship-application-field">

                  <label htmlFor="fullName">
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={
                      applicationForm.fullName
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Enter your full name"
                    required
                  />

                </div>


                <div className="internship-application-field">

                  <label htmlFor="email">
                    Email *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={
                      applicationForm.email
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Enter your email"
                    required
                  />

                </div>


                <div className="internship-application-field">

                  <label htmlFor="mobileNumber">
                    Mobile Number *
                  </label>

                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={
                      applicationForm.mobileNumber
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Enter your mobile number"
                    required
                  />

                </div>


                <div className="internship-application-field">

                  <label htmlFor="qualification">
                    Qualification *
                  </label>

                  <input
                    id="qualification"
                    name="qualification"
                    type="text"
                    value={
                      applicationForm.qualification
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Example: BCA, BTech, MCA"
                    required
                  />

                </div>


                <div className="internship-application-field">

                  <label htmlFor="city">
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={
                      applicationForm.city
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Enter your city"
                    required
                  />

                </div>


                <div className="internship-application-field">

                  <label htmlFor="resume">
                    Resume URL
                  </label>

                  <input
                    id="resume"
                    name="resume"
                    type="url"
                    value={
                      applicationForm.resume
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="https://..."
                  />

                  <small>
                    Add a Google Drive,
                    Dropbox or other
                    publicly accessible
                    resume link.
                  </small>

                </div>


                <div className="internship-application-field">

                  <label htmlFor="message">
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={
                      applicationForm.message
                    }
                    onChange={
                      handleApplicationChange
                    }
                    placeholder="Tell us briefly about yourself..."
                  />

                </div>


                <div className="internship-application-actions">

                  <button
                    type="button"
                    className="internship-application-cancel"
                    onClick={
                      handleCloseApplication
                    }
                    disabled={
                      applicationLoading
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="internship-apply-btn"
                    disabled={
                      applicationLoading
                    }
                  >
                    {applicationLoading
                      ? "Submitting..."
                      : "Submit Application"}

                    {!applicationLoading && (
                      <FiSend />
                    )}
                  </button>

                </div>

              </form>
            )}


            {/* =========================
                SUCCESS MESSAGE
                ========================= */}

            {applicationSuccess && (

              <div className="internship-application-success">

                <FiCheckCircle />

                <h3>
                  Application Submitted!
                </h3>

                <p>
                  Thank you for applying
                  for this internship.
                  Our team will review
                  your application and
                  contact you if your
                  profile matches the
                  opportunity.
                </p>

                <button
                  type="button"
                  className="internship-apply-btn"
                  onClick={() => {
                    setApplicationSuccess(
                      false
                    );

                    setShowApplicationForm(
                      true
                    );

                    setApplicationError("");
                  }}
                >
                  Submit Another Application
                </button>

              </div>

            )}


            {!showApplicationForm &&
            !applicationSuccess && (

              <p className="internship-apply-note">
                Our team will review your
                application and contact you
                if your profile matches the
                opportunity.
              </p>

            )}

          </aside>

        </div>

      </main>

      <StudentFooter />

    </div>
  );
}

export default InternshipDetails;