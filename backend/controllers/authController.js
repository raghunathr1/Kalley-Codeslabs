const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================================================
// REGISTER USER
// =====================================================

const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      registrationToken,
    } = req.body;

    // -------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------

    if (
      !name ||
      !email ||
      !password ||
      !registrationToken
    ) {
      return res.status(400).json({
        message:
          "Name, email, password and email verification are required",
      });
    }

    if (
      password.length < 6
    ) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email
        .toLowerCase()
        .trim();

    // -------------------------------------------------
    // VERIFY REGISTRATION TOKEN
    // -------------------------------------------------

    let decoded;

    try {
      decoded =
        jwt.verify(
          registrationToken,
          process.env.JWT_SECRET
        );
    } catch (error) {
      return res.status(401).json({
        message:
          "Email verification has expired. Please verify your email again.",
      });
    }

    // -------------------------------------------------
    // CHECK TOKEN PURPOSE
    // -------------------------------------------------

    if (
      decoded.purpose !==
      "email-registration"
    ) {
      return res.status(401).json({
        message:
          "Invalid email verification token",
      });
    }

    // -------------------------------------------------
    // TOKEN EMAIL MUST MATCH FORM EMAIL
    // -------------------------------------------------

    if (
      decoded.email !==
      normalizedEmail
    ) {
      return res.status(401).json({
        message:
          "Email verification does not match this account",
      });
    }

    // -------------------------------------------------
    // CHECK EXISTING USER
    // -------------------------------------------------

    const existingUser =
      await User.findOne({
        email:
          normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    const user =
      await User.create({
        name:
          name.trim(),

        email:
          normalizedEmail,

        password:
          hashedPassword,

        // This is now safe because
        // registrationToken was verified
        emailVerified:
          true,
      });

    return res.status(201).json({
      message:
        "Account created successfully",

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,
      },
    });
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create account",
    });
  }
};

// =====================================================
// LOGIN USER
// =====================================================

const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email and password are required",
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
      return res.status(401).json({
        message:
          "Invalid email or password",
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

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (
      !isPasswordCorrect
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    const token =
      jwt.sign(
        {
          userId:
            user._id.toString(),

          email:
            user.email,
        },

        process.env.JWT_SECRET,

        {
          expiresIn:
            "7d",
        }
      );

    return res.status(200).json({
      message:
        "Login successful",

      token,

      user: {
        id:
          user._id,

        name:
          user.name,

        email:
          user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message:
        "Login failed",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword =
  async (
    req,
    res
  ) => {
    try {
      const {
        resetToken,
        newPassword,
      } = req.body;

      if (
        !resetToken ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "Reset token and new password are required",
        });
      }

      if (
        newPassword.length < 6
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters",
        });
      }

      let decoded;

      try {
        decoded =
          jwt.verify(
            resetToken,
            process.env.JWT_SECRET
          );
      } catch (error) {
        return res.status(401).json({
          message:
            "Reset token is invalid or expired",
        });
      }

      if (
        !decoded.email ||
        decoded.purpose !==
          "password-reset"
      ) {
        return res.status(401).json({
          message:
            "Invalid password reset token",
        });
      }

      const user =
        await User.findOne({
          email:
            decoded.email,
        });

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      user.password =
        hashedPassword;

      await user.save();

      return res.status(200).json({
        message:
          "Password reset successfully",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to reset password",
      });
    }
  };

// =====================================================
// VERIFY CURRENT JWT
// =====================================================

const verifyToken =
  async (
    req,
    res
  ) => {
    try {
      const user =
        await User.findById(
          req.user.userId
        ).select(
          "_id name email emailVerified"
        );

      if (!user) {
        return res.status(401).json({
          message:
            "User account not found",
        });
      }

      if (
        !user.emailVerified
      ) {
        return res.status(403).json({
          message:
            "Email is not verified",
        });
      }

      return res.status(200).json({
        valid: true,

        user: {
          id:
            user._id,

          name:
            user.name,

          email:
            user.email,
        },
      });
    } catch (error) {
      console.error(
        "Verify token error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to verify authentication",
      });
    }
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
  verifyToken,
};