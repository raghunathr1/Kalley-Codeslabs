const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// =========================
// LOAD ENVIRONMENT VARIABLES
// =========================

dotenv.config();

// =========================
// CREATE EXPRESS APP
// =========================

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());

// =========================
// DATABASE CONNECTION
// =========================

connectDB();

// =========================
// IMPORT ROUTES
// =========================

const otpRoutes = require("./routes/otpRoutes");
const authRoutes = require("./routes/authRoutes");
const courseEnquiryRoutes = require("./routes/courseEnquiryRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

const adminRoutes = require("./routes/adminRoutes");

const jobRoutes = require("./routes/jobRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const courseRoutes = require("./routes/courseRoutes");

// =========================
// ROOT ROUTE
// =========================

app.get("/", (req, res) => {
  res.status(200).send(
    "Kalley CodeLabs Backend Running"
  );
});

// =========================
// API ROUTES
// =========================

// OTP
app.use("/api/otp", otpRoutes);

// USER AUTH
app.use("/api/auth", authRoutes);

// COURSE ENQUIRIES
app.use(
  "/api/course-enquiries",
  courseEnquiryRoutes
);

// CONSULTATIONS
app.use(
  "/api/consultations",
  consultationRoutes
);

// ADMIN
app.use("/api/admin", adminRoutes);

// JOBS
app.use("/api/jobs", jobRoutes);

// INTERNSHIPS
app.use(
  "/api/internships",
  internshipRoutes
);

// COURSES
app.use("/api/courses", courseRoutes);

// =========================
// 404 ROUTE
// =========================

app.use((req, res) => {
  return res.status(404).json({
    message: "API route not found",
  });
});

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use((error, req, res, next) => {
  console.error(
    "Unhandled server error:",
    error
  );

  return res.status(500).json({
    message: "Internal server error",
  });
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);