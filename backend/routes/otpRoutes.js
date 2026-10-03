const express = require("express");

const {
  sendOTP,
  verifyOTP,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
} = require("../controllers/otpController");

const router = express.Router();

// Registration OTP
router.post("/send", sendOTP);
router.post("/verify", verifyOTP);

// Forgot Password OTP
router.post(
  "/forgot-password/send",
  sendForgotPasswordOTP
);

router.post(
  "/forgot-password/verify",
  verifyForgotPasswordOTP
);

module.exports = router;