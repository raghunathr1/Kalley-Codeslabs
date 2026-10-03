import { useEffect, useState } from "react";
import {
  Link,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiSearch,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiBookOpen,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import api from "../api/api";
import StudentFooter from "../components/StudentFooter";

import "./Courses.css";


function Courses() {
  const [search, setSearch] =
    useState("");

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    fetchCourses();
  }, []);


  const fetchCourses =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/courses"
          );

        setCourses(
          Array.isArray(response.data)
            ? response.data
            : response.data?.courses ||
                []
        );
      } catch (error) {
        console.error(
          "Fetch courses error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load courses. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };


  const filteredCourses =
    courses.filter(
      (course) => {
        const searchText =
          search
            .toLowerCase()
            .trim();

        if (!searchText) {
          return true;
        }

        return (
          course.name
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          course.duration
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          course.location
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          course.description
            ?.toLowerCase()
            .includes(
              searchText
            ) ||
          course.skills?.some(
            (skill) =>
              skill
                .toLowerCase()
                .includes(
                  searchText
                )
          ) ||
          course.highlights?.some(
            (highlight) =>
              highlight
                .toLowerCase()
                .includes(
                  searchText
                )
          )
        );
      }
    );


  return (
    <div className="courses-page">

      {/* ================= HERO ================= */}

      <header className="courses-header">

        <div className="courses-header-container">

          <Link
            to="/student"
            className="courses-back-btn"
          >
            <FiArrowLeft />
            Dashboard
          </Link>

          <div className="courses-heading">

            <span>
              PLACEMENT COURSES
            </span>

            <h1>
              Learn Skills.
              <strong>
                {" "}Build Your Career.
              </strong>
            </h1>

            <p>
              Learn practical
              development skills
              through career-focused
              courses designed to help
              you become industry ready.
            </p>

          </div>

        </div>

      </header>


      {/* ================= CONTENT ================= */}

      <main className="courses-content">

        {/* SEARCH */}

        <section className="courses-filter-section">

          <div className="courses-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search courses, skills or technologies..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          <div className="courses-search-info">

            <div>

              <span>
                OUR PROGRAMS
              </span>

              <h2>
                Choose Your Course
              </h2>

              <p>
                {loading
                  ? "Loading courses..."
                  : `${filteredCourses.length} ${
                      filteredCourses.length ===
                      1
                        ? "course"
                        : "courses"
                    } available`}
              </p>

            </div>


            <button
              type="button"
              className="courses-refresh-btn"
              onClick={fetchCourses}
              disabled={loading}
            >
              <FiRefreshCw
                className={
                  loading
                    ? "courses-refresh-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

        </section>


        {/* ================= LOADING ================= */}

        {loading && (
          <div className="courses-state">

            <div className="courses-spinner" />

            <h3>
              Loading courses...
            </h3>

            <p>
              Please wait while we
              fetch the latest
              courses.
            </p>

          </div>
        )}


        {/* ================= ERROR ================= */}

        {!loading &&
          error && (
            <div className="courses-state">

              <FiBookOpen />

              <h3>
                Unable to load courses
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={fetchCourses}
              >
                Try Again
              </button>

            </div>
          )}


        {/* ================= GRID ================= */}

        {!loading &&
          !error &&
          filteredCourses.length >
            0 && (
            <div className="courses-grid">

              {filteredCourses.map(
                (course) => (
                  <article
                    className="course-card"
                    key={
                      course._id
                    }
                  >

                    <div className="course-card-top">

                      <div className="course-icon">
                        <FiBookOpen />
                      </div>

                      <span className="course-duration">
                        <FiClock />
                        {
                          course.duration
                        }
                      </span>

                    </div>


                    <div className="course-card-body">

                      <h3>
                        {course.name}
                      </h3>

                      <p className="course-description">
                        {
                          course.description
                        }
                      </p>


                      {course.skills?.length >
                        0 && (
                        <div className="course-skills">

                          {course.skills
                            .slice(
                              0,
                              6
                            )
                            .map(
                              (
                                skill
                              ) => (
                                <span
                                  key={
                                    skill
                                  }
                                >
                                  {
                                    skill
                                  }
                                </span>
                              )
                            )}


                          {course.skills
                            .length >
                            6 && (
                            <span>
                              +
                              {course.skills
                                .length -
                                6}{" "}
                              more
                            </span>
                          )}

                        </div>
                      )}


                      <div className="course-practical">

                        <FiCheckCircle />

                        <span>
                          Practical
                          Training
                        </span>

                      </div>


                      <div className="course-benefits">

                        <span>
                          Offer Letter
                        </span>

                        <span>
                          Experience Letter
                        </span>

                        <span>
                          Certificate
                        </span>

                      </div>


                      <div className="course-location">

                        <FiMapPin />

                        <div>

                          <span>
                            Location
                          </span>

                          <strong>
                            {
                              course.location
                            }
                          </strong>

                        </div>

                      </div>

                    </div>


                    <Link
                      to={`/courses/${course._id}`}
                      className="course-details-btn"
                    >
                      View Course
                      <FiArrowRight />
                    </Link>

                  </article>
                )
              )}

            </div>
          )}


        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          filteredCourses.length ===
            0 && (
            <div className="courses-state">

              <FiSearch />

              <h3>
                {courses.length ===
                0
                  ? "No courses available"
                  : "No courses found"}
              </h3>

              <p>
                {courses.length ===
                0
                  ? "There are currently no published placement courses."
                  : "Try searching with a different course or skill."}
              </p>

            </div>
          )}

      </main>

      <StudentFooter />

    </div>
  );
}

export default Courses;