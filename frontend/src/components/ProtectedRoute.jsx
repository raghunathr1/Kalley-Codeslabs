import {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
} from "react-router-dom";

import api from "../api/api";

function ProtectedRoute({
  children,
}) {
  const [checking, setChecking] =
    useState(true);

  const [authenticated, setAuthenticated] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAuthentication =
      async () => {
        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          if (isMounted) {
            setAuthenticated(false);
            setChecking(false);
          }

          return;
        }

        try {
          await api.get(
            "/auth/verify-token",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          if (isMounted) {
            setAuthenticated(true);
          }
        } catch (error) {
          console.error(
            "Authentication verification failed:",
            error
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          if (isMounted) {
            setAuthenticated(false);
          }
        } finally {
          if (isMounted) {
            setChecking(false);
          }
        }
      };

    verifyAuthentication();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // CHECKING AUTH
  // =========================

  if (checking) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          color: "#697386",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // =========================
  // NOT AUTHENTICATED
  // =========================

  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =========================
  // AUTHENTICATED
  // =========================

  return children;
}

export default ProtectedRoute;