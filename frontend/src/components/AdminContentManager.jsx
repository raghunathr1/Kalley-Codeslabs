import { useEffect, useState } from "react";
import {
  FiRefreshCw,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiX,
  FiSave,
} from "react-icons/fi";

import api from "../api/api";

import "./AdminContentManager.css";

function AdminContentManager({ onUnauthorized }) {
  const [activeTab, setActiveTab] =
    useState("jobs");

  const [jobs, setJobs] =
    useState([]);

  const [internships, setInternships] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editingItem, setEditingItem] =
    useState(null);

  const [editingType, setEditingType] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [formData, setFormData] =
    useState({});

  const adminToken =
    localStorage.getItem(
      "adminToken"
    );

  // =========================
  // FETCH ALL CONTENT
  // =========================

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        jobsResponse,
        internshipsResponse,
        coursesResponse,
      ] = await Promise.all([
        api.get("/jobs"),
        api.get("/internships"),
        api.get("/courses"),
      ]);

      setJobs(
        jobsResponse.data || []
      );

      setInternships(
        internshipsResponse.data || []
      );

      setCourses(
        coursesResponse.data || []
      );
    } catch (error) {
      console.error(
        "Fetch content error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        onUnauthorized();
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to fetch content"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // =========================
  // DELETE JOB
  // =========================

  const deleteJob = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/jobs/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`,
          },
        }
      );

      setJobs(
        (previousJobs) =>
          previousJobs.filter(
            (job) =>
              job._id !== id
          )
      );

      alert(
        "Job deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete job error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        onUnauthorized();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete job"
      );
    }
  };

  // =========================
  // DELETE INTERNSHIP
  // =========================

  const deleteInternship = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this internship?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/internships/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`,
          },
        }
      );

      setInternships(
        (previousInternships) =>
          previousInternships.filter(
            (internship) =>
              internship._id !== id
          )
      );

      alert(
        "Internship deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete internship error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        onUnauthorized();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete internship"
      );
    }
  };

  // =========================
  // DELETE COURSE
  // =========================

  const deleteCourse = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this course?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/courses/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`,
          },
        }
      );

      setCourses(
        (previousCourses) =>
          previousCourses.filter(
            (course) =>
              course._id !== id
          )
      );

      alert(
        "Course deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        onUnauthorized();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete course"
      );
    }
  };

  // =========================
  // ARRAY -> TEXT
  // =========================

  const arrayToText = (value) => {
    if (!Array.isArray(value)) {
      return "";
    }

    return value.join("\n");
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDateForInput = (
    value
  ) => {
    if (!value) {
      return "";
    }

    return new Date(value)
      .toISOString()
      .split("T")[0];
  };

  // =========================
  // OPEN JOB EDIT
  // =========================

  const openJobEdit = (job) => {
    setEditingType("job");
    setEditingItem(job);

    setFormData({
      role: job.role || "",
      company: job.company || "",
      skills: arrayToText(
        job.skills
      ),
      salary: job.salary || "",
      education:
        job.education || "",
      responsibilities:
        arrayToText(
          job.responsibilities
        ),
      location:
        job.location || "",
      openings:
        job.openings || 1,
      experience:
        job.experience ||
        "Fresher",
      aboutRole:
        job.aboutRole || "",
      expiryDate:
        formatDateForInput(
          job.expiryDate
        ),
      status:
        job.status ||
        "Published",
    });
  };

  // =========================
  // OPEN INTERNSHIP EDIT
  // =========================

  const openInternshipEdit = (
    internship
  ) => {
    setEditingType(
      "internship"
    );

    setEditingItem(
      internship
    );

    setFormData({
      role:
        internship.role || "",
      company:
        internship.company ||
        "",
      skills:
        arrayToText(
          internship.skills
        ),
      stipend:
        internship.stipend || "",
      duration:
        internship.duration || "",
      education:
        internship.education ||
        "",
      responsibilities:
        arrayToText(
          internship.responsibilities
        ),
      location:
        internship.location ||
        "",
      openings:
        internship.openings || 1,
      experience:
        internship.experience ||
        "Fresher",
      aboutRole:
        internship.aboutRole ||
        "",
      expiryDate:
        formatDateForInput(
          internship.expiryDate
        ),
      status:
        internship.status ||
        "Published",
    });
  };

  // =========================
  // OPEN COURSE EDIT
  // =========================

  const openCourseEdit = (
    course
  ) => {
    setEditingType("course");
    setEditingItem(course);

    setFormData({
      name: course.name || "",
      duration:
        course.duration || "",
      location:
        course.location || "",
      description:
        course.description ||
        "",
      skills:
        arrayToText(
          course.skills
        ),
      highlights:
        arrayToText(
          course.highlights
        ),
      status:
        course.status ||
        "Published",
    });
  };

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );
  };

  // =========================
  // TEXT -> ARRAY
  // =========================

  const textToArray = (value) => {
    if (
      !value ||
      !value.trim()
    ) {
      return [];
    }

    return value
      .split(/\n|,/)
      .map((item) =>
        item.trim()
      )
      .filter(Boolean);
  };

  // =========================
  // CLOSE EDIT MODAL
  // =========================

  const closeEditModal = () => {
    if (saving) {
      return;
    }

    setEditingItem(null);
    setEditingType("");
    setFormData({});
  };

  // =========================
  // SAVE JOB
  // =========================

  const updateJob = async () => {
    try {
      const payload = {
        role:
          formData.role.trim(),

        company:
          formData.company.trim(),

        skills:
          textToArray(
            formData.skills
          ),

        salary:
          formData.salary.trim(),

        education:
          formData.education.trim(),

        responsibilities:
          textToArray(
            formData.responsibilities
          ),

        location:
          formData.location.trim(),

        openings: Number(
          formData.openings
        ),

        experience:
          formData.experience.trim(),

        aboutRole:
          formData.aboutRole.trim(),

        expiryDate:
          formData.expiryDate,

        status:
          formData.status,
      };

      const response =
        await api.put(
          `/jobs/${editingItem._id}`,
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${adminToken}`,
            },
          }
        );

      setJobs(
        (previousJobs) =>
          previousJobs.map(
            (job) =>
              job._id ===
              editingItem._id
                ? response.data.job
                : job
          )
      );

      alert(
        "Job updated successfully"
      );

      closeEditModal();
    } catch (error) {
      console.error(
        "Update job error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        onUnauthorized();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update job"
      );
    }
  };

  // =========================
  // SAVE INTERNSHIP
  // =========================

  const updateInternship =
    async () => {
      try {
        const payload = {
          role:
            formData.role.trim(),

          company:
            formData.company.trim(),

          skills:
            textToArray(
              formData.skills
            ),

          stipend:
            formData.stipend.trim(),

          duration:
            formData.duration.trim(),

          education:
            formData.education.trim(),

          responsibilities:
            textToArray(
              formData.responsibilities
            ),

          location:
            formData.location.trim(),

          openings: Number(
            formData.openings
          ),

          experience:
            formData.experience.trim(),

          aboutRole:
            formData.aboutRole.trim(),

          expiryDate:
            formData.expiryDate,

          status:
            formData.status,
        };

        const response =
          await api.put(
            `/internships/${editingItem._id}`,
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${adminToken}`,
              },
            }
          );

        setInternships(
          (
            previousInternships
          ) =>
            previousInternships.map(
              (internship) =>
                internship._id ===
                editingItem._id
                  ? response.data
                      .internship
                  : internship
            )
        );

        alert(
          "Internship updated successfully"
        );

        closeEditModal();
      } catch (error) {
        console.error(
          "Update internship error:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          onUnauthorized();
          return;
        }

        alert(
          error.response?.data?.message ||
            "Failed to update internship"
        );
      }
    };

  // =========================
  // SAVE COURSE
  // =========================

  const updateCourse =
    async () => {
      try {
        const payload = {
          name:
            formData.name.trim(),

          duration:
            formData.duration.trim(),

          location:
            formData.location.trim(),

          description:
            formData.description.trim(),

          skills:
            textToArray(
              formData.skills
            ),

          highlights:
            textToArray(
              formData.highlights
            ),

          status:
            formData.status,
        };

        const response =
          await api.put(
            `/courses/${editingItem._id}`,
            payload,
            {
              headers: {
                Authorization:
                  `Bearer ${adminToken}`,
              },
            }
          );

        setCourses(
          (previousCourses) =>
            previousCourses.map(
              (course) =>
                course._id ===
                editingItem._id
                  ? response.data
                      .course
                  : course
            )
        );

        alert(
          "Course updated successfully"
        );

        closeEditModal();
      } catch (error) {
        console.error(
          "Update course error:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          onUnauthorized();
          return;
        }

        alert(
          error.response?.data?.message ||
            "Failed to update course"
        );
      }
    };

  // =========================
  // SAVE CHANGES
  // =========================

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    if (
      !editingItem ||
      !editingType
    ) {
      return;
    }

    try {
      setSaving(true);

      if (
        editingType === "job"
      ) {
        await updateJob();
      }

      if (
        editingType ===
        "internship"
      ) {
        await updateInternship();
      }

      if (
        editingType === "course"
      ) {
        await updateCourse();
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <section className="admin-content-manager">

      <div className="content-manager-header">

        <div>

          <h2>
            Manage Website Content
          </h2>

          <p>
            Manage jobs, internships and courses
            directly from MongoDB.
          </p>

        </div>

        <button
          type="button"
          className="content-refresh-btn"
          onClick={fetchContent}
          disabled={loading}
        >
          <FiRefreshCw
            className={
              loading
                ? "refresh-spinning"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* TABS */}

      <div className="content-tabs">

        <button
          type="button"
          className={
            activeTab === "jobs"
              ? "content-tab active"
              : "content-tab"
          }
          onClick={() =>
            setActiveTab("jobs")
          }
        >
          <FiBriefcase />

          Jobs

          <span>
            {jobs.length}
          </span>
        </button>

        <button
          type="button"
          className={
            activeTab ===
            "internships"
              ? "content-tab active"
              : "content-tab"
          }
          onClick={() =>
            setActiveTab(
              "internships"
            )
          }
        >
          <FiBookOpen />

          Internships

          <span>
            {internships.length}
          </span>
        </button>

        <button
          type="button"
          className={
            activeTab ===
            "courses"
              ? "content-tab active"
              : "content-tab"
          }
          onClick={() =>
            setActiveTab("courses")
          }
        >
          <FiAward />

          Courses

          <span>
            {courses.length}
          </span>
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="content-error">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchContent}
          >
            Try Again
          </button>

        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div className="content-loading">

          <div className="loading-spinner"></div>

          <p>
            Loading content...
          </p>

        </div>
      ) : (
        <>

          {/* JOBS */}

          {activeTab ===
            "jobs" && (
            <div className="managed-list">

              {jobs.length ===
              0 ? (
                <div className="empty-content">

                  <FiBriefcase />

                  <h3>
                    No Jobs Found
                  </h3>

                  <p>
                    Add a job from the dashboard
                    above.
                  </p>

                </div>
              ) : (
                jobs.map(
                  (job) => (
                    <div
                      className="managed-card"
                      key={job._id}
                    >

                      <div className="managed-card-icon">
                        <FiBriefcase />
                      </div>

                      <div className="managed-card-content">

                        <div className="managed-card-top">

                          <div>

                            <h3>
                              {job.role}
                            </h3>

                            <p className="managed-company">
                              {job.company}
                            </p>

                          </div>

                          <span
                            className={`status-badge ${
                              job.status?.toLowerCase() ||
                              "published"
                            }`}
                          >
                            {job.status}
                          </span>

                        </div>

                        <div className="managed-info">

                          <span>
                            Location:{" "}
                            {job.location}
                          </span>

                          <span>
                            Salary:{" "}
                            {job.salary}
                          </span>

                          <span>
                            Openings:{" "}
                            {job.openings}
                          </span>

                        </div>

                      </div>

                      <div className="managed-actions">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            openJobEdit(
                              job
                            )
                          }
                        >
                          <FiEdit2 />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            deleteJob(
                              job._id
                            )
                          }
                        >
                          <FiTrash2 />
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                )
              )}

            </div>
          )}

          {/* INTERNSHIPS */}

          {activeTab ===
            "internships" && (
            <div className="managed-list">

              {internships.length ===
              0 ? (
                <div className="empty-content">

                  <FiBookOpen />

                  <h3>
                    No Internships Found
                  </h3>

                  <p>
                    Add an internship from the
                    dashboard above.
                  </p>

                </div>
              ) : (
                internships.map(
                  (
                    internship
                  ) => (
                    <div
                      className="managed-card"
                      key={
                        internship._id
                      }
                    >

                      <div className="managed-card-icon">
                        <FiBookOpen />
                      </div>

                      <div className="managed-card-content">

                        <div className="managed-card-top">

                          <div>

                            <h3>
                              {
                                internship.role
                              }
                            </h3>

                            <p className="managed-company">
                              {
                                internship.company
                              }
                            </p>

                          </div>

                          <span
                            className={`status-badge ${
                              internship.status?.toLowerCase() ||
                              "published"
                            }`}
                          >
                            {
                              internship.status
                            }
                          </span>

                        </div>

                        <div className="managed-info">

                          <span>
                            Location:{" "}
                            {
                              internship.location
                            }
                          </span>

                          <span>
                            Stipend:{" "}
                            {
                              internship.stipend
                            }
                          </span>

                          <span>
                            Duration:{" "}
                            {
                              internship.duration
                            }
                          </span>

                          <span>
                            Openings:{" "}
                            {
                              internship.openings
                            }
                          </span>

                        </div>

                      </div>

                      <div className="managed-actions">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            openInternshipEdit(
                              internship
                            )
                          }
                        >
                          <FiEdit2 />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            deleteInternship(
                              internship._id
                            )
                          }
                        >
                          <FiTrash2 />
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                )
              )}

            </div>
          )}

          {/* COURSES */}

          {activeTab ===
            "courses" && (
            <div className="managed-list">

              {courses.length ===
              0 ? (
                <div className="empty-content">

                  <FiAward />

                  <h3>
                    No Courses Found
                  </h3>

                  <p>
                    Add a course from the
                    dashboard above.
                  </p>

                </div>
              ) : (
                courses.map(
                  (course) => (
                    <div
                      className="managed-card"
                      key={
                        course._id
                      }
                    >

                      <div className="managed-card-icon">
                        <FiAward />
                      </div>

                      <div className="managed-card-content">

                        <div className="managed-card-top">

                          <div>

                            <h3>
                              {course.name}
                            </h3>

                            <p className="managed-company">
                              {
                                course.location
                              }
                            </p>

                          </div>

                          <span
                            className={`status-badge ${
                              course.status?.toLowerCase() ||
                              "published"
                            }`}
                          >
                            {
                              course.status
                            }
                          </span>

                        </div>

                        <div className="managed-info">

                          <span>
                            Duration:{" "}
                            {
                              course.duration
                            }
                          </span>

                          <span>
                            Location:{" "}
                            {
                              course.location
                            }
                          </span>

                        </div>

                      </div>

                      <div className="managed-actions">

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            openCourseEdit(
                              course
                            )
                          }
                        >
                          <FiEdit2 />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            deleteCourse(
                              course._id
                            )
                          }
                        >
                          <FiTrash2 />
                          Delete
                        </button>

                      </div>

                    </div>
                  )
                )
              )}

            </div>
          )}

        </>
      )}

      {/* =========================
          EDIT MODAL
      ========================= */}

      {editingItem && (
        <div className="edit-modal-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">

              <div>

                <h2>
                  Edit{" "}
                  {editingType ===
                  "job"
                    ? "Job"
                    : editingType ===
                      "internship"
                    ? "Internship"
                    : "Course"}
                </h2>

                <p>
                  Update the existing information.
                </p>

              </div>

              <button
                type="button"
                className="close-modal-btn"
                onClick={
                  closeEditModal
                }
                disabled={saving}
              >
                <FiX />
              </button>

            </div>

            <form
              className="edit-form"
              onSubmit={handleSave}
            >

              {/* JOB FORM */}

              {editingType ===
                "job" && (
                <>

                  <div className="form-grid">

                    <div className="edit-form-group">

                      <label>
                        Role *
                      </label>

                      <input
                        type="text"
                        name="role"
                        value={
                          formData.role ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Company *
                      </label>

                      <input
                        type="text"
                        name="company"
                        value={
                          formData.company ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Skills *{" "}
                        <span>
                          One skill per line or
                          comma separated
                        </span>
                      </label>

                      <textarea
                        name="skills"
                        value={
                          formData.skills ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="3"
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Salary *
                      </label>

                      <input
                        type="text"
                        name="salary"
                        value={
                          formData.salary ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Education *
                      </label>

                      <input
                        type="text"
                        name="education"
                        value={
                          formData.education ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Location *
                      </label>

                      <input
                        type="text"
                        name="location"
                        value={
                          formData.location ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Openings *
                      </label>

                      <input
                        type="number"
                        name="openings"
                        min="1"
                        value={
                          formData.openings ||
                          1
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Experience
                      </label>

                      <input
                        type="text"
                        name="experience"
                        value={
                          formData.experience ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Expiry Date *
                      </label>

                      <input
                        type="date"
                        name="expiryDate"
                        value={
                          formData.expiryDate ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          formData.status ||
                          "Published"
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="Published">
                          Published
                        </option>

                        <option value="Draft">
                          Draft
                        </option>

                        <option value="Expired">
                          Expired
                        </option>

                      </select>

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Responsibilities
                      </label>

                      <textarea
                        name="responsibilities"
                        value={
                          formData.responsibilities ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="4"
                        placeholder="One responsibility per line"
                      />

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        About Role
                      </label>

                      <textarea
                        name="aboutRole"
                        value={
                          formData.aboutRole ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="5"
                      />

                    </div>

                  </div>

                </>
              )}

              {/* INTERNSHIP FORM */}

              {editingType ===
                "internship" && (
                <>

                  <div className="form-grid">

                    <div className="edit-form-group">

                      <label>
                        Role *
                      </label>

                      <input
                        type="text"
                        name="role"
                        value={
                          formData.role ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Company *
                      </label>

                      <input
                        type="text"
                        name="company"
                        value={
                          formData.company ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Skills *{" "}
                        <span>
                          One skill per line or
                          comma separated
                        </span>
                      </label>

                      <textarea
                        name="skills"
                        value={
                          formData.skills ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="3"
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Stipend *
                      </label>

                      <input
                        type="text"
                        name="stipend"
                        value={
                          formData.stipend ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Duration *
                      </label>

                      <input
                        type="text"
                        name="duration"
                        value={
                          formData.duration ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Education *
                      </label>

                      <input
                        type="text"
                        name="education"
                        value={
                          formData.education ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Location *
                      </label>

                      <input
                        type="text"
                        name="location"
                        value={
                          formData.location ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Openings *
                      </label>

                      <input
                        type="number"
                        name="openings"
                        min="1"
                        value={
                          formData.openings ||
                          1
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Experience
                      </label>

                      <input
                        type="text"
                        name="experience"
                        value={
                          formData.experience ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Expiry Date *
                      </label>

                      <input
                        type="date"
                        name="expiryDate"
                        value={
                          formData.expiryDate ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          formData.status ||
                          "Published"
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="Published">
                          Published
                        </option>

                        <option value="Draft">
                          Draft
                        </option>

                        <option value="Expired">
                          Expired
                        </option>

                      </select>

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Responsibilities
                      </label>

                      <textarea
                        name="responsibilities"
                        value={
                          formData.responsibilities ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="4"
                        placeholder="One responsibility per line"
                      />

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        About Role
                      </label>

                      <textarea
                        name="aboutRole"
                        value={
                          formData.aboutRole ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="5"
                      />

                    </div>

                  </div>

                </>
              )}

              {/* COURSE FORM */}

              {editingType ===
                "course" && (
                <>

                  <div className="form-grid">

                    <div className="edit-form-group">

                      <label>
                        Course Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={
                          formData.name ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Time Period *
                      </label>

                      <input
                        type="text"
                        name="duration"
                        value={
                          formData.duration ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Location *
                      </label>

                      <input
                        type="text"
                        name="location"
                        value={
                          formData.location ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />

                    </div>

                    <div className="edit-form-group">

                      <label>
                        Status
                      </label>

                      <select
                        name="status"
                        value={
                          formData.status ||
                          "Published"
                        }
                        onChange={
                          handleChange
                        }
                      >

                        <option value="Published">
                          Published
                        </option>

                        <option value="Draft">
                          Draft
                        </option>

                      </select>

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Description *
                      </label>

                      <textarea
                        name="description"
                        value={
                          formData.description ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="5"
                        required
                      />

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Skills
                        <span>
                          One skill per line or
                          comma separated
                        </span>
                      </label>

                      <textarea
                        name="skills"
                        value={
                          formData.skills ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="4"
                      />

                    </div>

                    <div className="edit-form-group full-width">

                      <label>
                        Highlights
                        <span>
                          One highlight per line
                        </span>
                      </label>

                      <textarea
                        name="highlights"
                        value={
                          formData.highlights ||
                          ""
                        }
                        onChange={
                          handleChange
                        }
                        rows="5"
                      />

                    </div>

                  </div>

                </>
              )}

              {/* FORM BUTTONS */}

              <div className="edit-form-actions">

                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={
                    closeEditModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-edit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="button-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default AdminContentManager;