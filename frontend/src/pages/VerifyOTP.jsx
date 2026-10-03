import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";

import api from "../api/api";

import "./VerifyOTP.css";

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const purpose =
    location.state?.purpose || "forgot-password";

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] =
    useState(false);
  const [error, setError] = useState("");

  /* ================= TIMER ================= */

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer(
        (previous) => previous - 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ================= OTP CHANGE ================= */

  const handleOtpChange = (
    value,
    index
  ) => {
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      document
        .getElementById(
          `otp-${index + 1}`
        )
        ?.focus();
    }
  };

  /* ================= BACKSPACE ================= */

  const handleKeyDown = (
    e,
    index
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      document
        .getElementById(
          `otp-${index - 1}`
        )
        ?.focus();
    }
  };

  /* ================= VERIFY OTP ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const enteredOtp = otp.join("");

    if (!email) {
      setError(
        "Email information is missing. Please start again."
      );
      return;
    }

    if (enteredOtp.length !== 6) {
      setError(
        "Please enter the complete 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      let response;

      /* =================
         FORGOT PASSWORD
      ================= */

      if (
        purpose ===
        "forgot-password"
      ) {
        response = await api.post(
          "/otp/forgot-password/verify",
          {
            email:
              email
                .trim()
                .toLowerCase(),
            otp: enteredOtp,
          }
        );

        alert(
          response.data.message ||
            "OTP verified successfully"
        );

        navigate(
          "/reset-password",
          {
            state: {
              email:
                email
                  .trim()
                  .toLowerCase(),

              purpose:
                "forgot-password",

              resetToken:
                response.data
                  .resetToken,
            },
          }
        );

        return;
      }

      /* =================
         REGISTRATION
      ================= */

      response = await api.post(
        "/otp/verify",
        {
          email:
            email
              .trim()
              .toLowerCase(),
          otp: enteredOtp,
        }
      );

      alert(
        response.data.message ||
          "Email verified successfully"
      );

      navigate("/register", {
        state: {
          email:
            email
              .trim()
              .toLowerCase(),

          purpose: "register",

          verified: true,
        },
      });
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND OTP ================= */

  const handleResend = async () => {
    if (
      timer > 0 ||
      resendLoading
    ) {
      return;
    }

    if (!email) {
      setError(
        "Email information is missing. Please start again."
      );
      return;
    }

    try {
      setError("");
      setResendLoading(true);

      if (
        purpose ===
        "forgot-password"
      ) {
        await api.post(
          "/otp/forgot-password/send",
          {
            email:
              email
                .trim()
                .toLowerCase(),
          }
        );
      } else {
        await api.post(
          "/otp/send",
          {
            email:
              email
                .trim()
                .toLowerCase(),
          }
        );
      }

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
          "otp-0"
        )
        ?.focus();

      alert(
        "A new OTP has been sent."
      );
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  /* ================= DISPLAY EMAIL ================= */

  const displayEmail =
    email ||
    "your registered email";

  return (
    <div className="otp-page">

      <div className="otp-card">

        {/* ================= ICON ================= */}

        <div className="otp-icon">
          <FiShield />
        </div>

        {/* ================= HEADER ================= */}

        <div className="otp-header">

          <span className="otp-label">
            VERIFY YOUR EMAIL
          </span>

          <h1>
            Enter your
            <span> OTP.</span>
          </h1>

          <p>
            We've sent a 6-digit
            verification code to
          </p>

          <strong>
            {displayEmail}
          </strong>

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="otp-inputs">

            {otp.map(
              (
                value,
                index
              ) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={value}
                  onChange={(
                    e
                  ) =>
                    handleOtpChange(
                      e.target.value,
                      index
                    )
                  }
                  onKeyDown={(
                    e
                  ) =>
                    handleKeyDown(
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
                  aria-label={`OTP digit ${
                    index + 1
                  }`}
                />
              )
            )}

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="otp-error">
              {error}
            </div>
          )}

          {/* ================= VERIFY BUTTON ================= */}

          <button
            type="submit"
            className="otp-verify-btn"
            disabled={
              loading
            }
          >
            {loading ? (
              <>
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <FiArrowRight />
              </>
            )}
          </button>

        </form>

        {/* ================= TIMER ================= */}

        <div className="otp-resend">

          {timer > 0 ? (
            <p>
              Resend OTP{" "}
              in{" "}
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
                handleResend
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

        {/* ================= BACK ================= */}

        <Link
          to="/forgot-password"
          className="otp-back-link"
        >
          <FiArrowLeft />
          Change Email
        </Link>

      </div>

    </div>
  );
}

export default VerifyOTP;