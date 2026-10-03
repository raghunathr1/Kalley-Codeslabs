import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
  FiBookOpen,
  FiMapPin,
  FiClock,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";

import api from "../api/api";
import StudentFooter from "../components/StudentFooter";

import "./Internships.css";

function Internships() {
  const [internships, setInternships] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [durationFilter, setDurationFilter] =
    useState("");

  const [educationFilter, setEducationFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH
  // =====================================================

  const fetchInternships =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get(
            "/internships"
          );

        setInternships(
          Array.isArray(response.data)
            ? response.data
            : response.data?.internships ||
                []
        );
      } catch (error) {
        console.error(
          "Fetch internships error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load internships."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchInternships();
  }, []);

  // =====================================================
  // ONLY PUBLISHED
  // =====================================================

  const publishedInternships =
    useMemo(() => {
      return internships.filter(
        (internship) =>
          internship.status ===
          "Published"
      );
    }, [internships]);

  // =====================================================
  // FILTER OPTIONS
  // =====================================================

  const durationOptions =
    useMemo(() => {
      return [
        ...new Set(
          publishedInternships
            .map(
              (internship) =>
                internship.duration
            )
            .filter(Boolean)
        ),
      ];
    }, [publishedInternships]);

  const educationOptions =
    useMemo(() => {
      return [
        ...new Set(
          publishedInternships
            .map(
              (internship) =>
                internship.education
            )
            .filter(Boolean)
        ),
      ];
    }, [publishedInternships]);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredInternships =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return publishedInternships.filter(
        (internship) => {
          const searchableText = [
            internship.role,
            internship.company,
            internship.location,
            internship.stipend,
            internship.duration,
            internship.education,
            internship.experience,
            internship.aboutRole,
            ...(internship.skills ||
              []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );

          const matchesDuration =
            !durationFilter ||
            internship.duration ===
              durationFilter;

          const matchesEducation =
            !educationFilter ||
            internship.education ===
              educationFilter;

          return (
            matchesSearch &&
            matchesDuration &&
            matchesEducation
          );
        }
      );
    }, [
      publishedInternships,
      search,
      durationFilter,
      educationFilter,
    ]);

  const resetFilters = () => {
    setSearch("");
    setDurationFilter("");
    setEducationFilter("");
  };

  return (
    <div className="internships-page">

      {/* ================= HERO ================= */}

      <section className="internships-hero">

        <div className="internships-hero-inner">

          <Link
            to="/student"
            className="internships-back-link"
          >
            <FiArrowLeft />
            Back to Career Portal
          </Link>

          <div className="internships-hero-content">

            <span className="internships-label">
              INTERNSHIP OPPORTUNITIES
            </span>

            <h1>
              Start with
              <span>
                {" "}real experience.
              </span>
            </h1>

            <p>
              Explore active internship
              opportunities and gain
              practical experience that
              supports your career journey.
            </p>

          </div>

        </div>

      </section>

      {/* ================= MAIN ================= */}

      <main className="internships-main">

        {/* FILTER */}

        <section className="internships-filter-section">

          <div className="internships-search-box">

            <FiSearch />

            <input
              type="text"
              placeholder="Search by role, company, skill or location..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="internships-filter-row">

            <select
              value={
                durationFilter
              }
              onChange={(e) =>
                setDurationFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Durations
              </option>

              {durationOptions.map(
                (duration) => (
                  <option
                    key={duration}
                    value={duration}
                  >
                    {duration}
                  </option>
                )
              )}
            </select>

            <select
              value={
                educationFilter
              }
              onChange={(e) =>
                setEducationFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Education
              </option>

              {educationOptions.map(
                (education) => (
                  <option
                    key={education}
                    value={education}
                  >
                    {education}
                  </option>
                )
              )}
            </select>

            {(search ||
              durationFilter ||
              educationFilter) && (
              <button
                type="button"
                className="internships-reset-btn"
                onClick={
                  resetFilters
                }
              >
                Reset Filters
              </button>
            )}

          </div>

        </section>

        {/* LIST HEADER */}

        <section className="internships-list-section">

          <div className="internships-list-header">

            <div>

              <span>
                AVAILABLE INTERNSHIPS
              </span>

              <h2>
                Open opportunities
              </h2>

              <p>
                {
                  filteredInternships.length
                }{" "}
                active{" "}
                {filteredInternships.length ===
                1
                  ? "internship"
                  : "internships"}{" "}
                available.
              </p>

            </div>

            <button
              type="button"
              className="internships-refresh-btn"
              onClick={
                fetchInternships
              }
              disabled={
                loading
              }
            >
              <FiRefreshCw
                className={
                  loading
                    ? "internships-refresh-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="internships-state">

              <div className="internships-spinner" />

              <p>
                Loading internship
                opportunities...
              </p>

            </div>
          )}

          {/* ERROR */}

          {!loading &&
            error && (
              <div className="internships-state internships-error-state">

                <FiBookOpen />

                <h3>
                  Unable to load internships
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchInternships
                  }
                >
                  Try Again
                </button>

              </div>
            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredInternships.length ===
              0 && (
              <div className="internships-state">

                <FiBookOpen />

                <h3>
                  No active internships found
                </h3>

                <p>
                  Try another search or
                  remove your filters.
                </p>

                {(search ||
                  durationFilter ||
                  educationFilter) && (
                  <button
                    type="button"
                    onClick={
                      resetFilters
                    }
                  >
                    Clear Filters
                  </button>
                )}

              </div>
            )}

          {/* CARDS */}

          {!loading &&
            !error &&
            filteredInternships.length >
              0 && (
              <div className="internships-grid">

                {filteredInternships.map(
                  (internship) => (
                    <article
                      className="internship-card"
                      key={
                        internship._id
                      }
                    >

                      <div className="internship-card-top">

                        <div className="internship-card-icon">
                          <FiBookOpen />
                        </div>

                        <span className="internship-status">
                          Active
                        </span>

                      </div>

                      <div className="internship-card-content">

                        <h3>
                          {
                            internship.role
                          }
                        </h3>

                        <p className="internship-company">
                          {
                            internship.company
                          }
                        </p>

                        <div className="internship-meta">

                          <span>
                            <FiMapPin />
                            {
                              internship.location
                            }
                          </span>

                          <span>
                            <strong>
                              ₹
                            </strong>
                            {
                              internship.stipend
                            }
                          </span>

                        </div>

                        <div className="internship-meta">

                          <span>
                            <FiClock />
                            {
                              internship.duration
                            }
                          </span>

                          <span>
                            <FiUsers />
                            {
                              internship.openings
                            }{" "}
                            {
                              internship.openings ===
                              1
                                ? "Opening"
                                : "Openings"
                            }
                          </span>

                        </div>

                        {internship.skills?.length >
                          0 && (
                          <div className="internship-skills">

                            {internship.skills
                              .slice(
                                0,
                                5
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

                            {internship.skills
                              .length >
                              5 && (
                              <span>
                                +
                                {internship.skills
                                  .length -
                                  5}{" "}
                                more
                              </span>
                            )}

                          </div>
                        )}

                      </div>

                      <div className="internship-card-footer">

                        <span className="internship-education">
                          <FiBookOpen />
                          {
                            internship.education
                          }
                        </span>

                        <Link
                          to={`/internships/${internship._id}`}
                          className="internship-view-btn"
                        >
                          View Internship
                          <FiArrowRight />
                        </Link>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

        </section>

      </main>

      <StudentFooter />

    </div>
  );
}

export default Internships;