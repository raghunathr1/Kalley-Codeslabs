import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMail,
  FiArrowRight,
  FiArrowLeft,
  FiLock,
} from "react-icons/fi";

import api from "../api/api";

import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const normalizedEmail =
      email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/otp/forgot-password/send",
        {
          email: normalizedEmail,
        }
      );

      alert(
        response.data.message ||
          "OTP sent successfully"
      );

      navigate("/verify-otp", {
        state: {
          email: normalizedEmail,
          purpose: "forgot-password",
        },
      });
    } catch (error) {
      console.error(
        "Forgot password OTP error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">

        {/* ================= ICON ================= */}

        <div className="forgot-icon">
          <FiLock />
        </div>

        {/* ================= HEADER ================= */}

        <div className="forgot-header">

          <span className="forgot-label">
            ACCOUNT RECOVERY
          </span>

          <h1>
            Forgot your
            <span> password?</span>
          </h1>

          <p>
            Don't worry. Enter your registered email
            address and we'll send you an OTP to reset
            your password.
          </p>

        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit}>

          <div className="forgot-form-group">

            <label htmlFor="forgot-email">
              Email Address
            </label>

            <div className="forgot-input-wrapper">

              <FiMail />

              <input
                id="forgot-email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="forgot-error">
              {error}
            </div>
          )}

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="forgot-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <FiArrowRight />
              </>
            )}
          </button>

        </form>

        {/* ================= BACK TO LOGIN ================= */}

        <Link
          to="/login"
          className="back-login-link"
        >
          <FiArrowLeft />
          Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ForgotPassword;