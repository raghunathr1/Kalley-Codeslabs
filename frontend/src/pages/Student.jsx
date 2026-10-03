import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentFooter from "../components/StudentFooter";

import {
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiArrowRight,
  FiLogOut,
  FiUser,
  FiHome,
} from "react-icons/fi";

import "./Student.css";

function Student() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {
      try {
        setUser(
          JSON.parse(
            storedUser
          )
        );
      } catch (error) {
        console.error(
          "User data error:",
          error
        );
      }
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };

  return (
    <div className="student-page">

      {/* ================= NAVBAR ================= */}

      <nav className="student-navbar">

        {/* LOGO */}

        <Link
          to="/student"
          className="student-logo"
        >
          <span>
            KALLEY
          </span>

          <small>
            CODELABS
          </small>
        </Link>

        {/* NAV LINKS */}

        <div className="student-nav-links">

          <Link to="/">
            <FiHome />
            Home
          </Link>

          <Link to="/student">
            Dashboard
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>

          <Link to="/internships">
            Internships
          </Link>

          <Link to="/courses">
            Courses
          </Link>

        </div>

        {/* USER AREA */}

        <div className="student-user-area">

          <div className="student-user">

            <div className="student-user-icon">
              <FiUser />
            </div>

            <div>

              <small>
                Welcome
              </small>

              <strong>
                {user?.name ||
                  "User"}
              </strong>

            </div>

          </div>

          <button
            className="student-logout-btn"
            onClick={
              handleLogout
            }
          >
            <FiLogOut />

            Logout
          </button>

        </div>

      </nav>

      {/* ================= HERO ================= */}

      <section className="student-dashboard-hero">

        <div className="student-dashboard-content">

          <span className="student-label">
            KALLEY CODELABS
          </span>

          <h1>
            Welcome,
            <br />

            <span>
              {user?.name ||
                "Student"}.
            </span>
          </h1>

          <p>
            Explore job
            opportunities,
            internships and
            practical
            placement courses
            designed to help you
            build your career.
          </p>

        </div>

      </section>

      {/* ================= OPTIONS ================= */}

      <section className="student-options">

        <div className="student-section-heading">

          <span>
            YOUR OPPORTUNITIES
          </span>

          <h2>
            Explore your
            <strong>
              {" "}next step.
            </strong>
          </h2>

          <p>
            Choose an opportunity
            and start building
            your skills,
            experience and
            career.
          </p>

        </div>

        <div className="student-option-grid">

          {/* ================= JOBS ================= */}

          <div className="student-option-card">

            <div className="student-option-icon">
              <FiBriefcase />
            </div>

            <h3>
              Job Opportunities
            </h3>

            <p>
              Discover current
              job openings from
              companies looking
              for skilled and
              motivated candidates.
            </p>

            <Link to="/jobs">
              Explore Jobs
              <FiArrowRight />
            </Link>

          </div>

          {/* ================= INTERNSHIPS ================= */}

          <div className="student-option-card">

            <div className="student-option-icon">
              <FiBookOpen />
            </div>

            <h3>
              Internships
            </h3>

            <p>
              Gain practical
              industry experience
              through internships
              and real-world
              development projects.
            </p>

            <Link to="/internships">
              Explore Internships
              <FiArrowRight />
            </Link>

          </div>

          {/* ================= COURSES ================= */}

          <div className="student-option-card">

            <div className="student-option-icon">
              <FiAward />
            </div>

            <h3>
              Placement Courses
            </h3>

            <p>
              Learn practical
              development skills
              through career-focused
              placement courses.
            </p>

            <Link to="/courses">
              View Courses
              <FiArrowRight />
            </Link>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="student-cta">

        <div>

          <span>
            READY TO GROW?
          </span>

          <h2>
            Build skills.
            <br />

            <strong>
              Build your career.
            </strong>
          </h2>

          <p>
            Explore opportunities
            and start working
            toward your career
            goals.
          </p>

        </div>

        <Link
          to="/courses"
          className="student-cta-btn"
        >
          Explore Courses
          <FiArrowRight />
        </Link>

      </section>

      <StudentFooter />

    </div>
  );
}

export default Student;