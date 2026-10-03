import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

import api from "../api/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // =========================
  // LOGIN
  // =========================

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      setError("");

      const normalizedEmail =
        email.trim().toLowerCase();

      if (
        !normalizedEmail ||
        !password
      ) {
        setError(
          "Please enter your email and password."
        );
        return;
      }

      try {
        setLoading(true);

        const response =
          await api.post(
            "/auth/login",
            {
              email:
                normalizedEmail,
              password,
            }
          );

        const token =
          response.data?.token;

        const user =
          response.data?.user;

        if (!token) {
          setError(
            "Login successful, but authentication token was not received."
          );
          return;
        }

        // =========================
        // SAVE LOGIN SESSION
        // =========================

        localStorage.setItem(
          "token",
          token
        );

        if (user) {
          localStorage.setItem(
            "user",
            JSON.stringify(
              user
            )
          );
        }

        // =========================
        // GO TO STUDENT PAGE
        // =========================

        navigate(
          "/student"
        );
      } catch (err) {
        console.error(
          "Login error:",
          err
        );

        setError(
          err.response?.data
            ?.message ||
            "Login failed. Please check your credentials."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* =========================
            LEFT INFORMATION SECTION
            ========================= */}

        <div className="login-info">

          <div className="login-label">
            KALLEY CODELABS
          </div>

          <h1>
            Welcome
            <br />
            <span>
              Back.
            </span>
          </h1>

          <p>
            Sign in to your
            Kalley CodeLabs
            account and
            continue exploring
            jobs, internships
            and placement
            courses.
          </p>

          <div className="login-features">

            <div>
              <span>
                <FiCheck />
              </span>

              Explore latest
              job opportunities
            </div>

            <div>
              <span>
                <FiCheck />
              </span>

              Discover
              internships
            </div>

            <div>
              <span>
                <FiCheck />
              </span>

              Access placement
              courses
            </div>

          </div>

        </div>

        {/* =========================
            RIGHT LOGIN FORM
            ========================= */}

        <div className="login-form-container">

          <div className="login-form-header">

            <h2>
              Sign in
            </h2>

            <p>
              Enter your account
              details below.
            </p>

          </div>

          {/* =========================
              ERROR
              ========================= */}

          {error && (
            <div
              style={{
                marginBottom:
                  "18px",
                padding:
                  "11px 13px",
                borderRadius:
                  "10px",
                background:
                  "#fff1f2",
                border:
                  "1px solid #fecdd3",
                color:
                  "#be123c",
                fontSize:
                  "13px",
                lineHeight:
                  "1.5",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* =========================
                EMAIL
                ========================= */}

            <div className="login-form-group">

              <label htmlFor="login-email">
                Email Address
              </label>

              <div className="login-input-wrapper">

                <FiMail />

                <input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={
                    email
                  }
                  autoComplete="email"
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  disabled={
                    loading
                  }
                  required
                />

              </div>

            </div>

            {/* =========================
                PASSWORD
                ========================= */}

            <div className="login-form-group">

              <div className="password-label">

                <label htmlFor="login-password">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>

              </div>

              <div className="login-input-wrapper">

                <FiLock />

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={
                    password
                  }
                  autoComplete="current-password"
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
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
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
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

            {/* =========================
                LOGIN BUTTON
                ========================= */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={
                loading
              }
            >

              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <FiArrowRight />
                </>
              )}

            </button>

          </form>

          {/* =========================
              REGISTER
              ========================= */}

          <div className="login-register">

            <span>
              Don't have an
              account?
            </span>

            <Link
              to="/register"
            >
              Create Account
              <FiArrowRight />
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;