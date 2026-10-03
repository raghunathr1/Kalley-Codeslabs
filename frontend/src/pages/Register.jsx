import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
  FiArrowLeft,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

import api from "../api/api";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  // =====================================================
  // STEP
  // 1 = NAME
  // 2 = EMAIL
  // 3 = OTP
  // 4 = PASSWORD
  // =====================================================

  const [step, setStep] = useState(1);

  // =====================================================
  // BASIC FORM DATA
  // =====================================================

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  // =====================================================
  // OTP
  // =====================================================

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [timer, setTimer] =
    useState(60);

  // =====================================================
  // REGISTRATION TOKEN
  // =====================================================

  const [
    registrationToken,
    setRegistrationToken,
  ] = useState("");

  // =====================================================
  // UI STATES
  // =====================================================

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    resendLoading,
    setResendLoading,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // =====================================================
  // OTP TIMER
  // =====================================================

  useEffect(() => {
    if (
      step !== 3 ||
      timer <= 0
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        setTimer(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearInterval(
        interval
      );
  }, [
    step,
    timer,
  ]);

  // =====================================================
  // NAME
  // =====================================================

  const handleNameSubmit = (
    e
  ) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Please enter your name."
      );
      return;
    }

    setStep(2);
  };

  // =====================================================
  // SEND REGISTRATION OTP
  // =====================================================

  const sendRegistrationOTP =
    async () => {
      if (!email.trim()) {
        setError(
          "Please enter your email address."
        );
        return false;
      }

      try {
        setLoading(true);
        setError("");

        await api.post(
          "/otp/send",
          {
            email:
              email
                .trim()
                .toLowerCase(),

            name:
              name.trim(),
          }
        );

        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        setTimer(60);

        setStep(3);

        return true;
      } catch (error) {
        console.error(
          "Send registration OTP error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );

        return false;
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // EMAIL SUBMIT
  // =====================================================

  const handleEmailSubmit =
    async (e) => {
      e.preventDefault();

      await sendRegistrationOTP();
    };

  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleOtpChange = (
    value,
    index
  ) => {
    if (
      !/^\d*$/.test(value)
    ) {
      return;
    }

    const newOtp = [
      ...otp,
    ];

    newOtp[index] =
      value.slice(-1);

    setOtp(newOtp);
    setError("");

    if (
      value &&
      index < 5
    ) {
      document
        .getElementById(
          `register-otp-${index + 1}`
        )
        ?.focus();
    }
  };

  // =====================================================
  // OTP BACKSPACE
  // =====================================================

  const handleOtpKeyDown =
    (
      e,
      index
    ) => {
      if (
        e.key ===
          "Backspace" &&
        !otp[index] &&
        index > 0
      ) {
        document
          .getElementById(
            `register-otp-${index - 1}`
          )
          ?.focus();
      }
    };

  // =====================================================
  // VERIFY REGISTRATION OTP
  // =====================================================

  const handleOtpSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      const enteredOtp =
        otp.join("");

      if (
        enteredOtp.length !==
        6
      ) {
        setError(
          "Please enter the complete 6-digit OTP."
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await api.post(
            "/otp/verify",
            {
              email:
                email
                  .trim()
                  .toLowerCase(),

              otp:
                enteredOtp,
            }
          );

        if (
          !response.data
            ?.verified ||
          !response.data
            ?.registrationToken
        ) {
          setError(
            "Email verification failed. Please try again."
          );
          return;
        }

        // Store backend verification proof
        setRegistrationToken(
          response.data
            .registrationToken
        );

        setStep(4);

        alert(
          response.data.message ||
            "Email verified successfully."
        );
      } catch (error) {
        console.error(
          "Registration OTP verification error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "OTP verification failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // RESEND OTP
  // =====================================================

  const handleResendOTP =
    async () => {
      if (
        timer > 0 ||
        resendLoading
      ) {
        return;
      }

      try {
        setResendLoading(
          true
        );

        setError("");

        await api.post(
          "/otp/send",
          {
            email:
              email
                .trim()
                .toLowerCase(),

            name:
              name.trim(),
          }
        );

        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        setTimer(60);

        document
          .getElementById(
            "register-otp-0"
          )
          ?.focus();

        alert(
          "A new OTP has been sent."
        );
      } catch (error) {
        console.error(
          "Resend registration OTP error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to resend OTP."
        );
      } finally {
        setResendLoading(
          false
        );
      }
    };

  // =====================================================
  // PASSWORD SUBMIT
  // =====================================================

  const handlePasswordSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      if (
        !registrationToken
      ) {
        setError(
          "Email verification session is missing or expired. Please verify your email again."
        );
        return;
      }

      if (
        password.length < 6
      ) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (
        password !==
        confirmPassword
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
            "/auth/register",
            {
              name:
                name.trim(),

              email:
                email
                  .trim()
                  .toLowerCase(),

              password,

              registrationToken,
            }
          );

        alert(
          response.data.message ||
            "Account created successfully."
        );

        navigate(
          "/login",
          {
            replace: true,
          }
        );
      } catch (error) {
        console.error(
          "Registration error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to create account. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // BACK BUTTON
  // =====================================================

  const handleBack = () => {
    setError("");

    if (step === 1) {
      navigate("/login");
      return;
    }

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
      return;
    }

    if (step === 4) {
      setStep(3);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="register-page">

      <div className="register-card">

        {/* ================= ICON ================= */}

        <div className="register-icon">
          {step === 3 ? (
            <FiShield />
          ) : step === 4 ? (
            <FiLock />
          ) : (
            <FiUser />
          )}
        </div>

        {/* ================= HEADER ================= */}

        <div className="register-header">

          <span className="register-label">
            CREATE ACCOUNT
          </span>

          <h1>
            {step === 1 &&
              "Let's get started."}

            {step === 2 && (
              <>
                Enter your
                <span>
                  {" "}email.
                </span>
              </>
            )}

            {step === 3 && (
              <>
                Verify your
                <span>
                  {" "}email.
                </span>
              </>
            )}

            {step === 4 && (
              <>
                Create your
                <span>
                  {" "}password.
                </span>
              </>
            )}
          </h1>

          <p>
            {step === 1 &&
              "Create your Kalley CodeLabs account to access jobs, internships and courses."}

            {step === 2 &&
              "Enter your email address. We'll send you a verification OTP."}

            {step === 3 &&
              "We've sent a 6-digit verification code to your email address."}

            {step === 4 &&
              "Your email has been verified. Now create a secure password."}
          </p>

          {step === 3 &&
            email && (
              <strong>
                {email}
              </strong>
            )}

        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* =================================================
            STEP 1 - NAME
            ================================================= */}

        {step === 1 && (
          <form
            onSubmit={
              handleNameSubmit
            }
          >

            <div className="register-form-group">

              <label htmlFor="register-name">
                Full Name
              </label>

              <div className="register-input-wrapper">

                <FiUser />

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={
                    name
                  }
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  autoComplete="name"
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="register-submit-btn"
            >
              Continue
              <FiArrowRight />
            </button>

          </form>
        )}

        {/* =================================================
            STEP 2 - EMAIL
            ================================================= */}

        {step === 2 && (
          <form
            onSubmit={
              handleEmailSubmit
            }
          >

            <div className="register-form-group">

              <label htmlFor="register-email">
                Email Address
              </label>

              <div className="register-input-wrapper">

                <FiMail />

                <input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={
                    email
                  }
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  autoComplete="email"
                  disabled={
                    loading
                  }
                  required
                />

              </div>

            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={
                loading
              }
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}

              {!loading && (
                <FiArrowRight />
              )}
            </button>

          </form>
        )}

        {/* =================================================
            STEP 3 - OTP
            ================================================= */}

        {step === 3 && (
          <form
            onSubmit={
              handleOtpSubmit
            }
          >

            <div className="register-otp-inputs">

              {otp.map(
                (
                  value,
                  index
                ) => (
                  <input
                    key={index}
                    id={`register-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={
                      value
                    }
                    onChange={(e) =>
                      handleOtpChange(
                        e.target.value,
                        index
                      )
                    }
                    onKeyDown={(e) =>
                      handleOtpKeyDown(
                        e,
                        index
                      )
                    }
                    autoComplete={
                      index ===
                      0
                        ? "one-time-code"
                        : "off"
                    }
                    disabled={
                      loading
                    }
                  />
                )
              )}

            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={
                loading
              }
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}

              {!loading && (
                <FiArrowRight />
              )}
            </button>

            <div className="register-resend">

              {timer >
              0 ? (
                <p>
                  Resend OTP in{" "}
                  <strong>
                    00:
                    {String(
                      timer
                    ).padStart(
                      2,
                      "0"
                    )}
                  </strong>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleResendOTP
                  }
                  disabled={
                    resendLoading
                  }
                >
                  <FiRefreshCw />

                  {resendLoading
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}

            </div>

          </form>
        )}

        {/* =================================================
            STEP 4 - PASSWORD
            ================================================= */}

        {step === 4 && (
          <form
            onSubmit={
              handlePasswordSubmit
            }
          >

            {/* NEW PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="register-input-wrapper">

                <FiLock />

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={
                    password
                  }
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                  disabled={
                    loading
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                  disabled={
                    loading
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

            {/* CONFIRM PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="register-confirm-password">
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <FiLock />

                <input
                  id="register-confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                  disabled={
                    loading
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                  disabled={
                    loading
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>

              </div>

            </div>

            <div className="register-password-rules">

              <div>
                <span>
                  ✓
                </span>

                Minimum 6 characters
              </div>

              <div>
                <span>
                  ✓
                </span>

                Use a strong password
              </div>

            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={
                loading
              }
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <FiArrowRight />
              )}
            </button>

          </form>
        )}

        {/* ================= BACK ================= */}

        <button
          type="button"
          className="register-back-btn"
          onClick={
            handleBack
          }
          disabled={
            loading
          }
        >
          <FiArrowLeft />

          {step === 1
            ? "Back to Login"
            : "Back"}
        </button>

        {/* ================= LOGIN ================= */}

        {step === 1 && (
          <p className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>
        )}

      </div>

    </div>
  );
}

export default Register;