import { useEffect, useState } from "react";
import {
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiUser,
  FiBookOpen,
  FiMessageSquare,
} from "react-icons/fi";

import api from "../api/api";

import "./AdminCourseEnquiryManager.css";

function AdminCourseEnquiryManager({
  onUnauthorized,
}) {
  const [enquiries, setEnquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const adminToken =
    localStorage.getItem(
      "adminToken"
    );

  // =========================
  // FETCH ENQUIRIES
  // =========================

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/course-enquiries",
          {
            headers: {
              Authorization:
                `Bearer ${adminToken}`,
            },
          }
        );

      setEnquiries(
        response.data || []
      );
    } catch (error) {
      console.error(
        "Fetch course enquiries error:",
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
          "Failed to fetch course enquiries"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (
    enquiryId,
    status
  ) => {
    try {
      setUpdatingId(enquiryId);

      const response =
        await api.patch(
          `/course-enquiries/${enquiryId}/status`,
          {
            status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${adminToken}`,
            },
          }
        );

      setEnquiries(
        (previousEnquiries) =>
          previousEnquiries.map(
            (enquiry) =>
              enquiry._id ===
              enquiryId
                ? response.data.enquiry
                : enquiry
          )
      );
    } catch (error) {
      console.error(
        "Update enquiry status error:",
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
          "Failed to update enquiry status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // DATE FORMAT
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="admin-course-enquiry-manager">

        <div className="course-enquiry-loading">

          <div className="course-enquiry-spinner"></div>

          <p>
            Loading course enquiries...
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="admin-course-enquiry-manager">

      {/* HEADER */}

      <div className="course-enquiry-manager-header">

        <div>
          <h2>
            Course Enquiries
          </h2>

          <p>
            Manage students interested in
            placement courses.
          </p>
        </div>

        <button
          type="button"
          className="course-enquiry-refresh-btn"
          onClick={fetchEnquiries}
        >
          <FiRefreshCw />

          Refresh
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="course-enquiry-error">

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={fetchEnquiries}
          >
            Try Again
          </button>

        </div>
      )}

      {/* EMPTY */}

      {!error &&
        enquiries.length ===
          0 && (
          <div className="course-enquiry-empty">

            <FiBookOpen />

            <h3>
              No Course Enquiries
            </h3>

            <p>
              Course enquiries submitted by
              students will appear here.
            </p>

          </div>
        )}

      {/* LIST */}

      {!error &&
        enquiries.length > 0 && (
          <div className="course-enquiry-list">

            {enquiries.map(
              (enquiry) => (
                <article
                  className="course-enquiry-card"
                  key={
                    enquiry._id
                  }
                >

                  {/* TOP */}

                  <div className="course-enquiry-card-top">

                    <div className="course-enquiry-person">

                      <div className="course-enquiry-avatar">
                        <FiUser />
                      </div>

                      <div>

                        <h3>
                          {enquiry.name}
                        </h3>

                        <p>
                          {formatDate(
                            enquiry.createdAt
                          )}
                        </p>

                      </div>

                    </div>

                    <select
                      value={
                        enquiry.status ||
                        "New"
                      }
                      onChange={(e) =>
                        updateStatus(
                          enquiry._id,
                          e.target.value
                        )
                      }
                      disabled={
                        updatingId ===
                        enquiry._id
                      }
                      className={`course-enquiry-status ${
                        (
                          enquiry.status ||
                          "New"
                        ).toLowerCase()
                      }`}
                    >

                      <option value="New">
                        New
                      </option>

                      <option value="Contacted">
                        Contacted
                      </option>

                      <option value="Closed">
                        Closed
                      </option>

                    </select>

                  </div>

                  {/* COURSE */}

                  <div className="course-enquiry-course">

                    <FiBookOpen />

                    <div>

                      <span>
                        Course
                      </span>

                      <strong>
                        {enquiry.course}
                      </strong>

                    </div>

                  </div>

                  {/* CONTACT */}

                  <div className="course-enquiry-contact-grid">

                    <a
                      href={`mailto:${enquiry.email}`}
                      className="course-enquiry-contact-item"
                    >

                      <FiMail />

                      <div>

                        <span>
                          Email
                        </span>

                        <strong>
                          {enquiry.email}
                        </strong>

                      </div>

                    </a>

                    <a
                      href={`tel:${enquiry.mobile}`}
                      className="course-enquiry-contact-item"
                    >

                      <FiPhone />

                      <div>

                        <span>
                          Mobile
                        </span>

                        <strong>
                          {enquiry.mobile}
                        </strong>

                      </div>

                    </a>

                  </div>

                  {/* QUERY */}

                  {enquiry.query && (
                    <div className="course-enquiry-query">

                      <div className="course-enquiry-query-heading">

                        <FiMessageSquare />

                        <span>
                          Query
                        </span>

                      </div>

                      <p>
                        {enquiry.query}
                      </p>

                    </div>
                  )}

                </article>
              )
            )}

          </div>
        )}

    </section>
  );
}

export default AdminCourseEnquiryManager;