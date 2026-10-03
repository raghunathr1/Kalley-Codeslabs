const jwt = require("jsonwebtoken");

const authMiddleware = (
  req,
  res,
  next
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message:
          "Authentication required",
      });
    }

    if (
      !authHeader.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication format",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message:
          "Authentication token missing",
      });
    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "User authentication error:",
      error.message
    );

    return res.status(401).json({
      message:
        "Invalid or expired authentication token",
    });
  }
};

module.exports = authMiddleware;