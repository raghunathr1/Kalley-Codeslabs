import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

import api from "../api/api";

import "./ResetPassword.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email =
    location.state?.email || "";

  const resetToken =
    location.state?.resetToken || "";

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      password: "",
      confirmPassword: "",
    });

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData(
      (previousData) => ({
        ...previousData,
        [name]: value,
      })
    );

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!resetToken) {
      setError(
        "Password reset session is missing or expired. Please request a new OTP."
      );
      return;
    }

    if (
      formData.password.length < 6
    ) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post(
          "/auth/reset-password",
          {
            resetToken,
            newPassword:
              formData.password,
          }
        );

      alert(
        response.data.message ||
          "Password reset successfully."
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">

      <div className="reset-card">

        {/* ================= ICON ================= */}

        <div className="reset-icon">
          <FiCheckCircle />
        </div>

        {/* ================= HEADER ================= */}

        <div className="reset-header">

          <span className="reset-label">
            PASSWORD RESET
          </span>

          <h1>
            Create a new
            <span> password.</span>
          </h1>

          <p>
            Your OTP has been verified.
            Create a new password for your
            account.
          </p>

          {email && (
            <div className="reset-email">
              {email}
            </div>
          )}

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
        >

          {/* NEW PASSWORD */}

          <div className="reset-form-group">

            <label htmlFor="new-password">
              New Password
            </label>

            <div className="reset-input-wrapper">

              <FiLock />

              <input
                id="new-password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter new password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                autoComplete="new-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label="Toggle password visibility"
                disabled={loading}
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="reset-form-group">

            <label htmlFor="confirm-password">
              Confirm New Password
            </label>

            <div className="reset-input-wrapper">

              <FiLock />

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm new password"
                value={
                  formData.confirmPassword
                }
                onChange={
                  handleChange
                }
                autoComplete="new-password"
                disabled={loading}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) =>
                      !previous
                  )
                }
                aria-label="Toggle confirm password visibility"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>

            </div>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="reset-error">
              {error}
            </div>
          )}

          {/* PASSWORD RULES */}

          <div className="password-rules">

            <div>
              <span>✓</span>
              Minimum 6 characters
            </div>

            <div>
              <span>✓</span>
              Use a strong password
            </div>

          </div>

          {/* RESET BUTTON */}

          <button
            type="submit"
            className="reset-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                Resetting...
              </>
            ) : (
              <>
                Reset Password
                <FiArrowRight />
              </>
            )}
          </button>

        </form>

        {/* LOGIN */}

        <Link
          to="/login"
          className="reset-login-link"
        >
          Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ResetPassword;