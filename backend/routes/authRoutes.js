const express = require("express");

const {
  registerUser,
  loginUser,
  resetPassword,
  verifyToken,
} = require(
  "../controllers/authController"
);

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const router =
  express.Router();

// =========================
// REGISTER
// =========================

router.post(
  "/register",
  registerUser
);

// =========================
// LOGIN
// =========================

router.post(
  "/login",
  loginUser
);

// =========================
// RESET PASSWORD
// =========================

router.post(
  "/reset-password",
  resetPassword
);

// =========================
// VERIFY JWT TOKEN
// =========================

router.get(
  "/verify-token",
  authMiddleware,
  verifyToken
);

module.exports = router;