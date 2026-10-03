const dns = require("dns");
const nodemailer = require("nodemailer");

try {
  dns.setDefaultResultOrder("ipv4first");
} catch (error) {
  console.error(
    "DNS configuration error:",
    error.message
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  requireTLS: true,

  tls: {
    servername: "smtp.gmail.com",
    rejectUnauthorized: false,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 60000,
});

transporter.verify((error) => {
  if (error) {
    console.error(
      "Email transporter error:",
      error.message
    );
  } else {
    console.log(
      "Email transporter is ready"
    );
  }
});

module.exports = transporter;