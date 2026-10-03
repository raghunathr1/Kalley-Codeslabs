const jwt = require("jsonwebtoken");
const transporter = require("../config/email");

const User = require("../models/User");

// =====================================================
// TEMPORARY OTP STORAGE
// =====================================================

const otpStore = new Map();

// =====================================================
// SEND REGISTRATION OTP
// =====================================================

const sendOTP = async (req, res) => {
  try {
    const {
      email,
      name,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        message:
          "Email is required",
      });
    }

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();

    const otp =
      Math.floor(
        100000 +
          Math.random() *
            900000
      ).toString();

    const expiresAt =
      Date.now() +
      10 * 60 * 1000;

    otpStore.set(
      `register:${normalizedEmail}`,
      {
        otp,
        expiresAt,
        name: name || "",
      }
    );

    await transporter.sendMail({
      from:
        `"Kalley Codeslabs Verify" <${process.env.EMAIL_USER}>`,

      to: normalizedEmail,

      subject:
        "Verify your email - Kalley Codeslabs",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="
            color: #172033;
          ">
            Verify your email
          </h2>

          <p>
            Hello ${name || "User"},
          </p>

          <p>
            Your OTP for email verification is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 20px;
            background: #f4f6f8;
            text-align: center;
            border-radius: 10px;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in
            10 minutes.
          </p>

          <p>
            If you did not request this
            verification code, you can
            safely ignore this email.
          </p>

          <p>
            Regards,<br />
            Kalley CodeLabs
          </p>

        </div>
      `,
    });

    console.log(
      `Registration OTP sent successfully to ${normalizedEmail}`
    );

    return res.status(200).json({
      message:
        "OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "Registration OTP sending error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to send OTP",
    });
  }
};

// =====================================================
// VERIFY REGISTRATION OTP
// =====================================================

const verifyOTP = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (
      !email ||
      !otp
    ) {
      return res.status(400).json({
        message:
          "Email and OTP are required",
      });
    }

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();

    const storeKey =
      `register:${normalizedEmail}`;

    const storedData =
      otpStore.get(storeKey);

    if (!storedData) {
      return res.status(400).json({
        message:
          "OTP not found or expired",
      });
    }

    if (
      Date.now() >
      storedData.expiresAt
    ) {
      otpStore.delete(storeKey);

      return res.status(400).json({
        message:
          "OTP has expired",
      });
    }

    if (
      storedData.otp !==
      otp.toString()
    ) {
      return res.status(400).json({
        message:
          "Invalid OTP",
      });
    }

    // OTP has been successfully verified
    otpStore.delete(storeKey);

    // Generate short-lived registration token
    const registrationToken =
      jwt.sign(
        {
          email:
            normalizedEmail,

          purpose:
            "email-registration",
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "10m",
        }
      );

    return res.status(200).json({
      message:
        "Email verified successfully",

      verified: true,

      registrationToken,
    });
  } catch (error) {
    console.error(
      "Registration OTP verification error:",
      error
    );

    return res.status(500).json({
      message:
        "OTP verification failed",
    });
  }
};

// =====================================================
// SEND FORGOT PASSWORD OTP
// =====================================================

const sendForgotPasswordOTP =
  async (req, res) => {
    try {
      const {
        email,
      } = req.body;

      if (!email) {
        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const user =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (!user) {
        return res.status(404).json({
          message:
            "No account found with this email",
        });
      }

      if (
        !user.emailVerified
      ) {
        return res.status(403).json({
          message:
            "Please verify your email first",
        });
      }

      const otp =
        Math.floor(
          100000 +
            Math.random() *
              900000
        ).toString();

      const expiresAt =
        Date.now() +
        10 * 60 * 1000;

      otpStore.set(
        `forgot-password:${normalizedEmail}`,
        {
          otp,
          expiresAt,
        }
      );

      await transporter.sendMail({
        from:
          `"Kalley Codeslabs Security" <${process.env.EMAIL_USER}>`,

        to: normalizedEmail,

        subject:
          "Password Reset OTP - Kalley Codeslabs",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
          ">

            <h2 style="
              color: #172033;
            ">
              Password Reset Request
            </h2>

            <p>
              We received a request to
              reset your Kalley CodeLabs
              account password.
            </p>

            <p>
              Your password reset OTP is:
            </p>

            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              padding: 20px;
              background: #f4f6f8;
              text-align: center;
              border-radius: 10px;
            ">
              ${otp}
            </div>

            <p>
              This OTP will expire in
              10 minutes.
            </p>

            <p>
              Do not share this OTP with
              anyone.
            </p>

            <p>
              If you did not request a
              password reset, please
              ignore this email.
            </p>

            <p>
              Regards,<br />
              Kalley CodeLabs
            </p>

          </div>
        `,
      });

      console.log(
        `Password reset OTP sent successfully to ${normalizedEmail}`
      );

      return res.status(200).json({
        message:
          "Password reset OTP sent successfully",
      });
    } catch (error) {
      console.error(
        "Forgot password OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to send password reset OTP",
      });
    }
  };

// =====================================================
// VERIFY FORGOT PASSWORD OTP
// =====================================================

const verifyForgotPasswordOTP =
  (req, res) => {
    try {
      const {
        email,
        otp,
      } = req.body;

      if (
        !email ||
        !otp
      ) {
        return res.status(400).json({
          message:
            "Email and OTP are required",
        });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      const storeKey =
        `forgot-password:${normalizedEmail}`;

      const storedData =
        otpStore.get(storeKey);

      if (!storedData) {
        return res.status(400).json({
          message:
            "OTP not found or expired",
        });
      }

      if (
        Date.now() >
        storedData.expiresAt
      ) {
        otpStore.delete(
          storeKey
        );

        return res.status(400).json({
          message:
            "OTP has expired",
        });
      }

      if (
        storedData.otp !==
        otp.toString()
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      otpStore.delete(
        storeKey
      );

      const resetToken =
        jwt.sign(
          {
            email:
              normalizedEmail,

            purpose:
              "password-reset",
          },

          process.env.JWT_SECRET,

          {
            expiresIn:
              "10m",
          }
        );

      return res.status(200).json({
        message:
          "OTP verified successfully",

        verified: true,

        resetToken,
      });
    } catch (error) {
      console.error(
        "Forgot password OTP verification error:",
        error
      );

      return res.status(500).json({
        message:
          "OTP verification failed",
      });
    }
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendOTP,
  verifyOTP,
  sendForgotPasswordOTP,
  verifyForgotPasswordOTP,
};