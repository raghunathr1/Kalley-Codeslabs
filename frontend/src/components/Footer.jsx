import { Link } from "react-router-dom";

import {
  FiMail,
  FiPhone,
  FiArrowUpRight,
} from "react-icons/fi";

import "./Footer.css";


function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <footer className="footer">

      {/* ========================================
          TOP CTA
      ======================================== */}

      <div className="footer-cta">

        <div className="footer-cta-content">

          <span className="footer-label">
            HAVE A PROJECT IN MIND?
          </span>

          <h2>
            Let's build something
            <span> meaningful.</span>
          </h2>

          <p>
            Whether you need a website, custom software
            or an AI-powered solution, our team is ready
            to help turn your idea into reality.
          </p>

        </div>


        <button
          className="footer-cta-btn"
          onClick={scrollToTop}
          type="button"
        >
          Let's Start
          <FiArrowUpRight />
        </button>

      </div>


      {/* ========================================
          FOOTER MAIN
      ======================================== */}

      <div className="footer-main">

        {/* ========================================
            BRAND
        ======================================== */}

        <div className="footer-brand">

          <Link
            to="/"
            className="footer-logo"
          >

            <img
              src="/logo.png"
              alt="Kalley CodeLabs"
              className="footer-logo-image"
            />

            <div className="footer-logo-text">

              <span>
                KALLEY
              </span>

              <small>
                CODELABS
              </small>

            </div>

          </Link>


          <p>
            Building modern digital experiences with
            web technologies, custom software and
            AI-powered solutions.
          </p>


          {/* CONTACT */}

          <div className="footer-contact">

            <a
              href="mailto:gktech870@gmail.com"
            >
              <FiMail />

              <span>
                gktech870@gmail.com
              </span>
            </a>


            <a
              href="tel:+919423031883"
            >
              <FiPhone />

              <span>
                +91 9423031883
              </span>
            </a>

          </div>

        </div>


        {/* ========================================
            COMPANY
        ======================================== */}

        <div className="footer-column">

          <h3>
            Company
          </h3>

          <Link to="/">
            About Us
          </Link>

          <Link to="/">
            Contact
          </Link>

          <Link to="/">
            Terms &amp; Conditions
          </Link>

        </div>


        {/* ========================================
            SERVICES
        ======================================== */}

        <div className="footer-column">

          <h3>
            Services
          </h3>

          <Link to="/">
            Custom Software Development
          </Link>

          <Link to="/">
            Web Development
          </Link>

          <Link to="/">
            IT Consulting
          </Link>

          <Link to="/">
            AI Integration
          </Link>

        </div>


        {/* ========================================
            CONNECT
        ======================================== */}

        <div className="footer-column">

          <h3>
            Connect
          </h3>

          <a
            href="mailto:gktech870@gmail.com"
          >
            Email Us
          </a>

          <a
            href="tel:+919423031883"
          >
            Call Us
          </a>

          <Link to="/student">
            Student / Job Vacancy
          </Link>

          <Link to="/student">
            Let's Start
          </Link>

        </div>

      </div>


      {/* ========================================
          SUPPORT STRIP
      ======================================== */}

      <div className="footer-support">

        <div className="footer-support-left">

          <span className="footer-support-dot"></span>

          <div>
            <strong>
              Need support?
            </strong>

            <span>
              Reach us through email or phone.
            </span>
          </div>

        </div>


        <div className="footer-support-links">

          <a
            href="mailto:gktech870@gmail.com"
          >
            <FiMail />
            gktech870@gmail.com
          </a>

          <a
            href="tel:+919423031883"
          >
            <FiPhone />
            +91 9423031883
          </a>

        </div>

      </div>


      {/* ========================================
          BOTTOM
      ======================================== */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Kalley
          CodeLabs. All rights reserved.
        </p>


        <button
          onClick={scrollToTop}
          className="back-top"
          type="button"
        >
          Back to top ↑
        </button>

      </div>

    </footer>
  );
}


export default Footer;