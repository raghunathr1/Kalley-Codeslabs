import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import StudentFooter from "../components/StudentFooter";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiSend,
  FiBookOpen,
  FiCheck,
} from "react-icons/fi";
import "./CourseDetails.css";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    query: "",
  });


  // =========================
  // FETCH COURSE
  // =========================

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:5000/api/courses/${id}`
      );

      setCourse(response.data.course);
    } catch (error) {
      console.error(
        "Fetch course details error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load course details."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // FORM HANDLER
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =========================
  // ENQUIRY SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim()
    ) {
      alert(
        "Please fill all required fields."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/course-enquiries",
        {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          email:
            formData.email
              .trim()
              .toLowerCase(),
          course: course.name,
          query: formData.query.trim(),
        }
      );

      alert(
        response.data.message
      );

      setSubmitted(true);

      setFormData({
        name: "",
        mobile: "",
        email: "",
        query: "",
      });
    } catch (error) {
      console.error(
        "Course enquiry error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit enquiry. Please try again."
      );
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="course-details-state">

        <FiBookOpen />

        <h2>
          Loading course details...
        </h2>

        <p>
          Please wait while we fetch
          the latest course information.
        </p>

      </div>
    );
  }


  // =========================
  // ERROR / NOT FOUND
  // =========================

  if (error || !course) {
    return (
      <div className="course-details-state">

        <FiBookOpen />

        <h1>
          Course Not Found
        </h1>

        <p>
          {error ||
            "The course you are looking for does not exist."}
        </p>

        <Link to="/courses">
          <FiArrowLeft />
          Back to Courses
        </Link>

      </div>
    );
  }


  return (
    <div className="course-details-page">

      {/* =========================
          HEADER
          ========================= */}

      <header className="course-details-header">

        <div className="course-details-header-container">

          <Link
            to="/courses"
            className="course-details-back-btn"
          >
            <FiArrowLeft />

            <span>
              All Courses
            </span>
          </Link>


          <div className="course-details-heading">

            <div className="course-details-icon">
              <FiBookOpen />
            </div>


            <div>

              <span>
                {course.status ===
                "Published"
                  ? "PLACEMENT COURSE"
                  : "COURSE"}
              </span>

              <h1>
                {course.name}
              </h1>

              <p>
                {course.description}
              </p>

            </div>

          </div>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
          ========================= */}

      <main className="course-details-content">

        <div className="course-details-layout">


          {/* =========================
              LEFT SIDE
              ========================= */}

          <section className="course-details-main">

            {/* COURSE INFO */}

            <div className="course-info-row">

              <div className="course-info-item">

                <FiClock />

                <div>

                  <span>
                    Duration
                  </span>

                  <strong>
                    {course.duration}
                  </strong>

                </div>

              </div>


              <div className="course-info-item">

                <FiMapPin />

                <div>

                  <span>
                    Location
                  </span>

                  <strong>
                    {course.location}
                  </strong>

                </div>

              </div>


              <div className="course-info-item">

                <FiBookOpen />

                <div>

                  <span>
                    Program
                  </span>

                  <strong>
                    Training &amp;
                    Internship
                  </strong>

                </div>

              </div>

            </div>


            {/* =========================
                ABOUT
                ========================= */}

            <div className="course-detail-section">

              <span className="section-label">
                ABOUT THE COURSE
              </span>

              <h2>
                Build practical skills.
                <strong>
                  {" "}Build your career.
                </strong>
              </h2>

              <p>
                {course.description}
              </p>

              <p>
                This program focuses on
                practical learning,
                hands-on development,
                real-world projects and
                industry-oriented training.
              </p>

            </div>


            {/* =========================
                COURSE HIGHLIGHTS
                ========================= */}

            <div className="course-detail-section">

              <span className="section-label">
                COURSE HIGHLIGHTS
              </span>

              <h2>
                What you will
                <strong>
                  {" "}get.
                </strong>
              </h2>


              <div className="course-highlights">

                {/* FIXED BENEFITS */}

                <div className="course-highlight-item">

                  <FiCheckCircle />

                  <span>
                    100% Training &amp;
                    Internship Provided
                  </span>

                </div>


                <div className="course-highlight-item">

                  <FiCheckCircle />

                  <span>
                    Offer Letter
                  </span>

                </div>


                <div className="course-highlight-item">

                  <FiCheckCircle />

                  <span>
                    Experience Letter
                  </span>

                </div>


                <div className="course-highlight-item">

                  <FiCheckCircle />

                  <span>
                    Course Completion
                    Certificate
                  </span>

                </div>


                {/* ADMIN CREATED HIGHLIGHTS */}

                {course.highlights?.map(
                  (item) => (

                    <div
                      className="course-highlight-item"
                      key={item}
                    >

                      <FiCheckCircle />

                      <span>
                        {item}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* =========================
                SKILLS
                ========================= */}

            <div className="course-detail-section">

              <span className="section-label">
                SKILLS COVERED
              </span>

              <h2>
                Technologies &amp;
                <strong>
                  {" "}skills.
                </strong>
              </h2>


              {course.skills?.length > 0 ? (

                <div className="course-detail-skills">

                  {course.skills.map(
                    (skill) => (

                      <span key={skill}>
                        {skill}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p>
                  Skills covered in this
                  course will be discussed
                  during the program.
                </p>

              )}

            </div>


            {/* =========================
                TRAINING APPROACH
                ========================= */}

            <div className="course-detail-section">

              <span className="section-label">
                TRAINING APPROACH
              </span>

              <h2>
                Learn by
                <strong>
                  {" "}building.
                </strong>
              </h2>


              <div className="training-steps">

                <div className="training-step">

                  <span>
                    01
                  </span>

                  <div>

                    <h3>
                      Learn
                    </h3>

                    <p>
                      Understand concepts
                      through structured
                      practical sessions.
                    </p>

                  </div>

                </div>


                <div className="training-step">

                  <span>
                    02
                  </span>

                  <div>

                    <h3>
                      Practice
                    </h3>

                    <p>
                      Solve coding problems
                      and practice real
                      development tasks.
                    </p>

                  </div>

                </div>


                <div className="training-step">

                  <span>
                    03
                  </span>

                  <div>

                    <h3>
                      Build
                    </h3>

                    <p>
                      Create practical
                      projects using the
                      technologies you learn.
                    </p>

                  </div>

                </div>


                <div className="training-step">

                  <span>
                    04
                  </span>

                  <div>

                    <h3>
                      Internship
                    </h3>

                    <p>
                      Apply your skills in
                      practical internship
                      experience.
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =========================
                PROGRAM BENEFITS
                ========================= */}

            <div className="course-detail-section">

              <span className="section-label">
                PROGRAM BENEFITS
              </span>

              <h2>
                Your learning
                <strong>
                  {" "}journey.
                </strong>
              </h2>


              <div className="course-benefit-list">

                <div className="course-benefit-detail">

                  <FiCheck />

                  <span>
                    100% Training &amp;
                    Internship Provided
                  </span>

                </div>


                <div className="course-benefit-detail">

                  <FiCheck />

                  <span>
                    Offer Letter
                  </span>

                </div>


                <div className="course-benefit-detail">

                  <FiCheck />

                  <span>
                    Experience Letter
                  </span>

                </div>


                <div className="course-benefit-detail">

                  <FiCheck />

                  <span>
                    Course Completion
                    Certificate
                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              RIGHT SIDE
              ========================= */}

          <aside className="course-enquiry-card">

            {!submitted ? (

              <>

                <div className="course-enquiry-header">

                  <span>
                    GET STARTED
                  </span>

                  <h2>
                    Interested in
                    <strong>
                      {" "}this course?
                    </strong>
                  </h2>

                  <p>
                    Fill in your details
                    and our team will
                    contact you with more
                    information.
                  </p>

                </div>


                <form
                  className="course-enquiry-form"
                  onSubmit={
                    handleSubmit
                  }
                >

                  {/* NAME */}

                  <div className="course-form-group">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={
                        formData.name
                      }
                      autoComplete="name"
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  {/* MOBILE */}

                  <div className="course-form-group">

                    <label>
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={
                        formData.mobile
                      }
                      autoComplete="tel"
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="course-form-group">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      value={
                        formData.email
                      }
                      autoComplete="email"
                      onChange={
                        handleChange
                      }
                      required
                    />

                  </div>


                  {/* COURSE */}

                  <div className="course-form-group">

                    <label>
                      Selected Course
                    </label>

                    <input
                      type="text"
                      value={
                        course.name
                      }
                      readOnly
                      className="course-readonly-input"
                    />

                  </div>


                  {/* QUERY */}

                  <div className="course-form-group">

                    <label>

                      Your Query

                      <span>
                        Optional
                      </span>

                    </label>

                    <textarea
                      name="query"
                      placeholder="Tell us what you want to know..."
                      value={
                        formData.query
                      }
                      onChange={
                        handleChange
                      }
                      rows="4"
                    />

                  </div>


                  <button
                    type="submit"
                    className="course-enquiry-submit"
                  >

                    Send Enquiry

                    <FiSend />

                  </button>

                </form>

              </>

            ) : (

              <div className="course-enquiry-success">

                <div className="success-icon">
                  <FiCheckCircle />
                </div>

                <h2>
                  Enquiry Submitted!
                </h2>

                <p>
                  Thank you for your
                  interest in
                  <strong>
                    {" "}{course.name}
                  </strong>.
                </p>

                <p>
                  Our team will contact
                  you soon.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSubmitted(false)
                  }
                >
                  Send Another Enquiry
                </button>

              </div>

            )}

          </aside>

        </div>

      </main>
      <StudentFooter />

    </div>
  );
}

export default CourseDetails;