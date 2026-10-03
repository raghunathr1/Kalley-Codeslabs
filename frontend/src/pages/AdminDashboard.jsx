import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import AdminContentManager from "../components/AdminContentManager";
import AdminConsultationManager from "../components/AdminConsultationManager";
import AdminCourseEnquiryManager from "../components/AdminCourseEnquiryManager";

import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  // =========================
  // ADMIN LOGIN
  // =========================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      Boolean(
        localStorage.getItem(
          "adminToken"
        )
      )
    );

  // =========================
  // JOB FORM
  // =========================

  const [showJobForm, setShowJobForm] =
    useState(false);

  const [jobLoading, setJobLoading] =
    useState(false);

  const [jobForm, setJobForm] = useState({
    role: "",
    company: "",
    salary: "",
    education: "",
    location: "",
    openings: "",
    experience: "",
    aboutRole: "",
    expiryDate: "",
  });

  const [jobSkills, setJobSkills] =
    useState([""]);

  const [jobResponsibilities, setJobResponsibilities] =
    useState([""]);

  // =========================
  // INTERNSHIP FORM
  // =========================

  const [
    showInternshipForm,
    setShowInternshipForm,
  ] = useState(false);

  const [
    internshipLoading,
    setInternshipLoading,
  ] = useState(false);

  const [internshipForm, setInternshipForm] =
    useState({
      role: "",
      company: "",
      stipend: "",
      duration: "",
      education: "",
      location: "",
      openings: "",
      experience: "",
      aboutRole: "",
      expiryDate: "",
    });

  const [internshipSkills, setInternshipSkills] =
    useState([""]);

  const [
    internshipResponsibilities,
    setInternshipResponsibilities,
  ] = useState([""]);

  // =========================
  // COURSE FORM
  // =========================

  const [showCourseForm, setShowCourseForm] =
    useState(false);

  const [courseLoading, setCourseLoading] =
    useState(false);

  const [courseForm, setCourseForm] =
    useState({
      name: "",
      duration: "",
      location: "",
      description: "",
    });

  const [courseSkills, setCourseSkills] =
    useState([""]);

  const [courseHighlights, setCourseHighlights] =
    useState([""]);

  // =========================
  // ADMIN LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert(
        "Please enter admin email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email:
            email
              .trim()
              .toLowerCase(),

          password,
        }
      );

      localStorage.setItem(
        "adminToken",
        response.data.token
      );

      localStorage.setItem(
        "admin",
        JSON.stringify(
          response.data.admin
        )
      );

      alert(
        response.data.message
      );

      setIsLoggedIn(true);
    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Admin login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "admin"
    );

    setIsLoggedIn(false);

    setEmail("");
    setPassword("");

    setShowJobForm(false);
    setShowInternshipForm(false);
    setShowCourseForm(false);
  };

  // =========================
  // JOB HANDLERS
  // =========================

  const handleJobChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setJobForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleJobSkillChange = (
    index,
    value
  ) => {
    setJobSkills(
      (previous) =>
        previous.map(
          (skill, i) =>
            i === index
              ? value
              : skill
        )
    );
  };

  const addJobSkill = () => {
    setJobSkills(
      (previous) => [
        ...previous,
        "",
      ]
    );
  };

  const removeJobSkill = (
    index
  ) => {
    if (
      jobSkills.length === 1
    ) {
      return;
    }

    setJobSkills(
      (previous) =>
        previous.filter(
          (_, i) =>
            i !== index
        )
    );
  };

  const handleJobResponsibilityChange =
    (
      index,
      value
    ) => {
      setJobResponsibilities(
        (previous) =>
          previous.map(
            (item, i) =>
              i === index
                ? value
                : item
          )
      );
    };

  const addJobResponsibility =
    () => {
      setJobResponsibilities(
        (previous) => [
          ...previous,
          "",
        ]
      );
    };

  const removeJobResponsibility =
    (index) => {
      if (
        jobResponsibilities.length ===
        1
      ) {
        return;
      }

      setJobResponsibilities(
        (previous) =>
          previous.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  const resetJobForm = () => {
    setJobForm({
      role: "",
      company: "",
      salary: "",
      education: "",
      location: "",
      openings: "",
      experience: "",
      aboutRole: "",
      expiryDate: "",
    });

    setJobSkills([""]);
    setJobResponsibilities(
      [""]
    );
  };

  const closeJobForm = () => {
    if (jobLoading) {
      return;
    }

    setShowJobForm(false);
    resetJobForm();
  };

  const handleJobSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !jobForm.role.trim() ||
      !jobForm.company.trim() ||
      !jobForm.salary.trim() ||
      !jobForm.education.trim() ||
      !jobForm.location.trim() ||
      !jobForm.openings ||
      !jobForm.expiryDate
    ) {
      alert(
        "Please fill all required job fields."
      );
      return;
    }

    const cleanSkills =
      jobSkills
        .map((skill) =>
          skill.trim()
        )
        .filter(Boolean);

    if (
      cleanSkills.length ===
      0
    ) {
      alert(
        "Please add at least one required skill."
      );
      return;
    }

    const cleanResponsibilities =
      jobResponsibilities
        .map((item) =>
          item.trim()
        )
        .filter(Boolean);

    try {
      setJobLoading(true);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        alert(
          "Admin session expired. Please login again."
        );

        handleLogout();
        return;
      }

      const response =
        await axios.post(
          "http://localhost:5000/api/jobs",
          {
            role:
              jobForm.role.trim(),

            company:
              jobForm.company.trim(),

            skills:
              cleanSkills,

            salary:
              jobForm.salary.trim(),

            education:
              jobForm.education.trim(),

            responsibilities:
              cleanResponsibilities,

            location:
              jobForm.location.trim(),

            openings: Number(
              jobForm.openings
            ),

            experience:
              jobForm.experience.trim() ||
              "Fresher",

            aboutRole:
              jobForm.aboutRole.trim(),

            expiryDate:
              jobForm.expiryDate,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      alert(
        response.data.message ||
          "Job published successfully."
      );

      closeJobForm();
    } catch (error) {
      console.error(
        "Create job error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        alert(
          "Admin session expired. Please login again."
        );

        handleLogout();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to publish job. Please try again."
      );
    } finally {
      setJobLoading(false);
    }
  };

  // =========================
  // INTERNSHIP HANDLERS
  // =========================

  const handleInternshipChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setInternshipForm(
        (previous) => ({
          ...previous,
          [name]: value,
        })
      );
    };

  const handleInternshipSkillChange =
    (
      index,
      value
    ) => {
      setInternshipSkills(
        (previous) =>
          previous.map(
            (skill, i) =>
              i === index
                ? value
                : skill
          )
      );
    };

  const addInternshipSkill =
    () => {
      setInternshipSkills(
        (previous) => [
          ...previous,
          "",
        ]
      );
    };

  const removeInternshipSkill =
    (index) => {
      if (
        internshipSkills.length ===
        1
      ) {
        return;
      }

      setInternshipSkills(
        (previous) =>
          previous.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  const handleInternshipResponsibilityChange =
    (
      index,
      value
    ) => {
      setInternshipResponsibilities(
        (previous) =>
          previous.map(
            (item, i) =>
              i === index
                ? value
                : item
          )
      );
    };

  const addInternshipResponsibility =
    () => {
      setInternshipResponsibilities(
        (previous) => [
          ...previous,
          "",
        ]
      );
    };

  const removeInternshipResponsibility =
    (index) => {
      if (
        internshipResponsibilities.length ===
        1
      ) {
        return;
      }

      setInternshipResponsibilities(
        (previous) =>
          previous.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  const resetInternshipForm =
    () => {
      setInternshipForm({
        role: "",
        company: "",
        stipend: "",
        duration: "",
        education: "",
        location: "",
        openings: "",
        experience: "",
        aboutRole: "",
        expiryDate: "",
      });

      setInternshipSkills([
        "",
      ]);

      setInternshipResponsibilities(
        [""]
      );
    };

  const closeInternshipForm =
    () => {
      if (
        internshipLoading
      ) {
        return;
      }

      setShowInternshipForm(
        false
      );

      resetInternshipForm();
    };

  const handleInternshipSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !internshipForm.role.trim() ||
        !internshipForm.company.trim() ||
        !internshipForm.stipend.trim() ||
        !internshipForm.duration.trim() ||
        !internshipForm.education.trim() ||
        !internshipForm.location.trim() ||
        !internshipForm.openings ||
        !internshipForm.expiryDate
      ) {
        alert(
          "Please fill all required internship fields."
        );

        return;
      }

      const cleanSkills =
        internshipSkills
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean);

      if (
        cleanSkills.length ===
        0
      ) {
        alert(
          "Please add at least one required skill."
        );

        return;
      }

      const cleanResponsibilities =
        internshipResponsibilities
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

      try {
        setInternshipLoading(
          true
        );

        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          alert(
            "Admin session expired. Please login again."
          );

          handleLogout();
          return;
        }

        const response =
          await axios.post(
            "http://localhost:5000/api/internships",
            {
              role:
                internshipForm.role.trim(),

              company:
                internshipForm.company.trim(),

              skills:
                cleanSkills,

              stipend:
                internshipForm.stipend.trim(),

              duration:
                internshipForm.duration.trim(),

              education:
                internshipForm.education.trim(),

              responsibilities:
                cleanResponsibilities,

              location:
                internshipForm.location.trim(),

              openings: Number(
                internshipForm.openings
              ),

              experience:
                internshipForm.experience.trim() ||
                "Fresher",

              aboutRole:
                internshipForm.aboutRole.trim(),

              expiryDate:
                internshipForm.expiryDate,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          response.data.message ||
            "Internship published successfully."
        );

        closeInternshipForm();
      } catch (error) {
        console.error(
          "Create internship error:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          alert(
            "Admin session expired. Please login again."
          );

          handleLogout();
          return;
        }

        alert(
          error.response?.data?.message ||
            "Failed to publish internship. Please try again."
        );
      } finally {
        setInternshipLoading(
          false
        );
      }
    };

  // =========================
  // COURSE HANDLERS
  // =========================

  const handleCourseChange = (
    e
  ) => {
    const {
      name,
      value,
    } = e.target;

    setCourseForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleCourseSkillChange =
    (
      index,
      value
    ) => {
      setCourseSkills(
        (previous) =>
          previous.map(
            (skill, i) =>
              i === index
                ? value
                : skill
          )
      );
    };

  const addCourseSkill = () => {
    setCourseSkills(
      (previous) => [
        ...previous,
        "",
      ]
    );
  };

  const removeCourseSkill =
    (index) => {
      if (
        courseSkills.length ===
        1
      ) {
        return;
      }

      setCourseSkills(
        (previous) =>
          previous.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  const handleCourseHighlightChange =
    (
      index,
      value
    ) => {
      setCourseHighlights(
        (previous) =>
          previous.map(
            (item, i) =>
              i === index
                ? value
                : item
          )
      );
    };

  const addCourseHighlight =
    () => {
      setCourseHighlights(
        (previous) => [
          ...previous,
          "",
        ]
      );
    };

  const removeCourseHighlight =
    (index) => {
      if (
        courseHighlights.length ===
        1
      ) {
        return;
      }

      setCourseHighlights(
        (previous) =>
          previous.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  const resetCourseForm = () => {
    setCourseForm({
      name: "",
      duration: "",
      location: "",
      description: "",
    });

    setCourseSkills([""]);

    setCourseHighlights([
      "",
    ]);
  };

  const closeCourseForm = () => {
    if (courseLoading) {
      return;
    }

    setShowCourseForm(false);

    resetCourseForm();
  };

  const handleCourseSubmit =
    async (e) => {
      e.preventDefault();

      if (
        !courseForm.name.trim() ||
        !courseForm.duration.trim() ||
        !courseForm.location.trim() ||
        !courseForm.description.trim()
      ) {
        alert(
          "Please fill all required course fields."
        );

        return;
      }

      const cleanSkills =
        courseSkills
          .map((skill) =>
            skill.trim()
          )
          .filter(Boolean);

      const cleanHighlights =
        courseHighlights
          .map((item) =>
            item.trim()
          )
          .filter(Boolean);

      try {
        setCourseLoading(true);

        const token =
          localStorage.getItem(
            "adminToken"
          );

        if (!token) {
          alert(
            "Admin session expired. Please login again."
          );

          handleLogout();
          return;
        }

        const response =
          await axios.post(
            "http://localhost:5000/api/courses",
            {
              name:
                courseForm.name.trim(),

              duration:
                courseForm.duration.trim(),

              location:
                courseForm.location.trim(),

              description:
                courseForm.description.trim(),

              skills:
                cleanSkills,

              highlights:
                cleanHighlights,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        alert(
          response.data.message ||
            "Course published successfully."
        );

        closeCourseForm();
      } catch (error) {
        console.error(
          "Create course error:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          alert(
            "Admin session expired. Please login again."
          );

          handleLogout();
          return;
        }

        alert(
          error.response?.data?.message ||
            "Failed to publish course. Please try again."
        );
      } finally {
        setCourseLoading(false);
      }
    };

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="admin-login-page">

        <div className="admin-login-card">

          <div className="admin-login-icon">
            <FiShield />
          </div>

          <div className="admin-login-heading">

            <span>
              KALLEY CODELABS
            </span>

            <h1>
              Admin Login
            </h1>

            <p>
              Sign in to manage jobs,
              internships and placement
              courses.
            </p>

          </div>

          <form
            className="admin-login-form"
            onSubmit={
              handleLogin
            }
          >

            <div className="admin-form-group">

              <label>
                Admin Email
              </label>

              <div className="admin-input-wrapper">

                <FiMail />

                <input
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="admin-form-group">

              <label>
                Password
              </label>

              <div className="admin-input-wrapper">

                <FiLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter admin password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>

            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}

              {!loading && (
                <FiArrowRight />
              )}
            </button>

          </form>

          <button
            className="admin-back-btn"
            onClick={() =>
              navigate("/")
            }
          >
            ← Back to Website
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="admin-dashboard-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="admin-dashboard-header">

        <div>

          <span>
            KALLEY CODELABS
          </span>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage jobs, internships
            and placement courses.
          </p>

        </div>

        <button
          className="admin-logout-btn"
          onClick={
            handleLogout
          }
        >
          Logout
        </button>

      </header>

      {/* =========================
          MAIN CONTENT
          ========================= */}

      <main className="admin-dashboard-content">

        {/* WELCOME */}

        <div className="admin-welcome-card">

          <div className="admin-welcome-icon">
            <FiShield />
          </div>

          <div>

            <span>
              ADMIN PANEL
            </span>

            <h2>
              Welcome to Kalley CodeLabs
            </h2>

            <p>
              Your admin authentication
              is working successfully.
            </p>

          </div>

        </div>

        {/* =========================
            CONTENT MANAGEMENT
            ========================= */}

        <section className="admin-management-section">

          <div className="admin-section-heading">

            <span>
              CONTENT MANAGEMENT
            </span>

            <h2>
              Manage your
              <strong>
                {" "}platform.
              </strong>
            </h2>

            <p>
              Add and manage opportunities
              and placement courses from
              one place.
            </p>

          </div>

          <div className="admin-management-grid">

            {/* JOB */}

            <div className="admin-management-card">

              <div className="admin-card-icon">
                💼
              </div>

              <h3>
                Add Job
              </h3>

              <p>
                Create and publish job
                opportunities for students
                and job seekers.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowJobForm(true)
                }
              >
                Add Job
                <FiArrowRight />
              </button>

            </div>

            {/* INTERNSHIP */}

            <div className="admin-management-card">

              <div className="admin-card-icon">
                🎓
              </div>

              <h3>
                Add Internship
              </h3>

              <p>
                Add internship opportunities
                with duration, stipend and
                required skills.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowInternshipForm(
                    true
                  )
                }
              >
                Add Internship
                <FiArrowRight />
              </button>

            </div>

            {/* COURSE */}

            <div className="admin-management-card">

              <div className="admin-card-icon">
                📚
              </div>

              <h3>
                Add Course
              </h3>

              <p>
                Create placement courses
                with duration, location and
                practical course details.
              </p>

              <button
                type="button"
                onClick={() =>
                  setShowCourseForm(
                    true
                  )
                }
              >
                Add Course
                <FiArrowRight />
              </button>

            </div>

          </div>

        </section>

        {/* =========================
            MANAGE CONTENT
            ========================= */}

        <AdminContentManager
          onUnauthorized={
            handleLogout
          }
        />

        {/* =========================
            CONSULTATION REQUESTS
            ========================= */}

        <AdminConsultationManager
          onUnauthorized={
            handleLogout
          }
        />

        {/* =========================
            COURSE ENQUIRIES
            ========================= */}

        <AdminCourseEnquiryManager
          onUnauthorized={
            handleLogout
          }
        />

      </main>

      {/* =================================================
          ADD JOB MODAL
          ================================================= */}

      {showJobForm && (

        <div className="admin-modal-overlay">

          <div className="admin-content-modal">

            <div className="admin-modal-header">

              <div>

                <span>
                  CONTENT MANAGEMENT
                </span>

                <h2>
                  Add New Job
                </h2>

                <p>
                  Fill in the job details and
                  publish it to the platform.
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeJobForm
                }
                disabled={
                  jobLoading
                }
              >
                <FiX />
              </button>

            </div>

            <form
              className="admin-content-form"
              onSubmit={
                handleJobSubmit
              }
            >

              {/* ROLE */}

              <div className="admin-job-field">

                <label>
                  Job Role
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. MERN Stack Developer"
                  value={
                    jobForm.role
                  }
                  onChange={
                    handleJobChange
                  }
                  required
                />

              </div>

              {/* COMPANY */}

              <div className="admin-job-field">

                <label>
                  Company Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Kalley CodeLabs"
                  value={
                    jobForm.company
                  }
                  onChange={
                    handleJobChange
                  }
                  required
                />

              </div>

              {/* SALARY / EXPERIENCE */}

              <div className="admin-job-two-column">

                <div className="admin-job-field">

                  <label>
                    Salary
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="salary"
                    placeholder="e.g. ₹3.5 - ₹6 LPA"
                    value={
                      jobForm.salary
                    }
                    onChange={
                      handleJobChange
                    }
                    required
                  />

                </div>

                <div className="admin-job-field">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. 0-2 Years"
                    value={
                      jobForm.experience
                    }
                    onChange={
                      handleJobChange
                    }
                  />

                </div>

              </div>

              {/* EDUCATION */}

              <div className="admin-job-field">

                <label>
                  Education
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="education"
                  placeholder="e.g. BCA / BSc CS / BE / BTech"
                  value={
                    jobForm.education
                  }
                  onChange={
                    handleJobChange
                  }
                  required
                />

              </div>

              {/* LOCATION */}

              <div className="admin-job-field">

                <label>
                  Location
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Nashik, Maharashtra"
                  value={
                    jobForm.location
                  }
                  onChange={
                    handleJobChange
                  }
                  required
                />

              </div>

              {/* OPENINGS / EXPIRY */}

              <div className="admin-job-two-column">

                <div className="admin-job-field">

                  <label>
                    Number of Openings
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="openings"
                    min="1"
                    placeholder="e.g. 2"
                    value={
                      jobForm.openings
                    }
                    onChange={
                      handleJobChange
                    }
                    required
                  />

                </div>

                <div className="admin-job-field">

                  <label>
                    Expiry Date
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={
                      jobForm.expiryDate
                    }
                    onChange={
                      handleJobChange
                    }
                    required
                  />

                </div>

              </div>

              {/* ABOUT ROLE */}

              <div className="admin-job-field">

                <label>
                  About Role
                </label>

                <textarea
                  name="aboutRole"
                  placeholder="Describe the role..."
                  rows="4"
                  value={
                    jobForm.aboutRole
                  }
                  onChange={
                    handleJobChange
                  }
                />

              </div>

              {/* SKILLS */}

              <div className="admin-dynamic-section">

                <div className="admin-dynamic-heading">

                  <div>

                    <label>
                      Required Skills
                      <span>*</span>
                    </label>

                    <p>
                      Add all skills required
                      for this position.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="admin-add-item-btn"
                    onClick={
                      addJobSkill
                    }
                  >
                    <FiPlus />
                    Add Skill
                  </button>

                </div>

                <div className="admin-dynamic-list">

                  {jobSkills.map(
                    (
                      skill,
                      index
                    ) => (

                      <div
                        className="admin-dynamic-row"
                        key={index}
                      >

                        <input
                          type="text"
                          placeholder={`Skill ${index + 1}`}
                          value={skill}
                          onChange={(e) =>
                            handleJobSkillChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-remove-item-btn"
                          onClick={() =>
                            removeJobSkill(
                              index
                            )
                          }
                          disabled={
                            jobSkills.length ===
                            1
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* RESPONSIBILITIES */}

              <div className="admin-dynamic-section">

                <div className="admin-dynamic-heading">

                  <div>

                    <label>
                      Responsibilities
                    </label>

                    <p>
                      Add responsibilities
                      for this job role.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="admin-add-item-btn"
                    onClick={
                      addJobResponsibility
                    }
                  >
                    <FiPlus />
                    Add Responsibility
                  </button>

                </div>

                <div className="admin-dynamic-list">

                  {jobResponsibilities.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="admin-dynamic-row"
                        key={index}
                      >

                        <input
                          type="text"
                          placeholder={`Responsibility ${index + 1}`}
                          value={
                            item
                          }
                          onChange={(e) =>
                            handleJobResponsibilityChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-remove-item-btn"
                          onClick={() =>
                            removeJobResponsibility(
                              index
                            )
                          }
                          disabled={
                            jobResponsibilities.length ===
                            1
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="admin-job-form-actions">

                <button
                  type="button"
                  className="admin-job-cancel-btn"
                  onClick={
                    closeJobForm
                  }
                  disabled={
                    jobLoading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-job-publish-btn"
                  disabled={
                    jobLoading
                  }
                >
                  {jobLoading
                    ? "Publishing..."
                    : "Publish Job"}

                  {!jobLoading && (
                    <FiArrowRight />
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          ADD INTERNSHIP MODAL
          ================================================= */}

      {showInternshipForm && (

        <div className="admin-modal-overlay">

          <div className="admin-content-modal">

            <div className="admin-modal-header">

              <div>

                <span>
                  CONTENT MANAGEMENT
                </span>

                <h2>
                  Add New Internship
                </h2>

                <p>
                  Fill in the internship details
                  and publish it to the platform.
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeInternshipForm
                }
                disabled={
                  internshipLoading
                }
              >
                <FiX />
              </button>

            </div>

            <form
              className="admin-content-form"
              onSubmit={
                handleInternshipSubmit
              }
            >

              {/* ROLE */}

              <div className="admin-job-field">

                <label>
                  Internship Role
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. MERN Stack Development Intern"
                  value={
                    internshipForm.role
                  }
                  onChange={
                    handleInternshipChange
                  }
                  required
                />

              </div>

              {/* COMPANY */}

              <div className="admin-job-field">

                <label>
                  Company Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Kalley CodeLabs"
                  value={
                    internshipForm.company
                  }
                  onChange={
                    handleInternshipChange
                  }
                  required
                />

              </div>

              {/* STIPEND / DURATION */}

              <div className="admin-job-two-column">

                <div className="admin-job-field">

                  <label>
                    Stipend
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="stipend"
                    placeholder="e.g. ₹8,000 - ₹12,000 / month"
                    value={
                      internshipForm.stipend
                    }
                    onChange={
                      handleInternshipChange
                    }
                    required
                  />

                </div>

                <div className="admin-job-field">

                  <label>
                    Duration
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 6 Months"
                    value={
                      internshipForm.duration
                    }
                    onChange={
                      handleInternshipChange
                    }
                    required
                  />

                </div>

              </div>

              {/* EXPERIENCE / EDUCATION */}

              <div className="admin-job-two-column">

                <div className="admin-job-field">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    placeholder="e.g. Fresher"
                    value={
                      internshipForm.experience
                    }
                    onChange={
                      handleInternshipChange
                    }
                  />

                </div>

                <div className="admin-job-field">

                  <label>
                    Education
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="education"
                    placeholder="e.g. BCA / BSc CS / BE / BTech"
                    value={
                      internshipForm.education
                    }
                    onChange={
                      handleInternshipChange
                    }
                    required
                  />

                </div>

              </div>

              {/* LOCATION */}

              <div className="admin-job-field">

                <label>
                  Location
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Nashik, Maharashtra"
                  value={
                    internshipForm.location
                  }
                  onChange={
                    handleInternshipChange
                  }
                  required
                />

              </div>

              {/* OPENINGS / EXPIRY */}

              <div className="admin-job-two-column">

                <div className="admin-job-field">

                  <label>
                    Number of Openings
                    <span>*</span>
                  </label>

                  <input
                    type="number"
                    name="openings"
                    min="1"
                    placeholder="e.g. 3"
                    value={
                      internshipForm.openings
                    }
                    onChange={
                      handleInternshipChange
                    }
                    required
                  />

                </div>

                <div className="admin-job-field">

                  <label>
                    Expiry Date
                    <span>*</span>
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={
                      internshipForm.expiryDate
                    }
                    onChange={
                      handleInternshipChange
                    }
                    required
                  />

                </div>

              </div>

              {/* ABOUT INTERNSHIP */}

              <div className="admin-job-field">

                <label>
                  About Internship
                </label>

                <textarea
                  name="aboutRole"
                  placeholder="Describe the internship..."
                  rows="4"
                  value={
                    internshipForm.aboutRole
                  }
                  onChange={
                    handleInternshipChange
                  }
                />

              </div>

              {/* SKILLS */}

              <div className="admin-dynamic-section">

                <div className="admin-dynamic-heading">

                  <div>

                    <label>
                      Required Skills
                      <span>*</span>
                    </label>

                    <p>
                      Add skills required
                      for this internship.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="admin-add-item-btn"
                    onClick={
                      addInternshipSkill
                    }
                  >
                    <FiPlus />
                    Add Skill
                  </button>

                </div>

                <div className="admin-dynamic-list">

                  {internshipSkills.map(
                    (
                      skill,
                      index
                    ) => (

                      <div
                        className="admin-dynamic-row"
                        key={index}
                      >

                        <input
                          type="text"
                          placeholder={`Skill ${index + 1}`}
                          value={
                            skill
                          }
                          onChange={(e) =>
                            handleInternshipSkillChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-remove-item-btn"
                          onClick={() =>
                            removeInternshipSkill(
                              index
                            )
                          }
                          disabled={
                            internshipSkills.length ===
                            1
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* RESPONSIBILITIES */}

              <div className="admin-dynamic-section">

                <div className="admin-dynamic-heading">

                  <div>

                    <label>
                      Responsibilities
                    </label>

                    <p>
                      Add responsibilities
                      for this internship.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="admin-add-item-btn"
                    onClick={
                      addInternshipResponsibility
                    }
                  >
                    <FiPlus />
                    Add Responsibility
                  </button>

                </div>

                <div className="admin-dynamic-list">

                  {internshipResponsibilities.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="admin-dynamic-row"
                        key={index}
                      >

                        <input
                          type="text"
                          placeholder={`Responsibility ${index + 1}`}
                          value={
                            item
                          }
                          onChange={(e) =>
                            handleInternshipResponsibilityChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-remove-item-btn"
                          onClick={() =>
                            removeInternshipResponsibility(
                              index
                            )
                          }
                          disabled={
                            internshipResponsibilities.length ===
                            1
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="admin-job-form-actions">

                <button
                  type="button"
                  className="admin-job-cancel-btn"
                  onClick={
                    closeInternshipForm
                  }
                  disabled={
                    internshipLoading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-job-publish-btn"
                  disabled={
                    internshipLoading
                  }
                >
                  {internshipLoading
                    ? "Publishing..."
                    : "Publish Internship"}

                  {!internshipLoading && (
                    <FiArrowRight />
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          ADD COURSE MODAL
          ================================================= */}

      {showCourseForm && (

        <div className="admin-modal-overlay">

          <div className="admin-content-modal">

            <div className="admin-modal-header">

              <div>

                <span>
                  CONTENT MANAGEMENT
                </span>

                <h2>
                  Add New Course
                </h2>

                <p>
                  Add course information and
                  publish it to the platform.
                </p>

              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  closeCourseForm
                }
                disabled={
                  courseLoading
                }
              >
                <FiX />
              </button>

            </div>

            <form
              className="admin-content-form"
              onSubmit={
                handleCourseSubmit
              }
            >

              {/* COURSE NAME */}

              <div className="admin-job-field">

                <label>
                  Course Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Full Stack Developer"
                  value={
                    courseForm.name
                  }
                  onChange={
                    handleCourseChange
                  }
                  required
                />

              </div>

              {/* DURATION / LOCATION */}

              <div className="admin-job-two-column">

                <div className="admin-job-field">

                  <label>
                    Time Period
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 6 Months"
                    value={
                      courseForm.duration
                    }
                    onChange={
                      handleCourseChange
                    }
                    required
                  />

                </div>

                <div className="admin-job-field">

                  <label>
                    Location
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Online / Offline"
                    value={
                      courseForm.location
                    }
                    onChange={
                      handleCourseChange
                    }
                    required
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="admin-job-field">

                <label>
                  Course Description
                  <span>*</span>
                </label>

                <textarea
                  name="description"
                  placeholder="Describe the course, training and practical learning approach..."
                  rows="5"
                  value={
                    courseForm.description
                  }
                  onChange={
                    handleCourseChange
                  }
                  required
                />

              </div>

              {/* SKILLS */}

              <div className="admin-dynamic-section">

                <div className="admin-dynamic-heading">

                  <div>

                    <label>
                      Skills Covered
                    </label>

                    <p>
                      Add technologies or
                      skills covered in
                      the course.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="admin-add-item-btn"
                    onClick={
                      addCourseSkill
                    }
                  >
                    <FiPlus />
                    Add Skill
                  </button>

                </div>

                <div className="admin-dynamic-list">

                  {courseSkills.map(
                    (
                      skill,
                      index
                    ) => (

                      <div
                        className="admin-dynamic-row"
                        key={index}
                      >

                        <input
                          type="text"
                          placeholder={`Skill ${index + 1}`}
                          value={
                            skill
                          }
                          onChange={(e) =>
                            handleCourseSkillChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-remove-item-btn"
                          onClick={() =>
                            removeCourseSkill(
                              index
                            )
                          }
                          disabled={
                            courseSkills.length ===
                            1
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* HIGHLIGHTS */}

              <div className="admin-dynamic-section">

                <div className="admin-dynamic-heading">

                  <div>

                    <label>
                      Course Highlights
                    </label>

                    <p>
                      Add important learning
                      outcomes or highlights.
                    </p>

                  </div>

                  <button
                    type="button"
                    className="admin-add-item-btn"
                    onClick={
                      addCourseHighlight
                    }
                  >
                    <FiPlus />
                    Add Highlight
                  </button>

                </div>

                <div className="admin-dynamic-list">

                  {courseHighlights.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="admin-dynamic-row"
                        key={index}
                      >

                        <input
                          type="text"
                          placeholder={`Highlight ${index + 1}`}
                          value={
                            item
                          }
                          onChange={(e) =>
                            handleCourseHighlightChange(
                              index,
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-remove-item-btn"
                          onClick={() =>
                            removeCourseHighlight(
                              index
                            )
                          }
                          disabled={
                            courseHighlights.length ===
                            1
                          }
                        >
                          <FiTrash2 />
                        </button>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* ACTIONS */}

              <div className="admin-job-form-actions">

                <button
                  type="button"
                  className="admin-job-cancel-btn"
                  onClick={
                    closeCourseForm
                  }
                  disabled={
                    courseLoading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-job-publish-btn"
                  disabled={
                    courseLoading
                  }
                >
                  {courseLoading
                    ? "Publishing..."
                    : "Publish Course"}

                  {!courseLoading && (
                    <FiArrowRight />
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminDashboard;