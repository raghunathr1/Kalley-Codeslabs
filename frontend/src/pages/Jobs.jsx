import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiSearch,
  FiBriefcase,
  FiMapPin,
  FiBookOpen,
  FiUsers,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";

import api from "../api/api";
import StudentFooter from "../components/StudentFooter";

import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const [search, setSearch] =
    useState("");

  const [experienceFilter, setExperienceFilter] =
    useState("");

  const [educationFilter, setEducationFilter] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // FETCH JOBS
  // =====================================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/jobs");

      setJobs(
        Array.isArray(response.data)
          ? response.data
          : response.data?.jobs || []
      );
    } catch (error) {
      console.error(
        "Fetch jobs error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // =====================================================
  // ONLY PUBLISHED JOBS
  // =====================================================

  const publishedJobs =
    useMemo(() => {
      return jobs.filter(
        (job) =>
          job.status === "Published"
      );
    }, [jobs]);

  // =====================================================
  // EXPERIENCE OPTIONS
  // =====================================================

  const experienceOptions =
    useMemo(() => {
      return [
        ...new Set(
          publishedJobs
            .map(
              (job) =>
                job.experience
            )
            .filter(Boolean)
        ),
      ];
    }, [publishedJobs]);

  // =====================================================
  // EDUCATION OPTIONS
  // =====================================================

  const educationOptions =
    useMemo(() => {
      return [
        ...new Set(
          publishedJobs
            .map(
              (job) =>
                job.education
            )
            .filter(Boolean)
        ),
      ];
    }, [publishedJobs]);

  // =====================================================
  // FILTER JOBS
  // =====================================================

  const filteredJobs =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return publishedJobs.filter(
        (job) => {
          const searchableText = [
            job.role,
            job.company,
            job.location,
            job.salary,
            job.education,
            job.experience,
            job.aboutRole,
            ...(job.skills || []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            searchableText.includes(
              query
            );

          const matchesExperience =
            !experienceFilter ||
            job.experience ===
              experienceFilter;

          const matchesEducation =
            !educationFilter ||
            job.education ===
              educationFilter;

          return (
            matchesSearch &&
            matchesExperience &&
            matchesEducation
          );
        }
      );
    }, [
      publishedJobs,
      search,
      experienceFilter,
      educationFilter,
    ]);

  // =====================================================
  // RESET
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setExperienceFilter("");
    setEducationFilter("");
  };

  return (
    <div className="jobs-page">

      {/* ================= HERO ================= */}

      <section className="jobs-hero">

        <div className="jobs-hero-inner">

          <Link
            to="/student"
            className="jobs-back-link"
          >
            <FiArrowLeft />
            Back to Career Portal
          </Link>

          <div className="jobs-hero-content">

            <span className="jobs-label">
              CAREER OPPORTUNITIES
            </span>

            <h1>
              Find your next
              <span>
                {" "}opportunity.
              </span>
            </h1>

            <p>
              Explore current job
              opportunities and find a
              role that matches your
              skills, education and
              career goals.
            </p>

          </div>

        </div>

      </section>

      {/* ================= MAIN ================= */}

      <main className="jobs-main">

        {/* SEARCH */}

        <section className="jobs-filter-section">

          <div className="jobs-search-box">

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

          <div className="jobs-filter-row">

            <select
              value={
                experienceFilter
              }
              onChange={(e) =>
                setExperienceFilter(
                  e.target.value
                )
              }
            >
              <option value="">
                All Experience
              </option>

              {experienceOptions.map(
                (experience) => (
                  <option
                    key={experience}
                    value={experience}
                  >
                    {experience}
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
              experienceFilter ||
              educationFilter) && (
              <button
                type="button"
                className="jobs-reset-btn"
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

        <section className="jobs-list-section">

          <div className="jobs-list-header">

            <div>
              <span>
                AVAILABLE JOBS
              </span>

              <h2>
                Open positions
              </h2>

              <p>
                {filteredJobs.length}{" "}
                active{" "}
                {filteredJobs.length ===
                1
                  ? "opportunity"
                  : "opportunities"}{" "}
                available.
              </p>
            </div>

            <button
              type="button"
              className="jobs-refresh-btn"
              onClick={fetchJobs}
              disabled={loading}
            >
              <FiRefreshCw
                className={
                  loading
                    ? "jobs-refresh-spin"
                    : ""
                }
              />

              Refresh
            </button>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="jobs-state">
              <div className="jobs-spinner" />

              <p>
                Loading job
                opportunities...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading &&
            error && (
              <div className="jobs-state jobs-error-state">

                <FiBriefcase />

                <h3>
                  Unable to load jobs
                </h3>

                <p>
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    fetchJobs
                  }
                >
                  Try Again
                </button>

              </div>
            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredJobs.length ===
              0 && (
              <div className="jobs-state">

                <FiBriefcase />

                <h3>
                  No active jobs found
                </h3>

                <p>
                  Try another search or
                  remove your filters.
                </p>

                {(search ||
                  experienceFilter ||
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

          {/* JOB GRID */}

          {!loading &&
            !error &&
            filteredJobs.length >
              0 && (
              <div className="jobs-grid">

                {filteredJobs.map(
                  (job) => (
                    <article
                      className="job-card"
                      key={
                        job._id
                      }
                    >

                      <div className="job-card-top">

                        <div className="job-card-icon">
                          <FiBriefcase />
                        </div>

                        <span className="job-status">
                          Active
                        </span>

                      </div>

                      <div className="job-card-content">

                        <h3>
                          {job.role}
                        </h3>

                        <p className="job-company">
                          {job.company}
                        </p>

                        <div className="job-meta">

                          <span>
                            <FiMapPin />
                            {job.location}
                          </span>

                          <span>
                            <strong>
                              ₹
                            </strong>
                            {job.salary}
                          </span>

                        </div>

                        <div className="job-meta">

                          <span>
                            <FiUsers />
                            {job.openings}{" "}
                            {job.openings ===
                            1
                              ? "Opening"
                              : "Openings"}
                          </span>

                          <span>
                            <FiClock />
                            {job.experience ||
                              "Fresher"}
                          </span>

                        </div>

                        {job.skills?.length >
                          0 && (
                          <div className="job-skills">

                            {job.skills
                              .slice(0, 5)
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

                            {job.skills
                              .length >
                              5 && (
                              <span>
                                +
                                {job.skills
                                  .length -
                                  5}{" "}
                                more
                              </span>
                            )}

                          </div>
                        )}

                      </div>

                      <div className="job-card-footer">

                        <span className="job-education">
                          <FiBookOpen />
                          {
                            job.education
                          }
                        </span>

                        <Link
                          to={`/jobs/${job._id}`}
                          className="job-view-btn"
                        >
                          View Job
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

export default Jobs;