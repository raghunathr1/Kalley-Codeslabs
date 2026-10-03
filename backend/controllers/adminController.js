const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      email.trim().toLowerCase() !==
        adminEmail.trim().toLowerCase() ||
      password !== adminPassword
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: adminEmail,
      },
      process.env.ADMIN_JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        email: adminEmail,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Admin login failed",
    });
  }
};

module.exports = {
  adminLogin,
};