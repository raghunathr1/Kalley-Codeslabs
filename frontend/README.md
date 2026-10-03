# Kalley CodeLabs

A modern full-stack startup and technology platform built for AI solutions, web development, custom software, IT consulting, jobs, internships, and placement courses.

Kalley CodeLabs is developed using React, Node.js, Express, MongoDB, JWT authentication, email OTP verification, Brevo transactional email API, Vercel, and Render.

---

## 🌐 Live Website

**Frontend:**  
https://kalley-codeslabs.vercel.app

**Backend API:**  
https://kalley-codeslabs.onrender.com

**GitHub Repository:**  
https://github.com/raghunathr1/Kalley-Codeslabs

---

## 🚀 Features

### Home Website
- Modern responsive landing page
- AI Solutions and Web Solutions section
- Get Started consultation form
- Give a Task functionality
- Services section with interactive flip cards
- Responsive navigation
- Support contact details
- Responsive footer

### Student / Job Vacancy
- Student dashboard
- Jobs listing
- Internship listing
- Placement courses
- Search functionality
- Job details page
- Internship details page
- Course details page

### Authentication
- User registration
- Email OTP verification
- User login
- JWT authentication
- Forgot password
- Forgot password OTP verification
- Password reset
- Protected routes

### Jobs
- Job creation through admin dashboard
- Role
- Company
- Required skills
- Salary
- Education
- Responsibilities
- Location
- Number of openings
- Experience
- About role
- Expiry date
- Published / Expired status

### Internships
- Internship creation through admin dashboard
- Role
- Company
- Required skills
- Stipend
- Duration
- Education
- Responsibilities
- Location
- Number of openings
- Experience
- Expiry date
- Published / Expired status

### Placement Courses
- Course creation through admin dashboard
- Course name
- Duration
- Location
- Description
- Skills
- Highlights
- Course details
- Course enquiry form

### Admin
- Admin login
- Admin dashboard
- Add jobs
- Edit jobs
- Delete jobs
- Add internships
- Edit internships
- Delete internships
- Add courses
- Edit courses
- Delete courses
- View consultation enquiries
- Update consultation status
- View course enquiries
- Update course enquiry status

### Email
- Registration OTP
- Forgot password OTP
- Brevo transactional email API
- Verified sender email

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Framer Motion
- React Icons
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Brevo Email API
- CORS
- dotenv

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Email: Brevo

---

## 📁 Project Structure

```text
Kalley-Codeslabs/
│
├── frontend/
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ServiceCard.jsx
│   │   │   ├── ConsultationForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Student.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Jobs.jsx
│   │   │   ├── JobDetails.jsx
│   │   │   ├── Internships.jsx
│   │   │   ├── InternshipDetails.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vercel.json
│   └── ...
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── email.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── otpController.js
│   │   ├── jobController.js
│   │   ├── internshipController.js
│   │   ├── courseController.js
│   │   ├── consultationController.js
│   │   ├── courseEnquiryController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Internship.js
│   │   ├── Course.js
│   │   ├── Consultation.js
│   │   └── CourseEnquiry.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── otpRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── internshipRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── consultationRoutes.js
│   │   ├── courseEnquiryRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md

```

---

## 💻 Run Project Locally

### 1. Clone Repository

```bash
git clone https://github.com/raghunathr1/Kalley-Codeslabs.git
```

Move into the project:

```bash
cd Kalley-Codeslabs
```

---

# 🔧 Backend Setup

Open a terminal and:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

### Backend Environment Variables

Create:

`backend/.env`

Add your own values:

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
ADMIN_JWT_SECRET=your_admin_jwt_secret

BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_verified_sender_email
BREVO_SENDER_NAME=Kalley CodeLabs
```

Never commit `.env` files or secret keys to GitHub.

Start backend in development:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

Backend will run locally at:

`http://localhost:5000`

Test root API:

`http://localhost:5000`

Expected response:

`Kalley CodeLabs Backend Running`

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

`frontend/.env`

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend will normally run at:

`http://localhost:5173`

---

## 🏗️ Production Build

From the frontend directory:

```bash
npm run build
```

Vite will generate the production build inside:

`frontend/dist`

---

## 🔐 Environment Variables

### Backend

The backend requires:

- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_JWT_SECRET`
- `BREVO_API_KEY`
- `EMAIL_USER`
- `BREVO_SENDER_NAME`

### Frontend

The frontend requires:

- `VITE_API_URL`

For local development:

`http://localhost:5000/api`

For production:

`https://kalley-codeslabs.onrender.com/api`

---

## ☁️ Deployment

### Frontend — Vercel

Frontend is deployed on Vercel.

Live URL:

https://kalley-codeslabs.vercel.app

Vercel Root Directory:

`frontend`

Build Command:

`npm run build`

Output Directory:

`dist`

Production Environment Variable:

`VITE_API_URL=https://kalley-codeslabs.onrender.com/api`

---

### Backend — Render

Backend is deployed on Render.

Live URL:

https://kalley-codeslabs.onrender.com

Render Root Directory:

`backend`

Build Command:

`npm install`

Start Command:

`npm start`

---

## 🗄️ Database

MongoDB Atlas is used for storing:

- Users
- Jobs
- Internships
- Courses
- Consultations
- Course enquiries

---

## 📧 Email Service

Brevo transactional email API is used for:

- Registration OTP
- Forgot password OTP

The verified sender email is configured in Brevo and the API key is stored securely in environment variables.

---

## 🔒 Security

- JWT authentication
- Password hashing using bcryptjs
- Protected user routes
- Protected admin routes
- Environment variables for secrets
- OTP verification
- Expired job and internship handling
- Sensitive credentials excluded from Git

---

## 📞 Support

**Email:**  
gktech870@gmail.com

**Phone:**  
+91 9423031883

---

## 🔗 Project Links

**Live Website:**  
https://kalley-codeslabs.vercel.app

**Backend API:**  
https://kalley-codeslabs.onrender.com

**GitHub:**  
https://github.com/raghunathr1/Kalley-Codeslabs

---

## 👨‍💻 Developed By

**Kalley CodeLabs**

Building modern web applications, custom software solutions, and AI-powered digital experiences.

---

## 📄 License

This project is created for Kalley CodeLabs.