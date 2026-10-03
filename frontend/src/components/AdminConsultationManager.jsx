import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiUser,
  FiBriefcase,
  FiMessageSquare,
} from "react-icons/fi";

import "./AdminConsultationManager.css";

const API_BASE_URL = "http://localhost:5000/api";

function AdminConsultationManager({
  onUnauthorized,
}) {
  const [consultations, setConsultations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  const adminToken =
    localStorage.getItem("adminToken");

  // =========================
  // FETCH CONSULTATIONS
  // =========================

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/consultations`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setConsultations(
        response.data || []
      );
    } catch (error) {
      console.error(
        "Fetch consultations error:",
        error
      );

      if (error.response?.status === 401) {
        onUnauthorized();
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to fetch consultations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (
    consultationId,
    status
  ) => {
    try {
      setUpdatingId(consultationId);

      const response = await axios.patch(
        `${API_BASE_URL}/consultations/${consultationId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      setConsultations(
        (previousConsultations) =>
          previousConsultations.map(
            (consultation) =>
              consultation._id ===
              consultationId
                ? response.data.consultation
                : consultation
          )
      );
    } catch (error) {
      console.error(
        "Update consultation status error:",
        error
      );

      if (error.response?.status === 401) {
        onUnauthorized();
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to update consultation status"
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

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="admin-consultation-manager">
        <div className="consultation-loading">
          <div className="consultation-spinner"></div>

          <p>
            Loading consultations...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-consultation-manager">

      {/* ================= HEADER ================= */}

      <div className="consultation-manager-header">

        <div>
          <h2>
            Consultation Requests
          </h2>

          <p>
            Manage project enquiries submitted
            from the website.
          </p>
        </div>

        <button
          type="button"
          className="consultation-refresh-btn"
          onClick={fetchConsultations}
          disabled={loading}
        >
          <FiRefreshCw
            className={
              loading
                ? "consultation-refresh-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="consultation-manager-error">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchConsultations}
          >
            Try Again
          </button>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!error &&
        consultations.length === 0 && (
          <div className="consultation-empty">

            <FiMessageSquare />

            <h3>
              No Consultation Requests
            </h3>

            <p>
              New consultation requests
              submitted from the website
              will appear here.
            </p>

          </div>
        )}

      {/* ================= LIST ================= */}

      {!error &&
        consultations.length > 0 && (
          <div className="consultation-list">

            {consultations.map(
              (consultation) => (
                <article
                  className="consultation-admin-card"
                  key={consultation._id}
                >

                  {/* TOP */}

                  <div className="consultation-card-top">

                    <div className="consultation-person">

                      <div className="consultation-avatar">
                        <FiUser />
                      </div>

                      <div>
                        <h3>
                          {consultation.name}
                        </h3>

                        <p>
                          {formatDate(
                            consultation.createdAt
                          )}
                        </p>
                      </div>

                    </div>

                    {/* STATUS */}

                    <select
                      value={
                        consultation.status ||
                        "New"
                      }
                      onChange={(e) =>
                        updateStatus(
                          consultation._id,
                          e.target.value
                        )
                      }
                      disabled={
                        updatingId ===
                        consultation._id
                      }
                      className={`consultation-status-select ${
                        (
                          consultation.status ||
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

                  {/* CONTACT INFORMATION */}

                  <div className="consultation-contact-grid">

                    <a
                      href={`mailto:${consultation.email}`}
                      className="consultation-contact-item"
                    >
                      <FiMail />

                      <div>
                        <span>Email</span>

                        <strong>
                          {consultation.email}
                        </strong>
                      </div>
                    </a>

                    <a
                      href={`tel:${consultation.contactNumber}`}
                      className="consultation-contact-item"
                    >
                      <FiPhone />

                      <div>
                        <span>
                          Contact Number
                        </span>

                        <strong>
                          {
                            consultation.contactNumber
                          }
                        </strong>
                      </div>
                    </a>

                    <div className="consultation-contact-item">
                      <FiBriefcase />

                      <div>
                        <span>
                          Company
                        </span>

                        <strong>
                          {
                            consultation.companyName
                          }
                        </strong>
                      </div>
                    </div>

                  </div>

                  {/* REQUIREMENT */}

                  <div className="consultation-requirement">

                    <div className="requirement-heading">
                      <FiMessageSquare />

                      <span>
                        Requirement
                      </span>
                    </div>

                    <p>
                      {
                        consultation.requirement
                      }
                    </p>

                  </div>

                </article>
              )
            )}

          </div>
        )}

    </section>
  );
}

export default AdminConsultationManager;