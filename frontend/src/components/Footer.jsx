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

      {/* Top CTA */}

      <div className="footer-cta">

        <div>
          <span className="footer-label">
            HAVE A PROJECT IN MIND?
          </span>

          <h2>
            Let's build something
            <span> meaningful.</span>
          </h2>

          <p>
            Whether you need a website, custom software or an
            AI-powered solution, our team is ready to help turn
            your idea into reality.
          </p>
        </div>

        <button
          className="footer-cta-btn"
          onClick={scrollToTop}
        >
          Let's Start
          <FiArrowUpRight />
        </button>

      </div>


      {/* Footer Main */}

      <div className="footer-main">

        {/* Company */}

        <div className="footer-brand">

          <Link to="/" className="footer-logo">
            <span>KALLEY</span>
            <small>CODELABS</small>
          </Link>

          <p>
            Building modern digital experiences with web
            technologies, custom software and AI-powered
            solutions.
          </p>

          <div className="footer-contact">

            <a href="mailto:your-email@example.com">
              <FiMail />
              your-email@example.com
            </a>

            <a href="tel:+910000000000">
              <FiPhone />
              +91 XXXXX XXXXX
            </a>

          </div>

        </div>


        {/* Company Links */}

        <div className="footer-column">

          <h3>Company</h3>

          <Link to="/">About Us</Link>

          <Link to="/">Contact</Link>

          <Link to="/">Terms & Conditions</Link>

        </div>


        {/* Services */}

        <div className="footer-column">

          <h3>Services</h3>

          <Link to="/">Custom Software Development</Link>

          <Link to="/">Web Development</Link>

          <Link to="/">IT Consulting</Link>

          <Link to="/">AI Integration</Link>

        </div>


        {/* Connect */}

        <div className="footer-column">

          <h3>Connect</h3>

          <a href="mailto:your-email@example.com">
            Email Us
          </a>

          <a href="tel:+910000000000">
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


      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Kalley CodeLabs.
          All rights reserved.
        </p>

        <button
          onClick={scrollToTop}
          className="back-top"
        >
          Back to top ↑
        </button>

      </div>

    </footer>
  );
}

export default Footer;